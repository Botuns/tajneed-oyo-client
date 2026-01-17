# Design Brain - Tajneed Oyo Attendance System

> Professional green-themed design system for an enterprise attendance management dashboard.

---

## Core Philosophy

| Principle | Description |
|-----------|-------------|
| **Professional** | Enterprise-grade aesthetics suitable for organizational use |
| **Green Mono+** | Primary green + neutrals. Maximum 3 colors in any view |
| **Flat** | Zero gradients. Zero box-shadows. Zero blur effects |
| **Data-First** | Prioritize information hierarchy and scanability |
| **Breathable** | Generous whitespace. Clear visual separation |

---

## Color Tokens

### Primary Palette
```css
--primary: #059669;          /* Emerald green - actions, active states */
--primary-light: #10B981;    /* Lighter green - hover states */
--primary-soft: #05966915;   /* 15% opacity - subtle backgrounds */
--primary-muted: #05966908;  /* 8% opacity - very subtle fills */
```

### Neutral Palette
```css
--foreground: #111827;       /* Primary text - gray-900 */
--muted-foreground: #6B7280; /* Secondary text - gray-500 */
--border: #E5E7EB;           /* Borders, dividers - gray-200 */
--muted: #F3F4F6;            /* Card backgrounds - gray-100 */
--background: #F9FAFB;       /* Page background - gray-50 */
--card: #FFFFFF;             /* Card surface - white */
```

### Semantic Colors
```css
--success: #059669;          /* Same as primary */
--destructive: #DC2626;      /* Errors, delete - red-600 */
--warning: #D97706;          /* Pending, attention - amber-600 */
--info: #2563EB;             /* Information - blue-600 */
```

---

## Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Page Title | 24px | 600 | 1.2 |
| Section Header | 18px | 600 | 1.3 |
| Card Title | 14px | 600 | 1.4 |
| Body | 14px | 400 | 1.5 |
| Small | 12px | 400 | 1.4 |
| Caption | 11px | 500 | 1.3 |
| Stat Number | 28px | 700 | 1.1 |

---

## Spacing System

### Base Unit: 4px
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
```

---

## Component Patterns

### Stat Cards
```css
.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px 20px;
}
.stat-card.active {
  border-color: var(--primary);
  background: var(--primary-soft);
}
.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
}
.stat-label {
  font-size: 12px;
  color: var(--muted-foreground);
  margin-top: 4px;
}
```

### Sidebar Navigation
```css
.sidebar {
  width: 240px;
  background: var(--card);
  border-right: 1px solid var(--border);
  padding: 16px 0;
}
.nav-item {
  padding: 10px 20px;
  color: var(--muted-foreground);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-item.active {
  color: var(--primary);
  background: var(--primary-soft);
  border-right: 2px solid var(--primary);
}
```

### Data Tables
```css
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th {
  text-align: left;
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-foreground);
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}
.table td {
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid var(--border);
}
.table tr:hover {
  background: var(--muted);
}
```

### Charts Container
```css
.chart-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.chart-title {
  font-size: 14px;
  font-weight: 600;
}
```

---

## Layout Reference

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo | Breadcrumb | User Info                       │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  Sidebar     │  Main Content Area                           │
│              │                                              │
│  - Dashboard │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐             │
│  - Officers  │  │Stat │ │Stat │ │Stat │ │Stat │             │
│  - Meetings  │  └─────┘ └─────┘ └─────┘ └─────┘             │
│  - Reports   │                                              │
│  - Settings  │  ┌─────────────┐ ┌──────────────┐            │
│              │  │   Chart     │ │   List       │            │
│              │  │             │ │              │            │
│              │  └─────────────┘ └──────────────┘            │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

---

## Forbidden Patterns ❌

| Pattern | Reason |
|---------|--------|
| Gradients | Visual noise, dated appearance |
| Box-shadows | Breaks flat aesthetic |
| Blur effects | Performance overhead |
| Multiple accent colors | Confuses hierarchy |
| Heavy borders (>1px) | Use color differentiation |
| Rounded corners >12px | Maintains professional feel |
| Decorative elements | Focus on data, not decoration |

---

## Animation Guidelines

| Property | Duration | Easing |
|----------|----------|--------|
| Hover | 150ms | ease-out |
| Transitions | 200ms | ease-in-out |
| Modals | 200ms | ease-out |

---

## Quality Checklist

- [ ] Zero gradients?
- [ ] Zero box-shadows?
- [ ] Only green + neutral colors?
- [ ] Clear information hierarchy?
- [ ] Adequate whitespace?
- [ ] Consistent 8px grid alignment?
- [ ] Professional typography?
