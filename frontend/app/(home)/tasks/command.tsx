'use client';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import React from "react"

export default function CommandMenu({
  suggest
}:{
  suggest: []
}) {
    const [open, setOpen] = React.useState(false)
 
    React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setOpen((open) => !open)
        }
      }
      document.addEventListener("keydown", down)
      return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <div>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search Tasks/Tags" />
                <CommandList>
                  <CommandEmpty>No tasks found.</CommandEmpty>
                  <CommandGroup>
                    {
                        suggest && suggest.map((x, idx) => (
                            <CommandItem>{x}</CommandItem>
                          ))
                    }
                  </CommandGroup>
                </CommandList>
            </CommandDialog> 
        </div>
    )
}