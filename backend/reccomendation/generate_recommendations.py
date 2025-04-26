import openai
import os
from flask import jsonify
import json
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv('OPEN_AI_API')

def build_input_prompt(food_items) -> str:
    return f"""
You are an AI assistant specialized in generating recommendations for food items. Your task is to provide suggestions on how to use the following food items to prevent waste. The food items are: {food_items}.

📌 Execution Context:
- Make sure 1 food 1 method of keeping the ingredients in the house to prevent waste, if there dictionary size is 3 then must have 3 recommendations.
- If the item is not a food, tell the user that the item is not a food and put None for method ignoring the category because the user probably entered the incorrect category.
- Display the result in json formatted as a list of dictionaries.

Example output for [{{"foodName": "Apple", "quantity": 10, "measurementUnit": "-", "expiryDate": "2023-12-31", "category": "Fruit"}}, {{ "foodName": "Bleach", "quantity": 1, "measurementUnit": "-", "expiryDate": "2023-12-31", "category": "Vegetable"}}]
{{"tips": [{{"item": "Apple", "method": "Refrigerate in crisper drawer", "reason": "Slows ripening by reducing ethylene production"}}, {{"item": "Bleach", "method": "None", "reason": "Item is not a food"}}]}}
"""

def generate_recommendations(food_items):
    prompt = build_input_prompt(food_items)
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )
    
    # Get raw output and clean it
    gpt_output = response.choices[0].message.content.strip()
    
    # Remove ```json and ``` markers if present
    cleaned_output = gpt_output.replace('```json', '').replace('```', '').strip()
    
    try:
        # Parse to verify it's valid JSON
        json_data = json.loads(cleaned_output)
        
        # Ensure the data is in the correct format
        if not isinstance(json_data, dict) or "tips" not in json_data:
            json_data = {"tips": json_data} if isinstance(json_data, list) else {"tips": [json_data]}
        
        # Save the cleaned output as a properly formatted JSON file
        with open('recommendations.json', 'a') as f: 
            json.dump(json_data, f, indent=4)  # Use indent for pretty printing
        
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
            "raw_output": cleaned_output
        })