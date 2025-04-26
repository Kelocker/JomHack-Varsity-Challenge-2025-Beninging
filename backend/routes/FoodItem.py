from datetime import datetime
from flask import Blueprint, jsonify, json
from dotenv import load_dotenv
import openai
import os
import requests
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

load_dotenv()

recipe = Blueprint('recipe', __name__)
openai.api_key = os.getenv("OPEN_AI_API")
PEXELS_API_KEY = os.getenv("PEXEL_API")

executor = ThreadPoolExecutor(max_workers=5)

class FoodItem:
    def __init__(self, food_name, quantity, measurement_unit, expiry_date, category):
        self.food_name = food_name
        self.quantity = quantity
        self.measurement_unit = measurement_unit
        self.expiry_date = expiry_date
        self.category = category

    def is_expired(self):
        today = datetime.today().date()
        expiry = datetime.strptime(self.expiry_date, "%Y-%m-%d").date()
        return today > expiry

    def to_dict(self):
        return {
            "foodName": self.food_name,
            "quantity": self.quantity,
            "measurementUnit": self.measurement_unit,
            "expiryDate": self.expiry_date,
            "category": self.category
        }

def load_food_items_from_json(file_path="summary_table.json"):
    try:
        with open(file_path, 'r') as file:
            food_items_data = json.load(file)
            food_items = [
                FoodItem(
                    item["foodName"],
                    item["quantity"],
                    item["measurementUnit"],
                    item["expiryDate"],
                    item["category"]
                ) for item in food_items_data.get("data", [])
            ]
            return food_items
    except Exception as e:
        print(f"Error loading food items: {e}")
        return []

def sort_by_expiry_date(food_items):
    return sorted(food_items, key=lambda x: datetime.strptime(x.expiry_date, "%Y-%m-%d"))

def fetch_food_image(food_name):
    try:
        url = f'https://api.pexels.com/v1/search?query={food_name}&per_page=1'
        headers = { 'Authorization': PEXELS_API_KEY }
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get('photos'):
                return data['photos'][0]['src']['original']
        return ""
    except Exception as e:
        print(f"Error fetching image for {food_name}: {e}")
        return ""

def get_recipe_from_chatgpt(ingredients, retries=2):
    prompt = f"""
        You are a smart cooking assistant.

        Here are the ingredients: {', '.join(ingredients)}.

        Return 5 or more simple recipes, prioritize using these ingredients.

        IMPORTANT:
        - ONLY return a VALID JSON object.
        - NO explanations, no comments, no extra text.
        - Structure must be exactly like:

        {{
            "recipes": [
                {{
                    "recipeName": "...",
                    "recipeDescription": "...",
                    "ingredients": [
                        {{"name": "...", "quantity": "...", "unit": "..."}}
                    ],
                    "skillLevel": "...",
                    "timeRequired": "...",
                    "instructions": ["Step 1", "Step 2"],
                    "imageUrl": "Leave empty string, will be filled later"
                }}
            ]
        }}
    """

    for attempt in range(retries + 1):
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2000
            )

            recipe_info = response.choices[0].message['content'].strip()

            # Attempt to load JSON
            recipe_data = json.loads(recipe_info)

            recipes = recipe_data.get("recipes", [])

            # Fetch images in parallel
            futures = {executor.submit(fetch_food_image, recipe.get("recipeName", "food")): recipe for recipe in recipes}
            for future in as_completed(futures):
                recipe = futures[future]
                try:
                    image_url = future.result()
                    recipe["imageUrl"] = image_url
                except Exception as e:
                    print(f"Image fetch error: {e}")
                    recipe["imageUrl"] = ""

            return recipe_data

        except json.JSONDecodeError as e:
            print(f"[Attempt {attempt+1}] JSON decode error: {e}")
            if attempt < retries:
                time.sleep(1)  # Wait a bit and retry
                continue
            else:
                return {"error": f"Failed to decode GPT response after {retries+1} tries."}
        except Exception as e:
            print(f"Error fetching recipes: {e}")
            return {"error": f"Error fetching recipe: {str(e)}"}

@recipe.route('/recipe', methods=['GET'])
def get_recipe():
    food_items = load_food_items_from_json()
    valid_food_items = [item for item in food_items if not item.is_expired()]

    if not valid_food_items:
        return jsonify({"message": "No valid ingredients found."}), 200

    sorted_items = sort_by_expiry_date(valid_food_items)
    all_ingredients = [item.food_name for item in sorted_items]

    recipe_suggestions = get_recipe_from_chatgpt(all_ingredients)
    return jsonify({
        "recipes": recipe_suggestions.get("recipes", []),
        "error": recipe_suggestions.get("error")
    }), 200
