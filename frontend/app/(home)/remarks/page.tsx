'use client';

import { useEffect, useState } from "react";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "lucide-react";
import { get_remarks, get_tag_colors, update_remarks} from "../utils";

function conv_timestamp(timestamp: string) {
    //Converts hh:mm:ss AM/PM into hh:mm (in 24 hour format)
    let time_decoded = timestamp.split(' ')
    let offset = (time_decoded[1] == 'AM') ? 0 : 12
    let tick = time_decoded[0].split(':')
    let time_converted = (Number(tick[0]) + Number(offset)) + ":" + tick[1]
    return time_converted
}

function get_dates(set_dates: any, remarks: any) {
    let dates = [];
    let prev_date = 0;
    let curr_date = 0;
    dates = remarks && remarks.map((remark: any, index: number) => {
        curr_date = remark["date"]
        if (curr_date !== prev_date) {
            prev_date = curr_date
            return curr_date
        } else {
            return "Duplicate"
        }
    })
    set_dates(dates)
}

function filter_remarks(
    pattern: string, 
    all_remarks: any, 
    set_remarks: any
) {
    let control = pattern[0]
    let input = pattern.slice(1)

    //Search in existing remarks
    if (control === '/') {
        var re = new RegExp(input, "i");
        let filtered_remarks = all_remarks.filter(function (remark: any) {
            return (re.test(remark.remark) || re.test(remark.task) || re.test(remark.tag));
        }
        );
        set_remarks(filtered_remarks)
    } else {
        if (control === ':') {
            var re = new RegExp(input, "i");
            let filtered_remarks = all_remarks.filter(function (remark: any) {
                return (re.test(remark.task) || re.test(remark.tag));
            }
            );
            set_remarks(filtered_remarks)
        } 
    }
}

function RemarkView({
    date,
    remark,
    index,
    colors,
    set_remark_delete
}:{ date: any;
    remark: any;
    index: number;
    colors: any;
    set_remark_delete: any;
}) {
        if ((date === remark["date"])) {
            return (
                <div key={index} className={`rounded-md bg-[#18181b] border-l-4 ${colors[remark["tag"]]} my-2 hover:border-2 hover:border-white min-w-80 w-max`}>
                    <div className="flex flex-row justify-between">
                        <p className="flex text-xs self-center p-2 text-[#6B7280]">
                            {remark["tag"]} : {remark["task"]}
                        </p>
                        <div className="flex flex-row justify-end">
                            <Clock className="h-3.5 w-3.5 flex self-center" color="#52525b"/>
                            <p className="flex text-xs self-center p-1 pr-2 text-[#6B7280]">
                                {conv_timestamp(remark["time"])}
                            </p>
                            <Button variant="ghost" size="icon" className="self-center" onClick={() => set_remark_delete(remark.index)}>
                                <Trash2 className="h-3.5 w-3.5 hover:fill-white hover:border-white" color="#52525b"/>
                            </Button>
                        </div>
                    </div>
                    <p className="flex justify-start text-md self-start px-2 pb-2" color="#52525b">{remark["remark"]}</p>
                </div>
            )
        }
}

function DayView({
    date,
    remarks,
    colors,
    set_remark_delete
}:{ date: any;
    remarks: any;
    colors: any;
    set_remark_delete: any;
}) {
    return (
        <div>
            <div className="flex justify-around">
                <h2 className="bg-[#25162c] rounded-xl px-3 py-1 text-xs font-small tracking-wide align-middle align-text-bottom text-white">{date}</h2>
            </div>
            {remarks && remarks.map((remark: any, index: number) => 
                <RemarkView 
                    key={index}
                    date={date}
                    remark={remark} 
                    index={index}
                    colors={colors}
                    set_remark_delete={set_remark_delete}>
                </RemarkView>
            )}
        </div>
    )
}

export default function Remarks() {

    const [all_remarks, set_all_remarks] = useState<any>([]);
    const [remarks, set_remarks] = useState<any>([]);
    const [dates, set_dates] = useState<any>([]);
    const [colors, set_colors] = useState<any>([]);
    const [remark_delete, set_remark_delete] = useState<any>([]);
    const searchRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    //Read all remarks from backend
    useEffect(() => {
        get_remarks(set_all_remarks)
        get_remarks(set_remarks)
    }, []);

    useEffect(() => {
        set_remarks(all_remarks)
        get_tag_colors(all_remarks, set_colors)
    }, [all_remarks])

    useEffect(() => {
        get_dates(set_dates, remarks)
    }, [remarks]);

    // Scroll to the bottom when the component mounts
    useEffect(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [remarks]);

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

    //Delete Remark
    useEffect(() => {
        if (remark_delete != "") {
            let updated_remarks = [];
            for (let r of all_remarks) {
                if (r.index === remark_delete) {
                    //Remove the deleted task info
                } else {
                    updated_remarks.push(r)
                }
            } 
            update_remarks(updated_remarks);
            set_all_remarks(updated_remarks);
        }
    }, [remark_delete])

    //Remarks View
    return (
        <div className="fixed top-0 left-20 w-full bg-black pt-4 flex flex-col" style={{ display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <ScrollArea className="overflow-y-auto justify-bottom"
                        style={{flex: 10}}
                        ref={scrollRef}>
                {dates && dates.map((date: any, index: number) => {
                    if (date != "Duplicate") {
                        return (
                            <DayView
                                date={date}
                                key={index}
                                remarks={remarks}
                                colors={colors}
                                set_remark_delete={set_remark_delete}>
                            </DayView>
                        )    
                    }
                })}
            </ScrollArea>
            <div className="w-full pt-2 bottom-0 bg-black" style={{flex: 1}}>
                <Input
                    ref={searchRef}
                    placeholder="Filter Remarks"
                    autoFocus
                    onChange={(event) => 
                        filter_remarks(event.target.value, all_remarks, set_remarks)
                    }
                    className="h-12 w-11/12 border-2 hover:border-[#9b9cb5] hover:border-3"
                />
            </div>
        </div>
    )
}