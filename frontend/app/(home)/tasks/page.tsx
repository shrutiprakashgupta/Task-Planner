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

function filter_tasks(pattern: string, all_tasks: [], set_tasks: any) {
        var re = new RegExp(pattern, "i");
        let filtered_tasks = all_tasks.filter(function (task: any) {
            return (re.test(task.name) || re.test(task.tag));
        }
        );
        set_tasks(filtered_tasks)
}

function get_task_card_view(status: string, task: any, index: number) {
    if (task.status == status) {
        return (
            <TaskCardView task={task.name} key={index} tag={task.tag} planned_days={task.planned_days} done_days={task.done_days} planned_date={task.planned_date} start_date={task.start_date} end_date={task.end_date} status={task.status}></TaskCardView>
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

    useEffect(() => {
        get_tasks(set_all_tasks)
        get_tasks(set_tasks)
    }, []);

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
                        return get_task_card_view("Planned", task, index)
                    })}
                </ScrollArea>
            </div>
            <div>
                <ScrollArea className="rounded-md border py-4">
                    <div className="bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-4 py-2 hover:rounded-none">
                        <h2 className="text-xl font-medium tracking-wide text-center align-middle align-text-bottom text-white">Ongoing Tasks</h2>
                    </div>
                    {tasks.map((task: any, index: number) => {
                        return get_task_card_view("Ongoing", task, index)
                    })}
                </ScrollArea>
            </div>
            <div>
                <ScrollArea className="rounded-md border p-4">
                    <div className="bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-4 py-2 hover:rounded-none">
                        <h2 className="text-xl font-medium tracking-wide text-center align-middle align-text-bottom text-white">Completed Tasks</h2>
                    </div>
                    {tasks.map((task: any, index: number) => {
                        return get_task_card_view("Completed", task, index)
                    })}
                </ScrollArea>
            </div>
        </div>
    </div>
    )
}