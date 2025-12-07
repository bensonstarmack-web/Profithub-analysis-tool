"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TicksSelectorProps {
  currentTicks: number
  onTicksChange: (ticks: number) => void
  theme: "light" | "dark"
}

const TICK_OPTIONS = [10, 20, 50, 100, 200, 500]

export function TicksSelector({ currentTicks, onTicksChange, theme }: TicksSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`px-3 py-2 text-sm flex items-center gap-2 ${
            theme === "dark"
              ? "border-blue-500/30 bg-blue-900/20 hover:bg-blue-900/30 text-blue-400"
              : "border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700"
          }`}
        >
          <span className="text-xs">Ticks:</span>
          <span className="font-semibold">{currentTicks}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`${
          theme === "dark" ? "bg-slate-900 border-blue-500/30 text-blue-400" : "bg-white border-blue-200 text-blue-700"
        }`}
        align="end"
      >
        {TICK_OPTIONS.map((ticks) => (
          <DropdownMenuItem
            key={ticks}
            onClick={() => onTicksChange(ticks)}
            className={`cursor-pointer ${
              currentTicks === ticks
                ? theme === "dark"
                  ? "bg-blue-900/40 text-blue-300"
                  : "bg-blue-100 text-blue-700"
                : theme === "dark"
                  ? "hover:bg-slate-800"
                  : "hover:bg-gray-100"
            }`}
          >
            {ticks} Ticks
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
