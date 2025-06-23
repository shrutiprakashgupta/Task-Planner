"use client"

import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  Trash2
} from 'lucide-react'

export function TaskDeleteView({
    task,
    set_task_delete
}: {
    task: any;
    set_task_delete: any;
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="self-center">
                      <Trash2 className="h-3.5 w-3.5 hover:fill-[#F3F3E0] hover:border-[#F3F3E0]" color="#183B4E"/>
                  </Button>
            </PopoverTrigger>
            <PopoverContent className="w-50">
                    <p className="text-md">
                      Are You Sure?
                    </p>
                    <p className="text-sm text-muted-foreground pb-2">
                      Task will be deleted permanently
                    </p>
                    <div className="flex justify-around">
                      <Button variant="outline" className="self-center w-20 bg-[#27548A] hover:border-[#F3F3E0] hover:bg-[#27548A] gap-4" onClick={() => set_task_delete(task.index)}>
                        Yes 
                      </Button>
                      <Button variant="outline" className="self-center w-20 bg-[#DDA853] hover:border-[#F3F3E0] hover:bg-[#DDA853] gap-4" onClick={() => set_task_delete("")}>
                        No
                      </Button>
                    </div>
            </PopoverContent>
        </Popover>
    )
}