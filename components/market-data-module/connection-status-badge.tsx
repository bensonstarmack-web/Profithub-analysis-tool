"use client"

import { Circle, Zap, AlertCircle } from "lucide-react"

interface ConnectionStatusBadgeProps {
  status: "connected" | "reconnecting" | "disconnected"
  theme: "light" | "dark"
  appId?: string
  wsUrl?: string
}

export function ConnectionStatusBadge({
  status,
  theme,
  appId = "1089",
  wsUrl = "wss://ws.deriv.com/websockets/v3",
}: ConnectionStatusBadgeProps) {
  const statusConfig = {
    connected: {
      icon: Circle,
      bgColor: theme === "dark" ? "bg-green-900/30" : "bg-green-50",
      borderColor: "border-green-500/50",
      textColor: theme === "dark" ? "text-green-400" : "text-green-600",
      label: "Connected",
      pulse: true,
    },
    reconnecting: {
      icon: Zap,
      bgColor: theme === "dark" ? "bg-yellow-900/30" : "bg-yellow-50",
      borderColor: "border-yellow-500/50",
      textColor: theme === "dark" ? "text-yellow-400" : "text-yellow-600",
      label: "Reconnecting...",
      pulse: false,
    },
    disconnected: {
      icon: AlertCircle,
      bgColor: theme === "dark" ? "bg-red-900/30" : "bg-red-50",
      borderColor: "border-red-500/50",
      textColor: theme === "dark" ? "text-red-400" : "text-red-600",
      label: "Disconnected",
      pulse: false,
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={`flex flex-col gap-2 p-4 rounded-xl border backdrop-blur-xl ${config.bgColor} ${config.borderColor}`}
    >
      <div className="flex items-center gap-2">
        <div className={`relative ${config.pulse ? "animate-pulse" : ""}`}>
          <Icon className={`w-5 h-5 ${config.textColor}`} />
          {config.pulse && (
            <div className={`absolute inset-0 rounded-full ${config.textColor} opacity-20 animate-pulse`} />
          )}
        </div>
        <span className={`font-semibold ${config.textColor}`}>{config.label}</span>
      </div>

      <div className={`text-xs space-y-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        <p>
          <span className="font-semibold">App ID:</span> {appId}
        </p>
        <p className="break-all">
          <span className="font-semibold">Server:</span> {wsUrl}
        </p>
      </div>
    </div>
  )
}
