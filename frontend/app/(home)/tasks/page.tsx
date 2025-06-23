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
    update_tasks,
    backup_tasks
} from "../utils";
import TaskCardView from "./task-card-view"
import { Button } from "@/components/ui/button";
import { DatabaseBackup, CalendarPlus, CalendarCog, CalendarCheck2 } from "lucide-react";

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
    const getIcon = (status: string) => {
        switch(status) {
            case "Planned":
                return <CalendarPlus className="h-5 w-5 text-[#DDA853]" />;
            case "Ongoing":
                return <CalendarCog className="h-5 w-5 text-[#DDA853]" />;
            case "Completed":
                return <CalendarCheck2 className="h-5 w-5 text-[#DDA853]" />;
            default:
                return null;
        }
    };

    return (
        <div className="flex items-center gap-2 py-2">
            {getIcon(status)}
            <h2 className="text-xl font-medium tracking-wide text-[#F3F3E0]">
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
    const [backup, set_backup] = useState<any>(0);

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

    //Backup all Task Data
    useEffect (() => {
        if (backup != "") {
            backup_tasks(all_tasks)
        }
    }, [backup])
    
    //Task View
    let task_category = ["Planned", "Ongoing", "Completed"]
    return (
    <div className="fixed top-0 left-8 w-full h-full bg-black" style={{ display: 'flex', flexDirection: 'column', height: '100vh'}}>
        <div className="grid grid-cols-[2fr_auto_2fr_auto_2fr] gap-x-12 items-stretch h-full overflow-y-auto px-12 pb-4">
            {task_category.flatMap((category: string, index: number) => {
                const columnComponent = (
                    <div key={`category-column-${category}`} className="flex flex-col bg-black rounded-xl py-4">
                        <CategoryView 
                            status={category}>
                        </CategoryView>
                        <ScrollArea className="rounded-md mt-4">
                            {tasks
                                .filter((task: any) => task.status === category)
                                .map((task: any) => (
                                    <TaskCardView task={task}
                                        key={task.index} // Assuming task.index is a unique identifier for the task
                                        colors={colors}
                                        set_tag={set_tag}
                                        set_planned_days={set_planned_days}
                                        set_planned_date={set_planned_date}
                                        set_start_date={set_start_date}
                                        set_end_date={set_end_date}
                                        set_task_update={set_task_update}
                                        set_task_delete={set_task_delete}>
                                    </TaskCardView>
                                ))}
                        </ScrollArea>
                    </div>
                );

                if (index > 0) {
                    // Add a separator before the second and third columns
                    const separatorComponent = (
                        <div key={`separator-${index}`} className="w-[2px] bg-[#DDA853]/30">
                            {/* This separator is a grid item. items-stretch from parent grid makes it full height. */}
                        </div>
                    );
                    return [separatorComponent, columnComponent];
                }
                
                return [columnComponent];
            })}
        </div>
        <div className="flex flex-row align-middle py-4 pl-24 justify-self-center gap-4">
            <Button variant="outline" size="default" className="h-12 border-2 hover:border-[#DDA853] hover:bg-black" onClick={() => set_backup(0)}>
                <DatabaseBackup color="gray" />
            </Button>
            <div className="w-full bottom-0 flex bg-black">
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
                    className="h-12 w-11/12 border-2 hover:border-[#DDA853] hover:border-3"
                />
            </div>
        </div>
    </div>
    )
}