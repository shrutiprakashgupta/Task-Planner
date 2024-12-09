'use client';

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Tag, Clock } from "lucide-react";
import { get_remarks, get_tasks } from "../utils";

function conv_timestamp(timestamp: string) {
    //Converts hh:mm:ss AM/PM into hh:mm (in 24 hour format)
    let time_decoded = timestamp.split(' ')
    let offset = (time_decoded[1] == 'AM') ? 0 : 12
    let tick = time_decoded[0].split(':')
    let time_converted = (Number(tick[0]) + Number(offset)) + ":" + tick[1]
    return time_converted
}

function get_all_dates(set_all_dates: any, remarks: any) {
    let all_dates = [];
    let prev_date = 0;
    let curr_date = 0;
    all_dates = remarks && remarks.map((remark: any, index: number) => {
        curr_date = remark["date"]
        if (curr_date !== prev_date) {
            prev_date = curr_date
            return curr_date
        }
    })
    set_all_dates(all_dates)
}

function filter_remarks(pattern: any, all_remarks: any, set_remarks: any) {
    return 0
    //TODO: fixme
}

function RemarkView({
    date,
    remark,
    index,
    all_tasks 
}:{ date: any;
    remark: any;
    index: number;
    all_tasks: any;
}) {
        if (all_tasks && (date === remark["date"])) {
            return (
                <div key={index} className="rounded-md bg-black border-r-4 border-[#41274f] my-2 hover:border-2 hover:border-white w-fit">
                    <div className="flex flex-row justify-between">
                        <p className="flex text-xs self-center p-2 text-[#b39ac1]">
                            {all_tasks[remark["task_id"]]["tag"]} : {all_tasks[remark["task_id"]]["name"]}
                        </p>
                        <div className="flex flex-row justify-end">
                            <Clock className="h-3.5 w-3.5 flex self-center" color="#52525b"/>
                            <p className="flex text-xs self-center p-1 pr-2 text-[#b39ac1]">
                                {conv_timestamp(remark["time"])}
                            </p>
                        </div>
                    </div>
                    <p className="flex justify-start text-sm self-start px-2 pb-1" color="#52525b">{remark["remark"]}</p>
                </div>
            )
        }
}

function DayView({
    date,
    remarks,
    all_tasks 
}:{ date: any;
    remarks: any;
    all_tasks: any;
}) {
    return (
        <div>
            <div className="flex justify-around bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-2 p-2">
                <h2 className="text-xs font-small tracking-wide align-middle align-text-bottom text-white">{date}</h2>
            </div>
            {remarks && remarks.map((remark: any, index: number) => 
                <RemarkView 
                    key={index}
                    date={date}
                    remark={remark} 
                    index={index}
                    all_tasks={all_tasks}>
                </RemarkView>
            )}
        </div>
    )
}

export default function Remarks() {

    const [all_remarks, set_all_remarks] = useState<any>();
    const [all_tasks, set_all_tasks] = useState<any>();
    const [remarks, set_remarks] = useState<any>();
    const [all_dates, set_all_dates] = useState<any>();

    //Read all remarks from backend
    useEffect(() => {
        get_remarks(set_all_remarks)
        get_tasks(set_all_tasks)
    }, []);

    useEffect(() => {
        get_all_dates(set_all_dates, all_remarks)
    }, [all_remarks]);

    //Remarks View
    return (
    <div>
        <div className="flex px-8 pt-4 justify-center">
            <Input
                placeholder="Filter Remarks"
                autoFocus
                // onChange={(event) => 
                //     filter_remarks(event.target.value, all_remarks, set_remarks)
                // }
                className="h-12 w-11/12 border-2 hover:border-[#9b9cb5] hover:border-3"
            />
        </div>
        <div className="flex grid grid-col-1">
            <ScrollArea className="rounded-xl bg-[#18181b] w-100 self-center p-4 m-4">
                {all_dates && all_dates.map((date: any, index: number) => 
                    <DayView
                        date={date}
                        key={index}
                        remarks={all_remarks} 
                        all_tasks={all_tasks}>
                    </DayView>
                )}
            </ScrollArea>
        </div>
    </div>
    )
}
