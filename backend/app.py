from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.FoodItem import recipe

app = Flask(__name__)
CORS(app)  # allow requests from React

app.register_blueprint(recipe, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
