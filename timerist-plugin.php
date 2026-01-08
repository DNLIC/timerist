<?php
/**
 * Plugin Name: TimeristWP
 * Plugin URI: https://timerist.com
 * Description: Embed Timerist fitness timers (Countdown, Tabata, Interval, EMOM, Stopwatch, Custom) using shortcodes in your WordPress posts and pages.
 * Version: 2.0
 * Author: Timerist
 * Author URI: https://timerist.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: timeristwp
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('TIMERISTWP_VERSION', '2.0');
define('TIMERISTWP_BASE_URL', 'https://timerist.com/wp-content/uploads/sites/13/timerist/');

/**
 * Main TimeristWP Plugin Class
 */
class TimeristWP_Plugin {
    
    /**
     * Available timer types
     */
    private $timer_types = array(
        'quick-countdown' => 'Quick Countdown',
        'countdown' => 'Countdown Timer',
        'interval' => 'Interval Timer',
        'tabata' => 'Tabata Timer',
        'emom' => 'EMOM Timer',
        'stopwatch' => 'Stopwatch',
        'custom' => 'Custom Timer'
    );
    
    /**
     * Constructor
     */
    public function __construct() {
        // Register shortcodes
        add_action('init', array($this, 'register_shortcodes'));
    }
    
    /**
     * Register all shortcodes
     */
    public function register_shortcodes() {
        // Generic shortcode: [timerist type="countdown" height="600"]
        add_shortcode('timerist', array($this, 'timerist_shortcode'));
        
        // Specific shortcodes for each timer type
        add_shortcode('timerist_quick_countdown', array($this, 'quick_countdown_shortcode'));
        add_shortcode('timerist_countdown', array($this, 'countdown_shortcode'));
        add_shortcode('timerist_interval', array($this, 'interval_shortcode'));
        add_shortcode('timerist_tabata', array($this, 'tabata_shortcode'));
        add_shortcode('timerist_emom', array($this, 'emom_shortcode'));
        add_shortcode('timerist_stopwatch', array($this, 'stopwatch_shortcode'));
        add_shortcode('timerist_custom', array($this, 'custom_shortcode'));
    }
    
    /**
     * Generate iframe HTML for a timer
     * 
     * @param string $timer_type The timer type (countdown, tabata, etc.)
     * @param int $height The iframe height in pixels
     * @return string The iframe HTML
     */
    private function generate_iframe($timer_type, $height = 600) {
        // Validate timer type
        if (!array_key_exists($timer_type, $this->timer_types)) {
            return '<p><strong>Error:</strong> Invalid timer type. Available types: ' . implode(', ', array_keys($this->timer_types)) . '</p>';
        }
        
        // Sanitize height
        $height = absint($height);
        if ($height < 200) {
            $height = 200; // Minimum height
        }
        if ($height > 2000) {
            $height = 2000; // Maximum height
        }
        
        // Build URL
        $url = esc_url(TIMERISTWP_BASE_URL . $timer_type . '.html');
        
        // Generate iframe
        $iframe = sprintf(
            '<iframe src="%s" width="100%%" height="%d" frameborder="0" scrolling="no" style="border: none; max-width: 100%%;"></iframe>',
            $url,
            $height
        );
        
        return $iframe;
    }
    
    /**
     * Generic timerist shortcode
     * Usage: [timerist type="countdown" height="600"]
     */
    public function timerist_shortcode($atts) {
        $atts = shortcode_atts(array(
            'type' => 'countdown',
            'height' => '600'
        ), $atts, 'timerist');
        
        return $this->generate_iframe($atts['type'], $atts['height']);
    }
    
    /**
     * Quick countdown timer shortcode
     * Usage: [timerist_quick_countdown height="600"]
     */
    public function quick_countdown_shortcode($atts) {
        $atts = shortcode_atts(array(
            'height' => '600'
        ), $atts, 'timerist_quick_countdown');
        
        return $this->generate_iframe('quick-countdown', $atts['height']);
    }
    
    /**
     * Countdown timer shortcode
     * Usage: [timerist_countdown height="600"]
     */
    public function countdown_shortcode($atts) {
        $atts = shortcode_atts(array(
            'height' => '600'
        ), $atts, 'timerist_countdown');
        
        return $this->generate_iframe('countdown', $atts['height']);
    }
    
    /**
     * Interval timer shortcode
     * Usage: [timerist_interval height="600"]
     */
    public function interval_shortcode($atts) {
        $atts = shortcode_atts(array(
            'height' => '600'
        ), $atts, 'timerist_interval');
        
        return $this->generate_iframe('interval', $atts['height']);
    }
    
    /**
     * Tabata timer shortcode
     * Usage: [timerist_tabata height="600"]
     */
    public function tabata_shortcode($atts) {
        $atts = shortcode_atts(array(
            'height' => '600'
        ), $atts, 'timerist_tabata');
        
        return $this->generate_iframe('tabata', $atts['height']);
    }
    
    /**
     * EMOM timer shortcode
     * Usage: [timerist_emom height="600"]
     */
    public function emom_shortcode($atts) {
        $atts = shortcode_atts(array(
            'height' => '600'
        ), $atts, 'timerist_emom');
        
        return $this->generate_iframe('emom', $atts['height']);
    }
    
    /**
     * Stopwatch shortcode
     * Usage: [timerist_stopwatch height="600"]
     */
    public function stopwatch_shortcode($atts) {
        $atts = shortcode_atts(array(
            'height' => '600'
        ), $atts, 'timerist_stopwatch');
        
        return $this->generate_iframe('stopwatch', $atts['height']);
    }
    
    /**
     * Custom timer shortcode
     * Usage: [timerist_custom height="700"]
     */
    public function custom_shortcode($atts) {
        $atts = shortcode_atts(array(
            'height' => '700'
        ), $atts, 'timerist_custom');
        
        return $this->generate_iframe('custom', $atts['height']);
    }
}

// Initialize the plugin
new TimeristWP_Plugin();
