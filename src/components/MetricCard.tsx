'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MetricCardProps {
    title: string
    value: string | number
    icon: ReactNode // Expecting a rendered element, e.g. <Phone className="..." />
    description?: string
    trend?: string
    color?: string
}

export function MetricCard({ title, value, icon, description, trend, color = "text-black" }: MetricCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05)" }}
            className="glass-card rounded-[2rem] p-6 relative overflow-hidden transition-all duration-300"
        >
            {/* Removed the background icon for simplicity and to avoid passing functions. 
          If needed, we can pass a separate 'decorativeIcon' prop. 
      */}

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 rounded-2xl bg-gray-50/50 backdrop-blur-sm border border-gray-100/50 ${color}`}>
                        {icon}
                    </div>
                    {trend && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100/50">
                            {trend}
                        </span>
                    )}
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">{title}</h3>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-semibold text-gray-900 tracking-tight">{value}</h2>
                    </div>
                    {description && (
                        <p className="mt-3 text-sm text-gray-500 font-medium">{description}</p>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
