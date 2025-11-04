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
    <div ref={sectionRef} className="stat-grid">
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
    let interval: ReturnType<typeof setInterval> | undefined

    const timer = setTimeout(() => {
      interval = setInterval(() => {
        currentStep++
        if (currentStep <= steps) {
          setCount(Math.min(Math.round(increment * currentStep), stat.value))
        } else if (interval) {
          clearInterval(interval)
        }
      }, stepDuration)
    }, delay * 1000)

    return () => {
      clearTimeout(timer)
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isVisible, stat.value, delay])

  return (
    <div
      className="stat-card"
      style={{
        animation: isVisible ? `countUp 0.8s ease-out ${delay}s both` : 'none',
      }}
    >
      <div className="stat-card__icon">{stat.icon}</div>
      <div className="stat-card__value">
        {count}
        <span className="stat-card__suffix">{stat.suffix}</span>
      </div>
      <p className="stat-card__label">{stat.label}</p>
    </div>
  )
}
