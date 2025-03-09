'use client';

import { useEffect, useState } from "react";
import { useRef } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2, Star, SquareCheckBig} from "lucide-react";
import { get_remarks, update_remarks} from "../utils";

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

function handle_remarks(
    textinput: string, 
    all_remarks: any, 
    set_remarks: any,
    set_new_remark: any
) {
    let control = textinput[0]
    let input = textinput.slice(1)

    //Search in existing remarks
    if (control === '/') {
        var re = new RegExp(input, "i");
        let filtered_remarks = all_remarks.filter(function (remark: any) {
            return (re.test(remark.remark));
        }
        );
        set_remarks(filtered_remarks)
    } else {
    //Add a new remark
        if (control === ':') {
            set_new_remark(input)
        } 
    }
}

function RemarkView({
    date,
    remark,
    index,
    set_remark_delete,
    set_remark_ai,
    set_remark_ai_done
}:{ date: any;
    remark: any;
    index: number;
    set_remark_delete: any;
    set_remark_ai: any;
    set_remark_ai_done: any;
}) {
        if ((date === remark["date"])) {
            let is_ai = (remark.ai) ? "fill-yellow-600 border-white" : "";
            let is_ai_done = (remark.ai_done) ? "fill-green-300 border-white" : ""; 
            return (
                <div key={index} className={`rounded-md bg-[#18181b] border-l-4 border-[#41274f] m-2 hover:border-2 hover:border-white min-h-8 min-w-80 w-max`}>
                    <div className="flex flex-row justify-between">
                        <p className="flex justify-start text-md self-start p-2 pr-4 max-w-[1500px] max-h-[100px] overflow-auto break-words" color="#52525b">{remark["remark"]}</p>
                        <div className="flex flex-row justify-end pb-2 pr-2">
                            <Button variant="ghost" size="icon" className="place-self-end" onClick={() => set_remark_ai(remark.index)}>
                                <Star className={`h-3.5 w-3.5 ${is_ai} hover:fill-yellow-600 hover:border-white`} color="#52525b"/>
                            </Button>
                            <Button variant="ghost" size="icon" className="place-self-end" onClick={() => set_remark_ai_done(remark.index)}>
                                <SquareCheckBig className={`h-3.5 w-3.5 ${is_ai_done} hover:fill-green-300 hover:border-white`} color="#52525b"/>
                            </Button>
                            <Button variant="ghost" size="icon" className="place-self-end" onClick={() => set_remark_delete(remark.index)}>
                                <Trash2 className="h-3.5 w-3.5 hover:fill-white hover:border-white" color="#52525b"/>
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }
}

function DayView({
    date,
    remarks,
    set_remark_delete,
    set_remark_ai,
    set_remark_ai_done
}:{ date: any;
    remarks: any;
    set_remark_delete: any;
    set_remark_ai: any;
    set_remark_ai_done: any;
}) {
    let date_string = new Date(date).toDateString();
    return (
        <div>
            <div className="flex justify-around">
                <h2 className="bg-[#25162c] rounded-xl px-3 py-1 text-xs font-small tracking-wide align-middle align-text-bottom text-white">{date_string}</h2>
            </div>
            {remarks && remarks.map((remark: any, index: number) => 
                <RemarkView 
                    key={index}
                    date={date}
                    remark={remark} 
                    index={index}
                    set_remark_delete={set_remark_delete}
                    set_remark_ai={set_remark_ai}
                    set_remark_ai_done={set_remark_ai_done}>
                </RemarkView>
            )}
        </div>
    )
}

export default function Remarks() {

    let weekday = new Date().toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
    const [all_remarks, set_all_remarks] = useState<any>([]);
    const [remarks, set_remarks] = useState<any>([]);
    const [new_remark, set_new_remark] = useState<any>([]);
    const [dates, set_dates] = useState<any>([]);
    const [remark_add, set_remark_add] = useState<any>([]);
    const [remark_delete, set_remark_delete] = useState<any>([]);
    const [remark_ai, set_remark_ai] = useState<any>([]);
    const [remark_ai_done, set_remark_ai_done] = useState<any>([]);
    const searchRef = useRef<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleInput = (e:any) => {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    const handleKeyDown = (e:any) => {
        if (e.key === 'Enter') {
            // Prevent the default behavior of adding a new line when pressing Enter
            e.preventDefault();

            set_remark_add(e.currentTarget.value[0] == ":");
            // Clear the input field when "Enter" is pressed
            if (searchRef.current) {
                searchRef.current.style.height = 'auto';
                searchRef.current.value = '';
            }
        }
    };

    //Read all remarks from backend
    useEffect(() => {
        get_remarks(set_all_remarks)
        get_remarks(set_remarks)
    }, []);

    useEffect(() => {
        set_remarks(all_remarks)
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

    //Add New Remark
    useEffect(() => {
        if (remark_add != "") {
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
            set_remark_add("");
        }
    }, [remark_add])

    //Mark Remark as AI
    useEffect(() => {
        if (remark_ai != "") {
            let updated_remarks = [];
            for (let r of all_remarks) {
                if (r.index === remark_ai) {
                    let r_copy = r;
                    r_copy.ai = (r.ai == 1) ? 0 : 1;
                    updated_remarks.push(r_copy)
                } else {
                    updated_remarks.push(r)
                }
            } 
            update_remarks(updated_remarks);
            set_all_remarks(updated_remarks);
            set_remark_ai("");
        }
    }, [remark_ai])

    //Mark Remark AI as Done
    useEffect(() => {
        if (remark_ai_done != "") {
            let updated_remarks = [];
            for (let r of all_remarks) {
                if (r.index === remark_ai_done) {
                    let r_copy = r;
                    console.log(r.ai_done)
                    console.log(r.ai_done == 1)
                    console.log(r.ai_done == "1")
                    r_copy.ai_done = (r.ai_done == 1) ? 0 : 1;
                    updated_remarks.push(r_copy)
                } else {
                    updated_remarks.push(r)
                }
            } 
            update_remarks(updated_remarks);
            set_all_remarks(updated_remarks);
            set_remark_ai_done("");
        }
    }, [remark_ai_done])

    //Delete Remark
    useEffect(() => {
        if (remark_delete != "") {
            let updated_remarks = [];
            for (let r of all_remarks) {
                if (r.index === remark_delete) {
                    //Remove the deleted remark info
                } else {
                    updated_remarks.push(r)
                }
            } 
            update_remarks(updated_remarks);
            set_all_remarks(updated_remarks);
            set_remark_delete("");
        }
    }, [remark_delete])

    //Remarks View
    return (
        <div className="fixed top-0 left-20 w-full bg-black pt-4 flex flex-col" style={{ display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <ScrollArea className="overflow-y-auto justify-bottom pb-2"
                        style={{flex: 10}}
                        ref={scrollRef}>
                {dates && dates.map((date: any, index: number) => {
                    if (date != "Duplicate") {
                        return (
                            <DayView
                                date={date}
                                key={index}
                                remarks={remarks}
                                set_remark_delete={set_remark_delete}
                                set_remark_ai={set_remark_ai}
                                set_remark_ai_done={set_remark_ai_done}>
                            </DayView>
                        )    
                    }
                })}
            </ScrollArea>
            <div className="flex p-2">                           
                <textarea
                    ref={searchRef}
                    placeholder="Add Remarks"
                    autoFocus
                    onChange={(event) => handle_remarks(event.target.value, all_remarks, set_remarks, set_new_remark)}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    className="w-11/12 border-stone-800 border-2 resize-none overflow-y-auto bg-black text-align-center p-2"
                    rows={1}
                />
            </div>
        </div>
    )
}