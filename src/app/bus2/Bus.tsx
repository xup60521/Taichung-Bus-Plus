'use client'
import { Input } from "@/components/ui/input"
import Map from "./_components/Map"
import { useState } from "react"
import { useBus, useDirection } from "@/utils/Bus2Context"
import { useSetBus } from "@/utils/BusContext"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"

export default function Bus() {

    return (
        <div className="w-screen h-screen">
            <Input className="absolute z-10 w-[80vw] h-8 m-2 " />
            <Map />
        </div>
    )
}

function ComboboxDemo({selectOptions, isOneWay}:
    {selectOptions: {
      label: string,
      value: string
  }[], isOneWay:boolean}) {
      const [open, setOpen] = useState(false)
    const value = useBus()
    const setValue = useSetBus()
    const direction = useDirection()
    const placeholder = selectOptions.find((framework) => framework.value === value)?.label
   
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="whitespace-normal	flex-grow h-fit text-wrap flex-shrink"
          >
            <p>
  
            {value
              ? (placeholder ? (
                placeholder + (!isOneWay ? (direction === 0 ? " (順向)" : " (逆向)") : "")
              ) : "")
              : "Select bus..."}
            </p>
  
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-min p-0">
          <Command>
            <CommandInput placeholder="Search bus..." className="h-9 p-2 m-2 border-2 rounded" />
            <CommandEmpty className="p-4">No Bus Found.</CommandEmpty>
            <CommandGroup className=" overflow-y-scroll h-96 ">
              {selectOptions.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue.toUpperCase() === value.toUpperCase() ? "" : currentValue.toUpperCase())
                    setOpen(false)
                  }}
                  className=" hover:bg-blue-100 px-4 py-2"
                >
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }