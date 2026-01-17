# Design System - Tajneed Oyo

> Complete CSS token reference and component specifications.

---

## CSS Variables

### Color Tokens
```css
:root {
  /* Primary Green Palette */
  --primary: #059669;
  --primary-hover: #047857;
  --primary-light: #10B981;
  --primary-soft: rgba(5, 150, 105, 0.1);
  --primary-muted: rgba(5, 150, 105, 0.05);

  /* Neutral Palette */
  --foreground: #111827;
  --muted-foreground: #6B7280;
  --placeholder: #9CA3AF;
  --border: #E5E7EB;
  --border-light: #F3F4F6;
  --muted: #F3F4F6;
  --background: #F9FAFB;
  --card: #FFFFFF;

  /* Semantic */
  --success: #059669;
  --success-soft: rgba(5, 150, 105, 0.1);
  --destructive: #DC2626;
  --destructive-soft: rgba(220, 38, 38, 0.1);
  --warning: #D97706;
  --warning-soft: rgba(217, 119, 6, 0.1);
  --info: #2563EB;
  --info-soft: rgba(37, 99, 235, 0.1);
}
```

### Spacing Tokens
```css
:root {
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

### Border Radius
```css
:root {
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;
}
```

### Typography
```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  --text-xs: 11px;
  --text-sm: 12px;
  --text-base: 14px;
  --text-lg: 16px;
  --text-xl: 18px;
  --text-2xl: 20px;
  --text-3xl: 24px;
  --text-4xl: 28px;

  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  --leading-tight: 1.2;
  --leading-snug: 1.3;
  --leading-normal: 1.5;
}
```

---

## Base Components

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: 10px 16px;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: background 150ms ease-out;
}
.btn-primary:hover {
  background: var(--primary-hover);
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Secondary Button */
.btn-secondary {
  background: var(--card);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 9px 15px;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: background 150ms ease-out;
}
.btn-secondary:hover {
  background: var(--muted);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--muted-foreground);
  border: none;
  padding: 8px 12px;
  font-size: var(--text-base);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 150ms ease-out;
}
.btn-ghost:hover {
  background: var(--muted);
  color: var(--foreground);
}

/* Icon Button */
.btn-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 150ms ease-out;
}
.btn-icon:hover {
  background: var(--muted);
}
```

### Inputs

```css
.input {
  width: 100%;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 10px 12px;
  font-size: var(--text-base);
  color: var(--foreground);
  transition: border-color 150ms ease-out;
}
.input::placeholder {
  color: var(--placeholder);
}
.input:focus {
  outline: none;
  border-color: var(--primary);
}
.input:disabled {
  background: var(--muted);
  cursor: not-allowed;
}

/* Search Input */
.input-search {
  padding-left: 40px;
  background-image: url("data:image/svg+xml,..."); /* search icon */
  background-repeat: no-repeat;
  background-position: 12px center;
}

/* Input with Icon */
.input-group {
  position: relative;
}
.input-group .icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
}
.input-group .input {
  padding-left: 40px;
}
```

### Cards

```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
}

/* Stat Card */
.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
}
.stat-card.highlighted {
  border-color: var(--primary);
  background: var(--primary-soft);
}
.stat-card .icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  background: var(--muted);
}
.stat-card.highlighted .icon-wrapper {
  background: var(--primary);
  color: white;
}
.stat-value {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--foreground);
  line-height: var(--leading-tight);
}
.stat-label {
  font-size: var(--text-sm);
  color: var(--muted-foreground);
  margin-top: var(--space-1);
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: var(--radius-sm);
}
.badge-primary {
  background: var(--primary-soft);
  color: var(--primary);
}
.badge-success {
  background: var(--success-soft);
  color: var(--success);
}
.badge-warning {
  background: var(--warning-soft);
  color: var(--warning);
}
.badge-destructive {
  background: var(--destructive-soft);
  color: var(--destructive);
}
.badge-muted {
  background: var(--muted);
  color: var(--muted-foreground);
}
```

---

## Layout Components

### Header

```css
.header {
  height: 60px;
  background: var(--card);
  border-bottom: 1px solid var(--border);
  padding: 0 var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-base);
  color: var(--muted-foreground);
}
.breadcrumb a:hover {
  color: var(--primary);
}
.breadcrumb .separator {
  color: var(--border);
}
.breadcrumb .current {
  color: var(--foreground);
  font-weight: var(--font-medium);
}
```

### Sidebar

```css
.sidebar {
  width: 240px;
  background: var(--card);
  border-right: 1px solid var(--border);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border);
}
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
}
.sidebar-section {
  padding: var(--space-4) 0;
}
.sidebar-section-title {
  padding: var(--space-2) var(--space-5);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-5);
  margin: var(--space-1) var(--space-2);
  font-size: var(--text-base);
  color: var(--muted-foreground);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 150ms ease-out;
}
.nav-item:hover {
  background: var(--muted);
  color: var(--foreground);
}
.nav-item.active {
  background: var(--primary-soft);
  color: var(--primary);
}
.nav-item .icon {
  width: 20px;
  height: 20px;
}
```

### Main Content

```css
.main-content {
  margin-left: 240px;
  padding: var(--space-6);
  background: var(--background);
  min-height: 100vh;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}
.page-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  color: var(--foreground);
}
.page-subtitle {
  font-size: var(--text-base);
  color: var(--muted-foreground);
  margin-top: var(--space-1);
}
```

---

## Data Display

### Tables

```css
.table-container {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th {
  text-align: left;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--muted-foreground);
  background: var(--muted);
  border-bottom: 1px solid var(--border);
}
.table td {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  color: var(--foreground);
  border-bottom: 1px solid var(--border);
}
.table tr:last-child td {
  border-bottom: none;
}
.table tr:hover td {
  background: var(--background);
}
```

### List Items

```css
.list-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
}
.list-item:last-child {
  border-bottom: none;
}
.list-item:hover {
  background: var(--background);
}
.list-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-medium);
  color: var(--muted-foreground);
}
.list-content {
  flex: 1;
}
.list-title {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--foreground);
}
.list-subtitle {
  font-size: var(--text-sm);
  color: var(--muted-foreground);
}
```

---

## Utility Classes

```css
/* Flex */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }

/* Grid */
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Text */
.text-sm { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }
.text-lg { font-size: var(--text-lg); }
.font-medium { font-weight: var(--font-medium); }
.font-semibold { font-weight: var(--font-semibold); }
.text-muted { color: var(--muted-foreground); }
.text-primary { color: var(--primary); }

/* Spacing */
.p-4 { padding: var(--space-4); }
.p-6 { padding: var(--space-6); }
.mt-4 { margin-top: var(--space-4); }
.mb-4 { margin-bottom: var(--space-4); }
```
