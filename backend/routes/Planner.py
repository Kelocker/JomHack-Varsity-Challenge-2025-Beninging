from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
import openai
import os
import json
from datetime import datetime

load_dotenv()

planner = Blueprint('planner', __name__)
openai.api_key = os.getenv("OPEN_AI_API")

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
            "measurement_unit": self.measurement_unit,
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
                    item["measurement_unit"],
                    item["expiryDate"],
                    item["category"]
                ) for item in food_items_data.get("data", [])
            ]
            return food_items
    except Exception as e:
        print(f"Error loading food items: {e}")
        return []

def ask_gpt_for_full_plan(food_items, people_count, meals_per_day=2, plan_days=4):
    prompt = f"""
        You are a smart food planner assistant.

        Here is the list of foods available:
        {json.dumps(food_items, indent=2)}

        There are {people_count} people consuming the food.
        They plan to cook {meals_per_day} meals per day.

        You must:

        1. Predict in total how many days the food will last (overallDaysLeft) based on typical consumption and cooking rate.
        2. Provide the expected finish date.
        3. Identify potential problems (like ingredients expiring before use) and suggest follow-up actions, including using social features in our app to upload post and share or sell the food to nearby.
        4. Plan meals for the next {plan_days} days (only if ingredients still available), each day suggest {meals_per_day} meals.

        Return response in this JSON format:
        {{
            "overallDaysLeft": ...,
            "expectedFinishDate": "YYYY-MM-DD",
            "problems": [
                {{
                    "foodName": "...",
                    "issue": "...",
                    "suggestion": "..."
                }}
            ],
            "mealPlan": [
                {{
                    "date": "YYYY-MM-DD",
                    "meals": [
                        {{
                            "mealName": "...",
                            "ingredientsUsed": ["...", "..."]
                        }}
                    ]
                }}
            ]
        }}

        IMPORTANT:
        - Today's date is {datetime.today().date().strftime("%Y-%m-%d")}.
        - No explanation or notes, only pure JSON object.
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=3000
        )

        plan_text = response.choices[0].message['content']
        plan_data = json.loads(plan_text)
        return plan_data

    except Exception as e:
        print(f"Error getting plan from GPT: {e}")
        return {"error": str(e)}

@planner.route('/planner', methods=['POST'])
def planner_api():
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 415

        data = request.get_json()
        people_count = data.get("peopleCount", 1)
        meals_per_day = data.get("mealsPerDay", 2)  # new input, default to 2 meals/day

        food_items_objects = load_food_items_from_json()
        food_items = [item.to_dict() for item in food_items_objects]

        if not food_items:
            return jsonify({"error": "No food items found in the database."}), 400

        plan = ask_gpt_for_full_plan(food_items, people_count, meals_per_day)

        return jsonify(plan), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
