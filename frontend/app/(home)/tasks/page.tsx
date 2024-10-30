'use client';

import TaskCardView from "./task-card-view"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Input
} from "@/components/ui/input"
import { useEffect, useState } from "react";

async function get_tasks(set_tasks: any) {
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


function filter_tasks(pattern: string, all_tasks: [], set_tasks: any) {
        var re = new RegExp(pattern, "i");
        let filtered_tasks = all_tasks.filter(function (task: any) {
            return (re.test(task.name) || re.test(task.tag));
        }
        );
        set_tasks(filtered_tasks)
}

function get_task_card_view(status: string, task: any, index: number, set_tag: any, set_planned_days: any, set_planned_date: any, set_start_date: any, set_end_date: any, set_task_update: any, set_task_delete: any) {
    if (task.status == status) {
        return (
            <TaskCardView task={task} key={index} set_tag={set_tag} set_planned_days={set_planned_days} set_planned_date={set_planned_date} set_start_date={set_start_date} set_end_date={set_end_date} set_task_update={set_task_update} set_task_delete={set_task_delete}></TaskCardView>
        )
    } else {
        return (
            ""
        )
    }
}

export default function Tasks() {
    const [all_tasks, set_all_tasks] = useState<any>([]);
    const [tasks, set_tasks] = useState<any>([]);
    const [tag, set_tag] = useState<any>("")
    const [planned_days, set_planned_days] = useState<any>(0)
    const [planned_date, set_planned_date] = useState<any>("")
    const [start_date, set_start_date] = useState<any>("")
    const [end_date, set_end_date] = useState<any>("")
    const [task_update, set_task_update] = useState<any>(0)
    const [task_delete, set_task_delete] = useState<any>(0)

    useEffect(() => {
        get_tasks(set_all_tasks)
        get_tasks(set_tasks)
    }, []);

    useEffect (() => {
      if (task_update != "") {
        let t_updated
        for (let t of all_tasks) {
            if (t.index === task_update) {
                t_updated = t
            } 
        }
        if (tag != "") {
          t_updated.tag = tag
        }
        if (planned_days != "") {
          t_updated.planned_days = planned_days
        }
        if (planned_date != "") {
          let t_planned_date = new Date(Date.parse(planned_date))
          t_updated.planned_date = t_planned_date.toLocaleDateString('en-US', {year: '2-digit', month: 'short', day: '2-digit'})
        }
        if (start_date != "") {
          let t_start_date = new Date(Date.parse(start_date))
          t_updated.start_date = t_start_date.toLocaleDateString('en-US', {year: '2-digit', month: 'short', day: '2-digit'})
        }
        if (end_date != "") {
          let t_end_date = new Date(Date.parse(end_date))
          t_updated.end_date = t_end_date.toLocaleDateString('en-US', {year: '2-digit', month: 'short', day: '2-digit'})
        }
        let updated_tasks = []
        for (let t of all_tasks) {
            if (t.index === task_update) {
                updated_tasks.push(t_updated)
            } else {
                updated_tasks.push(t)
            }
        }
        update_tasks(updated_tasks, set_all_tasks);
        set_task_update("")
      }
    }, [task_update])

    useEffect (() => {
        if (task_delete != "") {
            let updated_tasks = []
            for (let t of all_tasks) {
                if (t.index === task_delete) {
                } else {
                    updated_tasks.push(t)
                }
            } 
            update_tasks(updated_tasks, set_all_tasks);
            set_task_delete("")
        }
    }, [task_delete])

    return (
    <div>
        <div className="flex px-8 pt-4 justify-center">
            <Input
                placeholder="Search Tasks"
                autoFocus
                onChange={(event) => 
                    filter_tasks(event.target.value, all_tasks, set_tasks)
                }
                className="h-12 w-11/12 border-2 hover:border-[#9b9cb5] hover:border-3"
            />
        </div>
        <div className="flex justify-around grid gap-y-4 pt-2 pb-4 px-12 grid-cols-3">
            <div>
                <ScrollArea className="rounded-md border p-4">
                    <div className="bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-4 py-2 hover:rounded-none">
                        <h2 className="text-xl font-medium tracking-wide text-center align-middle align-text-bottom text-white">Planned Tasks</h2>
                    </div>
                    {tasks.map((task: any, index: number) => {
                        return get_task_card_view("Planned", task, index, set_tag, set_planned_days, set_planned_date, set_start_date, set_end_date, set_task_update, set_task_delete)
                    })}
                </ScrollArea>
            </div>
            <div>
                <ScrollArea className="rounded-md border py-4">
                    <div className="bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-4 py-2 hover:rounded-none">
                        <h2 className="text-xl font-medium tracking-wide text-center align-middle align-text-bottom text-white">Ongoing Tasks</h2>
                    </div>
                    {tasks.map((task: any, index: number) => {
                        return get_task_card_view("Ongoing", task, index, set_tag, set_planned_days, set_planned_date, set_start_date, set_end_date, set_task_update, set_task_delete)
                    })}
                </ScrollArea>
            </div>
            <div>
                <ScrollArea className="rounded-md border p-4">
                    <div className="bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-4 py-2 hover:rounded-none">
                        <h2 className="text-xl font-medium tracking-wide text-center align-middle align-text-bottom text-white">Completed Tasks</h2>
                    </div>
                    {tasks.map((task: any, index: number) => {
                        return get_task_card_view("Completed", task, index, set_tag, set_planned_days, set_planned_date, set_start_date, set_end_date, set_task_update, set_task_delete)
                    })}
                </ScrollArea>
            </div>
        </div>
    </div>
    )
}