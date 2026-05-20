# 🚀 Quick Start - Design System Reference

## Color System
```
Primary:     #853953 (Burgundy) - Buttons, accents, primary actions
Secondary:   #612D53 (Dark Burgundy) - Hover states, secondary accents  
Text:        #2C2C2C (Dark Gray) - All body text
Background:  #F3F4F4 (Light Gray) - Page backgrounds
```

## Responsive Breakpoints
```
Mobile:  < 640px   → Default Tailwind classes
Tablet:  640px-1024px → Add 'md:' prefix
Desktop: > 1024px   → Add 'lg:' prefix
```

## Common Patterns

### Button (Primary)
```jsx
<button className="px-6 md:px-7 py-3 rounded-lg md:rounded-xl bg-[#853953] text-white font-semibold hover:bg-[#612D53] transition">
  Action
</button>
```

### Card
```jsx
<div className="rounded-2xl md:rounded-3xl bg-white p-4 md:p-6 shadow-sm border border-black/5">
  Content
</div>
```

### Input
```jsx
<input className="w-full px-4 py-2.5 rounded-lg border border-black/10 focus:border-[#853953] focus:ring-1 focus:ring-[#853953] bg-[#F3F4F4]" />
```

### Grid (Responsive)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
  {/* Items */}
</div>
```

## Typography Scale
```
Display:   text-4xl md:text-5xl lg:text-6xl font-extrabold
Heading:   text-2xl md:text-3xl lg:text-4xl font-bold
Subhead:   text-lg md:text-xl font-bold
Body:      text-base md:text-lg text-[#2C2C2C]/70
Small:     text-sm text-[#2C2C2C]/60
Caption:   text-xs text-[#2C2C2C]/50
```

## Spacing Reference
```
Mobile First:
px-4 (padding horizontal)
py-3 (padding vertical)
gap-4 (spacing between items)

Then add responsive:
md:px-6 lg:px-8
md:py-4 lg:py-6
md:gap-6 lg:gap-8
```

## Shadow System
```
shadow-sm     → Subtle shadow (default for cards)
shadow-md     → Medium shadow
shadow-lg     → Large shadow (hover states)
shadow-xl     → Extra large shadow (modals/popovers)
```

## Roundness Scale
```
rounded-lg     → 8px (small elements)
rounded-xl     → 12px (medium elements)
rounded-2xl    → 16px (large cards)
rounded-3xl    → 24px (extra large sections)
```

## Opacity Variants
```
text-[#2C2C2C]/70      → 70% opacity text (secondary)
text-[#2C2C2C]/60      → 60% opacity text (tertiary)
text-[#2C2C2C]/50      → 50% opacity text (caption)
bg-[#853953]/10        → 10% opacity background (light accent)
border border-black/5  → 5% opacity border (subtle)
```

## Hover/Active States
```
hover:bg-[#612D53]      → Background color change
hover:shadow-lg         → Shadow increase
hover:scale-105         → Slight zoom (3D effect)
hover:-translate-y-1    → Move up slightly
focus:border-[#853953]  → Focus border color
focus:ring-1            → Focus ring
```

## Hide/Show Elements
```
hidden           → Hide on mobile
md:flex          → Show on tablet+
lg:block         → Show on desktop+
hidden md:flex   → Show only on tablet+
hidden lg:block  → Show only on desktop+
```

## Common Class Combinations

### Mobile-Friendly Text
```
text-3xl md:text-4xl lg:text-5xl
```

### Responsive Padding
```
px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-6
```

### Grid that adapts
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6
```

### Touch-friendly buttons
```
px-6 md:px-7 py-3 rounded-lg md:rounded-xl
```

## Color Combinations

### Text on Light Background
```
Dark text:    text-[#2C2C2C]
Secondary:    text-[#2C2C2C]/70
Tertiary:     text-[#2C2C2C]/60
Accent:       text-[#853953]
```

### Text on Dark Background (if needed)
```
Primary text: text-white
Secondary:    text-white/80
```

## Quick Copy-Paste Templates

### Full Width Section
```jsx
<section className="py-6 md:py-8 lg:py-12 px-4 md:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    {/* Content */}
  </div>
</section>
```

### Card Container
```jsx
<div className="rounded-lg md:rounded-2xl bg-white p-4 md:p-6 shadow-sm border border-black/5">
  {/* Content */}
</div>
```

### Responsive Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {items.map(item => (
    <div key={item.id} className="rounded-lg bg-white p-4 shadow-sm border border-black/5">
      {/* Item */}
    </div>
  ))}
</div>
```

---

**Files to Reference:**
- `DESIGN_SYSTEM.md` - Detailed guide
- `IMPLEMENTATION_SUMMARY.md` - What was changed
- Modified files: `Home.jsx`, `Dashboard.jsx`, `Login.jsx`, `Register.jsx`

**Remember:** Mobile First! Design for mobile, then enhance with `md:` and `lg:` breakpoints.
