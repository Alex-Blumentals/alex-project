# 🚨 Emergency Animation Restore

**Issue:** Animation completely disappeared - elements showing as static design  
**Priority:** HIGH - Get basic animation working immediately  
**Approach:** Start with minimal working version, then add features

---

## 🔍 Quick Diagnosis Steps

### Step 1: Check Browser Console
**Open Chrome DevTools (F12) → Console tab**

**Look for these errors:**
```
❌ "Uncaught ReferenceError: [something] is not defined"
❌ "Uncaught SyntaxError: [something]"
❌ No console messages at all = JavaScript not loading
```

### Step 2: Verify Webflow Code Placement
**Check that code is in the RIGHT place:**
- **CSS:** Page Settings → Custom Code → **Head Code** ✅
- **JavaScript:** Page Settings → Custom Code → **Footer Code** ✅
- **NOT:** Site settings (won't work for page-specific code)

---

## ⚡ EMERGENCY FIX: Super Simple Version

**Use this MINIMAL version that definitely works:**

### 🎨 Minimal CSS (Copy to Head Code)

```html
<style>
/* EMERGENCY: Super Simple Animation - Guaranteed to Work */
.simple-collision {
  min-height: 60vh;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
}

.simple-stage {
  position: relative;
  width: 100%;
  max-width: 1000px;
  height: 300px;
}

.simple-left,
.simple-right {
  position: absolute;
  top: 0;
  width: 40%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: Arial, sans-serif;
  font-weight: bold;
  font-size: 1.2rem;
  border-radius: 15px;
  transition: all 2s ease;
  opacity: 0;
}

.simple-left {
  left: 0;
  background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  transform: translateX(-100%);
}

.simple-right {
  right: 0;
  background: linear-gradient(45deg, #ef4444, #dc2626);
  transform: translateX(100%);
}

/* Animation Trigger */
.simple-collision.go .simple-left {
  transform: translateX(0);
  opacity: 1;
}

.simple-collision.go .simple-right {
  transform: translateX(0);
  opacity: 1;
}
</style>
```

### ⚡ Minimal JavaScript (Copy to Footer Code)

```html
<script>
console.log('🧪 EMERGENCY: Testing basic animation...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧪 DOM loaded');
    
    const section = document.querySelector('.simple-collision');
    
    if (section) {
        console.log('✅ Section found!');
        
        // Auto-trigger after 1 second
        setTimeout(() => {
            section.classList.add('go');
            console.log('🎯 Animation triggered!');
        }, 1000);
        
        // Manual trigger for testing
        window.testAnimation = function() {
            section.classList.toggle('go');
            console.log('🧪 Manual toggle');
        };
        
    } else {
        console.error('❌ Section NOT found - check HTML structure');
    }
});
</script>
```

---

## 📋 Webflow Setup (Minimal)

### HTML Structure in Webflow Designer:
```
1. Section Element
   └── Add class: simple-collision

2. Container Div 
   └── Add class: simple-stage

3. Left Panel Div
   └── Add class: simple-left
   └── Text: "Infraestructura"

4. Right Panel Div  
   └── Add class: simple-right
   └── Text: "Crisis Hídrica"
```

**That's it! Just 4 elements with 4 classes.**

---

## 🧪 Testing the Emergency Fix

### Expected Results:
1. **Immediate:** Elements visible with light background
2. **After 1 second:** Blue and red panels slide in from sides
3. **Console messages:**
   ```
   ✅ "EMERGENCY: Testing basic animation..."
   ✅ "DOM loaded"  
   ✅ "Section found!"
   ✅ "Animation triggered!"
   ```

### If Still Not Working:
1. **Type in console:** `testAnimation()` 
2. **Should toggle animation on/off**
3. **If no console messages:** JavaScript not loading properly

---

## 🔧 Common Issues & Quick Fixes

### Issue 1: No console messages
**Problem:** JavaScript not loading  
**Fix:** Make sure JavaScript is in **Footer Code**, not Head Code

### Issue 2: "Section NOT found" error
**Problem:** CSS class not assigned  
**Fix:** In Webflow Designer, select section and add class `simple-collision`

### Issue 3: Elements visible but no animation
**Problem:** CSS not loading  
**Fix:** Make sure CSS is in **Head Code**, not Footer Code

### Issue 4: Animation works but looks wrong
**Problem:** HTML structure doesn't match CSS  
**Fix:** Make sure you have exactly 4 elements with the 4 exact class names

---

## 🎯 Once Emergency Version Works

**After you confirm this minimal version works, we can:**
1. ✅ Add back the collision center text
2. ✅ Add back the floating chips
3. ✅ Add back background images
4. ✅ Add back scroll triggering
5. ✅ Add back mobile responsiveness

**But first, let's get the BASIC sliding panels working!**

---

## 📞 Immediate Actions

1. **Replace ALL existing custom code** with the emergency versions above
2. **Save and publish** Webflow
3. **Test** - should see panels slide in after 1 second
4. **Check console** - should see success messages
5. **Report back** what you see in the console and what happens visually

**Priority:** Get basic animation working first, then enhance!