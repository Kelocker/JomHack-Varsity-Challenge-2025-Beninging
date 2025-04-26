from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.FoodItem import recipe
from routes.GetIngredients import ingredient
from reccomendation.summary_table import store_summary_table
from reccomendation.generate_recommendations import generate_recommendations
from imageProcessM.imageProcess import image_to_food_list
import os
import json

app = Flask(__name__)
CORS(app)  # allow requests from React

app.register_blueprint(recipe, url_prefix='/api')
app.register_blueprint(ingredient, url_prefix='/api')

@app.route('/api/extract', methods=['POST'])
#run the store_summary_table function
def extract_summary_table():
    food = request.get_json()
    print(food)
    store_summary_table(food)
    get_recommendations() 
    return jsonify(message="Summary table stored successfully.")


def get_recommendations():
    food_items = request.get_json()
    # Call the function to generate recommendations
    recommendations = generate_recommendations(food_items)
    #return recommendations


# Handle scan uploads
@app.route('/scan', methods=['POST'])
def scan_image():
    try:
        data = request.get_json()
        base64_image = data.get('image')

        # Save the base64 into a temp text file (because your imageProcess expects a file path)
        with open('temp_image.txt', 'w') as f:
            f.write(base64_image.split(",")[1])  # remove the "data:image/jpeg;base64," part

        food_list = image_to_food_list('temp_image.txt')

        return jsonify({"result": food_list})
    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to process image"}), 500


@app.route('/api/saveData', methods=['POST'])
def save_data():
    data = request.json

    # Define the path to the example.json file
    file_path = os.path.join(os.path.dirname(__file__), 'summary_table.json')

    try:
        # Read the existing data from the file
        if os.path.exists(file_path):
            with open(file_path, 'r') as file:
                existing_data = json.load(file)
        else:
            existing_data = {"data": []}

        # Update the data
        existing_data['data'] = data['foodItems']

        # Write the updated data back to the file
        with open(file_path, 'w') as file:
            json.dump(existing_data, file, indent=4)

        return jsonify({"success": True, "message": "Data saved successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

