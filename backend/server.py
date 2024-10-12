from flask import Flask
from flask import request
from flask import url_for
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/home', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        return update_data()
    else:
        return send_data()

def update_data():
    return "<p>POST!</p>"

def send_data():
    with open('data/tasks.json') as tasks:
        tasks_data = json.load(tasks)
    return tasks_data
