# Design Guidelines - Tajneed Oyo

> Quick reference for UI implementation decisions.

---

## Visual Identity

### Primary Color
**Emerald Green: `#059669`**
- Use for: Primary buttons, active nav items, links, focus rings, highlighted stat cards
- Hover state: `#047857`
- Soft background: `rgba(5, 150, 105, 0.1)`

### Neutral Scale
| Token | Hex | Usage |
|-------|-----|-------|
| foreground | #111827 | Primary text |
| muted-foreground | #6B7280 | Secondary text, labels |
| placeholder | #9CA3AF | Input placeholders |
| border | #E5E7EB | All borders |
| muted | #F3F4F6 | Subtle backgrounds |
| background | #F9FAFB | Page background |
| card | #FFFFFF | Card surfaces |

---

## Layout Structure

### Dashboard Shell
```
┌─────────────────────────────────────────────────┐
│ HEADER (60px) - Logo, Breadcrumb, User          │
├─────────┬───────────────────────────────────────┤
│         │                                       │
│ SIDEBAR │  MAIN CONTENT                         │
│ (240px) │  - Page title                         │
│         │  - Stat cards row                     │
│         │  - Charts/Tables                      │
│         │                                       │
└─────────┴───────────────────────────────────────┘
```

### Stat Cards Row
- 4 columns on desktop, 2 on mobile
- Gap: 16px
- Active card: green border + soft green background

### Content Grid
- Main sections: 2 columns (charts, lists)
- Gap: 20px

---

## Component Quick Reference

### Buttons
```
┌──────────────────────────────────────────────────────┐
│ PRIMARY    │ bg: #059669  │ text: white │ rad: 8px   │
│ SECONDARY  │ bg: white    │ border: 1px │ rad: 8px   │
│ GHOST      │ bg: none     │ hover: gray │ rad: 6px   │
└──────────────────────────────────────────────────────┘
```

### Cards
- Border radius: 12px
- Padding: 20px
- Border: 1px solid #E5E7EB
- NO shadows

### Tables
- Header: gray-100 background, 12px semibold text
- Rows: hover state with gray-50 background
- Cells: 12-16px padding

### Navigation
- Active: green text + green soft background
- Inactive: gray text
- Hover: darker gray text + gray background

---

## Strict Rules

### NEVER Use
- ❌ Gradients
- ❌ Box shadows
- ❌ Blur/glassmorphism
- ❌ Rounded corners > 12px
- ❌ Multiple accent colors
- ❌ Heavy borders (>1px)
- ❌ Decorative dividers

### ALWAYS Use
- ✓ Flat solid colors
- ✓ 1px borders for separation
- ✓ Consistent green accent
- ✓ Generous whitespace
- ✓ Clear typography hierarchy
- ✓ 8px grid alignment

---

## Icon Guidelines
- Size: 20px for nav, 16px inline
- Stroke width: 1.5px
- Color: inherit from text
- Library: Lucide React or similar

---

## Animation
- Duration: 150ms for hover, 200ms for modals
- Easing: ease-out
- Properties: background, border-color, color
- NO transform animations on layout elements

---

## Responsive Breakpoints
```css
--mobile: 375px
--tablet: 768px
--desktop: 1024px
--wide: 1280px
```

### Mobile Adaptations
- Sidebar: hidden, hamburger menu
- Stat cards: 2 columns
- Tables: horizontal scroll
- Cards: full width

---

## Sample Implementation

```jsx
// Stat Card Component
<div className="stat-card">
  <div className="icon-wrapper">
    <UsersIcon />
  </div>
  <div>
    <div className="stat-value">256</div>
    <div className="stat-label">Total Officers</div>
  </div>
</div>

// Highlighted variant
<div className="stat-card highlighted">
  <div className="icon-wrapper">
    <ClockIcon />
  </div>
  <div>
    <div className="stat-value">12</div>
    <div className="stat-label">Pending Check-ins</div>
  </div>
</div>
```

---

## Pre-Implementation Checklist
- [ ] Using `Inter` font family?
- [ ] Primary green is `#059669`?
- [ ] All borders are 1px `#E5E7EB`?
- [ ] No gradients present?
- [ ] No shadows present?
- [ ] Consistent 8px spacing grid?
- [ ] Clear visual hierarchy?
