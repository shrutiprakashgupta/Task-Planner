'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchBox } from "./searchbox";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { 
    useEffect, 
    useState 
} from "react";
import {
    ChevronsLeft,
    ChevronsRight,
    Tag,
    Timer,
    MessageSquareText,
    SquareCheckBig
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
    get_tag_colors,
    get_tasks,
    update_tasks
 } from "../utils";

let today = new Date().toLocaleDateString("en-CA")
let weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function get_week_dates(day: number, set_week:any) {
    var week= new Array(); 
    let last_day = new Date()
    last_day.setDate(last_day.getDate() - day)

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

function get_days_contri (date: any, tasks: any){
    let days_contri = 0
    for (let task of tasks) {
        if ((date in task) && ("done" in task[date])) {
            days_contri = days_contri + parseFloat(task[date]["done"]);
        }
    }
    return days_contri
}

function PopoverDone({
    date,
    task, 
    set_done
}:{  date: any;
    task: any;
    set_done: any;
}) {
    return (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
                <Timer className="h-3.5 w-3.5 hover:fill-zinc-300 hover:border-zinc-800" color="#52525b"/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit bg-black border-[#41274f]">
            <Input
                id="time_spent"
                className="w-min align-self-center justify-end border-[#41274f]"
                type="range"
                min="0" max="1" step="0.1"
                value={task[date]["done"]}
                onChange={e => {
                        set_done([task.index, date, parseFloat(e.target.value)])
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
    date,
    set_day
} : {
    title: string;
    index: number;
    date: any;
    set_day: any;
}) {
    const IncreaseValue = () => {
        let weekday = weekdays[new Date(date).getDay()]
        if (weekday === "Mon") {
            set_day((day: number) => day + 3)
        } else {
            set_day((day: number) => day + 1)
        }
    }
    const DecreaseValue = () => {
        let weekday = weekdays[new Date(date).getDay()]
        if (weekday === "Fri") {
            set_day((day: number) => day - 3)
        } else {
            set_day((day: number) => day - 1)
        }
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
    date,
    task, 
    colors,
    set_done,
    set_complete
}:{ date: any;
    task: any; 
    colors: any;
    set_done: any;
    set_complete: any;
}) {
    let task_done = (task.status == "Completed") ? "fill-green-300" : "";
    return (
        <Card className={`border-0 border-l-2 ${colors[task["tag"]]} hover:border-2 hover:border-[#9b9cb5] h-full`}>
             {/* bg-gradient-to-t from-[#25162c] from-1% to-[#3b3b3b] to-99%`}> */}
          <CardHeader>
            <CardTitle className="font-sans text-white">
                <div className="flex flex-row justify-between">
                    <p>{task.name}</p>
                    <div className="flex flex-row justify-end">
                        <Button variant="ghost" size="icon" onClick={() => set_complete(task.index)}>
                            <SquareCheckBig className={`h-3.5 w-3.5 ${task_done} hover:fill-green-300 hover:border-green-800`} color="#52525b"/>
                        </Button>
                        <p className="font-sans text-[12px] font-extralight leading-relaxed align-text-top text-zinc-400">{task.done_days}/{task.planned_days}</p>
                    </div>
              </div>
            </CardTitle>
            <div>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row self-top">
                        <Button variant="ghost" size="icon" className="m-0">
                            <Tag className="h-3.5 w-3.5 hover:fill-zinc-300 hover:border-zinc-800" color="#52525b"/> 
                        </Button>
                        <p className="text-xs pt-1 self-top text-zinc-400">{task.tag}</p>
                    </div>
                    <div className="flex flex-row self-top">
                        <PopoverDone 
                            date={date} 
                            task={task} 
                            set_done={set_done}>
                        </PopoverDone>
                        <p className="text-xs pt-1 self-top text-zinc-400">{task[date]["done"]}</p>
                    </div>
                </div>
            </div>
          </CardHeader>
        </Card>
    )
}

function DayView({
    day,
    date,
    index,
    task,
    colors,
    set_day,
    set_task,
    set_done,
    set_complete,
    all_tasks, 
}:{ day: number;
    date: any; 
    index: number;
    task: any;
    colors: any;
    set_day: any;
    set_task: any;
    set_done: any;
    set_complete: any;
    all_tasks: any; 
}) {

    let weekday = new Date(date).toLocaleDateString('en-US', {day: '2-digit', month: 'short', weekday: 'short'})
    if (date === today) {
        return (
            <div className="flex rounded-xl justify-self-center w-11/12 my-2 flex-col grow">
                <DayNameView
                    title="Today"
                    index={index}
                    date={date}
                    set_day={set_day}>
                </DayNameView>
                <div style={{ display: 'flex', flexDirection: 'column', height: '80vh'}}>
                    {all_tasks.map((task: any, index: number) => {
                        if ((date in task) && ("done" in task[date])) {
                            if (parseFloat(task[date]["done"]) > 0) {
                                return (
                                <div style={{flex: task[date]["done"]}}>
                                    <ActiveTaskView 
                                        key={index}
                                        date={date}
                                        task={task}
                                        colors={colors}
                                        set_done={set_done}
                                        set_complete={set_complete}>
                                    </ActiveTaskView> 
                                </div>
                                )
                            }
                        }
                    }
                    )}
                </div>
                <div className="w-full my-3">
                    <SearchBox 
                        suggestions={all_tasks} 
                        date={date}
                        value={task} 
                        set_value={set_task}>
                    </SearchBox>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex rounded-xl justify-self-center w-11/12 my-2 flex-col h-100vh">
                <DayNameView
                    title={weekday}
                    index={index}
                    date={date}
                    set_day={set_day}>
                </DayNameView>
                <div style={{ display: 'flex', flexDirection: 'column', height: '80vh'}}>
                    {all_tasks.map((task: any, index: number) => {
                        if ((date in task) && ("done" in task[date])) {
                            if (parseFloat(task[date]["done"]) > 0) {
                                return (
                                <div style={{flex: task[date]["done"]}} className="py-1">
                                    <ActiveTaskView 
                                        key={index}
                                        date={date}
                                        task={task}
                                        colors={colors}
                                        set_done={set_done}
                                        set_complete={set_complete}>
                                    </ActiveTaskView> 
                                </div>
                                )
                            }
                        }
                    }
                    )}
                </div>
                <div className="w-full my-3">
                    <SearchBox 
                        suggestions={all_tasks} 
                        date={date}
                        value={task} 
                        set_value={set_task}>
                    </SearchBox>
                </div>
            </div>
        )
    }
}

export default function Today() {
    let weekday = new Date().toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
    const [day, set_day] = useState<number>(0);
    const [week, set_week] = useState([]);
    const [colors, set_colors] = useState([]);
    const [all_tasks, set_all_tasks] = useState<any>([]);
    const [task, set_task] = useState<any>("");
    const [done, set_done] = useState<any>("");
    const [complete, set_complete] = useState<any>("");

    useEffect(() => {
        set_day(0)
        get_tasks(set_all_tasks)
    }, []);

    useEffect(() => {
        get_week_dates(day, set_week)
    }, [day])

    useEffect(() => {
        get_tag_colors(all_tasks, set_colors)
    }, [all_tasks])

    useEffect(() => {
        if (task != "") {
            let days_contri = get_days_contri(task[0], all_tasks)
            if (days_contri < 1) {
                let updated_tasks = []
                for (let t of all_tasks) {
                    let t_copy = t
                    if (((t.name === task[1]) || (t.tag === task[1]))) {
                        t_copy[task[0]] = {"done": 0.1}
                        t_copy["done_days"] = t.done_days + 0.1; 
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
        if (done != "") {
            let updated_tasks = []
            for (let t of all_tasks) {
                if (t.index === done[0]) {
                    let t_copy = JSON.parse(JSON.stringify(t))
                    let done_days = Number(parseFloat(t["done_days"] - t_copy[done[1]]["done"] + done[2]).toFixed(1))
                    t_copy["done_days"] = done_days
                    t_copy[done[1]]["done"] = done[2]
                    if (done_days > 0) {
                        t_copy["status"] = "Ongoing"
                    } else {
                        t_copy["status"] = "Planned"
                    }
                    updated_tasks.push(t_copy)
                } else {
                    updated_tasks.push(t)
                }
            }
            let days_contri = get_days_contri(done[1], updated_tasks)
            if (days_contri <= 1) {
                update_tasks(updated_tasks, set_all_tasks)
            }
        set_done("")
        }
    }, [done])

    useEffect(() => {
        if (complete != "") {
            let updated_tasks = []
            for (let t of all_tasks) {
                if (t.index === complete) {
                    let t_copy = JSON.parse(JSON.stringify(t))
                    t_copy["status"] = "Completed";
                    t_copy["end_date"] = weekday;
                    updated_tasks.push(t_copy)
                } else {
                    updated_tasks.push(t)
                }
            }
            update_tasks(updated_tasks, set_all_tasks)
            set_complete("")
        }
    }, [complete])

    return (
    <div>
        <div className="flex grid grid-cols-5 my-4 mx-4 justify-stretch h-screen flex-row">
            {week.map((date: any, index: number) => 
                <DayView 
                    day={day}
                    date={date} 
                    key={index} 
                    index={index}
                    task={task} 
                    colors={colors}
                    set_day={set_day}
                    set_task={set_task} 
                    set_done={set_done}
                    set_complete={set_complete}
                    all_tasks={all_tasks}>
                </DayView>
            )}
        </div>
    </div>
    )
}