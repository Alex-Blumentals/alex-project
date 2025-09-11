# 🎯 Your Exact Structure - Seamless Video to Soil Profile

**Your Structure:**
- `solution-section` → `solution-container` → `soil-profile-stage` → `soil-transformation-container` → `vimeo-embed`
- **Goal:** Split the transformation container into video (top) + soil image (bottom)

---

## 🔧 **STEP 1: Modify HTML Structure in Webflow**

### **1A. Update Your `soil-transformation-container`**

**Current:**
```
soil-transformation-container
└── vimeo-embed (code embed element)
```

**Change to:**
```
soil-transformation-container
├── video-section (NEW div)
│   └── vimeo-embed (MOVE your existing code embed here)
└── profile-section (NEW div)
    └── soil-profile-image (NEW image element)
```

### **1B. How to Make These Changes:**
1. **Add new Div** inside `soil-transformation-container`
2. **Give it class:** `video-section`
3. **Drag your existing code embed** (with Vimeo) into this `video-section`
4. **Add another new Div** inside `soil-transformation-container`
5. **Give it class:** `profile-section`
6. **Add Image element** inside `profile-section`
7. **Give image class:** `soil-profile-image`

---

## 🎨 **STEP 2: Updated CSS (Add to Head Code)**

**Add this CSS to your existing custom code:**

```css
/* Updated Soil Transformation Container */
.soil-transformation-container {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 80%;
  z-index: 5;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

/* Video Section - Top Half */
.video-section {
  position: relative;
  width: 100%;
  height: 50%;
  overflow: hidden;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.vimeo-embed {
  width: 100%;
  height: 100%;
  border: none;
  opacity: 0;
  transition: opacity 1.5s ease;
}

.vimeo-embed.loaded {
  opacity: 1;
}

/* Profile Section - Bottom Half */
.profile-section {
  position: relative;
  width: 100%;
  height: 50%;
  overflow: hidden;
}

.soil-profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: translateY(20px);
  transition: all 1.5s ease;
}

.soil-profile-image.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Updated Transformation Overlay Position */
.transformation-overlay {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  opacity: 0;
  transition: all 1.2s ease;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(15px);
  padding: 20px 30px;
  border-radius: 50px;
}

.transformation-overlay.visible {
  opacity: 1;
}

.before-state,
.after-state {
  background: transparent;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  min-width: 100px;
}

.before-state {
  color: #ff6b6b;
}

.after-state {
  color: #22c55e;
}

.arrow-indicator {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #ff6b6b, #22c55e);
  border-radius: 2px;
  position: relative;
}

.arrow-indicator::after {
  content: '';
  position: absolute;
  right: -6px;
  top: -5px;
  width: 0;
  height: 0;
  border-left: 6px solid #22c55e;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

/* Animation States */
.solution-section.animate .vimeo-embed {
  opacity: 1;
}

.solution-section.animate .soil-profile-image {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 0.5s;
}

.solution-section.animate .transformation-overlay {
  opacity: 1;
  transition-delay: 1s;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .soil-transformation-container {
    width: 95%;
    height: 70%;
  }
  
  .transformation-overlay {
    flex-direction: column;
    gap: 15px;
    padding: 15px 20px;
  }
  
  .arrow-indicator {
    transform: rotate(90deg);
    width: 30px;
  }
  
  .before-state,
  .after-state {
    font-size: 14px;
    min-width: 80px;
  }
}
```

---

## ⚡ **STEP 3: Updated JavaScript (Add to Footer Code)**

**Add this JavaScript to your existing custom code:**

```javascript
// Soil Transformation with Vimeo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌱 Vimeo Soil Transformation Loading...');
    
    const solutionSection = document.querySelector('.solution-section');
    const soilProfileStage = document.querySelector('.soil-profile-stage');
    const vimeoEmbed = document.querySelector('.vimeo-embed');
    const soilProfileImage = document.querySelector('.soil-profile-image');
    const transformationOverlay = document.querySelector('.transformation-overlay');
    
    if (!solutionSection) {
        console.error('❌ Solution section not found!');
        return;
    }
    
    console.log('✅ Solution section found!');
    
    let animationTriggered = false;
    
    // Vimeo embed setup
    if (vimeoEmbed) {
        // Add loaded class when iframe loads
        setTimeout(() => {
            vimeoEmbed.classList.add('loaded');
            console.log('🎬 Vimeo embed loaded');
        }, 1000);
    }
    
    function triggerSoilTransformation() {
        if (animationTriggered) return;
        
        console.log('🌱 Triggering soil transformation!');
        animationTriggered = true;
        
        // Add animation classes
        solutionSection.classList.add('animate');
        soilProfileStage.classList.add('animate');
        
        console.log('🎬 Vimeo video should start playing (if autoplay enabled)');
        
        // Show soil profile image (transformed soil)
        setTimeout(() => {
            if (soilProfileImage) {
                soilProfileImage.classList.add('visible');
                console.log('🌱 Soil profile image revealed');
            }
        }, 1000);
        
        // Show transformation overlay
        setTimeout(() => {
            if (transformationOverlay) {
                transformationOverlay.classList.add('visible');
                console.log('🔄 Transformation overlay visible');
            }
        }, 1500);
        
        console.log('✅ Soil transformation sequence complete!');
    }
    
    function resetTransformation() {
        console.log('🔄 Resetting soil transformation...');
        animationTriggered = false;
        
        solutionSection.classList.remove('animate');
        soilProfileStage.classList.remove('animate');
        
        if (soilProfileImage) {
            soilProfileImage.classList.remove('visible');
        }
        if (transformationOverlay) {
            transformationOverlay.classList.remove('visible');
        }
        
        console.log('✅ Transformation reset complete');
    }
    
    // Intersection Observer for scroll trigger
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerSoilTransformation();
            } else {
                setTimeout(() => {
                    if (!entry.isIntersecting) {
                        resetTransformation();
                    }
                }, 100);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(solutionSection);
    
    // Manual controls for testing
    window.triggerSoilTransformation = triggerSoilTransformation;
    window.resetTransformation = resetTransformation;
    
    console.log('✅ Vimeo soil transformation initialized!');
});
```

---

## 🎬 **STEP 4: Update Your Vimeo Embed**

### **4A. Vimeo Embed Code Format:**
In your code embed element, use this format:

```html
<iframe 
  src="https://player.vimeo.com/video/YOUR_VIDEO_ID?autoplay=1&loop=1&muted=1&background=1&controls=0&title=0&byline=0&portrait=0" 
  class="vimeo-embed"
  frameborder="0" 
  allow="autoplay; fullscreen; picture-in-picture" 
  allowfullscreen>
</iframe>
```

**Replace `YOUR_VIDEO_ID` with your actual Vimeo video ID**

### **4B. Key Settings:**
- `autoplay=1` - Starts automatically
- `loop=1` - Loops continuously  
- `muted=1` - Required for autoplay
- `background=1` - Removes controls
- `controls=0` - Hides player controls

---

## 🖼️ **STEP 5: Add Soil Profile Image**

### **5A. Upload Image:**
- **Content:** Grass/vegetation on top, dark soil with roots on bottom
- **Ratio:** Should match your video dimensions
- **Format:** JPEG or WebP

### **5B. Assign to Element:**
- Select your `.soil-profile-image` element
- Set the uploaded image as source

---

## 📝 **STEP 6: Update Text (Optional)**

### **Update Your Existing Text:**
- `.before-state` → "Suelo Compactado"
- `.after-state` → "Suelo Vivo"

---

## 🧪 **STEP 7: Test the Result**

### **Expected Animation:**
1. **Scroll to section**
2. **Top half:** Vimeo video plays (rain on compacted soil)
3. **Bottom half:** Soil profile image fades in (grass + roots)
4. **Junction:** Overlay appears: "Suelo Compactado → Suelo Vivo"

### **Console Messages:**
```
✅ "Vimeo Soil Transformation Loading..."
✅ "Solution section found!"
🎬 "Vimeo embed loaded"
🌱 "Triggering soil transformation!"
🌱 "Soil profile image revealed"
🔄 "Transformation overlay visible"
```

### **Manual Testing:**
- Type `triggerSoilTransformation()` in console to force trigger
- Type `resetTransformation()` in console to reset

---

## 🎯 **Final Result**

**Perfect seamless transition:**
- **Video (top):** Rain bouncing off compacted soil = BEFORE
- **Image (bottom):** Healthy soil with grass and roots = AFTER
- **Width:** Matches your existing background layers
- **Overlay:** Professional transition indicator at the split

**This creates the exact visual story you want: compacted soil transforms into living, healthy soil!** 🌱