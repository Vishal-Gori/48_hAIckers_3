from flask import Flask, jsonify, redirect
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/home')
def index():
 return "This is a basic flask application"


if __name__ == "__main__":
    app.run(debug=True)
