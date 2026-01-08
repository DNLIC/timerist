# TimeristWP Plugin v2.0

A WordPress plugin that provides shortcodes to easily embed Timerist fitness timers in your posts and pages.

## Installation

1. Upload the `timerist-plugin.php` file to your WordPress installation:
   - Navigate to `/wp-content/plugins/` directory
   - Create a folder named `timeristWP` (or upload directly to plugins root)
   - Upload `timerist-plugin.php` to that folder

2. Activate the plugin:
   - Go to WordPress Admin → Plugins
   - Find "TimeristWP"
   - Click "Activate"

## Usage

### Generic Shortcode

Use the generic `[timerist]` shortcode with a `type` parameter:

```
[timerist type="countdown" height="600"]
[timerist type="tabata" height="600"]
[timerist type="interval" height="600"]
[timerist type="emom" height="600"]
[timerist type="stopwatch" height="600"]
[timerist type="custom" height="700"]
```

### Specific Shortcodes

Each timer type also has its own dedicated shortcode:

```
[timerist_countdown height="600"]
[timerist_interval height="600"]
[timerist_tabata height="600"]
[timerist_emom height="600"]
[timerist_stopwatch height="600"]
[timerist_custom height="700"]
```

### Parameters

- **type** (for generic shortcode only): The timer type (`countdown`, `interval`, `tabata`, `emom`, `stopwatch`, `custom`)
- **height**: The iframe height in pixels (default: 600, minimum: 200, maximum: 2000)

### Examples

**In a WordPress post or page:**

```
Here's a Tabata workout timer:

[timerist_tabata height="600"]

Or use the generic shortcode:

[timerist type="countdown" height="500"]
```

**Custom height:**

```
[timerist_custom height="800"]
```

## Available Timer Types

1. **Countdown Timer** - Simple countdown for timed exercises
2. **Interval Timer** - Work and rest intervals for circuit training
3. **Tabata Timer** - Classic Tabata protocol (20s work, 10s rest, 8 rounds)
4. **EMOM Timer** - Every Minute On the Minute workouts
5. **Stopwatch** - Track your workout duration
6. **Custom Timer** - Create multi-phase custom workout timers

## Version

**Current Version:** 2.0

## Notes

- The plugin automatically loads timers from: `https://timerist.com/wp-content/uploads/sites/13/timerist/`
- All URLs are properly escaped for security
- Height values are validated and constrained between 200-2000 pixels
- The iframe is responsive and will scale to fit container width
- Compatible with WordPress multisite installations

## Support

For issues or questions, visit [Timerist.com](https://timerist.com)
