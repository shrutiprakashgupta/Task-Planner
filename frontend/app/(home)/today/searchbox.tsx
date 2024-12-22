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
    date,
    suggestions,
    value,
    set_value
}: {
    date: any;
    suggestions: any;
    value: any;
    set_value: any;
}) {
  const [open, set_open] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={set_open}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value[1]
            ? suggestions.find((task: any) => task.name === value[1]).name
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
              {suggestions && suggestions.map((task: any, index: number) => (
                <CommandItem
                  key={index}
                  value={task.name}
                  onSelect={(currentValue) => {
                    set_value([date, currentValue])
                    set_open(false)
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