//Functions to read-write data from backend
export async function get_tasks(set_tasks: any) {
    try {
        let tasks = await fetch('http://127.0.0.1:5000/tasks');
        let tasks_json = await tasks.json();
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
        let remarks = await fetch('http://127.0.0.1:5000/remarks');
        let remarks_json = await remarks.json();
        let tasks = await fetch('http://127.0.0.1:5000/tasks');
        let tasks_json = await tasks.json();
        let remark_copy;
        let remarks_json_extd = remarks_json && remarks_json.map((remark: any, index: number) => {
            remark_copy = remark;
            remark_copy.tag = tasks_json[remark["task_id"]]["tag"];
            remark_copy.task = tasks_json[remark["task_id"]]["name"];
            return remark_copy
        });
        set_remarks(remarks_json_extd);
    } catch (error) {
        console.log(error)
    }
}

export async function update_remarks(updated_remarks: any) {
    let remark_copy = {index: 0, remark: "test", time: 0, date: 0, task_id: 0};
    let updated_remarks_json = [];
    if (updated_remarks) {
        for (let r of updated_remarks) {
            remark_copy = {index: 0, remark: "test", time: 0, date: 0, task_id: 0};
            remark_copy = {index: r.index, remark: r.remark, time: r.time, date: r.date, task_id: r.task_id};
            updated_remarks_json.push(remark_copy);
        }
    }
    try {
        let response = await fetch('http://127.0.0.1:5000/remarks', 
                    {method: "POST", 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(updated_remarks_json)});
    } catch (error) {
        console.log(error)
    }
}