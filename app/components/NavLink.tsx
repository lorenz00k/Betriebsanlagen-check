'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export default function NavLink({ href, children, className = '' }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname?.startsWith(`${href}/`))
  const classes = ['nav-link']

  if (isActive) {
    classes.push('is-active')
  }

  if (className) {
    classes.push(className)
  }

  return (
    <Link href={href} aria-current={isActive ? 'page' : undefined} className={classes.join(' ')}>
      {children}
    </Link>
  )
}
