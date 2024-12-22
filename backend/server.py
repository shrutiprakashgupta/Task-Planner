from flask import Flask
from flask import request
from flask import url_for
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/tasks', methods=['GET', 'POST'])
def tasks():
    if request.method == 'POST':
        return update_tasks(request.get_json())
    else:
        return read_tasks()

def update_tasks(response):
    with open("data/tasks.json", "w") as tasks:
        json.dump(response, tasks)
        tasks.close()
    return "Tasks Updated"

def read_tasks():
    with open('data/tasks.json') as tasks:
        tasks_data = json.load(tasks)
        tasks.close()
    return tasks_data

@app.route('/remarks', methods=['GET', 'POST'])
def remarks():
    if request.method == 'POST':
        return update_remarks(request.get_json())
    else:
        return read_remarks()

def update_remarks(response):
    with open("data/remarks.json", "w") as remarks:
        json.dump(response, remarks)
        remarks.close()
    return "Remarks Updated"

def read_remarks():
    with open('data/remarks.json') as remarks:
        remarks_data = json.load(remarks)
        remarks.close()
    return remarks_data
