# Timerist - Fitness Timers

A collection of responsive, embeddable fitness timers designed for WordPress integration. Perfect for workout pages, fitness blogs, and training resources.

## Features

- **Responsive Design**: Works seamlessly on smartphones, tablets, and desktops
- **Multiple Timer Types**: Countdown, Interval, Tabata, EMOM, Stopwatch, and Custom timers
- **WordPress Ready**: Easy to embed in WordPress pages
- **Modern UI**: Clean, professional design with smooth animations
- **Audio Alerts**: Built-in sound notifications when timers complete
- **No Dependencies**: Pure HTML, CSS, and JavaScript - no frameworks required

## Timer Types

1. **Countdown Timer**: Simple countdown for timed exercises
2. **Interval Timer**: Work and rest intervals for circuit training
3. **Tabata Timer**: Classic Tabata protocol (20s work, 10s rest, 8 rounds)
4. **EMOM Timer**: Every Minute On the Minute workouts
5. **Stopwatch**: Track your workout duration
6. **Custom Timer**: Create multi-phase custom workout timers

## WordPress Integration

### Method 1: Direct Embed (iframe)

You can embed any timer page directly into your WordPress posts or pages using an iframe:

```html
<iframe src="https://yourdomain.com/timerist/countdown.html" 
        width="100%" 
        height="600" 
        frameborder="0" 
        scrolling="no">
</iframe>
```

### Method 2: WordPress Block Editor

1. Add a "Custom HTML" block to your page
2. Paste the iframe code above
3. Adjust the `height` value as needed (600px works well for most timers)

### Method 3: Shortcode (Requires Plugin)

If you want to use shortcodes, you can create a simple WordPress plugin:

```php
function timerist_shortcode($atts) {
    $atts = shortcode_atts(array(
        'type' => 'countdown',
        'height' => '600'
    ), $atts);
    
    $url = 'https://yourdomain.com/timerist/' . $atts['type'] . '.html';
    
    return '<iframe src="' . esc_url($url) . '" 
                    width="100%" 
                    height="' . esc_attr($atts['height']) . '" 
                    frameborder="0" 
                    scrolling="no">
            </iframe>';
}
add_shortcode('timerist', 'timerist_shortcode');
```

Then use it in your posts: `[timerist type="tabata" height="600"]`

### Available Timer Types for Embedding

- `countdown.html` - Countdown Timer
- `interval.html` - Interval Timer
- `tabata.html` - Tabata Timer
- `emom.html` - EMOM Timer
- `stopwatch.html` - Stopwatch
- `custom.html` - Custom Timer

## File Structure

```
timerist/
├── index.html              # Main landing page
├── countdown.html          # Countdown timer page
├── interval.html           # Interval timer page
├── tabata.html             # Tabata timer page
├── emom.html               # EMOM timer page
├── stopwatch.html          # Stopwatch page
├── custom.html             # Custom timer page
├── styles/
│   └── main.css            # Main stylesheet
├── scripts/
│   ├── countdown.js        # Countdown timer logic
│   ├── interval.js         # Interval timer logic
│   ├── tabata.js           # Tabata timer logic
│   ├── emom.js             # EMOM timer logic
│   ├── stopwatch.js        # Stopwatch logic
│   └── custom.js           # Custom timer logic
└── README.md               # This file
```

## Deployment

### Option 1: Static Hosting

Upload all files to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Your own web server

### Option 2: WordPress Subdirectory

1. Upload the `timerist` folder to your WordPress root directory
2. Access timers at: `https://yourdomain.com/timerist/countdown.html`
3. Embed using the iframe method above

### Option 3: CDN

Upload to a CDN and reference the URLs in your WordPress embeds.

## Customization

### Colors

Edit `styles/main.css` and modify the CSS variables:

```css
:root {
    --primary-color: #4a90e2;
    --secondary-color: #50c878;
    --danger-color: #e74c3c;
    /* ... */
}
```

### Default Timer Values

Each timer page has default values in the HTML inputs. Modify these in the respective HTML files to change defaults.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Free to use for personal and commercial projects.

## Support

For issues or feature requests, please create an issue in the project repository.

