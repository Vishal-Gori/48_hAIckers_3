from flask import Flask, render_template,redirect, request, jsonify, session, abort, url_for
import joblib
import requests
import firebase_admin
import secrets
from firebase_admin import credentials, db
from flask_socketio import SocketIO, emit
import time
import threading
import pandas as pd
import pyrebase
import folium
from folium.plugins import MarkerCluster, HeatMap
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline



secret_key = secrets.token_hex(16)

app = Flask(__name__)
app = Flask(__name__, static_url_path='/static')
app.config['SECRET_KEY'] = secret_key
socketio = SocketIO(app, cors_allowed_origins='*')

firebase_config = {
    "apiKey": "AIzaSyAtZb6-LRZMpCpPasCbk_vycTcRQ5fl7KA",
    "authDomain": "dpps-23928.firebaseapp.com",
    "databaseURL": "https://dpps-23928-default-rtdb.asia-southeast1.firebasedatabase.app",
    "projectId": "dpps-23928",
    "storageBucket": "dpps-23928.appspot.com",
    "messagingSenderId": "114905554074",
    "appId": "1:114905554074:web:d527757221e8fabe115323",
    "measurementId": "G-ES3ZDPZC4F",
}
firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()
fb = firebase.database()
config = {
  "apiKey": "AIzaSyC_sYbyfyI9l7O5yzMGMltS7Jm051HNDU0",
  "authDomain": "auth-3538a.firebaseapp.com",
  "databaseURL" : "https://auth-3538a-default-rtdb.firebaseio.com/",
  "projectId": "auth-3538a",
  "storageBucket": "auth-3538a.appspot.com",
  "messagingSenderId": "776411640881",
  "appId": "1:776411640881:web:1ffbc1128e7978b2869110"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()

firebaseConfig = {
  "apiKey": "AIzaSyBn-z_lpT8UM4qNViGuaJ0qFmPW9b49n5Y",
  "authDomain": "authorityauth-810cd.firebaseapp.com",
  "databaseURL": "https://authorityauth-810cd-default-rtdb.firebaseio.com",
  "projectId": "authorityauth-810cd",
  "storageBucket": "authorityauth-810cd.appspot.com",
  "messagingSenderId": "414719593107",
  "appId": "1:414719593107:web:399817fc20c85c73649b66"
}
firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()
authoritydb = firebase.database()

person = {"is_logged_in": False, "name": "", "email": "", "uid": "","DHT":False,"MPU":False,"location":""}
authority={"is_logged_in": False, "name": "", "email": "", "uid": ""}



@app.route("/login")
def login():
    return render_template("login.html")
@app.route("/authoritylogin")
def authoritylogin():
    return render_template("authority_login.html")

#Sign up/ Register
@app.route("/signup")
def signup():
    return render_template("signup.html")
@app.route("/authoritysignup")
def authosignup():
    return render_template("authority_signup.html")

@app.route('/authorityHome')
def authoHome():
    if authority["is_logged_in"] == True:
        return render_template("authority_home.html",authority=authority)
    else:
        return redirect(url_for('authoritylogin'))
    
@app.route("/authorityresult", methods = ["POST", "GET"])
def authoresult():
    if request.method == "POST":
        result = request.form
        email = result["email"]
        password = result["pass"]
        try:
            govtAuthority = auth.sign_in_with_email_and_password(email, password)
            if govtAuthority is None:
                raise Exception("Authentication failed")
            global authority
            authority["is_logged_in"] = True
            authority["email"] = govtAuthority["email"]
            authority["uid"] = govtAuthority["localId"]
            data = authoritydb.child("authorities").get()
            authority["name"] = data.val()[authority["uid"]]["name"]
            return redirect(url_for('authoHome'))
        except Exception as e:
            print("Error occurred during authority login:", e)
            return redirect(url_for('authoritylogin'))
    else:
        if authority["is_logged_in"]:
            return redirect(url_for('authoHome'))
        else:
            return redirect(url_for('authoritylogin'))
@app.route("/authorityregister", methods=["POST", "GET"])
def authorityregister():
    if request.method == "POST":  # Only listen to POST
        result = request.form  
        email = result["authemail"]
        password = result["authpass"]
        name = result["authname"]
        try:
           
            auth.create_user_with_email_and_password(email, password)
           
            govtAuth = auth.sign_in_with_email_and_password(email, password)
            # Add data to global person
            global authority
            authority["is_logged_in"] = True
            authority["email"] = govtAuth["email"]
            authority["uid"] = govtAuth["localId"]
            authority["name"] = name
            # Append data to the firebase realtime database
            data = {"name": name, "email": email}
            authoritydb.child("authorities").child(authority["uid"]).set(data)
            # Go to welcome page
            return redirect(url_for('authoHome'))
        except Exception as e:
            # Print out the error for debugging
            print("Error occurred during registration:", e)
            # If there is any error, redirect to register
            return redirect(url_for('authorityregister'))

    else:
        if authority["is_logged_in"] == True:
            return redirect(url_for('authoHome'))
        else:
            return redirect(url_for('authorityregister'))

@app.route('/authlogout')
def authlogout():
    global authority
    authority["is_logged_in"] = False
    authority["name"] = ""
    authority["email"] = ""
    authority["uid"] = ""
    return redirect(url_for('authoritylogin'))
@app.route('/')
def home():
    if person["is_logged_in"] == True:
        return render_template('index.html', person=person)
    else:
        return redirect(url_for('login'))

@app.route("/result", methods = ["POST", "GET"])
def result():
    if request.method == "POST":        #Only if data has been posted
        result = request.form           #Get the data
        email = result["email"]
        password = result["pass"]
        try:
            #Try signing in the user with the given information
            user = auth.sign_in_with_email_and_password(email, password)
            #Insert the user data in the global person
            global person
            person["is_logged_in"] = True
            person["email"] = user["email"]
            person["uid"] = user["localId"]
            #Get the name of the user
            data = db.child("users").get()
            person["name"] = data.val()[person["uid"]]["name"]
            person["DHT"]=data.val()[person["uid"]]["DHT"]
            person["longitude"]=data.val()[person["uid"]]["longitude"]
            person["latitude"]=data.val()[person["uid"]]["latitude"]
            #Redirect to welcome page
            return redirect(url_for('home'))
        except Exception as e:
            #If there is any error, redirect back to login
            print("Error occurred during login:", e)
            return redirect(url_for('login'))
    else:
        if person["is_logged_in"] == True:
            return redirect(url_for('home'))
        else:
            return redirect(url_for('login'))

#If someone clicks on register, they are redirected to /register
@app.route("/register", methods = ["POST", "GET"])
def register():
    if request.method == "POST":        #Only listen to POST
        result = request.form           #Get the data submitted
        email = result["email"]
        password = result["pass"]
        name = result["name"]
        try:
            #Try creating the user account using the provided data
            auth.create_user_with_email_and_password(email, password)
            #Login the user
            user = auth.sign_in_with_email_and_password(email, password)
            #Add data to global person
            global person
            person["is_logged_in"] = True
            person["email"] = user["email"]
            person["uid"] = user["localId"]
            person["name"] = name
            person["DHT"]=True
            person["MPU"]=False
            #Append data to the firebase realtime database
            data = {"name": name, "email": email,"DHT":True,"MPU":False}
            db.child("users").child(person["uid"]).set(data)
            #Go to welcome page
            return redirect(url_for('home'))
        except:
            #If there is any error, redirect to register
            return redirect(url_for('register'))

    else:
        if person["is_logged_in"] == True:
            return redirect(url_for('home'))
        else:
            return redirect(url_for('register'))
        
@app.route('/logout')
def logout():
    global person
    person["is_logged_in"] = False
    person["name"] = ""
    person["email"] = ""
    person["uid"] = ""
    return redirect(url_for('login'))

   
if __name__ == '__main__':
    # Start a thread for updating data in the background

    socketio.run(app, debug=True,allow_unsafe_werkzeug=True)
