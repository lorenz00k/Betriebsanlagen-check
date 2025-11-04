# Design System Overview

This project now exposes a lightweight design layer built on CSS tokens and shared primitives. The tokens live in `app/tokens.css` and are consumed by `app/globals.css`.

## Tokens
- `--color-*`: background, surface, foreground and accent values for light + dark mode.
- `--radius*`, `--shadow*`: consistent radii and depth steps for cards, popovers and panels.
- `--container-w`, `--container-padding`: control the maximum content width and horizontal breathing room.
- `--transition-*`: global easing used for hover/focus transitions.
- `--font-*`: sans/mono stacks for typography.

Override tokens in `html.dark` to provide the dark-mode palette without touching components.

## Global primitives
The base styles in `app/globals.css` provide:
- `body` typography, max line length and color hierarchy.
- `.site-container` and `.section` helpers for spacing and layout rhythm (8pt scale, responsive padding).
- Button + card primitives via `.btn`, `.btn-primary`, `.btn-secondary`, `.card`, `.card--subtle`, etc.
- Accent utilities such as `.surface-muted`, `.surface-note`, `.cta-panel`, `.stat-card*` and `.page-hero` for structured content blocks.
- Navigation helpers (`.site-nav*`, `.language-switcher*`) to keep the header cohesive and accessible.
- Form inputs share styling through global `input`, `select`, `textarea` rules (consistent height, focus ring, error readiness).

Animation helpers (`.animate-fadeIn`, `.animate-slideDown`, `.animate-scaleIn`, `@keyframes countUp`) honour `prefers-reduced-motion`.

## Usage notes
- Wrap new page sections with `.section` and place content inside `.site-container` to inherit spacing.
- Use `.card` for surfaced content; add `.card--subtle` when you want a lighter elevation.
- Buttons should opt into `.btn-primary` or `.btn-secondary`; append Tailwind utilities for layout (e.g. `w-full`).
- For statistic blocks reuse `<AnimatedStats />` which now relies on the `.stat-card*` tokens.
- Language switcher and navigation already integrate focus-visible styling, so hook into their CSS modules when extending.

Dark mode can be activated by toggling the `dark` class on `<html>`, automatically remapping tokens without further overrides.
