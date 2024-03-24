import os
import pickle
import numpy as np
import pandas as pd
import requests


courses_list = pickle.load(open(os.path.join(os.getcwd(),'models\\courses.pkl'), 'rb'))
similarity = pickle.load(open(os.path.join(os.getcwd(),'models\\similarity.pkl'), 'rb'))

def recommendCourses(course):
    index = courses_list[courses_list['course_name'] == course].index[0]
    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
    recommended_course_names = []
    for i in distances[1:7]:
        course_name = courses_list.iloc[i[0]].course_name
        recommended_course_names.append(course_name)

    return recommended_course_names