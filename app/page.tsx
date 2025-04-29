"use client"

import { useState } from "react"
import { ColorPicker } from "@/components/color-picker"
import { PaletteGenerator } from "@/components/palette-generator"
import { UIPreview } from "@/components/ui-preview"
import { ColorChat } from "@/components/color-chat"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import { motion } from "framer-motion"

export default function Home() {
  const [baseColor, setBaseColor] = useState("#6366f1")
  const [palette, setPalette] = useState({
    analogous: [],
    monochromatic: [],
    triadic: [],
    complementary: [],
    shades: [],
  })

  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">Huegan</h1>
          <p className="text-lg text-muted-foreground">Color Palette Generator</p>
        </motion.div>

        {isMobile ? (
          <>
            <Tabs defaultValue="picker" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="picker">Color Picker</TabsTrigger>
                <TabsTrigger value="palette">Palette</TabsTrigger>
                <TabsTrigger value="preview">UI Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="picker">
                <ColorPicker baseColor={baseColor} setBaseColor={setBaseColor} setPalette={setPalette} />
              </TabsContent>
              <TabsContent value="palette">
                <PaletteGenerator baseColor={baseColor} palette={palette} />
              </TabsContent>
              <TabsContent value="preview">
                <UIPreview baseColor={baseColor} palette={palette} />
              </TabsContent>
            </Tabs>
            {/* Add the ColorChat component for mobile view */}
            <ColorChat setBaseColor={setBaseColor} />
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ColorPicker baseColor={baseColor} setBaseColor={setBaseColor} setPalette={setPalette} />
              {/* Add the ColorChat component below the random color button */}
              <ColorChat setBaseColor={setBaseColor} />
            </div>
            <div className="md:col-span-2 flex flex-col gap-6">
              <PaletteGenerator baseColor={baseColor} palette={palette} />
              <UIPreview baseColor={baseColor} palette={palette} />
            </div>
          </div>
        )}
      </main>

      {/* Add the Footer component */}
      <Footer />
    </div>
  )
}
