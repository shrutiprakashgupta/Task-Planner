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
import { TaskDeleteView } from "./task-delete-view";

function TimelineView({
  status,
  planned_date,
  start_date,
  end_date
}:{
  status: any;
  planned_date: any;
  start_date: any;
  end_date: any;
}) {

  //Updating date format to show on TaskCard
  let t_planned_date = new Date(Date.parse(planned_date))
  let t_planned_date_formatted = t_planned_date.toLocaleDateString('en-US', {year: '2-digit', month: 'short', day: '2-digit'})
  let t_start_date = new Date(Date.parse(start_date))
  let t_start_date_formatted = t_start_date.toLocaleDateString('en-US', {year: '2-digit', month: 'short', day: '2-digit'})
  let t_end_date = new Date(Date.parse(end_date))
  let t_end_date_formatted = t_end_date.toLocaleDateString('en-US', {year: '2-digit', month: 'short', day: '2-digit'})

  if (status === "Planned") {
    return (
      <div className="flex justify-start">
          <div className="pr-1 pt-1">
            <CircleDot className="h-2 w-2" color="#9962b7"/>
            <Slash className="h-3 w-2 -rotate-45" color="#475569"/>
            <CircleDot className="h-2 w-2" color="#475569"/>
            <Slash className="h-3 w-2 -rotate-45" color="#475569"/>
            <CircleDot className="h-2 w-2" color="#475569"/>
          </div>
          <div>
            <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{t_planned_date_formatted}</p>
          </div>
      </div>
    )
  } else {
    if (status === "Ongoing") {
      return (
        <div className="flex justify-start">
            <div className="pr-1 pt-1">
              <CircleDot className="h-2 w-2" color="#9962b7"/>
              <Slash className="h-3 w-2 -rotate-45" color="#ffffff"/>
              <CircleDot className="h-2 w-2" color="#9962b7"/>
              <Slash className="h-3 w-2 -rotate-45"color="#475569"/>
              <CircleDot className="h-2 w-2" color="#475569"/>
            </div>
            <div>
              <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{t_planned_date_formatted}</p>
              <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{t_start_date_formatted}</p>
            </div>
        </div>
      )
    } else {
      return (
        <div className="flex justify-start">
            <div className="pr-1 pt-1">
              <CircleDot className="h-2 w-2" color="#9962b7"/>
              <Slash className="h-3 w-2 -rotate-45" color="#ffffff"/>
              <CircleDot className="h-2 w-2" color="#9962b7"/>
              <Slash className="h-3 w-2 -rotate-45" color="#ffffff"/>
              <CircleDot className="h-2 w-2" color="#9962b7"/>
            </div>
            <div>
              <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{t_planned_date_formatted}</p>
              <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{t_start_date_formatted}</p>
              <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{t_end_date_formatted}</p>
            </div>
        </div>
      )
    }
  }
} 

function AnalyticsView({
  task
}:{
  task: any;
}) {
  if (task.status === "Planned") {
    return (
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
    )
  } else {
    if (task.status === "Ongoing") {
      return (
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
      )
    } else {
      return (
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
      )
    }
  }
}

export default function TaskCardView({
  task,
  colors,
  set_tag,
  set_planned_days,
  set_planned_date,
  set_start_date,
  set_end_date,
  set_task_update,
  set_task_delete
}: {
  task: any;
  colors: any;
  set_tag: any;
  set_planned_days: any;
  set_planned_date: any;
  set_start_date: any;
  set_end_date: any;
  set_task_update: any;
  set_task_delete: any;
}) {

    return (
        // <Card className="my-3 hover:border-2 hover:border-[#9b9cb5]">
        <Card className={`border-0 border-l-2 ${colors[task["tag"]]} hover:border-2 hover:border-[#9b9cb5] my-3`}>
          <CardHeader>
            <CardTitle className="font-sans text-white">
              <div className="flex flex-row justify-between">
                <p>{task.name}</p>
                <div>
                  <TaskEditView 
                    task={task}
                    status={task.status}
                    set_tag={set_tag}
                    set_planned_date={set_planned_date}
                    set_planned_days={set_planned_days}
                    set_start_date={set_start_date}
                    set_end_date={set_end_date}
                    set_task_update={set_task_update}>
                  </TaskEditView>
                  <TaskDeleteView 
                    task={task}
                    set_task_delete={set_task_delete}>
                  </TaskDeleteView>
                </div>
              </div>
            </CardTitle>
            <div>
              <div className="flex justify-between gap-x-1">
                <TimelineView
                  status={task.status}
                  planned_date={task.planned_date}
                  start_date={task.start_date}
                  end_date={task.end_date}>
                </TimelineView>
                <AnalyticsView
                  task={task}>
                </AnalyticsView>
              </div>
            </div>
          </CardHeader>
        </Card>
    )
}