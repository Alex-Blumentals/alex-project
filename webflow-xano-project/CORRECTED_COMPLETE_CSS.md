# 🔧 Corrected Complete CSS - Problem + Solution Sections

**Issues Found:**
1. Missing `.` before `solution-section` (line should be `.solution-section`)
2. Duplicate/conflicting `.transformation-overlay` styles
3. Missing `.soil-profile-stage` styles
4. `.video-container` styles conflict with your structure

---

## ✅ **Replace Your Entire CSS with This Corrected Version:**

```css
<style>
/* PROBLEM SECTION - Collision Animation */
.problema-section {
  width: 100%;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
}

.problema-container {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 20px;
}

.problema-header {
  text-align: center;
  margin-bottom: 20px;
}

.problema-header h2 {
  text-align: center;
}

.problema-header p {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.collision-stage {
  position: relative;
  min-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 30px 0;
  width: 100%;
  margin: 0 auto;
}

.split-panel-container {
  position: relative;
  width: 100%;
  max-width: 1600px; 
  height: 700px; 
  margin: 20px auto 0 auto; 
}

.left-panel,
.right-panel {
  position: absolute;
  top: 0;
  width: 70%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  border-radius: 20px;
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  padding-top: 120px;
  padding-bottom: 20px;
}

.left-panel {
  left: 0;
  transform: translateX(10%);
}

.right-panel {
  right: 0;
  transform: translateX(-10%);
}

.left-background,
.right-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.85) contrast(1.1);
  z-index: 1;
}

.left-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(102, 126, 234, 0.6) 0%, rgba(102, 126, 234, 0.2) 50%, rgba(102, 126, 234, 0.1) 100%);
  z-index: 2;
}

.right-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(255, 107, 107, 0.6) 0%, rgba(255, 107, 107, 0.2) 50%, rgba(255, 107, 107, 0.1) 100%);
  z-index: 2;
}

.left-content,
.right-content {
  position: relative;
  z-index: 3;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  margin-top: 60px; 
  margin-bottom: 10px; 
}

.collision-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  opacity: 0;
  z-index: 10;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px 50px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  min-width: 350px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.collision-text {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  color: #dc2626;
  margin-bottom: 20px;
}

.collision-impact-line {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #dc2626, #f59e0b);
  margin: 0 auto;
  border-radius: 2px;
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.4);
}

/* Problem Section Animation States */
.collision-stage.collision-active .left-panel {
  transform: translateX(-45%);
}

.collision-stage.collision-active .right-panel {
  transform: translateX(45%);
}

.collision-stage.collision-active .collision-overlay {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

/* Problem Section Floating Chips */
.floating-chips-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 20;
}

.chip-costos,
.chip-danos,
.chip-resistencia,
.chip-riesgo {
  position: absolute;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  padding: 18px 30px;
  border-radius: 25px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 18px;
  opacity: 0;
  transform: scale(0) rotate(0deg);
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
  white-space: nowrap;
  z-index: 25;
}

.chip-costos {
  top: 25%;
  left: 38%;
}

.chip-danos {
  top: 25%;
  right: 38%;
}

.chip-resistencia {
  bottom: 25%;
  left: 38%;
}

.chip-riesgo {
  bottom: 25%;
  right: 38%;
}

/* SOLUTION SECTION - Soil Transformation */
.solution-section {
  position: relative;
  min-height: 120vh;
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
  overflow: hidden;
  padding: 80px 0;
}

.solution-container {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  z-index: 10;
}

.solution-header {
  text-align: center;
  margin-bottom: 80px;
  z-index: 20;
  position: relative;
}

.solution-badge {
  display: inline-block;
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  padding: 8px 20px;
  border-radius: 25px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 20px;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.solution-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  color: #1e293b;
  margin-bottom: 20px;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.solution-subtitle {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: #475569;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Soil Profile Stage */
.soil-profile-stage {
  position: relative;
  height: 100vh;
  min-height: 800px;
  margin: 60px 0;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

/* Background Layers */
.parallax-bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%;
  z-index: 1;
}

.sky-layer {
  position: absolute;
  top: -10%;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(180deg, #87ceeb 0%, #b6e5f7 100%);
  will-change: transform;
  transform: translateZ(0);
}

.ground-layer {
  position: absolute;
  top: 30%;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(180deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%);
  will-change: transform;
  transform: translateZ(0);
}

.deep-soil-layer {
  position: absolute;
  top: 70%;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(180deg, #451a03 0%, #292524 50%, #1c1917 100%);
  will-change: transform;
  transform: translateZ(0);
}

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

/* Solution Section Transformation Overlay */
.solution-section .transformation-overlay {
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

.solution-section .transformation-overlay.visible {
  opacity: 1;
}

.solution-section .before-state,
.solution-section .after-state {
  background: transparent;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  min-width: 100px;
}

.solution-section .before-state {
  color: #ff6b6b;
}

.solution-section .after-state {
  color: #22c55e;
}

.solution-section .arrow-indicator {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #ff6b6b, #22c55e);
  border-radius: 2px;
  position: relative;
}

.solution-section .arrow-indicator::after {
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

/* Soil Profile Labels */
.soil-profile-labels {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 20px;
  width: 200px;
  z-index: 25;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 0 40px;
}

.surface-label,
.root-zone-label,
.deep-layer-label {
  background: rgba(16, 185, 129, 0.9);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.8s ease;
}

/* Feature Cards */
.feature-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 80px;
  padding: 0 20px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  opacity: 0;
  transform: translateY(30px);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 35px;
  color: white;
}

.feature-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  color: #1e293b;
  margin-bottom: 15px;
}

.feature-description {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #475569;
  line-height: 1.6;
}

/* ANIMATION STATES */

/* Solution Section Animation States */
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

.solution-section.animate .feature-card-1 {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 1.2s;
}

.solution-section.animate .feature-card-2 {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 1.4s;
}

.solution-section.animate .feature-card-3 {
  opacity: 1;
  transform: translateY(0);
  transition-delay: 1.6s;
}

.soil-profile-stage.animate .surface-label {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.5s;
}

.soil-profile-stage.animate .root-zone-label {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.7s;
}

.soil-profile-stage.animate .deep-layer-label {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.9s;
}

/* Parallax Animation States */
.soil-profile-stage.animate .sky-layer {
  transform: translateY(-20px) translateZ(0);
  transition: transform 1.5s ease-out;
}

.soil-profile-stage.animate .ground-layer {
  transform: translateY(-10px) translateZ(0);
  transition: transform 1.5s ease-out 0.2s;
}

.soil-profile-stage.animate .deep-soil-layer {
  transform: translateY(-5px) translateZ(0);
  transition: transform 1.5s ease-out 0.4s;
}

/* MOBILE RESPONSIVE */

/* Problem Section Mobile */
@media (max-width: 768px) {
  .collision-stage {
    padding: 40px 20px;
  }
  
  .split-panel-container {
    height: 600px;
  }
  
  .left-panel,
  .right-panel {
    width: 80%;
    height: 120px;
    font-size: 1.2rem;
    align-items: center;
  }
  
  .left-panel {
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%) translateX(6%);
  }
  
  .right-panel {
    top: 80%;
    right: 50%;
    transform: translate(50%, -50%) translateX(-6%);
  }
  
  .collision-stage.collision-active .left-panel {
    transform: translate(-50%, -50%) translateX(-20%);
  }
  
  .collision-stage.collision-active .right-panel {
    transform: translate(50%, -50%) translateX(20%);
  }
  
  .collision-overlay {
    min-width: 250px;
    padding: 20px 25px;
  }
}

/* Solution Section Mobile */
@media (max-width: 991px) {
  .solution-section {
    padding: 60px 0;
  }
  
  .soil-profile-stage {
    height: 60vh;
    min-height: 400px;
  }
  
  .soil-transformation-container {
    width: 95%;
    height: 70%;
  }
  
  .solution-section .transformation-overlay {
    flex-direction: column;
    gap: 15px;
    padding: 15px 20px;
  }
  
  .solution-section .arrow-indicator {
    transform: rotate(90deg);
    width: 30px;
  }
  
  .feature-cards-container {
    grid-template-columns: 1fr;
    gap: 30px;
    margin-top: 60px;
  }
}

@media (max-width: 768px) {
  .solution-title {
    font-size: clamp(1.8rem, 5vw, 2.5rem);
  }
  
  .solution-subtitle {
    font-size: 18px;
  }
  
  .soil-profile-stage {
    height: 50vh;
    min-height: 300px;
  }
  
  .solution-section .before-state,
  .solution-section .after-state {
    font-size: 14px;
    min-width: 80px;
  }
}

/* PERFORMANCE OPTIMIZATIONS */
.sky-layer,
.ground-layer,
.deep-soil-layer,
.vimeo-embed {
  will-change: transform;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}
</style>
```

---

## 🔧 **Key Fixes Made:**

1. **Fixed missing `.` before `solution-section`**
2. **Separated transformation overlay styles** for Problem vs Solution sections
3. **Added missing `.soil-profile-stage` styles**
4. **Removed conflicting `.video-container` styles**
5. **Added proper parallax background layers**
6. **Fixed mobile responsive conflicts**
7. **Organized animation states by section**

**This corrected CSS integrates both your Problem section (collision animation) and Solution section (video-to-soil transition) without conflicts!**