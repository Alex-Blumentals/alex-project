# 📄 Code Snippets & Configuration Reference

**Project:** TerraNext Webflow Implementation  
**Last Updated:** August 25, 2025  
**Purpose:** Production-ready code snippets and configuration templates

---

## 🎯 Hero Section Code Snippets

### Complete CSS Implementation (571 lines)

#### Core Hero Structure
```css
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.hero-bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-bg-image {
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  background-attachment: fixed;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  will-change: transform;
  transition: transform 0.1s linear;
}
```

#### Glass Morphism Header
```css
.glass-header {
  position: relative;
  z-index: 100;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.glass-header.scrolled {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

#### Responsive Typography
```css
.hero-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 1.1;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: slideInUp 1s ease-out 0.4s both;
}

.hero-description {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  max-width: 600px;
  animation: slideInUp 1s ease-out 0.6s both;
}
```

### Hero JavaScript (120+ lines)

#### Parallax Scrolling System
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const heroImage = document.querySelector('.hero-bg-image');
    const glassHeader = document.querySelector('.glass-header');
    let ticking = false;
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        const rate = scrollTop * -0.5;
        
        if (heroImage) {
            heroImage.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
        
        // Header scroll effect
        if (glassHeader) {
            if (scrollTop > 50) {
                glassHeader.classList.add('scrolled');
            } else {
                glassHeader.classList.remove('scrolled');
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // Only enable parallax on desktop
    if (window.innerWidth > 767) {
        window.addEventListener('scroll', requestTick, { passive: true });
    }
});
```

#### Mobile Menu System
```javascript
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
const body = document.body;

function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
    body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-nav-item a').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});
```

---

## 🎭 Problem Section Code Snippets

### Collision Animation CSS (400+ lines)

#### Split Panel System
```css
.collision-stage {
  position: relative;
  height: 80vh;
  min-height: 600px;
  margin: 60px 0;
  perspective: 1000px;
}

.left-panel, .right-panel {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  opacity: 0;
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.left-panel {
  left: 0;
  transform: translateX(-100%);
  border-radius: 0 20px 20px 0;
}

.right-panel {
  right: 0;
  transform: translateX(100%);
  border-radius: 20px 0 0 20px;
}

/* Animation Active States */
.collision-active .left-panel {
  transform: translateX(-10%);
  opacity: 1;
}

.collision-active .right-panel {
  transform: translateX(10%);
  opacity: 1;
}
```

#### Floating Chips Animation
```css
.floating-chips-container > div {
  position: absolute;
  background: rgba(255, 107, 107, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 13px;
  opacity: 0;
  transform: scale(0) rotate(0deg);
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.collision-active .chip-costos {
  opacity: 1;
  transform: scale(1) rotate(-5deg);
  transition-delay: 1.2s;
}

.collision-active .chip-danos {
  opacity: 1;
  transform: scale(1) rotate(5deg);
  transition-delay: 1.4s;
}
```

### Problem Section JavaScript (200+ lines)

#### Intersection Observer Setup
```javascript
document.addEventListener('DOMContentLoaded', function() {
    const animationConfig = {
        threshold: 0.3,
        rootMargin: '-10% 0px -10% 0px',
        duration: {
            panelSlide: 1200,
            collision: 800,
            chips: 600
        }
    };
    
    const collisionStage = document.querySelector('.collision-stage');
    let animationTriggered = false;
    
    const collisionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationTriggered) {
                triggerCollisionAnimation();
            }
        });
    }, {
        threshold: animationConfig.threshold,
        rootMargin: animationConfig.rootMargin
    });
    
    collisionObserver.observe(collisionStage);
});
```

#### Staggered Chip Animation
```javascript
function triggerCollisionAnimation() {
    if (animationTriggered || animationInProgress) return;
    
    console.log('💥 Triggering collision animation');
    animationInProgress = true;
    
    // Add collision active class
    collisionStage.classList.add('collision-active');
    
    // Floating chips animation with staggered delay
    const chips = document.querySelectorAll('.floating-chips-container > div');
    chips.forEach((chip, index) => {
        setTimeout(() => {
            chip.style.opacity = '1';
            const rotation = (index % 2 === 0 ? -1 : 1) * (Math.random() * 10 + 3);
            chip.style.transform = `scale(1) rotate(${rotation}deg)`;
        }, 1200 + (index * 200));
    });
}
```

---

## 🔧 Configuration Templates

### Google Fonts Integration
```html
<!-- Preload for performance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Font family loading -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

### CSS Custom Properties System
```css
:root {
  /* Primary Brand Colors */
  --primary-gradient-start: #667eea;
  --primary-gradient-end: #764ba2;
  --secondary-color: #ff6b6b;
  
  /* Neutral Colors */
  --text-light: rgba(255, 255, 255, 0.9);
  --text-muted: rgba(255, 255, 255, 0.8);
  --background-dark: #0a0a0a;
  --background-gradient: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  
  /* Glass Morphism */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-blur: blur(20px);
  
  /* Animation Timing */
  --timing-fast: 0.2s;
  --timing-normal: 0.3s;
  --timing-slow: 0.6s;
  --timing-collision: 1.2s;
}
```

### Responsive Breakpoint System
```css
/* Mobile First Approach */
/* Base styles: Mobile (0-479px) */

@media (min-width: 480px) {
  /* Mobile Large (480px-767px) */
  .hero-title { font-size: clamp(2.5rem, 7vw, 4.5rem); }
}

@media (min-width: 768px) {
  /* Tablet (768px-991px) */
  .nav-container { display: block; }
  .mobile-menu-btn { display: none; }
}

@media (min-width: 992px) {
  /* Desktop (992px+) */
  .hero-title { font-size: clamp(3rem, 8vw, 6rem); }
  .collision-stage { height: 80vh; }
}
```

---

## 🚀 Performance Optimization Snippets

### Hardware Acceleration Configuration
```css
/* Force GPU acceleration */
.hero-bg-image,
.left-panel,
.right-panel,
.collision-overlay {
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  transform: translate3d(0, 0, 0);
}
```

### Accessibility Compliance
```css
/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .hero-bg-image {
    background-attachment: scroll;
  }
}

/* Focus indicators */
.nav-item a:focus,
.btn-primary:focus,
.btn-secondary:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
```

### Page Visibility API Integration
```javascript
// Pause animations when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});
```

---

## 🔄 Utility Functions

### Throttled Scroll Handler
```javascript
function createThrottledScrollHandler(callback, delay = 16) {
    let ticking = false;
    
    return function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                callback();
                ticking = false;
            });
            ticking = true;
        }
    };
}

// Usage
const throttledParallax = createThrottledScrollHandler(updateParallax);
window.addEventListener('scroll', throttledParallax, { passive: true });
```

### Element Visibility Check
```javascript
function isElementInViewport(element, threshold = 0.3) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    
    return visibleHeight / elementHeight >= threshold;
}
```

### Safe Element Query
```javascript
function safeQuerySelector(selector, context = document) {
    const element = context.querySelector(selector);
    if (!element) {
        console.warn(`⚠️ Element not found: ${selector}`);
        return null;
    }
    return element;
}

// Usage
const collisionStage = safeQuerySelector('.collision-stage');
if (collisionStage) {
    // Proceed with animation setup
}
```

---

## 📱 Mobile-Specific Configurations

### Touch Event Handling
```javascript
// Mobile touch interaction
if (window.innerWidth <= 991) {
    collisionStage.addEventListener('touchstart', function(e) {
        if (!animationTriggered) {
            triggerCollisionAnimation();
        }
    }, { passive: true });
}
```

### Mobile Layout Overrides
```css
@media (max-width: 991px) {
  /* Hide desktop collision animation */
  .split-panel-container { display: none; }
  
  /* Show mobile layout */
  .mobile-collision-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: auto;
    padding: 40px 20px;
  }
  
  /* Simplify chips layout */
  .floating-chips-container {
    position: static;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 30px;
  }
}
```

---

## 🎨 Button Component System

### Primary CTA Button
```css
.btn-primary {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  padding: 16px 32px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  min-width: 160px;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
}
```

### Secondary Glass Button
```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-3px);
}
```

---

**Documentation Status:** ✅ Complete  
**Usage:** Copy-paste ready for Webflow custom code sections  
**Compatibility:** Modern browsers, mobile-optimized  
**Performance:** Hardware-accelerated, 60fps target