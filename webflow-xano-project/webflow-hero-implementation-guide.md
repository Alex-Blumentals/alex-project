# TerraNext Hero Section - Complete Webflow Implementation Guide

## 1. Webflow Designer Structure & Hierarchy

### Section Structure
```
📦 Hero Section (hero-section)
├── 🎨 Hero Background Container (hero-bg-container)
│   └── 🖼️ Background Image (hero-bg-image)
├── 📱 Glass Header (glass-header)
│   ├── 🏠 Brand Container (brand-container)
│   │   ├── 🖼️ Logo Image (brand-logo)
│   │   └── 📝 Brand Text (brand-text)
│   ├── 🧭 Navigation Container (nav-container)
│   │   └── 📋 Nav List (nav-list)
│   │       ├── 📄 Nav Item 1 (nav-item)
│   │       ├── 📄 Nav Item 2 (nav-item)
│   │       ├── 📄 Nav Item 3 (nav-item)
│   │       └── 📄 Nav Item 4 (nav-item)
│   └── 🍔 Mobile Menu Button (mobile-menu-btn)
│       ├── ➖ Menu Line 1 (menu-line)
│       ├── ➖ Menu Line 2 (menu-line)
│       └── ➖ Menu Line 3 (menu-line)
├── 📝 Hero Content Container (hero-content)
│   ├── 🏷️ Hero Subtitle (hero-subtitle)
│   ├── 🎯 Hero Title (hero-title)
│   ├── 📄 Hero Description (hero-description)
│   └── 🎛️ CTA Button Container (cta-container)
│       ├── 🔲 Primary CTA Button (btn-primary)
│       └── 🔳 Secondary CTA Button (btn-secondary)
└── 📱 Mobile Navigation Menu (mobile-nav)
    └── 📋 Mobile Nav List (mobile-nav-list)
        ├── 📄 Mobile Nav Item 1 (mobile-nav-item)
        ├── 📄 Mobile Nav Item 2 (mobile-nav-item)
        ├── 📄 Mobile Nav Item 3 (mobile-nav-item)
        └── 📄 Mobile Nav Item 4 (mobile-nav-item)
```

### Webflow Designer Setup Steps

#### Step 1: Create Main Hero Section
1. Add a **Section** element
2. Set class name: `hero-section`
3. **Layout**: Flex, Direction: Column
4. **Size**: Height: 100vh, Min-height: 700px
5. **Position**: Relative
6. **Background**: None (we'll use a child element)

#### Step 2: Background Container
1. Add a **Div Block** inside hero-section
2. Set class name: `hero-bg-container`
3. **Position**: Absolute
4. **Size**: Width: 100%, Height: 100%
5. **Position**: Top: 0px, Left: 0px
6. **Z-index**: 1

#### Step 3: Background Image
1. Add a **Div Block** inside hero-bg-container
2. Set class name: `hero-bg-image`
3. **Position**: Absolute
4. **Size**: Width: 120%, Height: 120%
5. **Position**: Top: -10%, Left: -10%
6. **Background**: Add your hero background image
7. **Background Settings**: Cover, Center Center, Fixed

#### Step 4: Glass Header
1. Add a **Div Block** inside hero-section (after bg-container)
2. Set class name: `glass-header`
3. **Layout**: Flex, Justify: Space Between, Align: Center
4. **Position**: Relative
5. **Z-index**: 100
6. **Padding**: 20px 5% (Desktop), 15px 20px (Mobile)

#### Step 5: Brand Container
1. Add a **Div Block** inside glass-header
2. Set class name: `brand-container`
3. **Layout**: Flex, Align: Center
4. **Gap**: 12px

#### Step 6: Navigation Container
1. Add a **Div Block** inside glass-header
2. Set class name: `nav-container`
3. **Display**: Block (Desktop), None (Tablet & Mobile)

#### Step 7: Mobile Menu Button
1. Add a **Div Block** inside glass-header
2. Set class name: `mobile-menu-btn`
3. **Display**: None (Desktop), Flex (Tablet & Mobile)
4. **Layout**: Flex, Direction: Column, Justify: Center, Align: Center
5. **Size**: Width: 30px, Height: 24px
6. **Cursor**: Pointer

#### Step 8: Hero Content
1. Add a **Div Block** inside hero-section
2. Set class name: `hero-content`
3. **Layout**: Flex, Direction: Column, Justify: Center, Align: Center
4. **Position**: Relative
5. **Z-index**: 10
6. **Flex**: 1 (to take remaining space)
7. **Text Align**: Center
8. **Padding**: 0px 20px

## 2. Complete Custom CSS Code

### Fonts Import (Add to Head Custom Code)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

### Main CSS (Add to Page Settings > Custom Code > Head)
```css
<style>
/* Reset and Base Styles */
* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 700px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Background Container with Parallax */
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

/* Glass Header */
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
  -webkit-backdrop-filter: blur(30px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Brand */
.brand-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  height: 40px;
  width: auto;
}

.brand-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
}

.glass-header.scrolled .brand-text {
  color: #1a1a1a;
}

/* Navigation */
.nav-container {
  display: block;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 40px;
}

.nav-item {
  margin: 0;
}

.nav-item a {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item a:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.glass-header.scrolled .nav-item a {
  color: #4a4a4a;
}

.glass-header.scrolled .nav-item a:hover {
  color: #1a1a1a;
  background: rgba(0, 0, 0, 0.05);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 24px;
  cursor: pointer;
  z-index: 110;
}

.menu-line {
  width: 100%;
  height: 3px;
  background: white;
  margin: 2px 0;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.glass-header.scrolled .menu-line {
  background: #1a1a1a;
}

.mobile-menu-btn.active .menu-line:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.mobile-menu-btn.active .menu-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active .menu-line:nth-child(3) {
  transform: rotate(-45deg) translate(8px, -8px);
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 20px;
  animation: heroFadeIn 1.2s ease-out;
}

@keyframes heroFadeIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-subtitle {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
  letter-spacing: 0.5px;
  animation: slideInUp 1s ease-out 0.2s both;
}

.hero-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 1.1;
  color: white;
  margin-bottom: 24px;
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
  margin-bottom: 40px;
  animation: slideInUp 1s ease-out 0.6s both;
}

@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* CTA Buttons */
.cta-container {
  display: flex;
  gap: 20px;
  align-items: center;
  animation: slideInUp 1s ease-out 0.8s both;
}

.btn-primary, .btn-secondary {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  min-width: 160px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
}

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

/* Mobile Navigation */
.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 105;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-nav.active {
  opacity: 1;
  visibility: visible;
}

.mobile-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: center;
}

.mobile-nav-item {
  margin: 20px 0;
}

.mobile-nav-item a {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 24px;
  color: white;
  text-decoration: none;
  display: block;
  padding: 15px;
  transition: all 0.3s ease;
}

.mobile-nav-item a:hover {
  color: #667eea;
  transform: translateX(10px);
}

/* Responsive Design */
@media (max-width: 991px) {
  .nav-container {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .hero-title {
    font-size: clamp(2.5rem, 7vw, 4.5rem);
  }
  
  .hero-description {
    font-size: 18px;
  }
  
  .cta-container {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    min-width: 200px;
  }
  
  .glass-header {
    padding: 15px 20px;
  }
}

@media (max-width: 767px) {
  .hero-content {
    padding: 0 15px;
  }
  
  .hero-subtitle {
    font-size: 16px;
  }
  
  .hero-description {
    font-size: 16px;
  }
  
  .btn-primary, .btn-secondary {
    padding: 14px 28px;
    font-size: 15px;
  }
}

@media (max-width: 479px) {
  .hero-section {
    min-height: 600px;
  }
  
  .hero-title {
    font-size: clamp(2rem, 8vw, 3.5rem);
  }
  
  .hero-subtitle {
    font-size: 14px;
  }
  
  .hero-description {
    font-size: 15px;
  }
  
  .glass-header {
    padding: 12px 15px;
  }
  
  .brand-text {
    font-size: 20px;
  }
  
  .brand-logo {
    height: 32px;
  }
}

/* Performance Optimizations */
.hero-bg-image {
  transform: translate3d(0, 0, 0);
}

.glass-header,
.hero-content,
.btn-primary,
.btn-secondary {
  will-change: transform;
}

/* Accessibility */
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

/* Focus States */
.nav-item a:focus,
.btn-primary:focus,
.btn-secondary:focus,
.mobile-menu-btn:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
</style>
```

## 3. JavaScript for Interactions

### Add to Page Settings > Custom Code > Before </body>
```html
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Parallax scrolling effect
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
        window.addEventListener('scroll', requestTick);
    }
    
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-item a');
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
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    if (mobileNav) {
        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) {
                toggleMobileMenu();
            }
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe animated elements
    const animatedElements = document.querySelectorAll('.hero-content > *');
    animatedElements.forEach(el => observer.observe(el));
    
    // Disable parallax on mobile for performance
    function handleResize() {
        if (window.innerWidth <= 767) {
            window.removeEventListener('scroll', requestTick);
            if (heroImage) {
                heroImage.style.transform = 'none';
                heroImage.style.backgroundAttachment = 'scroll';
            }
        } else {
            window.addEventListener('scroll', requestTick);
            if (heroImage) {
                heroImage.style.backgroundAttachment = 'fixed';
            }
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Run on load
    
    // Preload critical images
    function preloadImage(src) {
        const img = new Image();
        img.src = src;
    }
    
    // Add your hero background image URL here
    // preloadImage('your-hero-background-url.jpg');
});

// Page visibility API for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});
</script>
```

## 4. Asset Preparation Checklist

### Images
- **Hero Background**: 1920x1080px minimum, WebP format preferred
- **Logo**: SVG format for scalability, fallback PNG at 120x40px
- **Optimize**: Use tools like TinyPNG or WebP converters
- **Naming**: Use descriptive names (hero-bg.webp, logo.svg)

### Image Optimization Settings
```
Hero Background:
- Format: WebP (with JPG fallback)
- Dimensions: 1920x1080px or higher
- Quality: 85% for WebP, 90% for JPG
- File size target: Under 500KB

Logo:
- Format: SVG preferred
- Fallback: PNG with 2x retina version
- Max width: 200px
- Transparent background
```

### Font Loading Strategy
The fonts are loaded from Google Fonts with preconnect for performance:
- **Primary**: Inter (weights: 300, 400, 500, 600, 700)
- **Headers**: Montserrat (weights: 300, 400, 500, 600, 700, 800, 900)

## 5. Step-by-Step Implementation Guide

### Phase 1: Designer Setup (30 minutes)

1. **Create New Page/Section**
   - Add Section element
   - Set class: `hero-section`
   - Configure layout settings as outlined above

2. **Build Structure**
   - Follow the hierarchy exactly as shown
   - Apply all class names precisely
   - Set layout properties for each element

3. **Add Content**
   - Logo image in brand container
   - Navigation links in nav list
   - Hero text content
   - Button text and links

### Phase 2: Styling Setup (45 minutes)

4. **Add Custom CSS**
   - Copy complete CSS code to Page Settings > Custom Code
   - Verify fonts are loading correctly
   - Test glass header effect

5. **Background Image**
   - Upload optimized hero background
   - Set in hero-bg-image element
   - Verify parallax positioning

6. **Mobile Responsive Check**
   - Test all breakpoints
   - Adjust spacing if needed
   - Verify mobile menu functionality

### Phase 3: JavaScript Integration (30 minutes)

7. **Add Interactions**
   - Copy JavaScript to Before </body> tag
   - Test parallax scrolling
   - Verify mobile menu toggle

8. **Performance Testing**
   - Check smooth animations
   - Test on mobile devices
   - Verify accessibility features

### Phase 4: Final Polish (15 minutes)

9. **Content Optimization**
   - Add real content and links
   - Optimize image sizes
   - Test all interactions

10. **Cross-browser Testing**
    - Chrome, Firefox, Safari
    - Mobile browsers
    - Performance audit

## 6. Mobile Responsiveness Settings

### Breakpoint Strategy
```
Desktop: 992px and up
- Full navigation visible
- Parallax effects enabled
- Large typography scale

Tablet: 768px - 991px
- Mobile menu activated
- Adjusted button layout
- Reduced parallax effect

Mobile Landscape: 480px - 767px
- Stacked button layout
- Compressed header
- Touch-optimized interactions

Mobile Portrait: 479px and below
- Minimal header height
- Compressed typography
- Simplified animations
```

### Key Mobile Adjustments

1. **Header**
   - Reduced padding: 12px 15px
   - Smaller logo: 32px height
   - Hamburger menu activation

2. **Typography**
   - Hero title: Clamp between 2rem and 3.5rem
   - Subtitle: 14px minimum
   - Description: 15px minimum

3. **Buttons**
   - Full width on mobile
   - Stacked layout
   - Touch-friendly padding

4. **Interactions**
   - Disabled parallax on mobile
   - Touch-optimized menu
   - Reduced animation complexity

## 7. Performance Optimizations

### Critical Performance Features

1. **Efficient Animations**
   - Uses `transform` and `opacity` for animations
   - `will-change` property for optimized elements
   - RequestAnimationFrame for smooth scrolling

2. **Image Optimization**
   - WebP format with fallbacks
   - Lazy loading ready
   - Proper sizing and compression

3. **CSS Optimizations**
   - Hardware acceleration with `translate3d`
   - Minimized repaints and reflows
   - Efficient selectors

4. **JavaScript Performance**
   - Throttled scroll events
   - Conditional parallax loading
   - Page visibility API integration

### Accessibility Features

- **Focus management**: Clear focus states for all interactive elements
- **Screen reader support**: Semantic HTML structure
- **Motion preferences**: Respects prefers-reduced-motion
- **Keyboard navigation**: Full keyboard accessibility
- **Color contrast**: WCAG AA compliant color combinations

## 8. Common Troubleshooting

### Issue: Parallax not working
**Solution**: Ensure `background-attachment: fixed` is supported by browser. Add fallback:
```css
@supports not (-webkit-background-attachment: fixed) {
    .hero-bg-image {
        background-attachment: scroll;
    }
}
```

### Issue: Glass effect not visible
**Solution**: Verify backdrop-filter support:
```css
@supports not (backdrop-filter: blur()) {
    .glass-header {
        background: rgba(255, 255, 255, 0.9);
    }
}
```

### Issue: Mobile menu not working
**Solution**: Check JavaScript console for errors and ensure class names match exactly.

### Issue: Performance issues
**Solution**: Disable parallax on lower-end devices:
```javascript
const isLowEndDevice = navigator.hardwareConcurrency <= 2;
if (!isLowEndDevice && window.innerWidth > 767) {
    window.addEventListener('scroll', requestTick);
}
```

## 9. Customization Options

### Color Scheme Variables
Add these CSS variables for easy customization:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --text-light: rgba(255, 255, 255, 0.9);
    --glass-bg: rgba(255, 255, 255, 0.1);
    --glass-border: rgba(255, 255, 255, 0.2);
}
```

### Animation Timing
Adjust animation speeds:
```css
:root {
    --animation-speed-fast: 0.2s;
    --animation-speed-normal: 0.3s;
    --animation-speed-slow: 0.6s;
}
```

This comprehensive guide provides everything needed to implement a modern, production-ready Hero section in Webflow with glass morphism effects, parallax scrolling, and full responsive design. The code is optimized for performance, accessibility, and cross-browser compatibility.