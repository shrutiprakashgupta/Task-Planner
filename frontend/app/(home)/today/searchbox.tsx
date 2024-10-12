"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import {
    ListPlus
} from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function SearchBox({
    all_tasks,
    set_all_tasks,
    set_tasks
}: {
    all_tasks: any;
    set_all_tasks: any;
    set_tasks: any;
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? all_tasks.find((task: any) => task.name === value).name
            : "Add Task"}
          <ListPlus className="ml-2 h-5 w-5 shrink-0 opacity-100" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="bg-black hover:bg-black">
          <CommandInput placeholder="Search by Task/Tag" className="h-9" />
          <CommandList>
            <CommandEmpty>No tasks found.</CommandEmpty>
            <CommandGroup>
              {all_tasks && all_tasks.map((task: any, index: number) => (
                <CommandItem
                  key={index}
                  value={task.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    set_tasks((task: any) => [...task, all_tasks.filter((task: any) => task.name === currentValue)[0]]);
                    // set_all_tasks(all_tasks.filter((task: any) => task.name !== currentValue));
                  }}
                >
                  {task.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}