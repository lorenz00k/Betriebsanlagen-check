'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import NavLink from '../components/NavLink';
import BreakText from '@/components/ui/BreakText';

export default function HeaderNav({ locale }: { locale: string }) {
    const [open, setOpen] = useState(false);

    return (
        <nav className="site-nav sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
            <div className="site-container site-nav__inner mx-auto max-w-screen-xl w-full px-4">
                {/* Head Row */}
                <div className="flex h-14 items-center justify-between gap-3 md:gap-6">
                    {/* Brand: Logo + Titel (kurz auf Mobile, voll ab md) */}
                    <Link href={`/${locale}`} className="site-brand flex items-center gap-2 min-w-0" aria-label="Betriebsanlagen Check Startseite">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="site-brand__mark">
                                {/* verwende dein neues Icon */}
                                <Image src="/icon.svg" alt="Logo" width={28} height={28} priority />
                            </span>
                            <BreakText className="hidden md:inline font-semibold text-slate-900">
                                Betriebsanlagen Check
                            </BreakText>
                        </div>
                    </Link>

                    {/* Desktop-Navigation */}
                    <div className="hidden md:flex site-nav__links flex-wrap items-center gap-x-6 gap-y-2 min-w-0">
                        <NavLink href={`/${locale}/adressen-check`}>
                            <BreakText className="truncate md:truncate-0">Adressen-Check</BreakText>
                        </NavLink>
                        <NavLink href={`/${locale}/formular-assistent`}>
                            <BreakText className="truncate md:truncate-0">Formular-Assistent</BreakText>
                        </NavLink>
                        <NavLink href={`/${locale}/dokumente`} activeMatch={[`/${locale}/documents`]}>
                            <BreakText className="truncate md:truncate-0">Dokumente</BreakText>
                        </NavLink>
                        <NavLink href={`/${locale}/faq`}>
                            <BreakText className="truncate md:truncate-0">FAQ</BreakText>
                        </NavLink>
                    </div>

                    {/* Language + Mobile Toggle */}
                    <div className="flex items-center gap-2 min-w-0">
                        <LanguageSwitcher />
                        <button
                            className="md:hidden inline-flex items-center justify-center rounded-md p-2"
                            aria-label="Menü öffnen"
                            onClick={() => setOpen(v => !v)}
                        >
                            <svg width="24" height="24" fill="none" stroke="currentColor" aria-hidden="true">
                                <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {open && (
                    <div className="md:hidden border-t py-2">
                        <nav className="flex flex-col">
                            <NavLink href={`/${locale}/adressen-check`}> <span className="px-2 py-3">Adressen-Check </span> </NavLink>
                            <NavLink href={`/${locale}/formular-assistent`}> <span className="px-2 py-3">Formular-Assistent </span> </NavLink>
                            <NavLink href={`/${locale}/dokumente`}> <span className="px-2 py-3">Dokumente </span> </NavLink>
                            <NavLink href={`/${locale}/faq`}> <span className="px-2 py-3">FAQ </span> </NavLink>
                        </nav>
                    </div>
                )}
            </div>
        </nav>
    );
}
