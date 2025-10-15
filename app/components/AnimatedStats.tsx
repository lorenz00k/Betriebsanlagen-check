'use client'

import { useEffect, useRef, useState } from 'react'

interface Stat {
  value: number
  suffix: string
  label: string
  icon: React.ReactNode
}

interface AnimatedStatsProps {
  stats: Stat[]
}

export default function AnimatedStats({ stats }: AnimatedStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  return (
    <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <AnimatedStatCard
          key={index}
          stat={stat}
          isVisible={isVisible}
          delay={index * 0.1}
        />
      ))}
    </div>
  )
}

function AnimatedStatCard({
  stat,
  isVisible,
  delay,
}: {
  stat: Stat
  isVisible: boolean
  delay: number
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const duration = 1500 // Animation duration in ms
    const steps = 60 // Number of steps in the animation
    const increment = stat.value / steps
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        currentStep++
        if (currentStep <= steps) {
          setCount(Math.min(Math.round(increment * currentStep), stat.value))
        } else {
          clearInterval(interval)
        }
      }, stepDuration)

      return () => clearInterval(interval)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [isVisible, stat.value, delay])

  return (
    <div
      className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
      style={{
        animation: isVisible ? `countUp 0.8s ease-out ${delay}s both` : 'none',
      }}
    >
      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-md">
        {stat.icon}
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">
        {count}
        <span className="text-blue-600">{stat.suffix}</span>
      </div>
      <p className="text-gray-600 text-center font-medium">{stat.label}</p>
    </div>
  )
}
