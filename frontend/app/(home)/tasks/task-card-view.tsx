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
} from 'lucide-react'

export default function TaskCardView({
  task,
  tag,
  planned_days,
  done_days,
  planned_date,
  start_date,
  end_date,
  status  
}: {
  task: string;
  tag: string;
  planned_days: number;
  done_days: number;
  planned_date: string;
  start_date: string;
  end_date: string;
  status: string;
}) {
    if (status == "Planned") {
    return (
        <Card className="my-3 hover:border-2 hover:border-[#9b9cb5]">
          <CardHeader>
            <CardTitle className="font-sans text-white">{task}</CardTitle>
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
                      <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{planned_date}</p>
                    </div>
                </div>
                <div className="content-end">
                  <div className="flex justify-start gap-x-1">
                    <Tag className="h-3.5 w-3.5" color="#52525b"/> 
                    <p className="font-sans text-[12px] font-extralight leading-relaxed align-text-top text-zinc-400">{tag}</p>
                  </div>
                  <div className="flex justify-start gap-x-1">
                    <CalendarPlus className="h-3.5 w-3.5" color="#52525b"/>
                    <p className="font-sans text-[12px] font-extralight leading-relaxed align-text-top text-zinc-400">Planned: {planned_days}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
    )
    } else {
    if (status == "Ongoing") {
    return (
        <Card className="my-3 hover:border-2 hover:border-[#9b9cb5]">
          <CardHeader>
            <CardTitle className="font-sans text-white">{task}</CardTitle>
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
                      <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{planned_date}</p>
                      <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{start_date}</p>
                    </div>
                </div>
                <div className="content-end">
                  <div className="flex justify-start gap-x-1">
                    <Tag className="h-3.5 w-3.5" color="#52525b"/> 
                    <p className="font-sans text-[12px] font-extralight leading-relaxed align-text-top text-zinc-400">{tag}</p>
                  </div>
                  <div className="flex justify-start gap-x-1">
                    <CalendarCog className="h-3.5 w-3.5" color="#52525b"/>
                    <p className="font-sans text-[12px] font-extralight leading-relaxed align-text-top text-zinc-400">Done: {done_days}/{planned_days}</p>
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
            <CardTitle className="font-sans text-white">{task}</CardTitle>
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
                      <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{planned_date}</p>
                      <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{start_date}</p>
                      <p className="font-sans text-[11px] font-extralight leading-relaxed align-text-top text-zinc-400">{end_date}</p>
                    </div>
                </div>
                <div className="content-end">
                  <div className="flex justify-start gap-x-1">
                    <Tag className="h-3.5 w-3.5" color="#52525b"/> 
                    <p className="font-sans text-[12px] font-extralight leading-relaxed align-text-top text-zinc-400">{tag}</p>
                  </div>
                  <div className="flex justify-start gap-x-1">
                    <CalendarCheck2 className="h-3.5 w-3.5" color="#52525b"/>
                    <p className="font-sans text-[12px] font-extralight leading-relaxed align-text-top text-zinc-400">Done: {done_days}/{planned_days}</p>
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