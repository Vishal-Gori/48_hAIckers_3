from flask import Flask, jsonify, redirect
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Existing API Endpoints...



if __name__ == "__main__":
    app.run(debug=True)
