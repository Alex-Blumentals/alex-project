# 📱 Mobile Sticky Scroll Animation - Biogax Style

## Animation Sequence
1. **Infrastructure boom** - First image sticks when reaching navbar
2. **Escasez crítica** - Second image scrolls over first, slightly wider  
3. **Aquí está su inversión** - Third image scrolls over both, widest, with floating chips

## CSS Implementation

Add this CSS for mobile only (replace the existing mobile section in your CSS):

```css
/* Mobile Sticky Scroll Animation - Biogax Style */
@media (max-width: 991px) {
  .problema-section {
    /* Create tall container for sticky effect */
    min-height: 300vh; /* 3x viewport height for 3 images */
    position: relative;
  }
  
  .split-panel-container {
    display: none; /* Hide desktop version */
  }
  
  /* Mobile Sticky Container */
  .mobile-sticky-container {
    position: relative;
    height: 300vh; /* Full height for scrolling */
    width: 100%;
  }
  
  /* Sticky Viewport - Fixed position for layering effect */
  .sticky-viewport {
    position: sticky;
    top: 80px; /* Stick below navbar */
    height: calc(100vh - 80px);
    width: 100%;
    overflow: hidden;
    z-index: 1;
  }
  
  /* Image Layer Base Styles */
  .sticky-layer {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 15px;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: flex-end;
    padding: 30px;
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  /* Layer 1 - Infrastructure boom (smallest, appears first) */
  .sticky-layer-1 {
    width: 85%;
    height: 60%;
    top: 20%;
    z-index: 3;
    background: transparent; /* Remove background-image, using <img> instead */
  }
  
  /* Layer 2 - Escasez crítica (medium, appears second) */
  .sticky-layer-2 {
    width: 90%;
    height: 70%;
    top: 15%;
    z-index: 4;
    background: transparent; /* Remove background-image, using <img> instead */
  }
  
  /* Image styling for both layers */
  .layer-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 1;
  }
  
  /* Image wrapper for Webflow images */
  .layer-image-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  
  .layer-image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  
  /* Color overlays for each layer */
  .layer-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
  }
  
  .layer-overlay-blue,
  .sticky-layer-1 .layer-overlay {
    background: linear-gradient(to top, rgba(102, 126, 234, 0.8) 0%, rgba(102, 126, 234, 0.3) 70%, transparent 100%);
  }
  
  .layer-overlay-red,
  .sticky-layer-2 .layer-overlay {
    background: linear-gradient(to top, rgba(255, 107, 107, 0.8) 0%, rgba(255, 107, 107, 0.3) 70%, transparent 100%);
  }
  
  /* Layer 3 - Aquí está su inversión (largest, appears last) */
  .sticky-layer-3 {
    width: 95%;
    height: 80%;
    top: 10%;
    z-index: 5;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 2px solid rgba(255, 255, 255, 0.1);
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 40px;
  }
  
  /* Content inside each layer */
  .layer-content {
    position: relative;
    z-index: 2;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
  }
  
  .layer-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: clamp(1.2rem, 4vw, 1.8rem);
    margin-bottom: 10px;
  }
  
  .layer-subtitle {
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 14px;
    opacity: 0.9;
  }
  
  /* Center collision content for layer 3 */
  .collision-content {
    text-align: center;
  }
  
  .collision-title-mobile {
    font-family: 'Montserrat', sans-serif;
    font-weight: 800;
    font-size: clamp(1.5rem, 5vw, 2rem);
    color: #ff6b6b;
    margin-bottom: 20px;
  }
  
  .collision-line-mobile {
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #ff6b6b, #ffa500);
    margin: 0 auto 20px auto;
    border-radius: 2px;
    box-shadow: 0 0 15px rgba(255, 107, 107, 0.5);
  }
  
  /* Floating chips for layer 3 */
  .mobile-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
  }
  
  .mobile-chip {
    background: rgba(255, 107, 107, 0.9);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 13px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    animation: chipFloat 2s ease-in-out infinite;
  }
  
  .mobile-chip:nth-child(2) { animation-delay: 0.2s; }
  .mobile-chip:nth-child(3) { animation-delay: 0.4s; }
  .mobile-chip:nth-child(4) { animation-delay: 0.6s; }
  
  @keyframes chipFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
  }
}
```

## JavaScript for Scroll Control

Add this JavaScript to control the layering effect:

```javascript
// Mobile Sticky Scroll Animation
document.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth <= 991) {
    const layers = document.querySelectorAll('.sticky-layer');
    const stickyContainer = document.querySelector('.mobile-sticky-container');
    
    if (!stickyContainer) return;
    
    function updateLayers() {
      const containerTop = stickyContainer.offsetTop;
      const containerHeight = stickyContainer.offsetHeight;
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress through the container
      const scrollProgress = (scrollY - containerTop) / (containerHeight - viewportHeight);
      
      // Layer 1 - Infrastructure boom (appears first, stays visible)
      const layer1 = document.querySelector('.sticky-layer-1');
      if (scrollProgress >= 0 && scrollProgress <= 1) {
        layer1.style.opacity = '1';
      } else {
        layer1.style.opacity = '0';
      }
      
      // Layer 2 - Escasez crítica (appears at 33% progress)
      const layer2 = document.querySelector('.sticky-layer-2');
      if (scrollProgress >= 0.33 && scrollProgress <= 1) {
        layer2.style.opacity = '1';
        // Scale up slightly for covering effect
        layer2.style.transform = 'translateX(-50%) scale(1)';
      } else if (scrollProgress > 0.25 && scrollProgress < 0.33) {
        // Transition in
        const fadeProgress = (scrollProgress - 0.25) / 0.08;
        layer2.style.opacity = fadeProgress;
        layer2.style.transform = `translateX(-50%) scale(${0.95 + (fadeProgress * 0.05)})`;
      } else {
        layer2.style.opacity = '0';
        layer2.style.transform = 'translateX(-50%) scale(0.95)';
      }
      
      // Layer 3 - Aquí está su inversión (appears at 66% progress)
      const layer3 = document.querySelector('.sticky-layer-3');
      if (scrollProgress >= 0.66 && scrollProgress <= 1) {
        layer3.style.opacity = '1';
        layer3.style.transform = 'translateX(-50%) scale(1)';
      } else if (scrollProgress > 0.58 && scrollProgress < 0.66) {
        // Transition in
        const fadeProgress = (scrollProgress - 0.58) / 0.08;
        layer3.style.opacity = fadeProgress;
        layer3.style.transform = `translateX(-50%) scale(${0.9 + (fadeProgress * 0.1)})`;
      } else {
        layer3.style.opacity = '0';
        layer3.style.transform = 'translateX(-50%) scale(0.9)';
      }
    }
    
    // Throttled scroll listener
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function() {
          updateLayers();
          ticking = false;
        });
        ticking = true;
      }
    }
    
    window.addEventListener('scroll', onScroll);
    updateLayers(); // Initial call
  }
});
```

## HTML Structure with Images

Your HTML should include actual image elements in each layer:

```html
<div class="problema-section">
  <!-- Desktop version (existing) -->
  <div class="split-panel-container">
    <!-- Your existing desktop collision animation -->
  </div>
  
  <!-- Mobile sticky scroll version -->
  <div class="mobile-sticky-container">
    <div class="sticky-viewport">
      <!-- Layer 1 - Infrastructure boom with image -->
      <div class="sticky-layer sticky-layer-1">
        <img src="your-infrastructure-boom-image.jpg" alt="Infrastructure Boom in Spain" class="layer-image" />
        <div class="layer-overlay"></div>
        <div class="layer-content">
          <div class="layer-title">Boom de Infraestructura</div>
          <div class="layer-subtitle">España experimenta un crecimiento acelerado</div>
        </div>
      </div>
      
      <!-- Layer 2 - Water crisis with image -->
      <div class="sticky-layer sticky-layer-2">
        <img src="your-water-crisis-image.jpg" alt="Water Crisis" class="layer-image" />
        <div class="layer-overlay layer-overlay-red"></div>
        <div class="layer-content">
          <div class="layer-title">Escasez Crítica</div>
          <div class="layer-subtitle">Los recursos hídricos bajo presión extrema</div>
        </div>
      </div>
      
      <!-- Layer 3 - Investment solution (no background image, glass morphism) -->
      <div class="sticky-layer sticky-layer-3">
        <div class="collision-content">
          <div class="collision-title-mobile">Aquí está su inversión</div>
          <div class="collision-line-mobile"></div>
          <div class="mobile-chips">
            <div class="mobile-chip">Costos elevados</div>
            <div class="mobile-chip">Daños ambientales</div>
            <div class="mobile-chip">Resistencia social</div>
            <div class="mobile-chip">Riesgo regulatorio</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Alternative: Using Webflow Image Elements

If you're adding this through Webflow Designer, use this structure with Webflow image elements:

```html
<div class="problema-section">
  <!-- Desktop version remains unchanged -->
  <div class="split-panel-container">
    <!-- Your existing desktop collision -->
  </div>
  
  <!-- Mobile sticky version with Webflow images -->
  <div class="mobile-sticky-container">
    <div class="sticky-viewport">
      
      <!-- Layer 1 with Webflow image -->
      <div class="sticky-layer sticky-layer-1">
        <div class="w-embed">
          <div class="layer-image-wrapper">
            <!-- Add Webflow Image Element here with class "layer-image" -->
          </div>
        </div>
        <div class="layer-overlay layer-overlay-blue"></div>
        <div class="layer-content">
          <h3 class="layer-title">Boom de Infraestructura</h3>
          <p class="layer-subtitle">España experimenta un crecimiento acelerado</p>
        </div>
      </div>
      
      <!-- Layer 2 with Webflow image -->
      <div class="sticky-layer sticky-layer-2">
        <div class="w-embed">
          <div class="layer-image-wrapper">
            <!-- Add Webflow Image Element here with class "layer-image" -->
          </div>
        </div>
        <div class="layer-overlay layer-overlay-red"></div>
        <div class="layer-content">
          <h3 class="layer-title">Escasez Crítica</h3>
          <p class="layer-subtitle">Los recursos hídricos bajo presión extrema</p>
        </div>
      </div>
      
      <!-- Layer 3 - Glass morphism overlay -->
      <div class="sticky-layer sticky-layer-3">
        <div class="collision-content">
          <h2 class="collision-title-mobile">Aquí está su inversión</h2>
          <div class="collision-line-mobile"></div>
          <div class="mobile-chips">
            <div class="mobile-chip">Costos elevados</div>
            <div class="mobile-chip">Daños ambientales</div>
            <div class="mobile-chip">Resistencia social</div>
            <div class="mobile-chip">Riesgo regulatorio</div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</div>
```

This creates the exact effect you described: progressive layering with each image wider than the previous, sticky positioning, and the collision text with floating chips appearing last.