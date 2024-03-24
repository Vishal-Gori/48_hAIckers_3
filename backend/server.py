from flask import Flask, request, jsonify
from flask_cors import CORS

from models.ResumeParser import resume_analyzer
from models.CourseModel import recommendCourses


app = Flask(__name__)
CORS(app)


# Declare API Endpoints here onwards
@app.route("/api/home", methods=['GET'])
def return_home():
    return jsonify({
        'message': 'hello from server'
    })

@app.route('/analyze_summary', methods=['POST'])
def analyze_summary():
    
    if request.method == 'POST':
        pdf_file = request.files['resume']
        openai_api_key = request.form['openai_api_key']
        
        if pdf_file and openai_api_key:
            try:
                pdf_chunks = resume_analyzer.pdf_to_chunks(pdf_file)
                summary_prompt = resume_analyzer.summary_prompt(query_with_chunks=pdf_chunks)
                summary = resume_analyzer.openai(openai_api_key=openai_api_key, chunks=pdf_chunks, analyze=summary_prompt)
                return jsonify({'summary': summary}), 200
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            return jsonify({'error': 'Please provide resume and OpenAI API key'}), 400


if __name__ == "__main__":
    app.run(debug = True)