# TimerControls React Native Adaptation Guide

This guide explains how to adapt the `TimerControls` component for React Native using NativeWind (Tailwind CSS for React Native) and provides mappings for native iOS (SwiftUI) and Android (Jetpack Compose).

## Prerequisites

### Install NativeWind

```bash
npm install nativewind
npm install --save-dev tailwindcss
npx tailwindcss init
```

### Configure NativeWind

Update `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Map from globals.css design tokens
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        // ... etc
      },
    },
  },
}
```

### Update `metro.config.js`

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./app/globals.css" });
```

## Component Adaptation

### 1. Replace HTML Elements

- `<div>` → `<View>`
- `<button>` → `<Pressable>` or `<TouchableOpacity>`
- `<label>` → `<Text>` with accessibility props
- `<input>` → `<TextInput>` (for duration if needed)

### 2. Import React Native Components

```tsx
import { View, Pressable, Text } from "react-native"
import { Button } from "@/components/ui/button-native" // Custom native button
```

### 3. Use NativeWind Classes

The Tailwind classes from the web component work the same with NativeWind:

```tsx
<View className="flex flex-col gap-4 p-6 bg-card border border-border rounded-lg">
  {/* Same classes as web! */}
</View>
```

### 4. Handle Icons

Replace `lucide-react` with `react-native-vector-icons` or `@expo/vector-icons`:

```tsx
// Instead of: import { Play } from "lucide-react"
import { Ionicons } from "@expo/vector-icons"

<Ionicons name="play" size={16} color={colors.primary} />
```

### 5. Accessibility

React Native uses different accessibility props:

```tsx
// Web: aria-label="Start timer"
// Native:
<Pressable
  accessibilityLabel="Start timer"
  accessibilityRole="button"
  accessibilityState={{ disabled: disabled }}
>
```

## Complete Native Component Example

```tsx
import { View, Pressable, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { cn } from "@/lib/utils-native" // Use NativeWind's cn

export function TimerControlsNative({
  isRunning,
  onTogglePlayPause,
  onReset,
  // ... other props
}: TimerControlsProps) {
  return (
    <View
      className="flex flex-col gap-4 p-6 bg-card rounded-lg"
      accessibilityRole="group"
      accessibilityLabel="Timer controls"
    >
      <Pressable
        onPress={onTogglePlayPause}
        disabled={disabled}
        className={cn(
          "flex-1 min-w-[140px] font-semibold uppercase",
          isRunning
            ? "bg-secondary"
            : "bg-primary"
        )}
        accessibilityLabel={isRunning ? "Pause timer" : "Start timer"}
        accessibilityRole="button"
      >
        <View className="flex-row items-center justify-center p-3">
          <Ionicons
            name={isRunning ? "pause" : "play"}
            size={16}
            color="white"
          />
          <Text className="text-white ml-2">
            {isRunning ? "Pause" : "Start"}
          </Text>
        </View>
      </Pressable>
    </View>
  )
}
```

## iOS (SwiftUI) Mappings

### Design Tokens → SwiftUI

```swift
// Colors
extension Color {
    static let primary = Color(red: 74/255, green: 144/255, blue: 226/255)
    static let secondary = Color(red: 80/255, green: 200/255, blue: 120/255)
    static let card = Color(red: 255/255, green: 255/255, blue: 255/255)
    static let foreground = Color(red: 51/255, green: 51/255, blue: 51/255)
}

// Spacing
extension CGFloat {
    static let spacingXS: CGFloat = 8
    static let spacingSM: CGFloat = 16
    static let spacingMD: CGFloat = 24
    static let spacingLG: CGFloat = 32
    static let spacingXL: CGFloat = 48
}
```

### Component Structure

```swift
import SwiftUI

struct TimerControlsView: View {
    @Binding var isRunning: Bool
    var onTogglePlayPause: () -> Void
    var onReset: () -> Void
    
    var body: some View {
        VStack(spacing: 16) {
            // Play/Pause Button
            Button(action: onTogglePlayPause) {
                HStack {
                    Image(systemName: isRunning ? "pause.fill" : "play.fill")
                    Text(isRunning ? "Pause" : "Start")
                        .fontWeight(.semibold)
                        .textCase(.uppercase)
                }
                .foregroundColor(.white)
                .padding(.horizontal, 32)
                .padding(.vertical, 12)
                .background(isRunning ? Color.secondary : Color.primary)
                .cornerRadius(8)
            }
            .accessibilityLabel(isRunning ? "Pause timer" : "Start timer")
            
            // Reset Button
            Button(action: onReset) {
                HStack {
                    Image(systemName: "arrow.counterclockwise")
                    Text("Reset")
                        .fontWeight(.semibold)
                        .textCase(.uppercase)
                }
                .foregroundColor(.foreground)
                .padding(.horizontal, 32)
                .padding(.vertical, 12)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.border, lineWidth: 2)
                )
            }
            .disabled(isRunning)
            .accessibilityLabel("Reset timer")
        }
        .padding(24)
        .background(Color.card)
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 2)
    }
}
```

### Dark Mode Support

```swift
struct TimerControlsView: View {
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        // Use colorScheme to switch between light/dark
        let cardColor = colorScheme == .dark ? Color(red: 26/255, green: 26/255, blue: 26/255) : Color.white
        // ...
    }
}
```

## Android (Jetpack Compose) Mappings

### Design Tokens → Compose

```kotlin
// colors.xml or Theme.kt
object TimeristColors {
    val Primary = Color(0xFF4A90E2)
    val Secondary = Color(0xFF50C878)
    val Card = Color(0xFFFFFFFF)
    val Foreground = Color(0xFF333333)
    val Border = Color(0xFFE1E8ED)
}

// Spacing
object Spacing {
    val XS = 8.dp
    val SM = 16.dp
    val MD = 24.dp
    val LG = 32.dp
    val XL = 48.dp
}
```

### Component Structure

```kotlin
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun TimerControls(
    isRunning: Boolean,
    onTogglePlayPause: () -> Unit,
    onReset: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(24.dp),
        colors = CardDefaults.cardColors(
            containerColor = TimeristColors.Card
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Play/Pause Button
            Button(
                onClick = onTogglePlayPause,
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isRunning) TimeristColors.Secondary else TimeristColors.Primary
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = if (isRunning) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = null
                )
                Spacer(Modifier.width(8.dp))
                Text(
                    text = if (isRunning) "Pause" else "Start",
                    style = MaterialTheme.typography.labelLarge.copy(
                        fontWeight = FontWeight.SemiBold,
                        textTransform = TextTransform.Uppercase
                    )
                )
            }
            
            // Reset Button
            OutlinedButton(
                onClick = onReset,
                enabled = !isRunning,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.Refresh,
                    contentDescription = null
                )
                Spacer(Modifier.width(8.dp))
                Text(
                    text = "Reset",
                    style = MaterialTheme.typography.labelLarge.copy(
                        fontWeight = FontWeight.SemiBold,
                        textTransform = TextTransform.Uppercase
                    )
                )
            }
        }
    }
}
```

### Dark Mode Support

```kotlin
@Composable
fun TimerControlsTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        darkColorScheme(
            primary = Color(0xFFFF0000),
            secondary = Color(0xFF00FF00),
            surface = Color(0xFF1A1A1A)
        )
    } else {
        lightColorScheme(
            primary = Color(0xFF4A90E2),
            secondary = Color(0xFF50C878),
            surface = Color(0xFFFFFFFF)
        )
    }
    
    MaterialTheme(colorScheme = colorScheme) {
        content()
    }
}
```

## Key Differences & Considerations

### 1. Layout
- **Web**: Flexbox with `flex`, `gap`, etc.
- **React Native**: Same classes work with NativeWind
- **iOS**: `VStack`, `HStack` with `spacing`
- **Android**: `Column`, `Row` with `Arrangement.spacedBy()`

### 2. Styling
- **Web/RN**: Tailwind classes
- **iOS**: SwiftUI modifiers (`.padding()`, `.background()`, etc.)
- **Android**: Compose modifiers (`Modifier.padding()`, `Modifier.background()`, etc.)

### 3. Icons
- **Web**: `lucide-react`
- **React Native**: `@expo/vector-icons` or `react-native-vector-icons`
- **iOS**: SF Symbols (`Image(systemName:)`)
- **Android**: Material Icons (`Icons.Default.PlayArrow`)

### 4. Accessibility
- **Web**: `aria-label`, `aria-pressed`, etc.
- **React Native**: `accessibilityLabel`, `accessibilityRole`, `accessibilityState`
- **iOS**: `.accessibilityLabel()`, `.accessibilityValue()`
- **Android**: `contentDescription`, `semantics` modifier

### 5. Touch Interactions
- **Web**: `onClick`
- **React Native**: `onPress` (Pressable/TouchableOpacity)
- **iOS**: `Button(action:)` or `.onTapGesture()`
- **Android**: `onClick` lambda in Compose

## Testing Checklist

- [ ] All buttons respond to touch/tap
- [ ] Disabled states work correctly
- [ ] Dark mode theme applies correctly
- [ ] Accessibility labels are read by screen readers
- [ ] Layout adapts to different screen sizes
- [ ] Icons display correctly on all platforms
- [ ] Animations/transitions work smoothly
- [ ] State changes reflect in UI immediately

## Next Steps

1. Create native button components matching shadcn/ui style
2. Set up theme system for dark mode switching
3. Add haptic feedback for button presses (native)
4. Implement gesture support (swipe to reset, etc.)
5. Add animations using platform-specific APIs:
   - React Native: `Animated` or `react-native-reanimated`
   - iOS: SwiftUI animations
   - Android: Compose animations
