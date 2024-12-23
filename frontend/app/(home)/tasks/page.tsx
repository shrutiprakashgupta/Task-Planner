'use client';

import { 
    ScrollArea 
} from "@/components/ui/scroll-area"
import {
  Input
} from "@/components/ui/input"
import { 
    useEffect, 
    useState,
    useRef
} from "react";
import { 
    get_tag_colors,
    get_tasks,
    update_tasks  
} from "../utils";
import TaskCardView from "./task-card-view"

function filter_tasks(
    pattern: string, 
    all_tasks: [], 
    set_tasks: any
) {
    let control = pattern[0]
    let input = pattern.slice(1)

    //Search in existing tasks
    if (control === '/') {
        var re = new RegExp(input, "i");
        let filtered_tasks = all_tasks.filter(function (task: any) {
            return (re.test(task.name) || re.test(task.tag));
        }
        );
        set_tasks(filtered_tasks)
    }
}

function CategoryView({
    status
}:{
    status: any;
}
) {
    return (
        <div className="bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-4 py-2 hover:rounded-none">
            <h2 className="text-xl font-medium tracking-wide text-center align-middle align-text-bottom text-white">
                {status} Tasks
            </h2>
        </div>
    )
}

export default function Tasks() {
    const [all_tasks, set_all_tasks] = useState<any>([]);
    const [tasks, set_tasks] = useState<any>([]);
    const [colors, set_colors] = useState<any>([]);
    const [tag, set_tag] = useState<any>("")
    const [planned_days, set_planned_days] = useState<any>(0)
    const [planned_date, set_planned_date] = useState<any>("")
    const [start_date, set_start_date] = useState<any>("")
    const [end_date, set_end_date] = useState<any>("")
    const [task_update, set_task_update] = useState<any>(0)
    const [task_delete, set_task_delete] = useState<any>(0)
    const [task_add, set_task_add] = useState<any>(0)
    const searchRef = useRef<HTMLInputElement>(null);

    //Read all data from backend
    useEffect(() => {
        get_tasks(set_all_tasks)
        get_tasks(set_tasks)
    }, []);

    useEffect(() => {
        get_tag_colors(all_tasks, set_colors);
    }, [all_tasks])

    //Setup shortcut key for Search
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
          if (((event.key === '/') || (event.key === ':')) && searchRef.current) {
            searchRef.current.focus();
          } else {
            if ((event.key === 'Escape') && searchRef.current) {
                searchRef.current.value = "";
            }
          }
        };

        // Add event listener when the component mounts
        document.addEventListener('keydown', handleKeyPress);

        // Clean up the event listener when the component unmounts
        return () => {
          document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    //Update task
    useEffect (() => {
      if (task_update != "") {
        //Select the task to be updated
        let t_updated
        for (let t of all_tasks) {
            if (t.index === task_update) {
                t_updated = t
            } 
        }

        //Update the provided fields only
        if (tag != "") {
            t_updated.tag = tag
        }
        if (planned_days != "") {
            t_updated.planned_days = planned_days
        }
        if (planned_date != "") {
            t_updated.planned_date = planned_date
        }
        if (start_date != "") {
            t_updated.start_date = start_date
        }
        if (end_date != "") {
            t_updated.end_date = end_date
        }

        //Update the backend data as well
        let updated_tasks = []
        for (let t of all_tasks) {
            if (t.index === task_update) {
                updated_tasks.push(t_updated)
            } else {
                updated_tasks.push(t)
            }
        }
        update_tasks(updated_tasks, set_all_tasks);
        
        //Update the task view with new info
        set_tasks(updated_tasks)
        set_task_update("")
      }
    }, [task_update])

    //Delete task
    useEffect (() => {
        if (task_delete != "") {
            let updated_tasks = []
            for (let t of all_tasks) {
                if (t.index === task_delete) {
                    //Remove the deleted task info
                } else {
                    updated_tasks.push(t)
                }
            } 

            //Update the backend data as well
            update_tasks(updated_tasks, set_all_tasks);

            //Remove the deleted task from current view
            set_tasks(updated_tasks)
            set_task_delete("")
        }
    }, [task_delete])

    //Add New task
    useEffect (() => {
        if (task_add != "") {
            let name = task_add
            if (name[0] === ':') {
                let index = 0;
                for (let t of all_tasks) {
                    index = t.index + 1
                }
                let today = new Date().toLocaleDateString()

                //Initialize default values for the new task
                let new_task = {
                    name: name.slice(1),
                    index: index, 
                    tag: "New Task", 
                    status: "Planned", 
                    planned_date: today, 
                    planned_days: 0, 
                    start_date: today, 
                    done_days: 0, 
                    end_date: today}

                //Add the new task into database
                let updated_tasks = all_tasks
                updated_tasks.push(new_task)
                update_tasks(updated_tasks, set_all_tasks);

                //Add the task to current view
                set_tasks(updated_tasks)
                set_task_add("")
            }
        }
    }, [task_add])

    //Task View
    let task_category = ["Planned", "Ongoing", "Completed"]
    return (
    <div className="fixed top-0 left-10 w-full h-full bg-black" style={{ display: 'flex', flexDirection: 'column', height: '100vh'}}>
        <div className="flex justify-around grid gap-y-4 pb-4 px-12 grid-cols-3 h-full overflow-y-auto">
            {task_category.map((category: any, index: number) => {
                return (
                <div key={index}>
                    <ScrollArea className="rounded-md border p-4">
                        <CategoryView 
                            status={category}>
                        </CategoryView>
                        {tasks.map((task: any, index: number) => {
                            if (task.status === category) {
                                return (
                                    <TaskCardView task={task}
                                        key={index}
                                        colors={colors}
                                        set_tag={set_tag}
                                        set_planned_days={set_planned_days}
                                        set_planned_date={set_planned_date}
                                        set_start_date={set_start_date}
                                        set_end_date={set_end_date}
                                        set_task_update={set_task_update}
                                        set_task_delete={set_task_delete}>
                                    </TaskCardView>
                                )
                            }
                        })}
                    </ScrollArea>
                </div>
                )
            })}
        </div>
        <div className="py-4 w-full bottom-0 flex justify-center bg-black" style={{flex: 1}}>
            <Input
                ref={searchRef}
                placeholder="Search/Add Tasks"
                autoFocus
                onChange={(event) => 
                    filter_tasks(event.target.value, all_tasks, set_tasks)
                }
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        set_task_add(event.currentTarget.value);
                    }
                }}
                className="h-12 w-11/12 border-2 hover:border-[#9b9cb5] hover:border-3"
            />
        </div>
    </div>
    )
}