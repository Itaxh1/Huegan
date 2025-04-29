"use client"

import { useEffect } from "react"
import chroma from "chroma-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"
import { motion } from "framer-motion"

interface ColorPickerProps {
  baseColor: string
  setBaseColor: (color: string) => void
  setPalette: (palette: any) => void
}

export function ColorPicker({ baseColor, setBaseColor, setPalette }: ColorPickerProps) {
  // Generate random color
  const generateRandomColor = () => {
    const randomColor = chroma.random().hex()
    setBaseColor(randomColor)
  }

  // Generate color palette based on the base color
  const generatePalette = (color: string) => {
    try {
      const base = chroma(color)

      // Generate analogous colors (adjacent on the color wheel)
      const analogous = [
        base.set("hsl.h", (base.get("hsl.h") - 30) % 360).hex(),
        base.hex(),
        base.set("hsl.h", (base.get("hsl.h") + 30) % 360).hex(),
      ]

      // Generate monochromatic colors (same hue, different saturation/lightness)
      const monochromatic = [
        base.set("hsl.s", 0.3).set("hsl.l", 0.8).hex(),
        base.hex(),
        base.set("hsl.s", 0.8).set("hsl.l", 0.3).hex(),
      ]

      // Generate triadic colors (evenly spaced on the color wheel)
      const triadic = [
        base.hex(),
        base.set("hsl.h", (base.get("hsl.h") + 120) % 360).hex(),
        base.set("hsl.h", (base.get("hsl.h") + 240) % 360).hex(),
      ]

      // Generate complementary colors (opposite on the color wheel)
      const complementary = [base.hex(), base.set("hsl.h", (base.get("hsl.h") + 180) % 360).hex()]

      // Generate shades (lighter to darker)
      const shades = [
        base.brighten(2).hex(),
        base.brighten(1).hex(),
        base.hex(),
        base.darken(1).hex(),
        base.darken(2).hex(),
      ]

      setPalette({
        analogous,
        monochromatic,
        triadic,
        complementary,
        shades,
      })
    } catch (error) {
      console.error("Invalid color", error)
    }
  }

  // Update palette when base color changes
  useEffect(() => {
    generatePalette(baseColor)
  }, [baseColor])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-heading">Color Picker</CardTitle>
        <CardDescription>Choose a base color to generate a palette</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="color-input">Base Color</Label>
          <div className="flex gap-2">
            <Input
              id="color-input"
              type="text"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="font-mono"
            />
            <Input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-12 h-10 p-1 cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Color Preview</Label>
          <motion.div
            className="w-full h-32 rounded-md border"
            style={{ backgroundColor: baseColor }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button variant="outline" className="w-full" onClick={generateRandomColor}>
            <Shuffle className="mr-2 h-4 w-4" />
            Random Color
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )
}
