# Problem Section Implementation Guide

**Section:** Problem - Split-Panel Collision Animation  
**Spanish Content:** "Una Colisión Inminente"  
**Animation:** Infrastructure vs Water Crisis collision effect  
**Complexity:** Very High (Expert level)

---

## 🎯 Webflow Designer Structure

### Main Section Element
```
Problem Section (Section)
├── Problema Container (Div Block)
│   ├── Problema Header (Div Block)
│   │   ├── Problema Badge (Text Block) - "Problema"
│   │   ├── Problema Title (Heading 2) - "Una Colisión Inminente"
│   │   └── Problema Subtitle (Paragraph) - Description text
│   └── Collision Stage (Div Block)
│       ├── Split Panel Container (Div Block)
│       │   ├── Left Panel (Div Block)
│       │   │   ├── Left Background (Div Block)
│       │   │   ├── Left Overlay (Div Block)
│       │   │   └── Left Content (Div Block)
│       │   │       └── Left Title (Heading 3) - "Auge de Infraestructura"
│       │   └── Right Panel (Div Block)
│       │       ├── Right Background (Div Block)
│       │       ├── Right Overlay (Div Block)
│       │       └── Right Content (Div Block)
│       │           └── Right Title (Heading 3) - "Crisis Hídrica"
│       ├── Collision Overlay (Div Block)
│       │   ├── Collision Text (Heading 4) - "Una Colisión Inminente"
│       │   └── Collision Impact Line (Div Block)
│       └── Floating Chips Container (Div Block)
│           ├── Chip Costos (Div Block) - "Costos ocultos"
│           ├── Chip Daños (Div Block) - "Daños"
│           ├── Chip Resistencia (Div Block) - "Resistencia social"
│           └── Chip Riesgo (Div Block) - "Riesgo operativo"
```

---

## 🎨 CSS Classes to Assign

### Section Structure
- **Section Element**: `problema-section`
- **Main Container**: `problema-container`

### Header Elements
- **Header Container**: `problema-header`
- **Badge Element**: `problema-badge`
- **Main Title**: `problema-title`
- **Subtitle**: `problema-subtitle`

### Animation Stage
- **Animation Container**: `collision-stage`
- **Panel Container**: `split-panel-container`
- **Left Panel**: `left-panel`
- **Right Panel**: `right-panel`

### Panel Components
- **Backgrounds**: `left-background`, `right-background`
- **Color Overlays**: `left-overlay`, `right-overlay`
- **Content Areas**: `left-content`, `right-content`
- **Panel Titles**: `left-title`, `right-title`

### Collision Effects
- **Center Overlay**: `collision-overlay`
- **Impact Text**: `collision-text`
- **Accent Line**: `collision-impact-line`

### Floating Chips
- **Chips Container**: `floating-chips-container`
- **Individual Chips**: `chip-costos`, `chip-danos`, `chip-resistencia`, `chip-riesgo`

---

## 🖼️ Background Images Setup

### Left Panel Background
1. Upload infrastructure boom image to Webflow
2. Apply to `.left-background` element
3. Set background-size: cover
4. Set background-position: center

### Right Panel Background
1. Upload water crisis image to Webflow
2. Apply to `.right-background` element
3. Set background-size: cover
4. Set background-position: center

### Image Requirements
- Format: WebP preferred, JPEG fallback
- Size: 1920x1080px minimum
- Optimization: Compress for web (under 500KB each)
- Alt text: Descriptive for accessibility

---

## 📱 Responsive Behavior

### Desktop (992px+)
- Full collision animation with sliding panels
- Floating chips appear around collision point
- 3D perspective effects and hover states

### Tablet (768px - 991px)
- Stacked mobile layout activates
- Static panels replace collision animation
- Chips display in horizontal row

### Mobile (479px - 767px)
- Simplified mobile collision indicator
- Touch interaction triggers animation
- Reduced panel heights for mobile viewing

---

## ⚡ Performance Features

### Hardware Acceleration
- GPU-accelerated transforms with `translate3d()`
- `will-change` properties for animated elements
- `backface-visibility: hidden` for smoother animations

### Intersection Observer
- Scroll-triggered animation at 30% visibility
- Prevents unnecessary animation on page load
- Mobile-optimized touch interactions

### Accessibility
- Respects `prefers-reduced-motion` setting
- Keyboard navigation support
- Screen reader compatible structure

---

## 🔧 Testing Checklist

### Animation Functionality
- [ ] Panels slide in from opposite sides on scroll
- [ ] Center collision text appears with scaling effect
- [ ] Floating chips animate with staggered timing
- [ ] Animation only triggers once per page visit
- [ ] Hover effects work on panel backgrounds

### Responsive Testing
- [ ] Desktop collision animation works smoothly
- [ ] Mobile switches to stacked layout
- [ ] Touch interaction triggers animation on mobile
- [ ] All text remains readable at all breakpoints

### Performance Validation
- [ ] No layout shifts during animation
- [ ] Smooth 60fps animation performance
- [ ] Console shows no JavaScript errors
- [ ] Images load correctly for both panels

### Cross-Browser Testing
- [ ] Chrome: Full animation support
- [ ] Firefox: Backdrop-filter fallbacks work
- [ ] Safari: Hardware acceleration functions
- [ ] Edge: All CSS features supported

---

## 🚀 Implementation Steps

### Step 1: Create Section Structure
1. Add new Section element to page
2. Add class `problema-section`
3. Set min-height: 100vh
4. Apply dark gradient background

### Step 2: Build Header
1. Create header div with class `problema-header`
2. Add badge, title, and subtitle elements
3. Apply typography and spacing classes
4. Center-align all header content

### Step 3: Create Animation Stage
1. Add collision stage div with class `collision-stage`
2. Set up split panel container
3. Create left and right panel structures
4. Apply positioning and initial transform states

### Step 4: Add Content
1. Insert Spanish text content for each panel
2. Add collision overlay with impact text
3. Create floating chips with risk indicators
4. Apply proper z-index layering

### Step 5: Apply CSS
1. Copy CSS from `problem-section.css`
2. Paste into page-specific or site-wide custom code
3. Test animation triggers and timings
4. Adjust responsive breakpoints if needed

### Step 6: Add JavaScript
1. Copy JavaScript from `problem-section.js`
2. Paste into footer custom code section
3. Test scroll-triggered animation
4. Verify mobile touch interactions

### Step 7: Add Images
1. Upload and optimize background images
2. Apply to left and right background elements
3. Test image loading and positioning
4. Verify mobile image display

### Step 8: Final Testing
1. Test full animation sequence
2. Verify responsive behavior
3. Check performance with DevTools
4. Validate accessibility features

---

## 🎯 Spanish Content

### Main Title
**"Una Colisión Inminente"**
*Translation: "An Imminent Collision"*

### Left Panel
**"Auge de Infraestructura"**
*Translation: "Infrastructure Boom"*

### Right Panel
**"Crisis Hídrica"**
*Translation: "Water Crisis"*

### Floating Chips
- **"Costos ocultos"** - *Hidden costs*
- **"Daños"** - *Damage*
- **"Resistencia social"** - *Social resistance*
- **"Riesgo operativo"** - *Operational risk*

---

**Implementation Status:** ✅ Ready for Webflow Integration  
**Estimated Setup Time:** 45-60 minutes  
**Difficulty Level:** Expert (requires advanced CSS/JS knowledge)