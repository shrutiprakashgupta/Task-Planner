'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, RefreshCw, Clipboard} from "lucide-react";
import { get_tasks, update_tasks} from "../utils";

let today = new Date().toLocaleDateString("en-CA");

const isDateValid = (date = "") => { let parsedDate = new Date(date); return parsedDate.toString() !== "Invalid Date"; }

function copyToClipboard(data : string[][]) {
  const csvData = data.map((row) => row.join("\t")).join("\n");
  navigator.clipboard.writeText(csvData);
  alert("Table copied to clipboard!");
};

function record_extra_days (extra_days:string, rowIndex:number, extraDays:any, setExtraDays:any) {
    let extraDaysCopy = extraDays;
    extraDaysCopy[rowIndex] = extra_days;
    setExtraDays(extraDaysCopy);
}

function get_report_data(all_tasks: any, startDate: any, endDate: any, set_report_data:any) {
    // Initialize Report Data with Header
    let task_report;
    let report_data = [["POR ID", "Item", "Original", "Done (Cumulative)", "Done (Current Week)", "Remaining", "Effective Burndown", "Extra Days"]];

    // Initialize time window for tracking Task status
    let track_all = 0;
    let start_date = new Date(startDate);
    let end_date = new Date(endDate);

    if ((startDate == "") || (endDate == "")) { //Track all entries if start-end date not correct
        track_all = 1;
    } else {
        if (start_date >= end_date) {
            track_all = 1;
        }
    }

    for (let task of all_tasks) {

        // Tracking Task Status (Can define a tracking window as well)
        let done_trkd = 0;
        let extra_days = 0;
        let extra_trkd = 0;
        let extra_prev = 0;
        let remaining_days = 0;
        let effective_burndown = 0;

        for (let attr of Object.keys(task)) {
            if (isDateValid(attr)) {
                let curr_date = new Date(attr);

                if ("extra" in task[attr]) {
                    extra_days = parseFloat(task[attr]["extra"]);
                    if (!track_all) {
                        if (curr_date < start_date) {
                            extra_prev = parseFloat(task[attr]["extra"]);
                        }
                        if ((curr_date >= start_date) && (curr_date <= end_date)) {
                            extra_trkd = parseFloat(task[attr]["extra"]);
                        }
                    } else {
                        extra_prev = 0;
                        extra_trkd = extra_days;
                    }
                }

                if ("done" in task[attr]) {
                    if (!track_all) {
                        if ((curr_date >= start_date) && (curr_date <= end_date)) {
                            done_trkd = done_trkd + parseFloat(task[attr]["done"]);
                        }
                    } else {
                        done_trkd = task.done_days;
                    }
                }
            }
        }
        remaining_days = Number((parseFloat(task.planned_days) + extra_days - parseFloat(task.done_days)).toFixed(1))
        effective_burndown = Number((extra_prev - extra_trkd + done_trkd) .toFixed(1))

        // Populate Task Data
        task_report = [task.index, task.tag, task.name, task.planned_days, task.done_days, Number(done_trkd).toFixed(1), remaining_days, effective_burndown, extra_days];
        report_data.push(task_report);
    }
    set_report_data(report_data)
}
function DatePickerRow({
    startDate,
    endDate,
    setStartDate,
    setEndDate
}:{
    startDate : string;
    endDate : string;
    setStartDate : any;
    setEndDate : any;
}) 
{
  return (
    <div className="flex justify-start items-center gap-4 p-4 rounded-md w-full">
      {/* Start Date Picker */}
      <div className="flex flex-row grid grid-cols-4 items-center gap-4">
        <label htmlFor="start-date" className="mb-1 text-md font-medium text-white">
          Start Date
        </label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 col-span-3 h-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        />
      </div>
      {/* End Date Picker */}
      <div className="flex flex-row grid grid-cols-4 items-center gap-4">
        <label htmlFor="end-date" className="mb-1 text-md font-medium text-white">
          End Date
        </label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 col-span-3 h-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        />
      </div>
    </div>
  );
};

function CopyableTable ({
    data,
    extraDays,
    setExtraDays
}:{
    data : string[][];
    extraDays : any;
    setExtraDays : any;
}) {
    let taskIndex = 0;
    let hidden_cell_index = 0; //Task Index is hidden from the SCS table
    let editable_cell_index = 8; //Index to the editable cell - Extra Days used to adjust SCS
    if (data.flat().length == 0) {
        <div>
            <h2>Loading Data ...</h2>
        </div>
    } else {
    return (
        <div className="w-11/12 self-center">
            <table
                style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    margin: "20px 0",
                    fontSize: "16px",
                    textAlign: "left",
                }}
            >
                <thead>
                    <tr>
                        {data[0].map((header, index) => (
                            <th
                                key={index}
                                style={{
                                    border: "1px solid white",
                                    padding: "8px",
                                    backgroundColor: "#41274f",
                                    fontWeight: "bold",
                                }}
                            >
                              {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => {
                                if (cellIndex == hidden_cell_index) {
                                    taskIndex = parseInt(cell);
                                } else {
                                if (cellIndex == editable_cell_index) {
                                return (
                                    <td
                                        key={cellIndex}
                                        style={{
                                            border: "1px solid white",
                                            padding: "8px",
                                        }}
                                    >
                                        <input 
                                            className='tdValueInput bg-black w-20' 
                                            type="number"
                                            step="0.1" 
                                            defaultValue={cell} 
                                            onChange={(event) => record_extra_days(event.target.value, taskIndex, extraDays, setExtraDays)}/>
                                    </td>
                                )
                                } else {
                                return (
                                    <td
                                        key={cellIndex}
                                        style={{
                                            border: "1px solid white",
                                            padding: "8px",
                                        }}
                                    >
                                        {cell}
                                    </td>
                                )
                                }
                            }
                            }
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    }
};


export default function Reports() {

    const [all_tasks, set_all_tasks] = useState<any>([]);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [extraDays, setExtraDays] = useState<any>({});
    const [reportData, setReportData] = useState<string[][]>([]);
    const [generate, setGenerate] = useState<any>(0);
    const [report, setReport] = useState<any>(0);

    //Read all data from backend
    useEffect(() => {
        get_tasks(set_all_tasks)
    }, []);

    //Generate Report Data
    useEffect(() => {
        get_report_data(all_tasks, startDate, endDate, setReportData)
    }, [all_tasks]);

    //Update Report Data
    useEffect(() => {
        if (generate != "") {
            get_report_data(all_tasks, startDate, endDate, setReportData)
        }
        setGenerate("");
    }, [generate]);

    //Adjust SCS Planned days through Extra days addition
    useEffect(() => {
        if (report != "") {
            let all_tasks_copy = [];
            let task_copy;
            for (let task of all_tasks) {
                task_copy = task;
                if (task.index in extraDays) {
                    if (today in task_copy) {
                        task_copy[today]["extra"] = extraDays[task.index];
                    } else {
                        task_copy[today] = {["extra"] : extraDays[task.index]};
                    }
                } 
                all_tasks_copy.push(task_copy);
            }
            update_tasks(all_tasks_copy, set_all_tasks);
            setReport(0)
        }
    }, [report]);

    //Reports View
    return (
      <div className="flex flex-col mt-2 justify-center">
        <div className="bg-[#25162c] bg-gradient-to-r from-[#25162c] via-[#41274f] to-[#25162c] rounded-xl border-4 py-2 hover:rounded-none w-10/12 self-center">
            <h2 className="text-xl font-medium tracking-wide text-center align-middle align-text-bottom text-white">
                Task Analysis
            </h2>
        </div>
        <div className="flex flex-row self-center">
            <DatePickerRow 
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}>
            </DatePickerRow>
            <Button variant="ghost" size="icon" className="mt-4 h-8 w-8" onClick={() => setGenerate(1)}>
                <RefreshCw className="bg-black hover:fill-white hover:border-white" color="#52525b"/>
            </Button>
            <Button variant="ghost" size="icon" className="mt-4 h-8 w-8" onClick={() => setReport(1)}>
                <Save  className="bg-black hover:fill-white hover:border-white" color="#52525b"/>
            </Button>
            <Button variant="ghost" size="icon" className="mt-4 h-8 w-8" onClick={() => copyToClipboard(reportData)}>
                <Clipboard className="bg-black hover:fill-white hover:border-white" color="#52525b"/>
            </Button>
        </div>
        <CopyableTable 
            data={reportData}
            extraDays={extraDays}
            setExtraDays={setExtraDays}>
        </CopyableTable>
      </div>
    );
};