from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


# Declare API Endpoints here onwards
@app.route("/api/home", methods=['GET'])
def return_home():
    return jsonify({
        'message': 'hello from server'
    })

if __name__ == "__main__":
    app.run(debug = True)