# SMANDING Smart - Design System & Implementation Guide

## Overview
This document outlines the Stitch MCP design system implemented for the SMANDING Smart attendance system. The design uses Tailwind CSS with a burgundy color scheme, emphasizing modern, responsive UI/UX.

## Design System Information

### Stitch MCP Project
- **Project Name**: SMANDING Smart - Attendance System
- **Project ID**: `14737120750084727894`
- **Design System**: SMANDING Smart Design System
- **Design System ID**: `assets/10879856256619608546`

## Color Palette

### Primary Colors
| Name | Hex Code | RGB | Usage |
|------|----------|-----|-------|
| Primary Burgundy | `#853953` | 133, 57, 83 | Primary buttons, accents, headings |
| Secondary Burgundy | `#612D53` | 97, 45, 83 | Hover states, darker accents |
| Dark Text | `#2C2C2C` | 44, 44, 44 | All text content |
| Light Background | `#F3F4F4` | 243, 244, 244 | Page backgrounds, input backgrounds |

### Usage Examples
```jsx
// Primary button
className="bg-[#853953] text-white hover:bg-[#612D53]"

// Card with accent
className="bg-white rounded-2xl p-6 shadow-sm border border-black/5"

// Text hierarchy
<h1 className="text-[#2C2C2C]">Main Title</h1>
<p className="text-[#2C2C2C]/70">Secondary text</p>
<p className="text-[#2C2C2C]/60">Tertiary text</p>
```

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Used for**: All headings and body text

### Font Sizes & Hierarchy
```tailwind
/* Display/Hero Text */
className="text-4xl md:text-5xl lg:text-6xl font-extrabold"

/* Page Headings */
className="text-2xl md:text-3xl lg:text-4xl font-bold"

/* Section Headings */
className="text-lg md:text-xl font-bold"

/* Body Text */
className="text-base md:text-lg text-[#2C2C2C]/70"

/* Secondary Text */
className="text-sm text-[#2C2C2C]/60"

/* Captions */
className="text-xs text-[#2C2C2C]/50"
```

## Spacing & Sizing

### Roundness (Border Radius)
- **Small elements**: `rounded-lg` (8px)
- **Medium elements**: `rounded-xl` (12px)
- **Large elements**: `rounded-2xl` (16px)
- **Extra large elements**: `rounded-3xl` (24px)

### Padding/Margins - Responsive
```tailwind
/* Small screens (mobile) */
px-4 py-3

/* Medium screens (tablet) */
md:px-6 md:py-4

/* Large screens (desktop) */
lg:px-8 lg:py-6

/* Spacing between sections */
mt-6 md:mt-8 lg:mt-12
gap-4 md:gap-6 lg:gap-8
```

## Component Patterns

### Cards
```jsx
<div className="rounded-2xl md:rounded-3xl bg-white p-4 md:p-6 shadow-sm border border-black/5">
  {/* Content */}
</div>
```

### Buttons
```jsx
// Primary Button
<button className="px-6 md:px-7 py-3 rounded-lg md:rounded-xl bg-[#853953] text-white font-semibold hover:bg-[#612D53] transition">
  Action
</button>

// Secondary Button
<button className="px-6 md:px-7 py-3 rounded-lg md:rounded-xl bg-white text-[#853953] font-semibold border border-[#853953]/20 hover:border-[#853953] transition">
  Action
</button>
```

### Input Fields
```jsx
<input
  className="w-full px-4 py-2.5 rounded-lg border border-black/10 focus:border-[#853953] focus:ring-1 focus:ring-[#853953] bg-[#F3F4F4] transition"
  placeholder="Placeholder text"
/>
```

### Stat Cards
```jsx
<div className="rounded-lg md:rounded-2xl p-4 md:p-5 shadow-sm border border-black/5 bg-white">
  <p className="text-xs md:text-sm text-[#2C2C2C]/70">Label</p>
  <h3 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] mt-2">Value</h3>
  <p className="text-xs md:text-sm mt-2 md:mt-3 text-[#2C2C2C]/70">Description</p>
</div>
```

## Responsive Design Breakpoints

### Tailwind Default Breakpoints
- **sm**: 640px (tablets)
- **md**: 768px (small desktops)
- **lg**: 1024px (large desktops)
- **xl**: 1280px (extra large)

### Mobile-First Approach
```jsx
// Default for mobile, then override for larger screens
className="px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-5"

// For elements that should be hidden on mobile
className="hidden md:flex"

// For grid layouts
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
```

## Page Templates

### Landing Page (Home.jsx)
- Hero section with title and CTA buttons
- Feature cards (4 columns on desktop, 2 on tablet, 1 on mobile)
- Statistics section
- Responsive mockup area (hidden on mobile)

### Dashboard (Dashboard.jsx)
- Sticky topbar with search, notifications, user profile
- Hero card with gradient background
- 4-column stat cards grid
- Quick actions section (2-col grid on medium, full-width on mobile)
- Activity log table with horizontal scroll on small screens

### Authentication Pages (Login/Register)
- Centered form in container
- Branded header with logo
- Form fields with consistent styling
- CTA buttons with gradient background
- Footer with legal links

## Shadows & Effects

### Shadow Scale
```tailwind
/* Subtle shadow */
shadow-sm

/* Medium shadow */
shadow-md

/* Large shadow */
shadow-lg

/* Extra large shadow */
shadow-xl

/* Glow/Blur Effects */
blur-3xl  /* For background decorative elements */
```

### Gradients
```jsx
// Gradient Background
className="bg-gradient-to-br from-[#F3F4F4] to-[#FFFFFF]"

// Gradient Text/Button
className="bg-gradient-to-r from-[#853953] to-[#612D53]"
```

## Transitions & Interactions

### Hover States
```jsx
// Button hover
hover:bg-[#612D53]
hover:shadow-lg
hover:scale-105

// Card hover
hover:-translate-y-1 md:hover:-translate-y-2
hover:shadow-xl

// Link hover
hover:text-[#612D53]
hover:underline
```

### Transitions
```jsx
// All animations
transition
transition-all
transition-colors
duration-300
```

## Accessibility Best Practices

1. **Color Contrast**: Ensure text color has minimum 4.5:1 ratio with background
2. **Focus States**: All interactive elements have visible focus states
3. **Responsive Text**: Font sizes scale appropriately for readability
4. **Semantic HTML**: Use proper HTML elements (button, a, form, etc.)
5. **ARIA Labels**: Add labels for screen readers where needed

## Implementation Checklist

- ✅ Color scheme applied throughout
- ✅ Typography hierarchy established
- ✅ Responsive design on mobile, tablet, desktop
- ✅ Card and button components standardized
- ✅ Spacing and sizing consistent
- ✅ Transitions and hover states implemented
- ✅ Shadow and depth applied
- ✅ Forms and inputs styled
- ✅ Tables responsive and accessible
- ✅ Navigation and header styled

## Files Modified

1. **resources/js/Pages/Home.jsx** - Landing page with responsive design
2. **resources/js/Pages/Dashboard.jsx** - Admin dashboard with stat cards
3. **resources/js/Layouts/GuestLayout.jsx** - Auth page wrapper
4. **resources/js/Pages/Auth/Login.jsx** - Login form
5. **resources/js/Pages/Auth/Register.jsx** - Registration form

## Future Enhancements

- Add dark mode variant
- Create reusable component library (React components)
- Add animation library (Framer Motion)
- Implement theme switching
- Add more interactive charts and visualizations

## Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Stitch MCP Design System](https://stitchdesign.ai)
- [Inter Font](https://fonts.google.com/specimen/Inter)

---

**Version**: 1.0  
**Last Updated**: May 10, 2026  
**Maintained by**: SMANDING Smart Team
