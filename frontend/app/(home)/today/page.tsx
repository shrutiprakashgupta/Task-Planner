'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import TaskCardView from "./../tasks/task-card-view"
import { use, useEffect, useState } from "react";
import { SearchBox } from "./searchbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
    Tag,
    MessageSquareText,
    CircleCheck,
    Timer
} from 'lucide-react'

function get_week_dates(today: any) {
    var week= new Array(); 
    // Starting Monday not Sunday
    today.setDate((today.getDate() - today.getDay() +1));
    for (var i = 0; i < 7; i++) {
        week.push(
            new Date(today).toLocaleDateString()
        ); 
        today.setDate(today.getDate() +1);
    }
    return week; 
}

//Week starts on Monday
let now = new Date().toLocaleTimeString()
let day_id = (new Date().getDay() + 6) % 7
let weekdates = get_week_dates(new Date())
let weekdays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

async function get_tasks(set_tasks: any) {
    try {
        let response = await fetch('http://127.0.0.1:5000/home');
        let tasks_json = await response.json();
        set_tasks(tasks_json)
    } catch (error) {
        console.log(error)
    }
}

function get_todays_contri (day: any, tasks: any){
    let todays_contri = 0
    for (var t in tasks) {
        if ((weekdates[day] in tasks[t]) && ("done" in tasks[t][weekdates[day]])) {
            todays_contri = todays_contri + parseFloat(tasks[t][weekdates[day]]["done"]);
        }
    }
    return todays_contri
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

function PopoverRemark({
    day,
    task, 
    all_tasks,
    set_all_tasks}
:{  day: any;
    task: any;
    all_tasks: any;
    set_all_tasks: any;
}) {
    return (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="m-2">
                <MessageSquareText className="h-3.5 w-3.5" color="#52525b"/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-black border-[#41274f] border-2">
            <Input
                id="comment"
                defaultValue="Add Comment"
                className="h-8 w-full"
                type="text" 
                onKeyDown ={e => {
                        if (e.key === "Enter") {
                            now = new Date().toLocaleTimeString()
                            let task_copy = JSON.parse(JSON.stringify(task))
                            if ("remark" in task_copy[weekdates[day]]) {
                                task_copy[weekdates[day]]["remark"].push([now, (e.target as HTMLInputElement).value])
                            } else {
                                task_copy[weekdates[day]]["remark"] = [[now, (e.target as HTMLInputElement).value]]
                            }
                            let updated_tasks = []
                            for (let t of all_tasks) {
                                if (((t.name === task.name) && (t.tag === task.tag))) {
                                    updated_tasks.push(task_copy)
                                } else {
                                    updated_tasks.push(t)
                                }
                            }
                            update_tasks(updated_tasks, set_all_tasks)
                        }
                }}
            />
        </PopoverContent>
    </Popover>
  )
}

function PopoverDone({
    day,
    task, 
    all_tasks,
    set_all_tasks}
:{  day: any;
    task: any;
    all_tasks: any;
    set_all_tasks: any;
}) {
    return (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
                <Timer className="h-3.5 w-3.5" color="#52525b"/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit bg-black border-[#41274f] border-2">
            <Input
                id="time_spent"
                className="h-6 w-min m-2 align-self-center justify-end border-[#41274f]"
                type="range"
                min="0" max="1" step="0.1"
                value={task[weekdates[day]]["done"]}
                onChange={e => {
                        let task_copy = JSON.parse(JSON.stringify(task))
                        task_copy[weekdates[day]]["done"] = (parseFloat(e.target.value).toFixed(1))
                        let updated_tasks = []
                        for (let t of all_tasks) {
                            if (((t.name === task.name) && (t.tag === task.tag))) {
                                updated_tasks.push(task_copy)
                            } else {
                                updated_tasks.push(t)
                            }
                        }
                        let todays_contri = get_todays_contri(day, updated_tasks)
                        if (todays_contri <= 1) {
                            update_tasks(updated_tasks, set_all_tasks)
                        }
                    }
                }
            />
        </PopoverContent>
    </Popover>
  )
}

function TaskNameView({
    task_done,
    task_name
} : {
    task_done: any;
    task_name: any;
}) {
    if (task_done == "0.1") 
        return (
            <p className="mt-2 ml-2 text-xs text-[#b39ac1]">{task_name}</p>
        )
    else
        return (
            <p className="mt-2 ml-2 text-sm text-[#b39ac1]">{task_name}</p>
        )
}

function ActiveTaskView({
    day,
    task, 
    index,
    all_tasks,
    set_all_tasks
}:{ day: any;
    task: any; 
    index: number;
    all_tasks: any;
    set_all_tasks: any;
}) {
    let task_view_height = window.innerHeight * 10/12;
    return (
        <div key={index} className="rounded-md bg-black border-l-4 border-[#41274f] my-1 hover:border-2 hover:border-white" style={{ height: (task[weekdates[day]]["done"] * task_view_height) }}>
            <div className="flex flex-row justify-between">
                <TaskNameView task_done={task[weekdates[day]]["done"]} task_name={task.name}></TaskNameView>
                <PopoverRemark day={day} task={task} all_tasks={all_tasks} set_all_tasks={set_all_tasks}></PopoverRemark>
            </div>
            <div className="flex flex-row justify-between ml-2 mb-2 pb-1">
                <div className="flex flex-row">
                    <Button variant="ghost" size="icon" className="m-0">
                        <Tag className="h-3.5 w-3.5" color="#52525b"/> 
                    </Button>
                    <p className="text-xs self-center" color="#52525b">{task.tag}</p>
                </div>
                <div className="flex flex-row">
                    <PopoverDone day={day} task={task} all_tasks={all_tasks} set_all_tasks={set_all_tasks}></PopoverDone>
                    <div className="w-1"></div>
                    <p className="text-xs self-center mr-2" color="#52525b">{task[weekdates[day]]["done"]}</p>
                </div>
            </div>
        </div>
    )
}

function DayView({
    day,
    index,
    all_tasks, 
    set_all_tasks,
}:{ day: number; 
    index: number;
    all_tasks: any; 
    set_all_tasks: any; 
}) {
    const [value, set_value] = useState<any>("")

    useEffect(() => {
        if (value != "") {
            let todays_contri = get_todays_contri(day, all_tasks)
            if (todays_contri < 1) {
                let updated_tasks = []
                for (let t of all_tasks) {
                    let t_copy = t
                    if (((t.name === value) || (t.tag === value))) {
                        t_copy[weekdates[day_id]] = {"done": "0.1"}
                        updated_tasks.push(t_copy)
                    } else {
                        updated_tasks.push(t)
                    }
                }
                update_tasks(updated_tasks, set_all_tasks)
            }
            set_value("")
        }
    }, [value]);

    if (day === day_id) {
        return (
            <div key={index} className="flex rounded-xl justify-self-center w-11/12 my-2 flex-col grow">
                <div className="bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-2 py-2 hover:rounded-none ">
                    <h2 className="text-xl font-medium tracking-wide text-center align-middle align-text-bottom text-white">Today</h2>
                </div>
                <div className="rounded-xl mt-2 bg-[#18181b] grow">
                    <div className="p-2 w-full">
                        <SearchBox suggestions={all_tasks} value={value} set_value={set_value}></SearchBox>
                    </div>
                    <div className="mx-2">
                        {all_tasks.map((task: any, index: number) => {
                            if ((weekdates[day] in task) && ("done" in task[weekdates[day]])) {
                                if (parseFloat(task[weekdates[day]]["done"]) > 0) {
                                    return (
                                    <ActiveTaskView key={index} day={day} task={task} index={index} all_tasks={all_tasks} set_all_tasks={set_all_tasks}></ActiveTaskView> 
                                    )
                                }
                            } else {
                                ""
                            }
                        }
                        )}
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div key={index} className="flex rounded-xl justify-self-center w-11/12 my-2 flex-col grow">
                <div className="bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-2 py-2 hover:rounded-none">
                    <h2 className="text-xl font-medium tracking-wide text-center align-middle align-text-bottom text-white">{weekdays[day]}</h2>
                </div>
                <div className="rounded-xl mt-2 bg-[#18181b] grow">
                    <div className="mx-2">
                        {all_tasks.map((task: any, index: number) => {
                            if ((weekdates[day] in task) && ("done" in task[weekdates[day]])) {
                                if (parseFloat(task[weekdates[day]]["done"]) > 0) {
                                    return (
                                    <ActiveTaskView key={index} day={day} task={task} index={index} all_tasks={all_tasks} set_all_tasks={set_all_tasks}></ActiveTaskView> 
                                    )
                                }
                            } else {
                                ""
                            }
                        }
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default function Today() {
    const [all_tasks, set_all_tasks] = useState<any>([]);
    const [week, set_week] = useState([0, 1, 2, 3, 4])
    const [contri, set_contri] = useState<any>(0); 

    useEffect(() => {
        get_tasks(set_all_tasks)
    }, []);

    return (
    <div className="flex justify-around grid mx-4 grid-cols-5 h-screen flex-row">
        {week.map((day: number, index: number) => 
            <DayView key={index} day={day} index={index} all_tasks={all_tasks} set_all_tasks={set_all_tasks}></DayView>
        )}
    </div>
    )
}