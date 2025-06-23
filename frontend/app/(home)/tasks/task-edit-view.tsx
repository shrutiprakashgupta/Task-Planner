"use client"

import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Pencil
} from 'lucide-react'

function EditFieldView({
  task,
  set_tag,
  set_planned_date,
  set_planned_days,
  set_start_date,
  set_end_date
}:{
  task: any;
  set_tag: any;
  set_planned_date: any;
  set_planned_days: any;
  set_start_date: any;
  set_end_date: any;
}) {
  if (task.status === "Planned") {
    return (
    <div className="grid gap-2">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="tag" className="text-white">Tag</Label>
        <Input
          id="tag"
          defaultValue={task.tag}
          className="col-span-3 h-8 bg-gray-800 border-gray-600 text-white"
          onChange={(event) => {
            set_tag(event.target.value)
          }}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="planned_date" className="text-white">Planned Date</Label>
        <Input
          id="planned_date"
          defaultValue={task.planned_date}
          type="date"
          className="col-span-3 h-8 bg-gray-800 border-gray-600 text-white"
          onChange={(event) => {
            set_planned_date(event.target.value)
          }}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="planned_days" className="text-white">Planned Days</Label>
        <Input
          id="planned_days"
          defaultValue={task.planned_days}
          type="number"
          className="col-span-3 h-8 bg-gray-800 border-gray-600 text-white"
          onChange={(event) => {
            set_planned_days(event.target.value)
          }}
        />
      </div>
    </div>
    )
  } else {
    if (task.status === "Ongoing") {
      return (
        <div className="grid gap-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tag" className="text-white">Tag</Label>
            <Input
              id="tag"
              defaultValue={task.tag}
              className="col-span-3 h-8 bg-gray-800 border-gray-600 text-white"
              onChange={(event) => {
                set_tag(event.target.value)
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start_date" className="text-white">Start Date</Label>
            <Input
              id="start_date"
              defaultValue={task.start_date}
              type="date"
              className="col-span-3 h-8 bg-gray-800 border-gray-600 text-white"
              onChange={(event) => {
                set_start_date(event.target.value)
              }}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="grid gap-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tag" className="text-white">Tag</Label>
            <Input
              id="tag"
              defaultValue={task.tag}
              className="col-span-3 h-8 bg-gray-800 border-gray-600 text-white"
              onChange={(event) => {
                set_tag(event.target.value)
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end_date" className="text-white">End Date</Label>
            <Input
              id="end_date"
              defaultValue={task.end_date}
              type="date"
              className="col-span-3 h-8 bg-gray-800 border-gray-600 text-white"
              onChange={(event) => {
                set_end_date(event.target.value)
              }}
            />
          </div>
        </div>
      )
    }
  }
}

export function TaskEditView({
    task,
    status,
    set_tag,
    set_planned_days,
    set_planned_date,
    set_start_date,
    set_end_date,
    set_task_update
}: {
    task: any;
    status: any;
    set_tag: any;
    set_planned_days: any;
    set_planned_date: any;
    set_start_date: any;
    set_end_date: any;
    set_task_update: any;
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="self-center">
                  <div className="relative group">
                    <Pencil className="h-3.5 w-3.5 hover:text-white transition-colors duration-200" color="gray"/>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      Edit
                    </div>
                  </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-120 bg-black border-white">
              <div className="grid gap-4">
                <div className="flex flex-row justify-between">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none text-white">{task.name}</h4>
                    <p className="text-sm text-gray-300">
                      Edit the task details here
                    </p>
                  </div>
                  <Button variant="outline" className="self-center bg-[#27548A] hover:border-[#F3F3E0] hover:bg-[#27548A] text-white" onClick={() => set_task_update(task.index)}>
                    Save
                  </Button>
                </div>
                <EditFieldView
                  task={task}
                  set_tag={set_tag}
                  set_planned_date={set_planned_date}
                  set_planned_days={set_planned_days}
                  set_start_date={set_start_date}
                  set_end_date={set_end_date}>
                </EditFieldView>
              </div>
            </PopoverContent>
        </Popover>
    )
}