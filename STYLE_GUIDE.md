# TimeristWP Style System Guide

## Overview

The TimeristWP styling system supports multiple visual themes that can be easily customized. The system is designed to be responsive across iPhone, iPad, laptop, and desktop devices, and is structured to be easily portable to iOS and Android apps.

## Current Styles

1. **Style 1** - Ready for customization (images to be provided)
2. **Style 2** - Placeholder (ready for customization)
3. **Style 3** - Current design (purple gradient background, blue primary color) - **Default**

## How to Switch Styles

### Method 1: URL Parameter
Add `?style=style1` (or `style2`, `style3`) to any timer URL:
```
https://timerist.com/wp-content/uploads/sites/13/timerist/tabata.html?style=style1
```

**Note:** Style 3 is the default (current design). If no style is specified, Style 3 will be used.

### Method 2: localStorage (Persistent)
The theme switcher automatically saves your preference to localStorage. Once set via URL, it will persist across page loads.

### Method 3: Programmatic (JavaScript)
```javascript
TimeristWP.setTheme('style1');  // or 'style2', 'style3'
```

## File Structure

```
styles/
├── themes.css    # Theme variable definitions (Default, Style 1, 2, 3)
└── main.css      # Main stylesheet using theme variables

scripts/
└── theme-switcher.js  # Handles theme switching logic
```

## How to Provide Design Samples

To customize Style 1, Style 2, or Style 3, you can provide design samples in any of these formats:

### Option 1: Color Palette
Provide a list of colors for:
- Primary color (main action buttons, timer display)
- Secondary color (pause button, accents)
- Danger color (reset button, warnings)
- Background colors (gradient or solid)
- Text colors
- Card/container backgrounds

**Example:**
```
Style 1 Colors:
- Primary: #FF6B6B (coral red)
- Secondary: #4ECDC4 (teal)
- Danger: #FF4757 (bright red)
- Background: Linear gradient from #FFE5E5 to #FFB3B3
- Text: #2C3E50 (dark blue-gray)
- Card BG: #FFFFFF (white)
```

### Option 2: Screenshots/Mockups
Provide screenshots or design mockups showing:
- Overall layout and color scheme
- Button styles
- Timer display appearance
- Card/container styling
- Typography preferences

### Option 3: Design Tool Files
Share design files from:
- Figma
- Adobe XD
- Sketch
- Canva
- Or any design tool

### Option 4: Reference Websites/Apps
Point to existing websites or apps with the desired look and feel, and describe what elements you like.

### Option 5: Written Description
Describe the desired aesthetic:
- "Dark mode with neon accents"
- "Minimalist white with subtle shadows"
- "Bold, high-contrast colors"
- "Soft pastels with rounded corners"
- etc.

## What Gets Customized

Each style can customize:

### Colors
- Primary, secondary, danger, warning colors
- Text colors (main, light, lighter)
- Background colors and gradients
- Card/container backgrounds
- Border colors

### Typography
- Font families
- Font sizes (base, large, small)
- Font weights
- Letter spacing

### Spacing & Layout
- Border radius (rounded corners)
- Shadows (depth effects)
- Spacing values (padding, margins)
- Container max-widths

### Responsive Sizing
- Timer display sizes for different screen sizes
- Button sizes
- Font scaling

## Responsive Breakpoints

The system includes responsive breakpoints for:

- **iPhone (Portrait)**: 320px - 480px
- **iPhone (Landscape) / Small Tablet**: 481px - 768px
- **iPad (Portrait)**: 769px - 1024px
- **Laptop / Desktop**: 1025px+
- **Large Desktop**: 1440px+

## Orientation Support

The styles automatically adjust for **portrait** and **landscape** orientations:

- **Portrait**: Optimized vertical layout with full-width buttons
- **Landscape**: Optimized horizontal layout with inline buttons
- Timer sizes adjust based on both screen size AND orientation
- Layouts adapt to provide the best experience in both orientations

## CSS Variables Structure

Each theme defines variables in `themes.css`:

```css
:root[data-theme="style1"] {
    --primary-color: #your-color;
    --primary-dark: #darker-variant;
    --bg-gradient: linear-gradient(...);
    --timer-size-mobile: 2.5rem;
    --timer-size-desktop: 5rem;
    /* ... more variables ... */
}
```

## Next Steps

1. **Provide your design samples** using any of the methods above
2. **Specify which style** you want to customize (Style 1, 2, or 3)
3. **Mention any specific requirements** (e.g., "must work well in dark rooms", "needs high contrast for accessibility")

Once you provide the design direction, I'll update the corresponding style in `themes.css` with your customizations.

## Testing Styles

To test different styles:
1. Open any timer page
2. Add `?style=style1` (or style2, style3) to the URL
3. The style will apply and be saved to localStorage
4. Refresh the page - the style persists

## iOS/Android App Considerations

The CSS variable system is designed to map easily to:
- **iOS**: SwiftUI Color and Theme system
- **Android**: Material Design Theme and Color resources

The variable names and structure can be directly translated to native app theming systems.
