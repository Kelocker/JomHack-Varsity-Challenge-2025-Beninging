from flask import Flask, jsonify, request
from flask_cors import CORS
from summary_table import store_summary_table
from generate_recommendations import generate_recommendations

app = Flask(__name__)
CORS(app)  # allow requests from React

@app.route('/api/hello')
def hello():
    return jsonify(message="Hello from Flask!")

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

if __name__ == '__main__':
    app.run(debug=True)
