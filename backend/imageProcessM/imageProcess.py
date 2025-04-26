import os
import base64
import io
import json
import openai

from PIL import Image, UnidentifiedImageError
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Now you can access your environment variables using os.environ
openai.api_key = os.getenv('OPEN_AI_API')




def image_to_food_list(file_path):

    base64_file_path = file_path

    # --- Read Base64 String ---
    try:
        with open(base64_file_path, "r") as file:
            base64_image_string = file.read().strip()   
    except FileNotFoundError:
        print(f"Error: Base64 file not found at {base64_file_path}")
        exit()
    except Exception as e:
        print(f"Error reading base64 file: {e}")
        exit()

    if not base64_image_string:
        print("Error: Base64 string in file is empty.")
        exit()

    # --- Detect Image Type from Base64 ---
    mime_type = None
    try:
        # Decode the base64 string into bytes
        image_bytes = base64.b64decode(base64_image_string)

        # Use BytesIO to handle the bytes as an in-memory file
        img_io = io.BytesIO(image_bytes)

        # Open the image using Pillow WITHOUT saving it
        with Image.open(img_io) as img:
            # Get the format (e.g., 'JPEG', 'PNG', 'GIF', 'WEBP')
            img_format = img.format
            print(f"Detected image format: {img_format}") # For debugging

            # Map Pillow format to MIME type for OpenAI API
            # OpenAI supports 'png', 'jpeg', 'gif', 'webp'
            format_map = {
                'JPEG': 'image/jpeg',
                'PNG': 'image/png',
                'GIF': 'image/gif',
                'WEBP': 'image/webp',
            }
            # Use .upper() for case-insensitive matching (e.g., jpeg vs JPEG)
            mime_type = format_map.get(img_format.upper())

            if not mime_type:
                print(f"Error: Detected image format '{img_format}' is not one supported by OpenAI ('png', 'jpeg', 'gif', 'webp').")
                exit()

    except base64.binascii.Error:
        print("Error: Invalid base64 string found in file.")
        exit()
    except UnidentifiedImageError: 
        print("Error: Cannot identify image file format from the provided base64 data.")
        exit()
    except Exception as e:
        print(f"Error processing image data with Pillow: {e}")
        exit()



    # Tailor this prompt for your specific need (e.g., food identification)
    user_prompt = """
    Analyze the provided image of a grocery receipt. Extract only the items that are food or edible ingredients. Ignore all non-food items like soap, utensils, bags, cleaning supplies, etc.
    IMPORTANT: Your entire response must consist ONLY of the raw JSON list structure specified above. Do not include ```json markdown tags, any introductory text like "Here is the JSON:", or any explanatory text before or after the JSON list itself.

    For each food item identified, extract:
    1.  `foodName`: **Simplify the name to its most basic food type.** Remove brand names, specific varieties (like 'Gala' apples), sizes (if redundant with quantity/unit), or other non-essential descriptors. Use a common, generic name.
    2. The quantity purchased (assume 1 if not specified).
    3. The measurement unit (e.g., kg, g, L, ml, pcs, pack, unit). Infer the unit if obvious but not stated (like 'pcs' for apples), otherwise use 'unit'.
    4, `expiryDate`:
        * If the item is typically FRESH with a short shelf life (e.g., fresh fruits, vegetables, raw meat/poultry/fish, fresh milk, fresh bakery items), estimate a reasonable expiry date in YYYY-MM-DD format based on typical shelf life.
        * For all other items (e.g., packaged goods, canned goods, frozen foods, UHT milk, items with long shelf lives where the date isn't usually on the receipt), return `null`. Do not guess expiry dates for these items.
    5.  `category`: Assign a general food category. Use one of these: Fruit, Vegetable, Meat, Poultry, Fish, Seafood, Dairy, Eggs, Bakery, Pantry Staple, Beverage, Frozen, Snack, Condiment, Oil & Fat, Other Food.


    Return the result as a JSON list of objects, with keys "item_name", "quantity", and "measurement_unit".

    Example:
    [
    {"foodName": "Banana", "quantity": 1.2, "measurement_unit": "kg", "expiryDate": "2024-01-12", "category":"Fruit"},
    {"foodName": "Milk", "quantity": 1, "measurement_unit": "L", "expiryDate": "2024-01-22, "category":"Dairy"},
    {"foodName": "Eggs", "quantity": 12, "measurement_unit": "pcs", "expiryDate": "2024-01-15, "category":"Eggs"}
    ]

    IMPORTANT: Your entire response must consist ONLY of the raw JSON list structure specified above. Do not include ```json markdown tags, any introductory text like "Here is the JSON:", or any explanatory text before or after the JSON list itself.
    """

    # Construct the message payload for the API
    messages_payload = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": user_prompt
                },
                {
                    "type": "image_url",
                    "image_url": {
                        # Include the data URI scheme header
                        "url": f"data:image/jpeg;base64,{base64_image_string}"
                        # Change image/jpeg if your image is a different format (e.g., image/png)
                    }
                }
            ]
        }
    ]

    # Make the API Call
    response = openai.ChatCompletion.create(
        model="gpt-4o", # Or use "gpt-4-turbo"
        messages=messages_payload,
        max_tokens=800
    )

    ai_response = response.choices[0].message.content
    print(ai_response)

    #convert the response to JSON
    try:
        response_json = json.loads(ai_response)  # Parse the response as JSON
        print("Parsed JSON Response:")
        print(json.dumps(response_json, indent=4))  # Pretty-print the JSON
        return response_json
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")