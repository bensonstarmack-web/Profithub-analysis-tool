"use client"

import { SettingsPanel } from "@/components/settings-panel"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1629] to-[#1a1f3a] p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <SettingsPanel />
      </div>
    </div>
  )
}
