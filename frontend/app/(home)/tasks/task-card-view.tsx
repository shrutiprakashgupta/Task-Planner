import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tag,
  CalendarPlus,
  CalendarCog,
  CalendarCheck2,
  Slash,
  CircleDot,
  Trash2,
  Pencil
} from 'lucide-react'
import { 
  Button 
} from "@/components/ui/button"
import { TaskEditView } from "./task-edit-view";
import { useEffect, useState } from "react";

export default function TaskCardView({
  task,
  all_tasks,
  set_all_tasks
}: {
  task: any;
  all_tasks: any;
  set_all_tasks: any;
}) {

  const [tag, set_tag] = useState<any>("")
  const [planned_days, set_planned_days] = useState<any>(0)
  const [planned_date, set_planned_date] = useState<any>("")
  const [start_date, set_start_date] = useState<any>("")
  const [task_update, set_task_update] = useState<any>(0)

  useEffect (() => {
    let t_updated = task
    t_updated.tag = tag
    t_updated.planned_days = planned_days
    t_updated.planned_date = planned_date
    t_updated.start_date = start_date
    let updated_tasks = []
    for (let t of all_tasks) {
        if (((t.name === task.name) && (t.tag === task.tag))) {
            updated_tasks.push(t_updated)
        } else {
            updated_tasks.push(t)
        }
    }
  }, [task_update])

    if (task.status == "Planned") {
    return (
        <Card className="my-3 hover:border-2 hover:border-[#9b9cb5]">
          <CardHeader>
            <CardTitle className="font-sans text-white">
              <div className="flex flex-row justify-between">
                <p>{task.name}</p>
                <div>
                  <TaskEditView task={task} set_tag={set_tag} set_planned_date={set_planned_date} set_planned_days={set_planned_days} set_start_date={set_start_date} set_task_update={set_task_update}></TaskEditView>
                  <Button variant="ghost" size="icon" className="self-center">
                      <Trash2 className="h-3.5 w-3.5 hover:fill-white hover:border-white" color="#52525b"/>
                  </Button>
                </div>
              </div>
            </CardTitle>
            <div>
              <div className="flex justify-between gap-x-1">
                <div className="flex justify-start">
                    <div className="pr-1 pt-1">
                      <CircleDot className="h-2 w-2" color="#9962b7"/>
                      <Slash className="h-3 w-2 -rotate-45" color="#475569"/>
                      <CircleDot className="h-2 w-2" color="#475569"/>
                      <Slash className="h-3 w-2 -rotate-45" color="#475569"/>
                      <CircleDot className="h-2 w-2" color="#475569"/>
                    </div>
                    <div>
                      <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{task.planned_date}</p>
                    </div>
                </div>
                <div className="content-end">
                  <div className="flex justify-end gap-x-1">
                    <CalendarPlus className="h-3.5 w-3.5" color="#52525b"/>
                    <p className="font-sans text-[12px] font-extralight leading-relaxed align-text-top text-zinc-400">Planned: {task.planned_days}</p>
                  </div>
                  <div className="flex justify-end gap-x-1">
                    <Tag className="h-3.5 w-3.5" color="#52525b"/> 
                    <p className="font-sans text-[12px] font-extralight leading-relaxed align-text-top text-zinc-400">{task.tag}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
    )
    } else {
    if (task.status == "Ongoing") {
    return (
        <Card className="my-3 hover:border-2 hover:border-[#9b9cb5]">
          <CardHeader>
            <CardTitle className="font-sans text-white">
              <div className="flex flex-row justify-between">
                <p>{task.name}</p>
                <div>
                  <TaskEditView task={task} set_tag={set_tag} set_planned_date={set_planned_date} set_planned_days={set_planned_days} set_start_date={set_start_date} set_task_update={set_task_update}></TaskEditView>
                  <Button variant="ghost" size="icon" className="self-center">
                      <Trash2 className="h-3.5 w-3.5 hover:fill-white hover:border-white" color="#52525b"/>
                  </Button>
                </div>
              </div>
            </CardTitle>
            <div>
              <div className="flex justify-between gap-x-1">
                <div className="flex justify-start">
                    <div className="pr-1 pt-1">
                      <CircleDot className="h-2 w-2" color="#9962b7"/>
                      <Slash className="h-3 w-2 -rotate-45" color="#ffffff"/>
                      <CircleDot className="h-2 w-2" color="#9962b7"/>
                      <Slash className="h-3 w-2 -rotate-45"color="#475569"/>
                      <CircleDot className="h-2 w-2" color="#475569"/>
                    </div>
                    <div>
                      <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{task.planned_date}</p>
                      <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{task.start_date}</p>
                    </div>
                </div>
                <div className="content-end">
                  <div className="flex justify-end gap-x-1">
                    <CalendarCog className="h-3.5 w-3.5" color="#52525b"/>
                    <p className="font-sans text-[12px] font-extralight leading-relaxed align-text-top text-zinc-400">Done: {task.done_days}/{task.planned_days}</p>
                  </div>
                  <div className="flex justify-end gap-x-1">
                    <Tag className="h-3.5 w-3.5" color="#52525b"/> 
                    <p className="font-sans text-[12px] font-extralight leading-relaxed align-text-top text-zinc-400">{task.tag}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
    )
    } else {
    return (
        <Card className="my-3 hover:border-2 hover:border-[#9b9cb5]">
          <CardHeader>
            <CardTitle className="font-sans text-white">
              <div className="flex flex-row justify-between">
                <p>{task.name}</p>
                <div>
                  <TaskEditView task={task} set_tag={set_tag} set_planned_date={set_planned_date} set_planned_days={set_planned_days} set_start_date={set_start_date} set_task_update={set_task_update}></TaskEditView>
                  <Button variant="ghost" size="icon" className="self-center">
                      <Trash2 className="h-3.5 w-3.5 hover:fill-white hover:border-white" color="#52525b"/>
                  </Button>
                </div>
              </div>
            </CardTitle>
            <div>
              <div className="flex justify-between gap-x-1">
                <div className="flex justify-start">
                    <div className="pr-1 pt-1">
                      <CircleDot className="h-2 w-2" color="#9962b7"/>
                      <Slash className="h-3 w-2 -rotate-45" color="#ffffff"/>
                      <CircleDot className="h-2 w-2" color="#9962b7"/>
                      <Slash className="h-3 w-2 -rotate-45" color="#ffffff"/>
                      <CircleDot className="h-2 w-2" color="#9962b7"/>
                    </div>
                    <div>
                      <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{task.planned_date}</p>
                      <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{task.start_date}</p>
                      <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{task.end_date}</p>
                    </div>
                </div>
                <div className="content-end">
                  <div className="flex justify-end gap-x-1">
                    <CalendarCheck2 className="h-3.5 w-3.5" color="#52525b"/>
                    <p className="font-sans text-[12px] font-extralight leading-relaxed align-text-top text-zinc-400">Done: {task.done_days}/{task.planned_days}</p>
                  </div>
                  <div className="flex justify-end gap-x-1">
                    <Tag className="h-3.5 w-3.5" color="#52525b"/> 
                    <p className="font-sans text-[12px] font-extralight leading-relaxed align-text-top text-zinc-400">{task.tag}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
    )
    }
    }
}