"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check } from "lucide-react"
import { motion } from "framer-motion"

interface PaletteGeneratorProps {
  baseColor: string
  palette: {
    analogous: string[]
    monochromatic: string[]
    triadic: string[]
    complementary: string[]
    shades: string[]
  }
}

export function PaletteGenerator({ baseColor, palette }: PaletteGeneratorProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const ColorSwatch = ({ color }: { color: string }) => (
    <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <div
        className="w-full h-16 rounded-md mb-2 relative cursor-pointer group"
        style={{ backgroundColor: color }}
        onClick={() => copyToClipboard(color)}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-md">
          {copiedColor === color ? (
            <Check className="h-5 w-5 text-white drop-shadow-md" />
          ) : (
            <Copy className="h-5 w-5 text-white drop-shadow-md" />
          )}
        </div>
      </div>
      <span className="text-xs font-mono">{color}</span>
    </motion.div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Color Palette</CardTitle>
        <CardDescription>Different color harmonies based on your selection</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="shades">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="shades">Shades</TabsTrigger>
            <TabsTrigger value="analogous">Analogous</TabsTrigger>
            <TabsTrigger value="monochromatic">Mono</TabsTrigger>
            <TabsTrigger value="triadic">Triadic</TabsTrigger>
            <TabsTrigger value="complementary">Complement</TabsTrigger>
          </TabsList>

          <TabsContent value="shades" className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {palette.shades.map((color, index) => (
                <ColorSwatch key={`shade-${index}`} color={color} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analogous" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {palette.analogous.map((color, index) => (
                <ColorSwatch key={`analogous-${index}`} color={color} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monochromatic" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {palette.monochromatic.map((color, index) => (
                <ColorSwatch key={`mono-${index}`} color={color} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="triadic" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {palette.triadic.map((color, index) => (
                <ColorSwatch key={`triadic-${index}`} color={color} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="complementary" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {palette.complementary.map((color, index) => (
                <ColorSwatch key={`complementary-${index}`} color={color} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
