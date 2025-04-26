import json
def store_summary_table(data):
    try:
        # Open the file in read mode first to check existing content
        try:
            with open('summary_table.json', 'r') as f:
                existing_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            existing_data = {"data": []}  # Initialize if file doesn't exist or is invalid
        
        # Append new data to existing data
        if isinstance(data, dict) and "data" in data:
            existing_data["data"].extend(data["data"])
        else:
            existing_data["data"].append(data)  # Handle single item if needed
        
        # Write the combined data back to the file with pretty printing
        with open('summary_table.json', 'w') as f:
            json.dump(existing_data, f, indent=4)
        
        print("Summary table stored successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")