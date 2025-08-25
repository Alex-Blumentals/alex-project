# 🔧 Animation Debugging Guide - Problem Section

**Issue:** Problem section collision animation not working  
**Date:** August 25, 2025  
**Status:** Troubleshooting in progress

---

## 🚨 Quick Diagnostic Checklist

### 1. Browser Console Check
**Open Chrome DevTools (F12) → Console tab**

Look for these messages:
```javascript
✅ Expected: "🎯 Initializing Problem Section..."
✅ Expected: "💥 Triggering collision animation" (on scroll)
❌ Error: "⚠️ Collision stage element not found"
❌ Error: JavaScript errors or warnings
```

### 2. HTML Structure Verification
**Check that these elements exist in your Webflow page:**

```html
<!-- Required HTML structure -->
<section class="problema-section">
  <div class="problema-container">
    <div class="collision-stage">
      <div class="split-panel-container">
        <div class="left-panel">
          <div class="left-background"></div>
          <div class="left-overlay"></div>
          <div class="left-content">
            <h3 class="left-title">Auge de Infraestructura</h3>
          </div>
        </div>
        <div class="right-panel">
          <div class="right-background"></div>
          <div class="right-overlay"></div>
          <div class="right-content">
            <h3 class="right-title">Crisis Hídrica</h3>
          </div>
        </div>
      </div>
      <div class="collision-overlay">
        <h4 class="collision-text">Una Colisión Inminente</h4>
        <div class="collision-impact-line"></div>
      </div>
      <div class="floating-chips-container">
        <div class="chip-costos">Costos ocultos</div>
        <div class="chip-danos">Daños</div>
        <div class="chip-resistencia">Resistencia social</div>
        <div class="chip-riesgo">Riesgo operativo</div>
      </div>
    </div>
  </div>
</section>
```

### 3. CSS Classes Assignment Check
**In Webflow Designer, verify each element has the correct class:**

- Section element: `problema-section`
- Main container: `problema-container` 
- Animation stage: `collision-stage`
- Panel container: `split-panel-container`
- Left/right panels: `left-panel`, `right-panel`
- Collision overlay: `collision-overlay`
- Chips container: `floating-chips-container`

---

## 🔍 Step-by-Step Debugging

### Step 1: Test JavaScript Loading
Add this temporary code to your page footer to test if JS is loading:

```javascript
<script>
console.log('🧪 Testing JavaScript execution...');
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧪 DOM loaded successfully');
    
    // Test element existence
    const collisionStage = document.querySelector('.collision-stage');
    if (collisionStage) {
        console.log('✅ Collision stage found');
    } else {
        console.log('❌ Collision stage NOT found');
    }
    
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    console.log('Left panel found:', !!leftPanel);
    console.log('Right panel found:', !!rightPanel);
});
</script>
```

### Step 2: Manual Animation Trigger Test
Add this debug code to manually trigger the animation:

```javascript
<script>
// Manual trigger for testing
window.debugCollisionTest = function() {
    console.log('🧪 Manual animation trigger test');
    
    const collisionStage = document.querySelector('.collision-stage');
    if (collisionStage) {
        collisionStage.classList.add('collision-active');
        console.log('✅ Added collision-active class');
    } else {
        console.log('❌ Cannot find collision-stage element');
    }
};

// Run manual test after 2 seconds
setTimeout(() => {
    console.log('🧪 Running automatic test...');
    window.debugCollisionTest();
}, 2000);
</script>
```

### Step 3: CSS Animation Test
Add this simplified CSS to test basic panel movement:

```css
<style>
/* Debug CSS - simplified version */
.collision-stage {
    background: red; /* Temporary - should see red background */
    min-height: 400px;
    position: relative;
}

.left-panel, .right-panel {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    background: blue; /* Temporary - should see blue panels */
    transition: transform 2s ease; /* Slower for testing */
}

.left-panel {
    left: 0;
    transform: translateX(-100%);
}

.right-panel {
    right: 0;
    transform: translateX(100%);
}

/* Test animation - should see panels slide in */
.collision-active .left-panel {
    transform: translateX(0%);
}

.collision-active .right-panel {
    transform: translateX(0%);
}
</style>
```

---

## 🛠️ Common Issues & Solutions

### Issue 1: "Collision stage element not found"
**Cause:** CSS class not assigned or HTML structure missing

**Solution:**
1. In Webflow Designer, select your section element
2. Add class `problema-section` in the Style panel
3. Select the inner div that will contain the animation
4. Add class `collision-stage`

### Issue 2: Animation triggers but nothing visible happens
**Cause:** CSS not loaded or class conflicts

**Solution:**
1. Check that Problem section CSS is added to page custom code
2. Verify no CSS class name conflicts
3. Use browser DevTools → Elements tab to inspect applied styles

### Issue 3: Animation works on desktop but not mobile
**Cause:** Mobile layout CSS hiding animation elements

**Solution:**
```css
/* Ensure animation works on all devices */
@media (max-width: 991px) {
  .split-panel-container {
    display: flex !important; /* Force display for testing */
  }
}
```

### Issue 4: Intersection Observer not triggering
**Cause:** Element not in viewport or observer configuration issues

**Solution:**
```javascript
// More aggressive observer settings for testing
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        console.log('🧪 Intersection ratio:', entry.intersectionRatio);
        if (entry.intersectionRatio > 0) {
            triggerCollisionAnimation();
        }
    });
}, { 
    threshold: [0, 0.1, 0.2, 0.3], // Multiple thresholds
    rootMargin: '0px' // No margin for testing
});
```

---

## 🚀 Quick Fix Solution

If animation still not working, try this simplified version:

### Minimal Working HTML Structure
```html
<section class="test-collision">
  <div class="test-stage">
    <div class="test-left">LEFT PANEL</div>
    <div class="test-right">RIGHT PANEL</div>
  </div>
</section>
```

### Minimal Working CSS
```css
<style>
.test-collision {
  height: 100vh;
  background: #000;
  position: relative;
  overflow: hidden;
}

.test-stage {
  position: relative;
  width: 100%;
  height: 100%;
}

.test-left, .test-right {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  transition: transform 2s ease;
}

.test-left {
  left: 0;
  background: blue;
  transform: translateX(-100%);
}

.test-right {
  right: 0;
  background: red;
  transform: translateX(100%);
}

.test-collision.active .test-left {
  transform: translateX(0);
}

.test-collision.active .test-right {
  transform: translateX(0);
}
</style>
```

### Minimal Working JavaScript
```javascript
<script>
document.addEventListener('DOMContentLoaded', function() {
    const section = document.querySelector('.test-collision');
    
    // Trigger animation after 2 seconds
    setTimeout(() => {
        if (section) {
            section.classList.add('active');
            console.log('✅ Animation triggered!');
        }
    }, 2000);
    
    // Also trigger on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.5 });
    
    if (section) {
        observer.observe(section);
    }
});
</script>
```

---

## 📞 Immediate Action Plan

**Try these in order:**

1. **Add debug JavaScript** (Step 1) → Check console for errors
2. **Verify HTML structure** → Ensure all classes are assigned
3. **Test with simplified CSS** (Step 3) → See if basic movement works
4. **Use manual trigger** (Step 2) → Force animation without scroll
5. **Try minimal version** → Use quick fix solution above

**Report back with:**
- What you see in the browser console
- Whether manual trigger works
- Whether simplified version works
- Any error messages

This will help me provide a specific solution for your setup.