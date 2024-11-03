//Functions to read-write data from backend
export async function get_tasks(set_tasks: any) {
    try {
        let response = await fetch('http://127.0.0.1:5000/home');
        let tasks_json = await response.json();
        set_tasks(tasks_json);
    } catch (error) {
        console.log(error)
    }
}

export async function update_tasks(updated_tasks: any, set_all_tasks: any) {
    set_all_tasks(updated_tasks)
    try {
        let response = await fetch('http://127.0.0.1:5000/home', 
                    {method: "POST", 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(updated_tasks)});
    } catch (error) {
        console.log(error)
    }
}