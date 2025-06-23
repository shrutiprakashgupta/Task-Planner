'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchBox } from "./searchbox";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
    SquareCheckBig,
    Calendar
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
    get_tag_colors,
    get_tasks,
    get_remarks,
    update_tasks,
    update_remarks
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
                <Timer className="h-3.5 w-3.5 hover:fill-zinc-300 hover:border-zinc-800" color="gray"/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit bg-black border-stone-800">
            <Input
                id="time_spent"
                className="w-min align-self-center justify-end border-stone-800"
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
    return (
        <div className="flex flex-row items-center bg-black py-2 transition-all duration-200 w-full px-4">
            <Calendar className="h-5 w-5 text-[#DDA853] mr-3" />
            <h2 className="text-xl font-medium tracking-wide text-[#F3F3E0]">{title}</h2>
        </div>
    )
}

function PreviousButton({
    date,
    set_day
} : {
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

    return (
        <div className="flex flex-col items-center mr-4 group">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={IncreaseValue}>
                <ChevronsLeft className="text-[#DDA853]"/> 
            </Button>
            <p className="text-xs text-[#F3F3E0] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">Previous</p>
        </div>
    )
}

function NextButton({
    date,
    set_day
} : {
    date: any;
    set_day: any;
}) {
    const DecreaseValue = () => {
        let weekday = weekdays[new Date(date).getDay()]
        if (weekday === "Fri") {
            set_day((day: number) => day - 3)
        } else {
            set_day((day: number) => day - 1)
        }
    }

    return (
        <div className="flex flex-col items-center ml-4 group">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={DecreaseValue}>
                <ChevronsRight className="text-[#DDA853]"/> 
            </Button>
            <p className="text-xs text-[#F3F3E0] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">Next</p>
        </div>
    )
}

function ActiveTaskView({
    date,
    task, 
    colors,
    set_done,
    set_complete,
    setDialogOpen,
    setSelectedTask
}:{ date: any;
    task: any; 
    colors: any;
    set_done: any;
    set_complete: any;
    setDialogOpen: any;
    setSelectedTask: any;
}) {
    let task_done = (task.status == "Completed") ? "fill-green-300" : "";
    const tagColor = colors[task["tag"]] ? colors[task["tag"]].replace(/[\[\]]/g, '') : "#DDA853";
    
    const handleCardClick = (e: React.MouseEvent) => {
        // Prevent click if clicking on buttons
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }
        setSelectedTask(task);
        setDialogOpen(true);
    };
    
    return (
        <Card 
            className="rounded-xl border-2 bg-black hover:shadow-lg hover:scale-[1.01] h-full cursor-pointer" 
            style={{ borderBottomWidth: '8px', borderBottomColor: tagColor, borderLeftColor: '#333', borderRightColor: '#333', borderTopColor: '#333' }} 
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.borderBottomColor = tagColor; }} 
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.borderBottomColor = tagColor; }}
            onClick={handleCardClick}
        >
          <CardHeader>
            <CardTitle className="font-sans text-white">
                <div className="flex flex-row justify-between">
                    <p>{task.name}</p>
                    <div className="flex flex-row justify-end">
                        <Button variant="ghost" size="icon" onClick={() => set_complete(task.index)}>
                            <SquareCheckBig className={`h-3.5 w-3.5 ${task_done} hover:fill-green-300 hover:border-green-800`} color="gray"/>
                        </Button>
                        <p className="font-sans text-[12px] font-extralight leading-relaxed align-text-top text-gray-400 font-bold">{task.done_days}/{task.planned_days}</p>
                    </div>
              </div>
            </CardTitle>
            <div>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row self-top">
                        <Button variant="ghost" size="icon" className="m-0">
                            <Tag className="h-3.5 w-3.5 hover:fill-zinc-300 hover:border-zinc-800" color="gray"/> 
                        </Button>
                        <p className="text-xs pt-1 self-top text-gray-300 font-sans">{task.tag}</p>
                    </div>
                    <div className="flex flex-row self-top">
                        <PopoverDone 
                            date={date} 
                            task={task} 
                            set_done={set_done}>
                        </PopoverDone>
                        <p className="text-xs pt-1 self-top text-gray-300 font-sans">{task[date]["done"]}</p>
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
    setDialogOpen,
    setSelectedTask
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
    setDialogOpen: any;
    setSelectedTask: any;
}) {

    let weekday = new Date(date).toLocaleDateString('en-US', {day: '2-digit', month: 'short', weekday: 'short'})
    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-row items-center justify-center mb-2">
                <DayNameView
                    title={date === today ? "Today" : weekday}
                    index={index}
                    date={date}
                    set_day={set_day}>
                </DayNameView>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }} className="flex-1 min-h-0">
                {all_tasks.map((task: any, index: number) => {
                    if ((date in task) && ("done" in task[date])) {
                        if (parseFloat(task[date]["done"]) > 0) {
                            return (
                                <div key={index} style={{ flex: task[date]["done"] }} className="mb-2">
                                    <ActiveTaskView
                                        key={index}
                                        date={date}
                                        task={task}
                                        colors={colors}
                                        set_done={set_done}
                                        set_complete={set_complete}
                                        setDialogOpen={setDialogOpen}
                                        setSelectedTask={setSelectedTask}>
                                    </ActiveTaskView> 
                                </div>
                            )
                        }
                    }
                }
                )}
            </div>
            <div className="w-full mt-3">
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

export default function Today() {
    let weekday = new Date().toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
    const [day, set_day] = useState<number>(0);
    const [week, set_week] = useState([]);
    const [colors, set_colors] = useState({});
    const [all_tasks, set_all_tasks] = useState<any>([]);
    const [all_remarks, set_all_remarks] = useState<any>([]);
    const [task, set_task] = useState<any>("");
    const [done, set_done] = useState<any>("");
    const [complete, set_complete] = useState<any>("");
    const [dialogText, setDialogText] = useState<any>("");
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [new_remark, set_new_remark] = useState<any>("");

    const handleDialogSubmit = (task: any, text: string, set_new_remark: any) => {
        let new_remark = task.tag + " - " + task.name + " - " + text;
        set_new_remark(new_remark);
    };

    useEffect(() => {
        set_day(0)
        get_tasks(set_all_tasks)
    }, []);
    
    useEffect(() => {
        get_remarks(set_all_remarks)
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

    useEffect(() => {
        if (new_remark) {
            let updated_remarks = [];
            let new_remark_id = 0;
            if (all_remarks) {
                for (let r of all_remarks) {
                    updated_remarks.push(r);
                    new_remark_id = r.index + 1;
                } 
            }
            let new_remark_data = {
                "index" : new_remark_id,
                "date" : weekday, 
                "time" : new Date().toLocaleTimeString(),
                "remark" : new_remark,
                "ai" : 0,
                "ai_done" : 0
            }
            updated_remarks.push(new_remark_data);
            update_remarks(updated_remarks);
            set_all_remarks(updated_remarks)
            set_new_remark("");
            setDialogText("");
            setDialogOpen(false);
        }
    }, [new_remark])

    return (
    <div className="flex flex-row items-stretch h-screen w-full">
        <div className="flex items-center px-4">
            <PreviousButton
                date={week[0]}
                set_day={set_day}>
            </PreviousButton>
        </div>
        <div className="flex-1 grid grid-cols-5 gap-4 p-4">
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
                    all_tasks={all_tasks}
                    setDialogOpen={setDialogOpen}
                    setSelectedTask={setSelectedTask}>
                </DayView>
            )}
        </div>
        <div className="flex items-center px-4">
            <NextButton
                date={week[4]}
                set_day={set_day}>
            </NextButton>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="bg-black border-1 border-white text-white">
                <div className="py-4">
                    <textarea
                        value={dialogText}
                        onChange={(e) => setDialogText(e.target.value)}
                        placeholder="Add New Remark ..."
                        className="w-full h-32 border-1 border-white bg-black text-gray p-3 resize-none rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                        autoFocus
                    />
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => { setDialogOpen(false); setDialogText("") }}
                        className="border-white text-white hover:bg-[#DDA853] hover:text-black"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleDialogSubmit(selectedTask, dialogText, set_new_remark)}
                        className="bg-[#DDA853] text-black hover:bg-[#DDA853]/80"
                    >
                        Add
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
    )
}