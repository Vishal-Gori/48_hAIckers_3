
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
from iteration_utilities import unique_everseen, duplicates



from models.ResumeParser import resume_analyzer
from models.CourseModel import recommendCourses




app = Flask(__name__)
CORS(app)

# Load your model and data here
job_list = pickle.load(open('job1_dict.pkl', 'rb'))
job1 = pd.DataFrame(job_list)
similarity = pickle.load(open('similarity1.pkl', 'rb'))

# Define your recommendation logic here
def recommend(job_name):
    job_index = job1[job1['KEY_SKILL'] == job_name].index[0]
    distances = similarity[job_index]
    job_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:15]

    recommended_job = []
    for i in job_list:
        recommended_job.append(job1.iloc[i[0]].JOB_TYPE)
    recommended_job1 = set(recommended_job)
    return recommended_job1

def recommend_ug(job_name):
    job_index = job1[job1['UG'] == job_name].index[0]
    distances = similarity[job_index]
    job_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:15]

    recommended_job = []
    for i in job_list:
        recommended_job.append(job1.iloc[i[0]].JOB_TYPE)
    recommended_job1 = set(recommended_job)
    return recommended_job1


def recommend_spe(job_name):
    job_index = job1[job1['SPECIALIZATION'] == job_name].index[0]
    distances = similarity[job_index]
    job_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:15]

    recommended_job = []
    for i in job_list:
        recommended_job.append(job1.iloc[i[0]].JOB_TYPE)
    recommended_job1 = set(recommended_job)
    return recommended_job1


def recommend_inti(job_name):
    job_index = job1[job1['INTERESTS'] == job_name].index[0]
    distances = similarity[job_index]
    job_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:15]

    recommended_job = []
    for i in job_list:
        recommended_job.append(job1.iloc[i[0]].JOB_TYPE)
    recommended_job1 = set(recommended_job)
    return recommended_job1
# Additional recommendation functions...
# As previously defined

@app.route('/api/home', methods=['GET'])
def home():
    # Extract unique values for dropdowns from your dataframe
    ug_programs = list(job1['UG'].unique())
    specializations = list(job1['SPECIALIZATION'].unique())
    key_skills = list(job1['KEY_SKILL'].unique())
    interests = list(job1['INTERESTS'].unique())
    
    dropdown_data = {
        'ug_programs': ug_programs,
        'specializations': specializations,
        'key_skills': key_skills,
        'interests': interests,
    }
    return jsonify(dropdown_data)

@app.route('/recommend', methods=['POST','GET'])
def get_recommendations():
    data = request.get_json(silent=True)  # This returns None instead of raising an error if there's no JSON
    if not data:
        return jsonify({'error': 'No input data provided'}), 400

    recommendations = []

    # Extract user preferences from the request
    ug = data.get('ug', '')
    specialization = data.get('specialization', '')
    skills = data.get('skills', [])
    interests = data.get('interests', [])

    # Compile recommendations based on the user's inputs
    if ug:
        recommendations.extend(recommend_ug(ug))
    if specialization:
        recommendations.extend(recommend_spe(specialization))
    for skill in skills:
        recommendations.extend(recommend(skill))
    for interest in interests:
        recommendations.extend(recommend_inti(interest))

    # Use unique_everseen and duplicates from iteration_utilities as needed
    unique_recommendations = list(unique_everseen(duplicates(recommendations)))

    # Return recommendations
    return jsonify(unique_recommendations)


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

    app.run(debug=True)
