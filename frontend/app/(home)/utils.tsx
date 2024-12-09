//Functions to read-write data from backend
export async function get_tasks(set_tasks: any) {
    try {
        let response = await fetch('http://127.0.0.1:5000/tasks');
        let tasks_json = await response.json();
        set_tasks(tasks_json);
    } catch (error) {
        console.log(error)
    }
}

export async function update_tasks(updated_tasks: any, set_tasks: any) {
    set_tasks(updated_tasks)
    try {
        let response = await fetch('http://127.0.0.1:5000/tasks', 
                    {method: "POST", 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(updated_tasks)});
    } catch (error) {
        console.log(error)
    }
}

export async function get_remarks(set_remarks: any) {
    try {
        let response = await fetch('http://127.0.0.1:5000/remarks');
        let remarks_json = await response.json();
        set_remarks(remarks_json);
    } catch (error) {
        console.log(error)
    }
}

export async function update_remarks(updated_remarks: any) {
    try {
        let response = await fetch('http://127.0.0.1:5000/remarks', 
                    {method: "POST", 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(updated_remarks)});
    } catch (error) {
        console.log(error)
    }
}
