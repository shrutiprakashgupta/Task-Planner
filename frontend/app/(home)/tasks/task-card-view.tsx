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
  CircleDot
} from 'lucide-react'
import { TaskEditView } from "./task-edit-view";
import { TaskDelete } from "./task-delete";

export default function TaskCardView({
  task,
  set_tag,
  set_planned_days,
  set_planned_date,
  set_start_date,
  set_end_date,
  set_task_update,
  set_task_delete
}: {
  task: any;
  set_tag: any;
  set_planned_days: any;
  set_planned_date: any;
  set_start_date: any;
  set_end_date: any;
  set_task_update: any;
  set_task_delete: any;
}) {

    if (task.status == "Planned") {
    return (
        <Card className="my-3 hover:border-2 hover:border-[#9b9cb5]">
          <CardHeader>
            <CardTitle className="font-sans text-white">
              <div className="flex flex-row justify-between">
                <p>{task.name}</p>
                <div>
                  <TaskEditView task={task} status={"Planned"} set_tag={set_tag} set_planned_date={set_planned_date} set_planned_days={set_planned_days} set_start_date={set_start_date} set_end_date={set_end_date} set_task_update={set_task_update}></TaskEditView>
                  <TaskDelete task={task} set_task_delete={set_task_delete}></TaskDelete>
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
                  <TaskEditView task={task} status={"Ongoing"} set_tag={set_tag} set_planned_date={set_planned_date} set_planned_days={set_planned_days} set_start_date={set_start_date} set_end_date={set_end_date} set_task_update={set_task_update}></TaskEditView>
                  <TaskDelete task={task} set_task_delete={set_task_delete}></TaskDelete>
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
                  <TaskEditView task={task} status={"Completed"} set_tag={set_tag} set_planned_date={set_planned_date} set_planned_days={set_planned_days} set_start_date={set_start_date} set_end_date={set_end_date} set_task_update={set_task_update}></TaskEditView>
                  <TaskDelete task={task} set_task_delete={set_task_delete}></TaskDelete>
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