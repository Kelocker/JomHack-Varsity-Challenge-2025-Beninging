import os
import openai
import json
from flask import jsonify
from dotenv import load_dotenv

load_dotenv()

# Smart fallback setup
try:
    # Try the simple method first (for old openai versions)
    openai.api_key = os.getenv('OPEN_AI_API')
    client = openai  # set client = openai
except Exception as e:
    print(f"openai.api_key setting failed: {e}")
    try:
        # Try the new client initialization (for newer openai versions)
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv('OPEN_AI_API'))
    except Exception as e2:
        raise ValueError(f"Failed to initialize OpenAI client: {e2}")

def build_input_prompt(food_items) -> str:
    return f"""
You are an AI assistant specialized in generating recommendations for food items. Your task is to provide suggestions on how to use the following food items to prevent waste. The food items are: {food_items}.

📌 Execution Context:
- Make sure 1 food 1 method of keeping the ingredients in the house to prevent waste, if the dictionary size is 3 then must have 3 recommendations.
- If the item is not a food, tell the user that the item is not a food and put None for method ignoring the category because the user probably entered the incorrect category.
- Display the result in JSON formatted as a list of dictionaries.

Example output for:
[
  {{"foodName": "Apple", "quantity": 10, "measurementUnit": "-", "expiryDate": "2023-12-31", "category": "Fruit"}},
  {{"foodName": "Bleach", "quantity": 1, "measurementUnit": "-", "expiryDate": "2023-12-31", "category": "Vegetable"}}
]

Output should be:
{{
  "tips": [
    {{"item": "Apple", "method": "Refrigerate in crisper drawer", "reason": "Slows ripening by reducing ethylene production"}},
    {{"item": "Bleach", "method": "None", "reason": "Item is not a food"}}
  ]
}}
"""

def generate_recommendations(food_items):
    prompt = build_input_prompt(food_items)

    try:
        response = client.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return jsonify({"success": False, "error": str(e)})
    
    try:
        gpt_output = response['choices'][0]['message']['content'].strip()
        cleaned_output = gpt_output.replace('```json', '').replace('```', '').strip()

        json_data = json.loads(cleaned_output)

        if not isinstance(json_data, dict) or "tips" not in json_data:
            json_data = {"tips": json_data} if isinstance(json_data, list) else {"tips": [json_data]}

        with open('recommendations.json', 'a') as f:
            json.dump(json_data, f, indent=4)

        print("Recommendations generated successfully.")
        return jsonify({
            "success": True,
            "recommendations": json_data
        })

    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Invalid JSON format: {str(e)}",
            "raw_output": gpt_output if 'gpt_output' in locals() else ""
        })
