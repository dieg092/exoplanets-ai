import type { Metadata } from "next"
import { Fellix } from "@/styles/fonts"
import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Exoplanets-AI",
  description:
    "EXOPLANETS-AI simula el universo y permite la exploración de los exoplanetas en 3D a escala real con inteligencia artificial para guiar a los usuarios en la exploración de los distintos cuerpos celestes y sus propiedades. El objetivo de EXOPLANETS-AI es brindar al usuario una experiencia inmersiva mientras descubre exoplanetas. Impulsado por Inteligencia artificial, utiliza Vercel AI SDK, conecta la API de la NASA con OpenAI y un entorno 3D del universo.",
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
