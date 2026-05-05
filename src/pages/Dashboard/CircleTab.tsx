import React from 'react'
import { Plus } from 'lucide-react'
import type { CircleMember, Journey } from '../../types'

interface CircleTabProps {
  members: CircleMember[]
  journeys: Journey[]
}

export function CircleTab({ members, journeys }: CircleTabProps) {
  return (
    <div className="px-4 pb-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Calm Support, Real Journeys</p>
        <h2 className="font-display font-bold text-2xl text-zayra-navy dark:text-white mt-0.5">Community</h2>
      </div>

      {/* My Circle */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">My Circle</p>
          <span className="text-xs font-semibold text-zayra-teal bg-zayra-mint/40 px-2 py-0.5 rounded-full">
            {members.length} with you
          </span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          {members.map(member => (
            <div
              key={member.id}
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ backgroundColor: member.color }}
            >
              {member.initials}
            </div>
          ))}
          <button className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-zayra-teal hover:text-zayra-teal transition-colors">
            <Plus size={16} />
          </button>
        </div>
        {members[0]?.lastMessage && (
          <p className="text-xs text-gray-500">
            {members[0].name} sent you "{members[0].lastMessage}" this morning.
          </p>
        )}
      </div>

      {/* Shared Journeys */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Shared Journeys</p>
        <div className="space-y-2">
          {journeys.map((journey, i) => (
            <div
              key={journey.id}
              className={`rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-transform hover:scale-[1.01] ${
                i === 0 ? 'bg-teal-gradient text-white' : i === 1 ? 'bg-zayra-navy text-white' : 'bg-gradient-to-r from-zayra-navy-mid to-zayra-navy text-white'
              }`}
            >
              <div>
                <p className="font-semibold text-sm">{journey.title}</p>
                <p className="text-xs opacity-70 mt-0.5">{journey.subtitle}</p>
              </div>
              <span className="text-xl">{journey.emoji}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expert Rooms */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">Expert Rooms</p>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zayra-teal/20 flex items-center justify-center">
              <span className="text-xs font-bold text-zayra-teal">M</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-zayra-navy dark:text-white">Dr. Mehta</p>
              <p className="text-xs text-gray-400">Cardiologist · Join live</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
