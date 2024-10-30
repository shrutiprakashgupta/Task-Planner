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
  if (status === "Planned") {
    return (
        <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="self-center">
                  <Pencil className="h-3.5 w-3.5 hover:fill-white hover:border-white" color="#52525b"/>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="flex flex-row justify-between">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">{task.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Edit the task details here
                    </p>
                  </div>
                  <Button variant="outline" className="self-center" onClick={() => set_task_update(task.index)}>
                    Save
                  </Button>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="tag">Tag</Label>
                    <Input
                      id="tag"
                      defaultValue={task.tag}
                      className="col-span-1 h-8"
                      onChange={(event) => {
                        set_tag(event.target.value)
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="planned_date">Planned Date</Label>
                    <Input
                      id="planned_date"
                      defaultValue={task.planned_date}
                      type="date"
                      className="col-span-1 h-8"
                      onChange={(event) => {
                        set_planned_date(event.target.value)
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="planned_days">Planned Days</Label>
                    <Input
                      id="planned_days"
                      defaultValue={task.planned_days}
                      type="number"
                      className="col-span-1 h-8"
                      onChange={(event) => {
                        set_planned_days(event.target.value)
                      }}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
        </Popover>
    )
  } else {
    if (status == "Ongoing") {
    return (
        <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="self-center">
                  <Pencil className="h-3.5 w-3.5 hover:fill-white hover:border-white" color="#52525b"/>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="flex flex-row justify-between">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">{task.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Edit the task details here
                    </p>
                  </div>
                  <Button variant="outline" className="self-center" onClick={() => set_task_update(task.index)}>
                    Save
                  </Button>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="tag">Tag</Label>
                    <Input
                      id="tag"
                      defaultValue={task.tag}
                      className="col-span-1 h-8"
                      onChange={(event) => {
                        set_tag(event.target.value)
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      defaultValue={task.start_date}
                      type="date"
                      className="col-span-1 h-8"
                      onChange={(event) => {
                        set_start_date(event.target.value)
                      }}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
        </Popover>
    )
    } else {
    return (
        <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="self-center">
                  <Pencil className="h-3.5 w-3.5 hover:fill-white hover:border-white" color="#52525b"/>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="flex flex-row justify-between">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">{task.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Edit the task details here
                    </p>
                  </div>
                  <Button variant="outline" className="self-center" onClick={() => set_task_update(task.index)}>
                    Save
                  </Button>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="tag">Tag</Label>
                    <Input
                      id="tag"
                      defaultValue={task.tag}
                      className="col-span-1 h-8"
                      onChange={(event) => {
                        set_tag(event.target.value)
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      defaultValue={task.end_date}
                      type="date"
                      className="col-span-1 h-8"
                      onChange={(event) => {
                        set_end_date(event.target.value)
                      }}
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
        </Popover>
    )

    }
  }
}