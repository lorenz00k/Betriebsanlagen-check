'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, type ReactNode } from 'react'
import styles from "./NavLink.module.css";

interface NavLinkProps {
  href: string
  activeMatch?: string[]
  children: ReactNode
}

export default function NavLink({ href, activeMatch, children }: NavLinkProps) {
  const pathname = usePathname()

  const isActive = useMemo(() => {
    if (!pathname) return false
    const targets = [href, ...(activeMatch ?? [])]
    return targets.some((target) => {
      if (target === '/') {
        return pathname === '/' || pathname === ''
      }

      return pathname === target || pathname.startsWith(`${target}/`)
    })
  }, [pathname, href, activeMatch])

  return (
    <Link href={href} className={`${styles.siteNav__link} ${isActive ? ' active' : ''}`}>
      {children}
    </Link>
  )
}
