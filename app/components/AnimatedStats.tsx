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
    <div ref={sectionRef} className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
      className="surface-card h-full flex flex-col items-center gap-4 text-center"
      style={{ animation: isVisible ? `fade-up 0.6s ease ${delay}s both` : 'none' }}
    >
      <span className="stat-icon !w-12 !h-12">{stat.icon}</span>
      <div className="text-4xl font-semibold text-[color:var(--color-fg)]">
        {count}
        <span className="text-[color:var(--color-muted)] text-2xl align-super">{stat.suffix}</span>
      </div>
      <p className="text-sm font-medium text-[color:var(--color-muted)]">{stat.label}</p>
    </div>
  )
}
