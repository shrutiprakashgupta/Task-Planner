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
        return update_data(request.get_json())
    else:
        return send_data()

def update_data(response):
    print(response)
    with open("data/tasks.json", "w") as tasks:
        json.dump(response, tasks)
        tasks.close()
    return "Tasks Updated"

def send_data():
    with open('data/tasks.json') as tasks:
        tasks_data = json.load(tasks)
        tasks.close()
    return tasks_data
