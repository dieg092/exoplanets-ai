import type { Metadata } from "next"
import { Fellix } from "@/styles/fonts"
import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Exoplanets-AI",
  description:
    "Exoplanets AI conecta la API de exoplanetas de la NASA con OpenAI con universo 3D, donde se representa de forma interactiva en tiempo real tanto el exoplaneta del que se esta hablando como su estrella mientras conversas cómodamente con una AI entrenada con la información de la API de la NASA",
  icons: "/favicon.png",
  openGraph: {
    images: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${cn("min-h-screen bg-background font-sans antialiased")} ${
          Fellix.className
        }`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
