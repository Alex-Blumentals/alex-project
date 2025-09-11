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
            resetCollisionAnimation();
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Debug functions for testing
    window.debugCollision = {
        trigger: triggerCollisionAnimation,
        reset: resetCollisionAnimation
    };
    
    console.log('✅ Problem section collision animation initialized');
});