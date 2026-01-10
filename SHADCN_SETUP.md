# shadcn/ui Setup Instructions for TimerControls

This document provides the commands needed to install all required shadcn/ui components for the `TimerControls` component.

## Prerequisites

Ensure you have a Next.js project set up with Tailwind CSS and shadcn/ui initialized:

```bash
npx create-next-app@latest timerist --typescript --tailwind --app
cd timerist
npx shadcn-ui@latest init
```

## Required Components

Install the following shadcn/ui components:

```bash
# Button component (required)
npx shadcn-ui@latest add button

# Toggle Group component (for mode selector)
npx shadcn-ui@latest add toggle-group

# Toggle component (dependency of toggle-group)
npx shadcn-ui@latest add toggle

# Badge component (for status indicators)
npx shadcn-ui@latest add badge

# Slider component (for duration picker)
npx shadcn-ui@latest add slider
```

## Additional Dependencies

The components also require these peer dependencies (usually auto-installed):

```bash
# Radix UI primitives (auto-installed with shadcn components)
# @radix-ui/react-slot (for Button)
# @radix-ui/react-toggle-group (for ToggleGroup)
# @radix-ui/react-toggle (for Toggle)
# @radix-ui/react-slider (for Slider)

# Utility libraries
npm install class-variance-authority clsx tailwind-merge

# Icons (lucide-react)
npm install lucide-react
```

## File Structure

After installation, your project structure should look like:

```
timerist/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   ├── badge.tsx
│   │   └── slider.tsx
│   └── TimerControls.tsx
├── lib/
│   └── utils.ts
├── app/
│   └── globals.css
└── package.json
```

## Configuration

### 1. Update `tailwind.config.js`

Ensure your Tailwind config includes the component paths:

```js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Your theme extensions
    },
  },
  plugins: [],
}
```

### 2. Update `app/globals.css`

The `globals.css` file should include:
- Tailwind directives
- Design token CSS variables (mapped from `themes.css`)
- Base layer styles

See the provided `app/globals.css` file for the complete setup.

### 3. Update `lib/utils.ts`

Ensure the `cn` utility function is set up:

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Verification

After installation, verify the setup:

1. **Check imports**: All components should import without errors
2. **Check styles**: Design tokens should be available via CSS variables
3. **Test component**: Import and render `TimerControls` in a test page

```tsx
// app/test-timer/page.tsx
import { TimerControls } from "@/components/TimerControls"

export default function TestTimerPage() {
  return (
    <TimerControls
      isRunning={false}
      mode="tabata"
      onTogglePlayPause={() => {}}
      onReset={() => {}}
    />
  )
}
```

## Troubleshooting

### Issue: "Cannot find module '@/components/ui/button'"

**Solution**: Ensure your `tsconfig.json` has the path alias configured:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: CSS variables not working

**Solution**: Ensure `globals.css` is imported in your root layout:

```tsx
// app/layout.tsx
import "./globals.css"
```

### Issue: Icons not displaying

**Solution**: Ensure `lucide-react` is installed:

```bash
npm install lucide-react
```

### Issue: ToggleGroup not working

**Solution**: Ensure both `toggle` and `toggle-group` are installed:

```bash
npx shadcn-ui@latest add toggle
npx shadcn-ui@latest add toggle-group
```

## Next Steps

1. Install all components using the commands above
2. Copy the provided `TimerControls.tsx` to `components/TimerControls.tsx`
3. Copy the provided `globals.css` to `app/globals.css`
4. Test the component in your app
5. Customize design tokens in `globals.css` to match your brand

## Design Token Mapping

The `globals.css` file maps the existing Timerist CSS variables (from `styles/themes.css`) to shadcn/ui design tokens:

- `--primary-color` → `--primary`
- `--secondary-color` → `--secondary`
- `--card-bg` → `--card`
- `--text-color` → `--foreground`
- `--border-color` → `--border`
- etc.

This ensures visual consistency between the vanilla HTML version and the React component version.
