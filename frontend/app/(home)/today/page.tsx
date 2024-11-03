'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchBox } from "./searchbox";
import { 
    useEffect, 
    useState 
} from "react";
import {
    ChevronsLeft,
    ChevronsRight,
    Tag,
    Timer,
    MessageSquareText
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
    get_tasks,
    update_tasks
 } from "../utils";

let today = new Date().toLocaleDateString("en-CA")
let weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function get_week_dates(day: any, set_week:any) {
    var week= new Array(); 
    let last_day = new Date()
    last_day.setDate(last_day.getDate() - day)
    console.log(day)
    console.log(last_day)

    var i = 0;
    while(i < 5) {
        let weekday = weekdays[last_day.getDay()]
        if ((weekday === "Sat") || (weekday === "Sun")) {
            //Don't add Sat-Sun in the view
        } else {
            week.push(
                new Date(last_day).toLocaleDateString("en-CA")
            ); 
            i = i + 1;
        }
        last_day.setDate(last_day.getDate() - 1);
    }
    week.reverse()
    set_week(week)
}

function get_todays_contri (day: any, tasks: any){
    let todays_contri = 0
    for (let task of tasks) {
        if ((day in task) && ("done" in task[day])) {
            todays_contri = todays_contri + parseFloat(task[day]["done"]);
        }
    }
    return todays_contri
}

function PopoverRemark({
    task, 
    set_remark
}:{ task: any;
    set_remark: any;
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
                            let now = new Date().toLocaleTimeString()
                            set_remark([task.index, now, (e.target as HTMLInputElement).value])
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
    set_done
}:{  day: any;
    task: any;
    set_done: any;
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
                value={task[day]["done"]}
                onChange={e => {
                        set_done([task.index, day, parseFloat(e.target.value).toFixed(1)])
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

function DayNameView({
    title,
    index,
    set_day
} : {
    title: string;
    index: number;
    set_day: any;
}) {
    const IncreaseValue = () => {
        set_day((day: number) => day + 1);
    }
    const DecreaseValue = () => {
        set_day((day: number) => day - 1);
    }

    if (index === 0) 
        return (
            <div className="flex flex-row justify-center bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-2 py-2 hover:rounded-none">
                <Button variant="ghost" size="icon" className="h-7 w-7 mr-4" onClick={IncreaseValue}>
                    <ChevronsLeft color="#52525b"/> 
                </Button>
                <h2 className="text-xl font-medium mr-4 tracking-wide align-middle align-text-bottom text-white">{title}</h2>
            </div>
        )
    else {
        if (index == 4) {
        return (
            <div className="flex flex-row justify-center bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-2 py-2 hover:rounded-none">
                <h2 className="text-xl font-medium ml-4 tracking-wide align-middle align-text-bottom text-white">{title}</h2>
                <Button variant="ghost" size="icon" className="h-7 w-7 ml-4" onClick={DecreaseValue}>
                    <ChevronsRight color="#52525b"/> 
                </Button>
            </div>
        )
        } else {
        return (
            <div className="flex flex-row justify-center bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-2 py-2 hover:rounded-none">
                <h2 className="text-xl font-medium tracking-wide align-middle align-text-bottom text-white">{title}</h2>
            </div>
        )
        }
    }
}

function ActiveTaskView({
    day,
    task, 
    set_done,
    set_remark,
}:{ day: any;
    task: any; 
    set_done: any;
    set_remark: any;
}) {
    let task_view_height = window.innerHeight * 10/12;
    return (
        <div className="rounded-md bg-black border-l-4 border-[#41274f] my-1 hover:border-2 hover:border-white" 
            style={{ height: (task[day]["done"] * task_view_height) }}>
            <div className="flex flex-row justify-between">
                <TaskNameView 
                    task_done={task[day]["done"]} 
                    task_name={task.name}>
                </TaskNameView>
                <PopoverRemark 
                    task={task} 
                    set_remark={set_remark}>
                </PopoverRemark>
            </div>
            <div className="flex flex-row justify-between ml-2 mb-2 pb-1">
                <div className="flex flex-row">
                    <Button variant="ghost" size="icon" className="m-0">
                        <Tag className="h-3.5 w-3.5" color="#52525b"/> 
                    </Button>
                    <p className="text-xs self-center" color="#52525b">{task.tag}</p>
                </div>
                <div className="flex flex-row">
                    <PopoverDone 
                        day={day} 
                        task={task} 
                        set_done={set_done}>
                    </PopoverDone>
                    <div className="w-1"></div>
                    <p className="text-xs self-center mr-2" color="#52525b">{task[day]["done"]}</p>
                </div>
            </div>
        </div>
    )
}

function DayView({
    day,
    index,
    task,
    set_day,
    set_task,
    set_done,
    set_remark,
    all_tasks, 
}:{ day: any; 
    index: number;
    task: any;
    set_day: any;
    set_task: any;
    set_done: any;
    set_remark: any;
    all_tasks: any; 
}) {

    let weekday = new Date(day).toLocaleDateString('en-US', {day: '2-digit', month: 'short', weekday: 'short'})
    if (day === today) {
        return (
            <div className="flex rounded-xl justify-self-center w-11/12 my-2 flex-col grow">
                <DayNameView
                    title="Today"
                    index={index}
                    set_day={set_day}>
                </DayNameView>
                <div className="rounded-xl mt-2 bg-[#18181b] grow">
                    <div className="p-2 w-full">
                        <SearchBox 
                            suggestions={all_tasks} 
                            value={task} 
                            set_value={set_task}>
                        </SearchBox>
                    </div>
                    <div className="mx-2">
                        {all_tasks.map((task: any, index: number) => {
                            if ((day in task) && ("done" in task[day])) {
                                if (parseFloat(task[day]["done"]) > 0) {
                                    return (
                                    <ActiveTaskView 
                                        key={index}
                                        day={day}
                                        task={task}
                                        set_done={set_done}
                                        set_remark={set_remark}>
                                    </ActiveTaskView> 
                                    )
                                }
                            }
                        }
                        )}
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex rounded-xl justify-self-center w-11/12 my-2 flex-col grow">
                <DayNameView
                    title={weekday}
                    index={index}
                    set_day={set_day}>
                </DayNameView>
                <div className="rounded-xl mt-2 bg-[#18181b] grow">
                    <div className="mx-2">
                        {all_tasks.map((task: any, index: number) => {
                            if ((day in task) && ("done" in task[day])) {
                                if (parseFloat(task[day]["done"]) > 0) {
                                    return (
                                    <ActiveTaskView 
                                        key={index}
                                        day={day}
                                        task={task}
                                        set_done={set_done}
                                        set_remark={set_remark}
                                        >
                                    </ActiveTaskView> 
                                    )
                                }
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
    const [day, set_day] = useState<number>(0)
    const [week, set_week] = useState([])
    const [all_tasks, set_all_tasks] = useState<any>([]);
    const [task, set_task] = useState<any>("")
    const [remark, set_remark] = useState<any>("")
    const [done, set_done] = useState<any>("")

    useEffect(() => {
        set_day(0)
        get_tasks(set_all_tasks)
    }, []);

    useEffect(() => {
        get_week_dates(day, set_week)
    }, [day])

    useEffect(() => {
        if (task != "") {
            let todays_contri = get_todays_contri(today, all_tasks)
            if (todays_contri < 1) {
                let updated_tasks = []
                for (let t of all_tasks) {
                    let t_copy = t
                    if (((t.name === task) || (t.tag === task))) {
                        t_copy[today] = {"done": "0.1", "done_days": "0.1"}
                        updated_tasks.push(t_copy)
                    } else {
                        updated_tasks.push(t)
                    }
                }
                update_tasks(updated_tasks, set_all_tasks)
            }
            set_task("")
        }
    }, [task]);

    useEffect(() => {
        if (remark != "") {
            let updated_tasks = []
            for (let t of all_tasks) {
                if (t.index === remark[0]) {
                    let t_copy = JSON.parse(JSON.stringify(t))
                    if (today in t_copy) {
                        if ("remark" in t_copy[today]) {
                            t_copy[today]["remark"].push([remark[1], remark[2]])
                        } else {
                            t_copy[today]["remark"] = [[remark[1], remark[2]]]
                        }
                    } else {
                        t_copy[today] = {"remark": [[remark[1], remark[2]]]}
                    }
                    updated_tasks.push(t_copy)
                } else {
                    updated_tasks.push(t)
                }
            }
        update_tasks(updated_tasks, set_all_tasks)
        set_remark("")
        }
    }, [remark])

    useEffect(() => {
        if (done != "") {
            let updated_tasks = []
            for (let t of all_tasks) {
                if (t.index === done[0]) {
                    let t_copy = JSON.parse(JSON.stringify(t))
                    t_copy["done_days"] = t_copy["done_days"] - t_copy[done[1]]["done"] + done[2]
                    t_copy[done[1]]["done"] = done[2]
                    updated_tasks.push(t_copy)
                } else {
                    updated_tasks.push(t)
                }
            }
            let todays_contri = get_todays_contri(done[1], updated_tasks)
            if (todays_contri <= 1) {
                update_tasks(updated_tasks, set_all_tasks)
            }
        set_done("")
        }
    })

    return (
    <div>
        <div className="flex grid grid-cols-5 mx-4 justify-stretch h-screen flex-row">
            {week.map((day: any, index: number) => 
                <DayView 
                    day={day} 
                    key={index} 
                    index={index}
                    task={task} 
                    set_day={set_day}
                    set_task={set_task} 
                    set_done={set_done}
                    set_remark={set_remark}
                    all_tasks={all_tasks}>
                </DayView>
            )}
        </div>
    </div>
    )
}