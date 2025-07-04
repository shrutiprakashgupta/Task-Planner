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
                      <div className="relative group">
                        <Trash2 className="h-3.5 w-3.5 hover:text-white transition-colors duration-200" color="gray"/>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          Delete
                        </div>
                      </div>
                  </Button>
            </PopoverTrigger>
            <PopoverContent className="w-50 bg-black border-white">
                    <p className="text-md text-white">
                      Are You Sure?
                    </p>
                    <p className="text-sm text-gray-300 pb-2">
                      Task will be deleted permanently
                    </p>
                    <div className="flex justify-around">
                      <Button variant="outline" className="self-center w-20 bg-[#27548A] hover:border-[#F3F3E0] hover:bg-[#27548A] gap-4 text-white" onClick={() => set_task_delete(task.index)}>
                        Yes 
                      </Button>
                      <Button variant="outline" className="self-center w-20 bg-[#DDA853] hover:border-[#F3F3E0] hover:bg-[#DDA853] gap-4 text-white" onClick={() => set_task_delete("")}>
                        No
                      </Button>
                    </div>
            </PopoverContent>
        </Popover>
    )
}