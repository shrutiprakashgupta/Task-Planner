'use client';

import { useEffect, useState } from "react";
import { useRef } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2, Star, SquareCheckBig, Calendar, Clock, Plus, Search} from "lucide-react";
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

function search_remarks(
    regex: string, 
    all_remarks: any, 
    set_remarks: any,
) {
    //Find existing remarks matching the regex
    var re = new RegExp(regex, "i");
    let matched_remarks = all_remarks.filter(function (remark: any) {
        return (re.test(remark.remark));
    });
    set_remarks(matched_remarks)
}

function filter_remarks(
    ais_only: boolean, 
    pending_only: boolean, 
    all_remarks: any, 
    set_remarks: any
) {
    let filtered_remarks = all_remarks.filter(function (remark: any) {
        if (ais_only) {
            if (remark.ai) {
                if (pending_only) {
                    if (!remark.ai_done) {
                        return remark;
                    }
                } else {
                    return remark;
                }
            }
        } else {
            return remark;
        }
    });
    set_remarks(filtered_remarks);
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
            let is_ai = (remark.ai) ? "fill-yellow-600 border-black" : "";
            let is_ai_done = (remark.ai_done) ? "fill-green-300 border-black" : ""; 
            return (
                <div key={index} className={`rounded-md bg-black border-l-4 border-l-[#DDA853] m-2 hover:border-2 hover:border-white min-h-8 min-w-80 w-max`}>
                    <div className="flex flex-row justify-between">
                        <div className="flex justify-start text-md self-start p-2 pr-4 max-w-[1500px] max-h-[100px] overflow-auto break-words whitespace-pre-wrap" style={{color: "gray"}}>{remark["remark"]}</div>
                        <div className="flex flex-row justify-end pb-2 pr-2">
                            <Button variant="ghost" size="icon" className="place-self-end" onClick={() => set_remark_ai(remark.index)}>
                                <Star className={`h-3.5 w-3.5 ${is_ai} hover:fill-yellow-600 hover:border-black`} color="#52525b"/>
                            </Button>
                            <Button variant="ghost" size="icon" className="place-self-end" onClick={() => set_remark_ai_done(remark.index)}>
                                <Clock className={`h-3.5 w-3.5 ${is_ai_done} hover:fill-green-300 hover:border-black`} color="#52525b"/>
                            </Button>
                            <Button variant="ghost" size="icon" className="place-self-end" onClick={() => set_remark_delete(remark.index)}>
                                <Trash2 className="h-3.5 w-3.5 hover:fill-white hover:border-black" color="#52525b"/>
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
                <h2 className="border-[#DDA853] border-2 rounded-xl px-3 py-1 text-sm font-small tracking-wide align-middle align-text-bottom text-gray-400">{date_string}</h2>
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
    const [remark_add, set_remark_add] = useState<boolean>(false);
    const [remark_delete, set_remark_delete] = useState<any>([]);
    const [remark_ai, set_remark_ai] = useState<any>([]);
    const [remark_ai_done, set_remark_ai_done] = useState<any>([]);
    const [ais_only, set_ais_only] = useState<boolean>(false);
    const [pending_only, set_pending_only] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [dialogText, setDialogText] = useState<string>("");
    const [searchText, setSearchText] = useState<string>("");
    const searchRef = useRef<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleDialogSubmit = () => {
        if (dialogText.trim()) {
            set_new_remark(dialogText);
            set_remark_add(true);
            setDialogText("");
            setDialogOpen(false);
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

    // Add useEffect for filtering
    useEffect(() => {
        if (ais_only) {
            filter_remarks(ais_only, pending_only, remarks, set_remarks);
        } else {
            set_remarks(all_remarks)
        }
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [ais_only, pending_only, all_remarks]);

    // Add handler for search
    const handleSearch = () => {
        if (searchText.trim()) {
            search_remarks(searchText, remarks, set_remarks);
        } else {
            set_remarks(all_remarks);
        }
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    //Scroll to the bottom when the component mounts
    useEffect(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [remarks]);

    //Add New Remark
    useEffect(() => {
        if (remark_add && new_remark) {
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
            set_remark_add(false);
            set_new_remark("");
        }
    }, [remark_add, new_remark])

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
        <div className="fixed top-0 left-20 right-0 bg-black pt-4 flex flex-col" style={{ display: 'flex', flexDirection: 'column', height: '100vh'}}>
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
            <div className="flex flex-row items-center gap-2 p-2 h-12">                           
                <Button 
                    variant="outline" 
                    size="default" 
                    className="h-12 border-2 hover:border-[#DDA853] hover:bg-black" 
                    title="Task"
                    color="gray"
                    onClick={() => set_ais_only(!ais_only)}
                >
                    <Star className={`h-5 w-5 ${ais_only ? 'fill-yellow-600' : 'text-gray'}`} color="gray"/>
                </Button>
                <Button 
                    variant="outline" 
                    size="default" 
                    className="h-12 border-2 hover:border-[#DDA853] hover:bg-black" 
                    title="Status"
                    color="gray"
                    onClick={() => set_pending_only(!pending_only)}
                >
                    <Clock className={`h-5 w-5 ${pending_only ? 'fill-red-600' : 'text-gray'}`} color="gray"/>
                </Button>
                <Button 
                    variant="outline" 
                    size="default" 
                    className="h-12 border-2 hover:border-[#DDA853] hover:bg-black" 
                    color="gray"
                    onClick={() => setDialogOpen(true)}>
                    <Plus color="gray"/>
                </Button>
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Filter Tasks ..." 
                    className="h-12 px-3 border-2 border-stone-800 hover:border-stone-400 bg-black text-white rounded-md focus:outline-none flex-1"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
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
                            onClick={() => {setDialogOpen(false); setDialogText("")}}
                            className="border-white text-white hover:bg-[#DDA853] hover:text-black"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleDialogSubmit}
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