import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Timerist - Timer Controls Demo",
  description: "Fitness timer controls component demo",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="font-sans" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
