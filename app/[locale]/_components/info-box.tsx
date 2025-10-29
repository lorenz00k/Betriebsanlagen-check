"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Info } from "lucide-react"

type InfoBoxProps = {
  text: string
}

export function InfoBox({ text }: InfoBoxProps) {
  const id = useId()
  const isShort = text.length <= 120
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!open || isShort) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation()
        setOpen(false)
        buttonRef.current?.focus()
      }
    }

    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleClick)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClick)
    }
  }, [open, isShort])

  if (isShort) {
    return (
      <div className="relative inline-flex" ref={containerRef}>
        <button
          ref={buttonRef}
          type="button"
          aria-describedby={open ? id : undefined}
          aria-label="Info"
          className="ml-2 inline-flex items-center rounded-full border border-transparent bg-white/80 p-1 text-blue-600 shadow-sm transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          <Info className="h-4 w-4" aria-hidden="true" />
        </button>
        {open ? (
          <div
            id={id}
            role="tooltip"
            className="absolute left-1/2 top-full z-20 mt-2 w-max max-w-xs -translate-x-1/2 rounded-md bg-slate-900 px-3 py-2 text-xs text-white shadow-lg"
          >
            {text}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="relative inline-flex" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Info"
        className="ml-2 inline-flex items-center rounded-full border border-transparent bg-white/80 p-1 text-blue-600 shadow-sm transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Info className="h-4 w-4" aria-hidden="true" />
      </button>
      {open ? (
        <div
          id={id}
          role="dialog"
          aria-modal="false"
          className="absolute left-1/2 top-full z-20 mt-2 max-w-sm -translate-x-1/2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm leading-snug text-slate-900 shadow-xl"
        >
          {text}
        </div>
      ) : null}
    </div>
  )
}
