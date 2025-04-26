from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.FoodItem import recipe
from reccomendation.summary_table import store_summary_table
from reccomendation.generate_recommendations import generate_recommendations
from imageProcessM.imageProcess import image_to_food_list

app = Flask(__name__)
CORS(app)  # allow requests from React

app.register_blueprint(recipe, url_prefix='/api')

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
    

if __name__ == '__main__':
    app.run(debug=True)

