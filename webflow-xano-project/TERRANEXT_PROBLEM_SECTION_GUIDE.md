# 🎯 TerraNext Problem Section - Complete Webflow Implementation Guide

**Section:** "Una Colisión Inminente" - Split-Panel Collision Animation  
**Complexity:** High - Advanced scroll-triggered animations  
**Implementation Time:** 3-4 hours

---

## 1. 🏗️ Complete Section Structure & Hierarchy

### Webflow Designer Elements (Exact Hierarchy)

```
📦 Section (problema-section)
├── 🎨 Div Block (problema-container)
│   ├── 📝 Div Block (problema-header)
│   │   ├── 🏷️ Div Block (problema-badge) - "Problema" chip
│   │   ├── 🎯 Heading H2 (problema-title) - "Una Colisión Inminente"
│   │   └── 📄 Paragraph (problema-subtitle) - Infrastructure vs water crisis
│   ├── 🎭 Div Block (collision-stage) - Main animation container
│   │   ├── 📱 Div Block (split-panel-container)
│   │   │   ├── 🖼️ Div Block (left-panel)
│   │   │   │   ├── 🎨 Div Block (left-background) - Background image container
│   │   │   │   ├── 🌊 Div Block (left-overlay) - Dark overlay for contrast
│   │   │   │   └── 📝 Div Block (left-content)
│   │   │   │       ├── 🏗️ Heading H3 (left-title) - "Boom de Infraestructura"
│   │   │   │       └── 📊 Div Block (left-stats) - Optional stats/metrics
│   │   │   └── 🖼️ Div Block (right-panel)
│   │   │       ├── 🎨 Div Block (right-background) - Background image container
│   │   │       ├── 🌊 Div Block (right-overlay) - Dark overlay for contrast
│   │   │       └── 📝 Div Block (right-content)
│   │   │           ├── 💧 Heading H3 (right-title) - "Escasez Crítica de Agua"
│   │   │           └── 📊 Div Block (right-stats) - Optional stats/metrics
│   │   ├── 🎯 Div Block (collision-overlay) - Center collision text
│   │   │   ├── 💰 Heading H3 (collision-text) - "Aquí está su inversión"
│   │   │   └── ⚡ Div Block (collision-impact-line) - Visual impact line
│   │   └── 🏷️ Div Block (floating-chips-container)
│   │       ├── 💸 Div Block (chip-costos) - "Costos ocultos"
│   │       ├── ⚠️ Div Block (chip-danos) - "Daños"
│   │       ├── 👥 Div Block (chip-resistencia) - "Resistencia social"
│   │       └── 🎲 Div Block (chip-riesgo) - "Riesgo operativo"
│   └── 📱 Div Block (mobile-collision-container) - Mobile-only simplified version
│       ├── 🖼️ Div Block (mobile-infra-panel)
│       ├── 💥 Div Block (mobile-collision-indicator)
│       └── 🖼️ Div Block (mobile-water-panel)
```

---

## 2. 🎨 Complete Custom CSS Implementation

### Add to Page Settings > Custom Code > Head

```html
<style>
/* Problem Section - Split Panel Collision Animation */

.problema-section {
  position: relative;
  min-height: 100vh;
  padding: 80px 0;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
}

.problema-container {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  z-index: 10;
}

/* Header Section */
.problema-header {
  text-align: center;
  margin-bottom: 80px;
  z-index: 20;
  position: relative;
}

.problema-badge {
  display: inline-block;
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b;
  padding: 8px 20px;
  border-radius: 25px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.problema-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: white;
  margin-bottom: 20px;
  line-height: 1.2;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.problema-subtitle {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Main Collision Stage */
.collision-stage {
  position: relative;
  height: 80vh;
  min-height: 600px;
  margin: 60px 0;
  perspective: 1000px;
}

.split-panel-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Left Panel - Infrastructure Boom */
.left-panel {
  position: absolute;
  left: 0;
  top: 0;
  width: 50%;
  height: 100%;
  transform: translateX(-100%);
  opacity: 0;
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0 20px 20px 0;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.left-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  filter: brightness(0.7);
  transition: transform 0.3s ease;
}

.left-panel:hover .left-background {
  transform: scale(1.05);
}

.left-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.6) 100%);
  z-index: 2;
}

.left-content {
  position: absolute;
  bottom: 40px;
  left: 40px;
  right: 40px;
  z-index: 3;
  color: white;
}

.left-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 15px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

/* Right Panel - Water Crisis */
.right-panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
  height: 100%;
  transform: translateX(100%);
  opacity: 0;
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 20px 0 0 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.right-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  filter: brightness(0.7);
  transition: transform 0.3s ease;
}

.right-panel:hover .right-background {
  transform: scale(1.05);
}

.right-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.8) 0%, rgba(255, 165, 0, 0.6) 100%);
  z-index: 2;
}

.right-content {
  position: absolute;
  bottom: 40px;
  left: 40px;
  right: 40px;
  z-index: 3;
  color: white;
}

.right-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 15px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

/* Collision Animation Active States */
.collision-active .left-panel {
  transform: translateX(-10%);
  opacity: 1;
}

.collision-active .right-panel {
  transform: translateX(10%);
  opacity: 1;
}

/* Center Collision Overlay */
.collision-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  z-index: 10;
  text-align: center;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  min-width: 300px;
}

.collision-active .collision-overlay {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  transition-delay: 0.8s;
}

.collision-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  color: #ff6b6b;
  margin-bottom: 15px;
  text-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
}

.collision-impact-line {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ff6b6b, #ffa500);
  margin: 0 auto;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
}

/* Floating Chips Animation */
.floating-chips-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 15;
}

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
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.chip-costos {
  top: 20%;
  left: 15%;
}

.chip-danos {
  top: 30%;
  right: 20%;
}

.chip-resistencia {
  bottom: 30%;
  left: 20%;
}

.chip-riesgo {
  bottom: 20%;
  right: 15%;
}

/* Chips Active Animation */
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

.collision-active .chip-resistencia {
  opacity: 1;
  transform: scale(1) rotate(3deg);
  transition-delay: 1.6s;
}

.collision-active .chip-riesgo {
  opacity: 1;
  transform: scale(1) rotate(-3deg);
  transition-delay: 1.8s;
}

/* Collision Impact Effects */
@keyframes collisionImpact {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

.collision-impact-active .collision-overlay {
  animation: collisionImpact 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Mobile Responsive Design */
@media (max-width: 991px) {
  .split-panel-container {
    display: none;
  }
  
  .mobile-collision-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: auto;
    padding: 40px 20px;
  }
  
  .mobile-infra-panel,
  .mobile-water-panel {
    height: 200px;
    border-radius: 15px;
    overflow: hidden;
    position: relative;
    background-size: cover;
    background-position: center;
  }
  
  .mobile-collision-indicator {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 107, 107, 0.1);
    border-radius: 10px;
    border: 2px dashed rgba(255, 107, 107, 0.3);
    margin: 10px 0;
  }
  
  .floating-chips-container {
    position: static;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 30px;
  }
  
  .floating-chips-container > div {
    position: static;
    opacity: 1;
    transform: none;
    transition: none;
  }
}

@media (max-width: 767px) {
  .problema-section {
    padding: 60px 0;
  }
  
  .problema-header {
    margin-bottom: 50px;
  }
  
  .collision-stage {
    height: auto;
    min-height: auto;
  }
  
  .mobile-infra-panel,
  .mobile-water-panel {
    height: 180px;
  }
  
  .floating-chips-container > div {
    font-size: 12px;
    padding: 6px 12px;
  }
}

/* Performance Optimizations */
.left-panel,
.right-panel,
.collision-overlay {
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.left-background,
.right-background {
  will-change: transform;
  transform: translate3d(0, 0, 0);
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .left-panel,
  .right-panel,
  .collision-overlay,
  .floating-chips-container > div {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}

/* Focus States */
.collision-stage:focus-within {
  outline: 2px solid #667eea;
  outline-offset: 4px;
  border-radius: 10px;
}
</style>
```

---

## 3. ⚡ JavaScript Animation Implementation

### Add to Page Settings > Custom Code > Before </body>

```html
<script>
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Initializing Problem Section Collision Animation...');
    
    // Animation configuration
    const animationConfig = {
        threshold: 0.3,
        rootMargin: '-10% 0px -10% 0px',
        duration: {
            panelSlide: 1200,
            collision: 800,
            chips: 600
        },
        easing: {
            panels: 'cubic-bezier(0.4, 0, 0.2, 1)',
            collision: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            chips: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }
    };
    
    // Get DOM elements
    const collisionStage = document.querySelector('.collision-stage');
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    const collisionOverlay = document.querySelector('.collision-overlay');
    const chips = document.querySelectorAll('.floating-chips-container > div');
    
    // Check if elements exist
    if (!collisionStage) {
        console.warn('⚠️ Collision stage element not found');
        return;
    }
    
    // Animation state
    let animationTriggered = false;
    let animationInProgress = false;
    
    // Collision animation function
    function triggerCollisionAnimation() {
        if (animationTriggered || animationInProgress) return;
        
        console.log('💥 Triggering collision animation');
        animationInProgress = true;
        
        // Add collision active class
        collisionStage.classList.add('collision-active');
        
        // Panel slide animation
        setTimeout(() => {
            // Add impact effect
            if (collisionOverlay) {
                collisionOverlay.classList.add('collision-impact-active');
            }
        }, 800);
        
        // Floating chips animation with staggered delay
        chips.forEach((chip, index) => {
            setTimeout(() => {
                chip.style.opacity = '1';
                chip.style.transform = `scale(1) rotate(${(index % 2 === 0 ? -1 : 1) * (Math.random() * 10 + 3)}deg)`;
            }, 1200 + (index * 200));
        });
        
        // Mark animation as triggered
        setTimeout(() => {
            animationTriggered = true;
            animationInProgress = false;
        }, 2000);
    }
    
    // Reset animation function (for testing)
    function resetCollisionAnimation() {
        console.log('🔄 Resetting collision animation');
        animationTriggered = false;
        animationInProgress = false;
        
        collisionStage.classList.remove('collision-active');
        if (collisionOverlay) {
            collisionOverlay.classList.remove('collision-impact-active');
        }
        
        chips.forEach(chip => {
            chip.style.opacity = '0';
            chip.style.transform = 'scale(0) rotate(0deg)';
        });
    }
    
    // Intersection Observer for scroll trigger
    const observerOptions = {
        threshold: animationConfig.threshold,
        rootMargin: animationConfig.rootMargin
    };
    
    const collisionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationTriggered) {
                // Trigger collision animation
                triggerCollisionAnimation();
            } else if (!entry.isIntersecting && window.innerWidth <= 991) {
                // Reset on mobile when scrolling away
                resetCollisionAnimation();
            }
        });
    }, observerOptions);
    
    // Start observing
    collisionObserver.observe(collisionStage);
    
    // Advanced scroll-based animation (optional enhancement)
    function updateScrollAnimation() {
        if (animationTriggered || window.innerWidth <= 991) return;
        
        const rect = collisionStage.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
        
        // Calculate scroll progress
        const scrollProgress = Math.max(0, Math.min(1, 
            (viewportHeight - elementTop) / (viewportHeight + rect.height)
        ));
        
        if (scrollProgress > 0.3 && scrollProgress < 0.8) {
            // Update panel positions based on scroll
            const panelProgress = (scrollProgress - 0.3) / 0.5; // Normalize to 0-1
            
            if (leftPanel && rightPanel) {
                leftPanel.style.transform = `translateX(${-100 + (panelProgress * 90)}%)`;
                leftPanel.style.opacity = panelProgress;
                
                rightPanel.style.transform = `translateX(${100 - (panelProgress * 90)}%)`;
                rightPanel.style.opacity = panelProgress;
            }
        }
    }
    
    // Throttled scroll handler
    let scrollTicking = false;
    function handleScroll() {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                updateScrollAnimation();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }
    
    // Add scroll listener for enhanced animation
    if (window.innerWidth > 991) {
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // Particle effect for collision impact (optional)
    function createCollisionParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 20;
        `;
        
        collisionStage.appendChild(particleContainer);
        
        // Create particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 * i) / 15;
            const velocity = 50 + Math.random() * 100;
            
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: linear-gradient(45deg, #ff6b6b, #ffa500);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: particleExplosion 1.5s ease-out forwards;
            `;
            
            // Add particle animation
            particle.style.setProperty('--dx', `${Math.cos(angle) * velocity}px`);
            particle.style.setProperty('--dy', `${Math.sin(angle) * velocity}px`);
            
            particleContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => particle.remove(), 1500);
        }
        
        // Remove container after all particles are gone
        setTimeout(() => particleContainer.remove(), 1600);
    }
    
    // Add particle explosion CSS
    const particleCSS = `
        @keyframes particleExplosion {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }
            50% {
                transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1);
                opacity: 0.8;
            }
            100% {
                transform: translate(calc(-50% + var(--dx) * 2), calc(-50% + var(--dy) * 2)) scale(0);
                opacity: 0;
            }
        }
    `;
    
    // Add particle CSS to document
    const style = document.createElement('style');
    style.textContent = particleCSS;
    document.head.appendChild(style);
    
    // Trigger particles on collision
    setTimeout(() => {
        if (animationTriggered) {
            createCollisionParticles();
        }
    }, 1000);
    
    // Mobile touch handling
    if (window.innerWidth <= 991) {
        collisionStage.addEventListener('touchstart', function(e) {
            if (!animationTriggered) {
                triggerCollisionAnimation();
            }
        }, { passive: true });
    }
    
    // Resize handler
    function handleResize() {
        if (window.innerWidth <= 991) {
            // Mobile mode - reset and disable scroll animation
            window.removeEventListener('scroll', handleScroll);
            resetCollisionAnimation();
        } else if (window.innerWidth > 991 && !animationTriggered) {
            // Desktop mode - enable scroll animation
            window.addEventListener('scroll', handleScroll, { passive: true });
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Performance monitoring
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 16.67) { // More than 60fps
                console.warn(`⚠️ Animation frame took ${entry.duration.toFixed(2)}ms`);
            }
        }
    });
    
    if ('PerformanceObserver' in window) {
        perfObserver.observe({ entryTypes: ['measure'] });
    }
    
    // Debug functions (remove in production)
    window.debugCollision = {
        trigger: triggerCollisionAnimation,
        reset: resetCollisionAnimation,
        particles: createCollisionParticles
    };
    
    console.log('✅ Problem section collision animation initialized');
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

---

## 4. 📝 Step-by-Step Webflow Implementation

### Phase 1: Structure Setup (60 minutes)

#### Step 1: Create Main Section
1. Add **Section** element
2. Set class name: `problema-section`
3. **Settings:**
   - Height: Auto
   - Padding: 80px top/bottom, 0px left/right
   - Position: Relative
   - Overflow: Hidden

#### Step 2: Container Setup
1. Add **Div Block** inside section
2. Class name: `problema-container`
3. **Settings:**
   - Max-width: 1400px
   - Margin: Auto (center)
   - Padding: 0px 20px
   - Position: Relative

#### Step 3: Header Elements
1. Add **Div Block** for header
2. Class name: `problema-header`
3. Add elements inside header:
   - **Div Block** → Class: `problema-badge` → Text: "Problema"
   - **Heading H2** → Class: `problema-title` → Text: "Una Colisión Inminente"
   - **Paragraph** → Class: `problema-subtitle` → Your subtitle text

#### Step 4: Collision Stage Container
1. Add **Div Block** after header
2. Class name: `collision-stage`
3. **Settings:**
   - Height: 80vh
   - Min-height: 600px
   - Position: Relative
   - Margin: 60px top/bottom, 0px left/right

#### Step 5: Split Panel Container
1. Add **Div Block** inside collision-stage
2. Class name: `split-panel-container`
3. **Settings:**
   - Width: 100%
   - Height: 100%
   - Position: Relative
   - Display: Flex
   - Align Items: Center
   - Justify Content: Center

### Phase 2: Panel Structure (45 minutes)

#### Step 6: Left Panel Setup
1. Add **Div Block** inside split-panel-container
2. Class name: `left-panel`
3. **Settings:**
   - Position: Absolute
   - Left: 0px
   - Top: 0px
   - Width: 50%
   - Height: 100%
   - Border Radius: 0px 20px 20px 0px
   - Overflow: Hidden

#### Step 7: Left Panel Components
Inside left-panel, add:
1. **Div Block** → Class: `left-background`
   - Position: Absolute, full size
   - **Background Image:** Add your infrastructure image
   - Background: Cover, Center Center
2. **Div Block** → Class: `left-overlay`
   - Position: Absolute, full size
3. **Div Block** → Class: `left-content`
   - Position: Absolute
   - Bottom: 40px, Left/Right: 40px
   - Add **Heading H3** → Class: `left-title` → Text: "Boom de Infraestructura en España"

#### Step 8: Right Panel Setup
1. Add **Div Block** inside split-panel-container
2. Class name: `right-panel`
3. **Settings:** Mirror left panel but:
   - Position: Right: 0px
   - Border Radius: 20px 0px 0px 20px

#### Step 9: Right Panel Components
Inside right-panel, add:
1. **Div Block** → Class: `right-background`
   - **Background Image:** Add your water crisis image
2. **Div Block** → Class: `right-overlay`
3. **Div Block** → Class: `right-content`
   - Add **Heading H3** → Class: `right-title` → Text: "Escasez Crítica de Agua"

### Phase 3: Collision Overlay (30 minutes)

#### Step 10: Center Collision Text
1. Add **Div Block** inside collision-stage (after split-panel-container)
2. Class name: `collision-overlay`
3. Add inside:
   - **Heading H3** → Class: `collision-text` → Text: "Aquí está su inversión"
   - **Div Block** → Class: `collision-impact-line`

#### Step 11: Floating Chips Container
1. Add **Div Block** inside collision-stage
2. Class name: `floating-chips-container`
3. Add 4 **Div Blocks** inside with classes:
   - `chip-costos` → Text: "Costos ocultos"
   - `chip-danos` → Text: "Daños"
   - `chip-resistencia` → Text: "Resistencia social"
   - `chip-riesgo` → Text: "Riesgo operativo"

### Phase 4: Mobile Layout (30 minutes)

#### Step 12: Mobile Container
1. Add **Div Block** inside problema-container
2. Class name: `mobile-collision-container`
3. **Settings:**
   - Display: None (desktop)
   - Display: Flex (tablet/mobile)
   - Flex Direction: Column
   - Gap: 20px

#### Step 13: Mobile Panels
Add inside mobile-collision-container:
1. **Div Block** → Class: `mobile-infra-panel`
   - Height: 200px
   - Background: Your infrastructure image
2. **Div Block** → Class: `mobile-collision-indicator`
   - Height: 60px
   - Text: "⚡ COLLISION POINT ⚡"
3. **Div Block** → Class: `mobile-water-panel`
   - Height: 200px
   - Background: Your water crisis image

### Phase 5: Code Integration (30 minutes)

#### Step 14: Add Custom CSS
1. Go to **Page Settings > Custom Code > Head**
2. Copy and paste the complete CSS code from section 2
3. **Publish** and test basic styling

#### Step 15: Add JavaScript
1. Go to **Page Settings > Custom Code > Before </body>**
2. Copy and paste the complete JavaScript code from section 3
3. **Publish** and test animations

#### Step 16: Background Images Setup
1. Upload optimized images:
   - Infrastructure image: Construction, buildings, urban development
   - Water crisis image: Drought, empty reservoirs, cracked earth
2. Set background images in Webflow:
   - Left-background: Infrastructure image
   - Right-background: Water crisis image
   - Mobile panels: Same images

---

## 5. 🖼️ Background Image Requirements

### Image Specifications

#### Left Panel - Infrastructure Boom
- **Dimensions:** 1200x800px minimum
- **Format:** WebP with JPG fallback
- **Content:** Spanish construction boom imagery
  - Modern buildings under construction
  - Cranes and urban development
  - Infrastructure projects
  - Bright, optimistic color palette
- **File Size:** <400KB
- **Aspect Ratio:** 3:2 or 4:3

#### Right Panel - Water Crisis  
- **Dimensions:** 1200x800px minimum
- **Format:** WebP with JPG fallback
- **Content:** Water scarcity imagery
  - Drought conditions
  - Empty reservoirs
  - Cracked earth
  - Darker, warning color palette
- **File Size:** <400KB
- **Aspect Ratio:** 3:2 or 4:3

### Image Optimization
```bash
# Recommended optimization settings
WebP Quality: 85%
JPG Quality: 90%
Compression: Moderate
Color Space: sRGB
```

---

## 6. 📱 Mobile Responsiveness Strategy

### Breakpoint Behavior

#### Desktop (992px+)
- Full split-panel collision animation
- Floating chips appear around collision point
- Scroll-triggered reveal effect
- Hover effects on panels

#### Tablet (768px-991px)
- Simplified collision animation
- Reduced floating chips
- Touch-friendly interactions

#### Mobile (767px and below)
- Stacked layout replaces split panels
- Simple collision indicator between panels
- Chips displayed as static elements below
- Touch-triggered animations

### Mobile-Specific Code
```css
/* Mobile adaptations already included in main CSS */
@media (max-width: 767px) {
  .split-panel-container { display: none; }
  .mobile-collision-container { display: flex; }
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

## 7. 🧪 Testing & Quality Assurance

### Performance Testing Checklist
- [ ] **60fps Animation** - Use browser DevTools performance tab
- [ ] **Memory Usage** - Monitor for memory leaks during animation
- [ ] **Mobile Performance** - Test on actual devices
- [ ] **Battery Impact** - Reasonable power consumption
- [ ] **Loading Speed** - Images load quickly, animation doesn't block

### Cross-Browser Testing
- [ ] **Chrome** - Full animation support
- [ ] **Firefox** - Backdrop-filter compatibility  
- [ ] **Safari** - iOS/macOS animation performance
- [ ] **Edge** - Windows compatibility

### Accessibility Testing
- [ ] **Keyboard Navigation** - Can be navigated without mouse
- [ ] **Screen Readers** - Proper content announcement
- [ ] **Reduced Motion** - Respects user preferences
- [ ] **Focus Management** - Clear focus indicators

### Animation Testing
- [ ] **Scroll Trigger** - Activates at correct scroll position
- [ ] **Panel Collision** - Smooth slide-in from both sides  
- [ ] **Center Text** - Appears with scaling effect
- [ ] **Floating Chips** - Staggered appearance with rotation
- [ ] **Mobile Alternative** - Works on touch devices

---

## 8. 🚀 Launch Checklist

### Pre-Launch Validation
- [ ] All background images optimized and uploaded
- [ ] CSS code added to page head
- [ ] JavaScript code added to page footer
- [ ] Desktop animation works smoothly
- [ ] Mobile layout displays correctly
- [ ] All text content in Spanish as specified
- [ ] Cross-browser compatibility verified
- [ ] Performance metrics acceptable (90+ Lighthouse)

### Post-Launch Monitoring
- [ ] User interaction tracking
- [ ] Animation performance metrics
- [ ] Mobile usage patterns
- [ ] Load time optimization

---

## 9. 🛠️ Troubleshooting Common Issues

### Animation Not Triggering
```javascript
// Debug console commands
window.debugCollision.trigger(); // Force trigger animation
window.debugCollision.reset();   // Reset to test again
```

### Performance Issues
```css
/* Add to CSS if performance is poor */
.collision-stage * {
  will-change: auto; /* Remove will-change after animation */
}
```

### Mobile Layout Problems
```css
/* Force mobile layout for testing */
.split-panel-container { display: none !important; }
.mobile-collision-container { display: flex !important; }
```

---

**Implementation Status:** Ready for Development  
**Estimated Total Time:** 3-4 hours  
**Complexity:** High - Advanced scroll animations with collision effects

This implementation creates a sophisticated split-panel collision animation that reveals the investment conflict in your TerraNext landing page, complete with floating risk indicators and smooth mobile adaptation.