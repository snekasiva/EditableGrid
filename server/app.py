from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enables Cross-Origin Resource Sharing

# Mock database
records = [
    {"id": 1, "name": "John Doe", "age": 28, "email": "john@example.com"},
    {"id": 2, "name": "Jane Smith", "age": 32, "email": "jane@example.com"},
]

# Fetch all records
@app.route('/api/records', methods=['GET'])
def get_records():
    return jsonify(records)

# Add a new record
@app.route('/api/records', methods=['POST'])
def add_record():
    new_record = request.json
    new_record['id'] = len(records) + 1  # Generate a new ID
    records.append(new_record)
    return jsonify(new_record)

# Update an existing record
@app.route('/api/records/<int:record_id>', methods=['PUT'])
def update_record(record_id):
    updated_record = request.json
    for record in records:
        if record['id'] == record_id:
            record.update(updated_record)
            return jsonify(record)
    return jsonify({"error": "Record not found"}), 404

# Delete a record
@app.route('/api/records/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    global records
    records = [record for record in records if record['id'] != record_id]
    return jsonify({"message": "Record deleted"})

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
