from datetime import datetime
from flask import Blueprint, jsonify, json
from dotenv import load_dotenv
import openai 
import os
import requests
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

ingredient = Blueprint('getIngredient', __name__)
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

@ingredient.route('/getIngredient', methods=['GET'])
def getIngredient():
    food_items = load_food_items_from_json()
    food_items_dict = [item.to_dict() for item in food_items]
    return jsonify(food_items_dict)
