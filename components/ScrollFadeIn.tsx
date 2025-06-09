'use client'

import React, { useState, useRef, useEffect } from 'react'

interface ScrollFadeInProps {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  className?: string
}

export default function ScrollFadeIn({
  children,
  direction = 'up',
  delay = 0,
  className = ''
}: ScrollFadeInProps) {
  const [isVisible, setVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            setTimeout(() => {
              setVisible(true)
              setHasAnimated(true)
            }, delay)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    if (domRef.current) {
      observer.observe(domRef.current)
    }

    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current)
      }
    }
  }, [delay, hasAnimated])

  const getTransform = () => {
    if (isVisible) return 'translateX(0) translateY(0)'

    switch (direction) {
      case 'left':
        return 'translateX(-50px)'
      case 'right':
        return 'translateX(50px)'
      case 'up':
        return 'translateY(30px)'
      case 'down':
        return 'translateY(-30px)'
      default:
        return 'translateY(30px)'
    }
  }

  return (
    <div
      ref={domRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: 'all 1000ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  )
}
