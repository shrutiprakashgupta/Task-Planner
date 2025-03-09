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
        set_remarks(remarks_json);
    } catch (error) {
        console.log(error)
    }
}

export async function update_remarks(updated_remarks: any) {
    let remark_copy = {index: 0, remark: "test", time: 0, date: 0, ai: 0, ai_done: 0};
    let updated_remarks_json = [];
    if (updated_remarks) {
        for (let r of updated_remarks) {
            remark_copy = {index: 0, remark: "test", time: 0, date: 0, ai: 0, ai_done: 0};
            remark_copy = {index: r.index, remark: r.remark, time: r.time, date: r.date, ai: r.ai, ai_done: r.ai_done};
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

//Function to color code Tasks based on Tag
export async function get_tag_colors(all_entries: any, set_colors: any) {
    let all_colors = [
        "border-red-500",
        "border-yellow-500",
        "border-lime-500",
        "border-orange-500",
        "border-teal-500",
        "border-blue-500",
        "border-purple-500",
        "border-amber-500",
        "border-green-500",
        "border-fuchsia-500",
        "border-pink-500",
        "border-red-900",
        "border-yellow-900",
        "border-lime-900",
        "border-orange-900",
        "border-teal-900",
        "border-blue-900",
        "border-purple-900",
        "border-amber-900",
        "border-green-900",
        "border-fuchsia-900",
        "border-pink-900",
        "border-red-200",
        "border-yellow-200",
        "border-lime-200",
        "border-orange-200",
        "border-teal-200",
        "border-blue-200",
        "border-purple-200",
        "border-amber-200",
        "border-green-200",
        "border-fuchsia-200",
        "border-pink-200"
    ];
    let i = 0; 
    let colors: { [key: string]: string } = { "New Task": "border-white" };

    for (let elem of all_entries) {
        if (!(elem.tag in colors)) {
            // Add a new color only if it doesn't already exist
            colors[elem.tag] = all_colors[i];
            i++;

            // Reset index if colors run out (optional)
            if (i >= all_colors.length) {
                i = 0; // Start reusing colors
            }
        }
    }
    set_colors(colors);
}

export async function backup_tasks(all_tasks: any) {
    try {
        let response = await fetch('http://127.0.0.1:5000/tasks_backup', 
                    {method: "POST", 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(all_tasks)});
    } catch (error) {
        console.log(error)
    }
}
