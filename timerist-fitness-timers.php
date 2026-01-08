<?php
/**
 * Plugin Name: Timerist Fitness Timers 2.0
 * Plugin URI: https://timerist.com
 * Description: Embed Timerist fitness timers (Countdown, Tabata, Interval, EMOM, Stopwatch, Custom) using shortcodes in your WordPress posts and pages (no iframes).
 * Version: 1.1.0
 * Author: Timerist
 * Author URI: https://timerist.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: timerist
 */

if (!defined('ABSPATH')) {
  exit;
}

if (!defined('TIMERIST_FT_VERSION')) {
  define('TIMERIST_FT_VERSION', '1.1.0');
}

if (!class_exists('Timerist_Fitness_Timers_Plugin')) {

  final class Timerist_Fitness_Timers_Plugin {

    private static $instance = null;

    /**
     * Available timer types
     */
    private $timer_types = array(
      'countdown'  => 'Countdown Timer',
      'interval'   => 'Interval Timer',
      'tabata'     => 'Tabata Timer',
      'emom'       => 'EMOM Timer',
      'stopwatch'  => 'Stopwatch',
      'custom'     => 'Custom Timer',
    );

    public static function instance() {
      if (self::$instance === null) {
        self::$instance = new self();
      }
      return self::$instance;
    }

    private function __construct() {
      add_action('init', array($this, 'register_shortcodes'));
      add_action('wp_enqueue_scripts', array($this, 'register_assets'));
    }

    public function register_assets() {
      $base = plugin_dir_url(__FILE__);

      wp_register_style(
        'timerist-ft-css',
        $base . 'assets/timerist.css',
        array(),
        TIMERIST_FT_VERSION
      );

      wp_register_script(
        'timerist-ft-js',
        $base . 'assets/timerist.js',
        array(),
        TIMERIST_FT_VERSION,
        true
      );
    }

    private function enqueue_assets() {
      wp_enqueue_style('timerist-ft-css');
      wp_enqueue_script('timerist-ft-js');
    }

    public function register_shortcodes() {
      // Generic: [timerist type="tabata" theme="digital" prep="10" work="20" rest="10" rounds="8" minutes="10" beeps="1" voice="1"]
      add_shortcode('timerist', array($this, 'timerist_shortcode'));

      // Convenience shortcodes
      add_shortcode('timerist_countdown', array($this, 'countdown_shortcode'));
      add_shortcode('timerist_interval', array($this, 'interval_shortcode'));
      add_shortcode('timerist_tabata', array($this, 'tabata_shortcode'));
      add_shortcode('timerist_emom', array($this, 'emom_shortcode'));
      add_shortcode('timerist_stopwatch', array($this, 'stopwatch_shortcode'));
      add_shortcode('timerist_custom', array($this, 'custom_shortcode'));
    }

    private function normalize_timer_type($type) {
      $type = sanitize_key($type);
      return array_key_exists($type, $this->timer_types) ? $type : 'tabata';
    }

    private function normalize_theme($theme) {
      $theme = sanitize_key($theme);
      $allowed = array('minimal', 'digital');
      return in_array($theme, $allowed, true) ? $theme : 'minimal';
    }

    private function boolish($val) {
      // Accept 1/0, true/false, yes/no, on/off
      $v = strtolower(trim((string)$val));
      return in_array($v, array('1', 'true', 'yes', 'on'), true);
    }

    private function render_timer($atts) {
      $this->enqueue_assets();

      $type  = $this->normalize_timer_type($atts['type']);
      $theme = $this->normalize_theme($atts['theme']);

      // Common inputs
      $prep   = max(0, absint($atts['prep']));
      $work   = max(1, absint($atts['work']));
      $rest   = max(0, absint($atts['rest']));
      $rounds = max(1, absint($atts['rounds']));
      $minutes = max(1, absint($atts['minutes'])); // countdown/emom convenience

      $beeps = $this->boolish($atts['beeps']) ? 1 : 0;
      $voice = $this->boolish($atts['voice']) ? 1 : 0;

      $id = 'timerist-' . wp_generate_uuid4();

      $config = array(
        'type' => $type,
        'theme' => $theme,
        'prep' => $prep,
        'work' => $work,
        'rest' => $rest,
        'rounds' => $rounds,
        'minutes' => $minutes,
        'beeps' => $beeps,
        'voice' => $voice,
      );

      ob_start();
      ?>
      <div
        id="<?php echo esc_attr($id); ?>"
        class="timerist timerist--<?php echo esc_attr($theme); ?>"
        data-timerist
        data-config="<?php echo esc_attr(wp_json_encode($config)); ?>"
        role="group"
        aria-label="<?php echo esc_attr($this->timer_types[$type]); ?>"
      >
        <div class="timerist__header">
          <div class="timerist__title"><?php echo esc_html($this->timer_types[$type]); ?></div>
          <div class="timerist__status" data-status>Ready</div>
        </div>

        <div class="timerist__time" data-time>00:00</div>

        <div class="timerist__meta">
          <div><strong>Round:</strong> <span data-round>0</span>/<span data-rounds><?php echo esc_html($rounds); ?></span></div>
          <div><strong>Phase:</strong> <span data-phase>--</span></div>
          <div><strong>Total:</strong> <span data-total>--</span></div>
        </div>

        <div class="timerist__controls">
          <button type="button" class="timerist__btn" data-action="start">Start</button>
          <button type="button" class="timerist__btn" data-action="pause" disabled>Pause</button>
          <button type="button" class="timerist__btn" data-action="stop" disabled>Stop</button>
          <button type="button" class="timerist__btn" data-action="reset">Reset</button>
        </div>

        <details class="timerist__details">
          <summary>Settings</summary>
          <div class="timerist__settings">
            <div><strong>Theme:</strong> <?php echo esc_html($theme); ?></div>
            <div><strong>Beeps:</strong> <?php echo $beeps ? 'On' : 'Off'; ?></div>
            <div><strong>Voice:</strong> <?php echo $voice ? 'On' : 'Off'; ?></div>
          </div>
        </details>
      </div>
      <?php
      return ob_get_clean();
    }

    public function timerist_shortcode($atts) {
      $atts = shortcode_atts(array(
        'type'   => 'tabata',
        'theme'  => 'minimal',

        // Tabata/Interval defaults (seconds)
        'prep'   => 10,
        'work'   => 20,
        'rest'   => 10,
        'rounds' => 8,

        // Countdown/EMOM default (minutes)
        'minutes' => 10,

        // Audio toggles
        'beeps'  => 1,
        'voice'  => 1,
      ), $atts, 'timerist');

      return $this->render_timer($atts);
    }

    // Convenience shortcodes
    public function countdown_shortcode($atts)  { $atts['type'] = 'countdown';  return $this->timerist_shortcode($atts); }
    public function interval_shortcode($atts)   { $atts['type'] = 'interval';   return $this->timerist_shortcode($atts); }
    public function tabata_shortcode($atts)     { $atts['type'] = 'tabata';     return $this->timerist_shortcode($atts); }
    public function emom_shortcode($atts)       { $atts['type'] = 'emom';       return $this->timerist_shortcode($atts); }
    public function stopwatch_shortcode($atts)  { $atts['type'] = 'stopwatch';  return $this->timerist_shortcode($atts); }
    public function custom_shortcode($atts)     { $atts['type'] = 'custom';     return $this->timerist_shortcode($atts); }
  }

  Timerist_Fitness_Timers_Plugin::instance();
}
