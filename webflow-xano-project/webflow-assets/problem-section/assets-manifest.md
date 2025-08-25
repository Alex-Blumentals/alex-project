# Problem Section Assets Manifest

**Section:** Problem - Split-Panel Collision Animation  
**Asset Count:** 2 background images + optional visual elements  
**Total Estimated Size:** ~1MB optimized

---

## 🖼️ Required Background Images

### 1. Infrastructure Boom Image
**File:** `infrastructure-boom.webp` (primary) / `infrastructure-boom.jpg` (fallback)
- **Purpose:** Left panel background image
- **Dimensions:** 1920x1080px minimum
- **Subject:** Industrial infrastructure, construction, urban development
- **Color Theme:** Blue/purple tones (matches left overlay gradient)
- **Compression:** Under 400KB
- **Alt Text:** "Industrial infrastructure boom and urban development"

### 2. Water Crisis Image  
**File:** `water-crisis.webp` (primary) / `water-crisis.jpg` (fallback)
- **Purpose:** Right panel background image
- **Dimensions:** 1920x1080px minimum
- **Subject:** Water scarcity, drought, environmental crisis
- **Color Theme:** Orange/red tones (matches right overlay gradient)
- **Compression:** Under 400KB
- **Alt Text:** "Water crisis and environmental drought conditions"

---

## 🎯 Optional Visual Elements

### 3. Collision Indicators (Optional)
**File:** `collision-indicators.svg`
- **Purpose:** Visual accent elements for collision effect
- **Format:** SVG for scalability
- **Size:** Under 50KB
- **Usage:** Enhancement for collision overlay

---

## 📋 Asset Implementation Checklist

### Image Optimization
- [ ] Convert to WebP format for modern browsers
- [ ] Keep JPEG fallbacks for compatibility
- [ ] Compress images to under 400KB each
- [ ] Test loading speed on mobile connections

### Webflow Upload
- [ ] Upload both WebP and JPEG versions
- [ ] Apply to `.left-background` and `.right-background` elements
- [ ] Set background-size: cover
- [ ] Set background-position: center center

### Performance Testing
- [ ] Verify images load smoothly during animation
- [ ] Check mobile loading performance
- [ ] Test various network conditions
- [ ] Validate image display across devices

### Accessibility
- [ ] Add descriptive alt text for all images
- [ ] Ensure images support assistive technologies
- [ ] Test with screen readers
- [ ] Verify color contrast with overlays

---

## 🔧 Implementation Notes

### CSS Background Properties
```css
.left-background {
  background-image: url('infrastructure-boom.webp');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.right-background {
  background-image: url('water-crisis.webp');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
```

### Webflow CMS Integration
If using Webflow CMS for dynamic images:
1. Create background image fields in CMS
2. Bind to background elements
3. Set up fallback images in Designer
4. Test dynamic image loading

---

**Asset Status:** 📋 Manifest Ready - Images Needed  
**Implementation:** Ready for upload to Webflow  
**Estimated Setup Time:** 15 minutes after images acquired