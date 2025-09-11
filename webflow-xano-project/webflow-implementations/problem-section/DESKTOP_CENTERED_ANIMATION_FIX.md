# 🔧 Desktop Centered Collision Animation Fix

## Issue
The collision images are positioned to the left of the screen (-10% and 10% transforms) instead of being centered with proper separation.

## Solution
Fix the active animation states to center the panels with better spacing while keeping "Aquí está su inversión" centered.

## Updated CSS

Replace lines 196-205 in your CSS with this centered animation:

```css
/* Collision Animation Active States - CENTERED VERSION */
.collision-active .left-panel {
  transform: translateX(-25%); /* More centered, less overlap */
  opacity: 1;
}

.collision-active .right-panel {
  transform: translateX(25%); /* More centered, less overlap */  
  opacity: 1;
}
```

## Why This Works Better

### Before (Issue):
- Left panel: `translateX(-10%)` - Too far left
- Right panel: `translateX(10%)` - Too far right  
- Result: Images appear pushed to screen edges

### After (Fixed):
- Left panel: `translateX(-25%)` - Properly centered with gap
- Right panel: `translateX(25%)` - Properly centered with gap
- Result: Images centered on screen with "Aquí está su inversión" visible in center

## Visual Layout

```
Before: |[LEFT_IMAGE]     [CENTER_TEXT]     [RIGHT_IMAGE]|
After:  |    [LEFT_IMG] [CENTER_TEXT] [RIGHT_IMG]    |
```

The -25% and 25% transforms create proper separation while keeping both images visible and the center text perfectly positioned.