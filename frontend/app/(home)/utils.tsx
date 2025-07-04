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

//Function to color code Tasks based on Tag with pastel colors
export async function get_tag_colors(all_entries: any, set_colors: any) {
    let all_colors = [
        "[#FDCFE8]", // Dark Pink (muted)
        "[#CCFF90]", // Dark Green (muted)
        "[#FFF475]", // Dark Yellow (muted)
        "[#FBB040]", // Dark Orange (muted)
        "[#E6C9A8]", // Dark Brown (muted)
        "[#A7FFEB]", // Dark Teal (muted)
        "[#CBF0F8]", // Dark Lavender (muted)
        "[#F28B82]", // Dark Red (muted)
        "[#D7AEFB]", // Dark Purple (muted)
        "[#FDCFE8]", // Dark Pink
        "[#CCFF90]", // Dark Green
        "[#FFF475]", // Dark Yellow
        "[#FBB040]", // Dark Orange
        "[#E6C9A8]", // Dark Brown
        "[#A7FFEB]", // Dark Teal
        "[#CBF0F8]", // Dark Lavender
        "[#F28B82]", // Dark Red
        "[#D7AEFB]", // Dark Purple
    ];
    let i = 0; 
    let colors: { [key: string]: string } = { "New Task": "[#CBF0F8]" };

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
