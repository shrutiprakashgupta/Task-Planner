'use client';

import TaskCardView from "./../tasks/task-card-view"
import {
  Input
} from "@/components/ui/input"
import {
    ScrollArea
} from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react";
import CommandMenu from "../tasks/command";
import { SearchBox } from "./searchbox";

async function get_tasks(set_tasks: any) {
    try {
        let response = await fetch('http://127.0.0.1:5000/home');
        let tasks_json = await response.json();
        set_tasks(tasks_json)
        // let tasks_name = tasks_json.map((task: any, idx: number) => {
        //     return task.name;
        // })
        // set_tasks(tasks_name);
    } catch (error) {
        console.log(error)
    }
}

function filter_tasks(pattern: string, all_tasks: [], set_tasks: any) {
        var re = new RegExp(pattern, "i");
        let filtered_tasks = all_tasks.filter(function (task: any) {
            return (re.test(task.name) || re.test(task.tag));
        }
        );
        set_tasks(filtered_tasks)
}

function get_task_card_view(status: string, task: any, index: number) {
    return (
        <TaskCardView task={task.name} key={index} tag={task.tag} planned_days={task.planned_days} done_days={task.done_days} planned_date={task.planned_date} start_date={task.start_date} end_date={task.end_date} status={status}></TaskCardView>
    )
}

function get_day_view(column_id: number, all_tasks: any, set_all_tasks: any, todays_tasks: any, set_todays_tasks: any) {
    let day_id = new Date().getDay()
    const weekdays_names = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    if (column_id === day_id) {
        return (
            <div className="rounded-xl justify-self-center w-11/12 my-4 h-full">
                <div className="bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-2 py-2 hover:rounded-none ">
                    <h2 className="text-xl font-medium tracking-wide text-center align-middle align-text-bottom text-white">Today</h2>
                </div>
                <div className="rounded-xl mt-2 bg-[#1d1a1f] h-full">
                    <div className="p-2 w-full">
                        <SearchBox all_tasks={all_tasks} set_all_tasks={set_all_tasks} set_tasks={set_todays_tasks}></SearchBox>
                    </div>
                    <div className="mx-2">
                        {todays_tasks.map((task: any, index: number) => {
                            return get_task_card_view("Ongoing", task, index)
                        })}
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="rounded-xl justify-self-center w-11/12 my-4 h-full">
                <div className="bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-2 py-2 hover:rounded-none">
                    <h2 className="text-xl font-medium tracking-wide text-center align-middle align-text-bottom text-white">{weekdays_names[column_id]}</h2>
                </div>
                <div className="rounded-xl mt-2 bg-[#1d1a1f] h-full">
                </div>
            </div>
        )
    }
}

export default function Today() {
    const [all_tasks, set_all_tasks] = useState<any>([]);
    const [todays_tasks, set_todays_tasks] = useState<any>([]);
    // TODO: fix the weekdays below
    const [weekdays, set_weekdays] = useState([3, 4, 5, 6, 0])

    useEffect(() => {
        get_tasks(set_all_tasks)
    }, []);

    return (
    <div className="flex justify-around grid mx-4 grid-cols-5 h-full">
        {weekdays.map((day: number) => 
            get_day_view(day, all_tasks, set_all_tasks, todays_tasks, set_todays_tasks))
        }
    </div>
    )
}