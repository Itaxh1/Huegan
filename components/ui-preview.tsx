"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import {
  Moon,
  Sun,
  Home,
  Settings,
  Users,
  BarChart3,
  Mail,
  FileText,
  ArrowRight,
  Download,
  Copy,
  Check,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Tablet,
  Info,
  ChevronRight,
  CreditCard,
  ShoppingBag,
  Plane,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import chroma from "chroma-js"

interface UIPreviewProps {
  baseColor: string
  palette: {
    analogous: string[]
    monochromatic: string[]
    triadic: string[]
    complementary: string[]
    shades: string[]
  }
}

export function UIPreview({ baseColor, palette }: UIPreviewProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [previewType, setPreviewType] = useState("dashboard")
  const [devicePreview, setDevicePreview] = useState("desktop")
  const [showColorInfo, setShowColorInfo] = useState(false)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [selectedShade, setSelectedShade] = useState(500)
  const [showColorGrid, setShowColorGrid] = useState(false)
  const [contrastRatio, setContrastRatio] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const [notification, setNotification] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  })

  // Get colors from the palette
  const primary = baseColor
  const secondary = palette.analogous[2] || "#000000"
  const accent = palette.triadic[1] || "#000000"
  const neutral = palette.shades[1] || "#000000"
  const muted = palette.monochromatic[0] || "#000000"

  // Generate a full color scale for the primary color
  const generateColorScale = (color: string) => {
    try {
      const base = chroma(color)
      return {
        50: base.luminance(0.95).hex(),
        100: base.luminance(0.9).hex(),
        200: base.luminance(0.8).hex(),
        300: base.luminance(0.7).hex(),
        400: base.luminance(0.6).hex(),
        500: base.hex(),
        600: base.luminance(0.4).hex(),
        700: base.luminance(0.3).hex(),
        800: base.luminance(0.2).hex(),
        900: base.luminance(0.1).hex(),
        950: base.luminance(0.05).hex(),
      }
    } catch (e) {
      return {
        50: "#f8f9fa",
        100: "#f1f3f5",
        200: "#e9ecef",
        300: "#dee2e6",
        400: "#ced4da",
        500: "#adb5bd",
        600: "#868e96",
        700: "#495057",
        800: "#343a40",
        900: "#212529",
        950: "#0d0f10",
      }
    }
  }

  const colorScale = generateColorScale(primary)
  const secondaryScale = generateColorScale(secondary)

  // Calculate contrast ratio between text and background
  const calculateContrast = (textColor: string, bgColor: string) => {
    try {
      return chroma.contrast(textColor, bgColor)
    } catch (e) {
      return null
    }
  }

  // Apply colors to CSS variables
  const applyColors = () => {
    document.documentElement.style.setProperty("--preview-primary", primary)
    document.documentElement.style.setProperty("--preview-primary-50", colorScale[50])
    document.documentElement.style.setProperty("--preview-primary-100", colorScale[100])
    document.documentElement.style.setProperty("--preview-primary-200", colorScale[200])
    document.documentElement.style.setProperty("--preview-primary-300", colorScale[300])
    document.documentElement.style.setProperty("--preview-primary-400", colorScale[400])
    document.documentElement.style.setProperty("--preview-primary-500", colorScale[500])
    document.documentElement.style.setProperty("--preview-primary-600", colorScale[600])
    document.documentElement.style.setProperty("--preview-primary-700", colorScale[700])
    document.documentElement.style.setProperty("--preview-primary-800", colorScale[800])
    document.documentElement.style.setProperty("--preview-primary-900", colorScale[900])
    document.documentElement.style.setProperty("--preview-primary-950", colorScale[950])
    document.documentElement.style.setProperty("--preview-secondary", secondary)
    document.documentElement.style.setProperty("--preview-accent", accent)
    document.documentElement.style.setProperty("--preview-muted", muted)
    document.documentElement.style.setProperty("--preview-neutral", neutral)
  }

  // Only show the theme UI when mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Apply colors when component mounts or colors change
  useEffect(() => {
    setIsLoading(true)
    applyColors()

    // Calculate contrast ratio for accessibility
    const bgColor = resolvedTheme === "dark" ? "#1f2937" : "#faf8f5" // Warm white in light mode
    const textContrast = calculateContrast(primary, bgColor)
    setContrastRatio(textContrast)

    // Simulate loading for animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [baseColor, palette, resolvedTheme])

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }

  const isDark = resolvedTheme === "dark"

  // Copy color to clipboard
  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setNotification({
      visible: true,
      message: `${color} copied to clipboard!`,
    })
    setTimeout(() => {
      setCopiedColor(null)
      setNotification({ visible: false, message: "" })
    }, 2000)
  }

  // Export color palette as CSS variables
  const exportAsCSSVariables = () => {
    const css = `:root {
  --color-primary-50: ${colorScale[50]};
  --color-primary-100: ${colorScale[100]};
  --color-primary-200: ${colorScale[200]};
  --color-primary-300: ${colorScale[300]};
  --color-primary-400: ${colorScale[400]};
  --color-primary-500: ${colorScale[500]};
  --color-primary-600: ${colorScale[600]};
  --color-primary-700: ${colorScale[700]};
  --color-primary-800: ${colorScale[800]};
  --color-primary-900: ${colorScale[900]};
  --color-primary-950: ${colorScale[950]};
  
  --color-secondary: ${secondary};
  --color-accent: ${accent};
  --color-muted: ${muted};
  --color-neutral: ${neutral};
}`

    const blob = new Blob([css], { type: "text/css" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "huegan-palette.css"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setNotification({
      visible: true,
      message: "CSS Variables exported!",
    })
    setTimeout(() => setNotification({ visible: false, message: "" }), 2000)
  }

  // Take screenshot of the preview
  const takeScreenshot = () => {
    if (!previewRef.current) return

    setNotification({
      visible: true,
      message: "Screenshot functionality will be available in the next update.",
    })
    setTimeout(() => setNotification({ visible: false, message: "" }), 2000)
  }

  // Color swatch component
  const ColorSwatch = ({ color, label }: { color: string; label: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => copyToClipboard(color)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="w-full h-12 rounded-md mb-1 relative group" style={{ backgroundColor: color }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-md">
                {copiedColor === color ? (
                  <Check className="h-4 w-4 text-white drop-shadow-md" />
                ) : (
                  <Copy className="h-4 w-4 text-white drop-shadow-md" />
                )}
              </div>
            </div>
            <span className="text-xs font-mono">{label}</span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{color}</p>
          <p className="text-xs text-muted-foreground">Click to copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-heading">UI Preview</CardTitle>
          <CardDescription>See how your palette looks in a real UI</CardDescription>
        </div>
        <div className="flex items-center space-x-4">
          {mounted && (
            <motion.div className="flex items-center space-x-2" whileTap={{ scale: 0.95 }}>
              <Sun className="h-4 w-4" />
              <Switch
                checked={isDark}
                onCheckedChange={toggleTheme}
                aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              />
              <Moon className="h-4 w-4" />
            </motion.div>
          )}
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="icon" onClick={() => setShowColorGrid(!showColorGrid)}>
                      {showColorGrid ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showColorGrid ? "Hide" : "Show"} color grid</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="icon" onClick={exportAsCSSVariables}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export as CSS variables</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="icon" onClick={takeScreenshot}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy screenshot</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <style jsx global>{`
          :root {
            --preview-primary: ${primary};
            --preview-primary-50: ${colorScale[50]};
            --preview-primary-100: ${colorScale[100]};
            --preview-primary-200: ${colorScale[200]};
            --preview-primary-300: ${colorScale[300]};
            --preview-primary-400: ${colorScale[400]};
            --preview-primary-500: ${colorScale[500]};
            --preview-primary-600: ${colorScale[600]};
            --preview-primary-700: ${colorScale[700]};
            --preview-primary-800: ${colorScale[800]};
            --preview-primary-900: ${colorScale[900]};
            --preview-primary-950: ${colorScale[950]};
            --preview-secondary: ${secondary};
            --preview-accent: ${accent};
            --preview-muted: ${muted};
            --preview-neutral: ${neutral};
          }
          
          .preview-primary { background-color: var(--preview-primary); }
          .preview-primary-50 { background-color: var(--preview-primary-50); }
          .preview-primary-100 { background-color: var(--preview-primary-100); }
          .preview-primary-200 { background-color: var(--preview-primary-200); }
          .preview-primary-300 { background-color: var(--preview-primary-300); }
          .preview-primary-400 { background-color: var(--preview-primary-400); }
          .preview-primary-500 { background-color: var(--preview-primary-500); }
          .preview-primary-600 { background-color: var(--preview-primary-600); }
          .preview-primary-700 { background-color: var(--preview-primary-700); }
          .preview-primary-800 { background-color: var(--preview-primary-800); }
          .preview-primary-900 { background-color: var(--preview-primary-900); }
          .preview-primary-950 { background-color: var(--preview-primary-950); }
          .preview-secondary { background-color: var(--preview-secondary); }
          .preview-accent { background-color: var(--preview-accent); }
          .preview-muted { background-color: var(--preview-muted); }
          .preview-neutral { background-color: var(--preview-neutral); }
          
          .preview-text-primary { color: var(--preview-primary); }
          .preview-text-secondary { color: var(--preview-secondary); }
          .preview-text-accent { color: var(--preview-accent); }
          
          .preview-border-primary { border-color: var(--preview-primary); }
          .preview-border-secondary { border-color: var(--preview-secondary); }
          .preview-border-accent { border-color: var(--preview-accent); }
          
          .dark .preview-text-primary { color: var(--preview-primary); }
          .dark .preview-text-secondary { color: var(--preview-secondary); }
          .dark .preview-text-accent { color: var(--preview-accent); }
          
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          
          .shimmer {
            background: linear-gradient(90deg, 
              rgba(255,255,255,0) 0%, 
              rgba(255,255,255,0.2) 25%, 
              rgba(255,255,255,0.2) 50%, 
              rgba(255,255,255,0) 100%);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
        `}</style>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="absolute inset-0 bg-background/80 z-10 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 rounded-full preview-primary shimmer"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showColorGrid && (
            <motion.div
              className="p-4 border-b"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-sm font-medium font-heading">Color Scale</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">Shade: {selectedShade}</span>
                  <Slider
                    value={[selectedShade]}
                    min={50}
                    max={950}
                    step={50}
                    className="w-32"
                    onValueChange={(value) => setSelectedShade(value[0])}
                  />
                </div>
              </div>
              <motion.div
                className="grid grid-cols-11 gap-1"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, staggerChildren: 0.03 }}
              >
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                  <ColorSwatch key={`shade-${shade}`} color={colorScale[shade]} label={shade.toString()} />
                ))}
              </motion.div>

              {contrastRatio && (
                <motion.div
                  className="mt-4 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge variant={contrastRatio >= 4.5 ? "default" : "destructive"} className="mr-2">
                    {contrastRatio.toFixed(2)}:1
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {contrastRatio >= 4.5 ? "Passes WCAG AA standard" : "Does not meet WCAG AA standard"}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                          <Info className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">WCAG AA requires a contrast ratio of at least 4.5:1 for normal text</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border-t">
          <Tabs defaultValue="dashboard" onValueChange={setPreviewType}>
            <div className="px-4 py-2 border-b flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
                <TabsTrigger value="buttons">Buttons</TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={devicePreview === "mobile" ? "secondary" : "ghost"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setDevicePreview("mobile")}
                        >
                          <Smartphone className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mobile view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={devicePreview === "tablet" ? "secondary" : "ghost"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setDevicePreview("tablet")}
                        >
                          <Tablet className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tablet view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={devicePreview === "desktop" ? "secondary" : "ghost"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setDevicePreview("desktop")}
                        >
                          <Monitor className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Desktop view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <motion.div
              ref={previewRef}
              className={cn(
                "transition-all duration-300",
                devicePreview === "mobile" && "max-w-[375px] mx-auto",
                devicePreview === "tablet" && "max-w-[768px] mx-auto",
              )}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <TabsContent value="dashboard" className="m-0">
                <div className="flex h-[500px] overflow-hidden">
                  <SidebarProvider defaultOpen={devicePreview !== "mobile"}>
                    <Sidebar
                      className="w-[200px] border-r"
                      collapsible={devicePreview === "mobile" ? "always" : "none"}
                    >
                      <SidebarHeader className="p-4 border-b">
                        <div className="font-bold flex items-center font-heading">
                          <div className="w-4 h-4 rounded-full preview-primary mr-2"></div>
                          Huegan App
                        </div>
                      </SidebarHeader>
                      <SidebarContent>
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <SidebarMenuButton className="preview-text-primary">
                              <Home className="w-4 h-4" />
                              <span>Dashboard</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton>
                              <Users className="w-4 h-4" />
                              <span>Users</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton>
                              <BarChart3 className="w-4 h-4" />
                              <span>Analytics</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton>
                              <Mail className="w-4 h-4" />
                              <span>Messages</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton>
                              <FileText className="w-4 h-4" />
                              <span>Documents</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarContent>
                      <SidebarFooter className="p-4 border-t">
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <SidebarMenuButton>
                              <Settings className="w-4 h-4" />
                              <span>Settings</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarFooter>
                    </Sidebar>

                    <div className="flex-1 p-4 overflow-auto">
                      <h2 className="text-xl font-bold mb-4 font-heading">Dashboard Overview</h2>

                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ staggerChildren: 0.1 }}
                      >
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                          <Card className="preview-border-primary border-t-4">
                            <CardContent className="p-4">
                              <div className="text-sm text-muted-foreground">Total Users</div>
                              <div className="text-2xl font-bold preview-text-primary">2,543</div>
                              <div className="text-xs text-green-500 mt-1">+12% from last month</div>
                            </CardContent>
                          </Card>
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                          <Card className="preview-border-secondary border-t-4">
                            <CardContent className="p-4">
                              <div className="text-sm text-muted-foreground">Revenue</div>
                              <div className="text-2xl font-bold preview-text-secondary">$45,231</div>
                              <div className="text-xs text-green-500 mt-1">+8% from last month</div>
                            </CardContent>
                          </Card>
                        </motion.div>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                          <Card className="preview-border-accent border-t-4">
                            <CardContent className="p-4">
                              <div className="text-sm text-muted-foreground">Active Projects</div>
                              <div className="text-2xl font-bold preview-text-accent">12</div>
                              <div className="text-xs text-red-500 mt-1">-2 from last month</div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-heading">Traffic Sources</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[150px] flex items-end justify-between gap-2">
                              <motion.div
                                className="w-1/5 preview-primary rounded-t-sm"
                                initial={{ height: "0%" }}
                                animate={{ height: "30%" }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                              ></motion.div>
                              <motion.div
                                className="w-1/5 preview-secondary rounded-t-sm"
                                initial={{ height: "0%" }}
                                animate={{ height: "80%" }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                              ></motion.div>
                              <motion.div
                                className="w-1/5 preview-accent rounded-t-sm"
                                initial={{ height: "0%" }}
                                animate={{ height: "60%" }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                              ></motion.div>
                              <motion.div
                                className="w-1/5 preview-muted rounded-t-sm"
                                initial={{ height: "0%" }}
                                animate={{ height: "45%" }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                              ></motion.div>
                              <motion.div
                                className="w-1/5 preview-neutral rounded-t-sm"
                                initial={{ height: "0%" }}
                                animate={{ height: "75%" }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                              ></motion.div>
                            </div>
                            <div className="flex justify-between mt-2">
                              <span className="text-xs">Direct</span>
                              <span className="text-xs">Social</span>
                              <span className="text-xs">Email</span>
                              <span className="text-xs">Organic</span>
                              <span className="text-xs">Referral</span>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-heading">Revenue Split</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[150px] flex items-center justify-center">
                              <motion.div
                                className="relative w-[120px] h-[120px] rounded-full border-8 preview-border-primary"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: 360 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                              >
                                <div className="absolute top-0 right-0 w-1/2 h-1/2 preview-secondary rounded-tr-full"></div>
                                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 preview-accent rounded-br-full"></div>
                              </motion.div>
                            </div>
                            <div className="flex justify-center gap-4 mt-2">
                              <div className="flex items-center">
                                <div className="w-3 h-3 preview-primary rounded-full mr-1"></div>
                                <span className="text-xs">Products</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 preview-secondary rounded-full mr-1"></div>
                                <span className="text-xs">Services</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 preview-accent rounded-full mr-1"></div>
                                <span className="text-xs">Other</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </SidebarProvider>
                </div>
              </TabsContent>

              <TabsContent value="finance" className="m-0">
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Card className="overflow-hidden">
                        <div className="h-32 preview-primary-100 relative">
                          <img
                            src="/focused-commuter.png"
                            alt="Track expenses"
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute bottom-0 left-0 p-4">
                            <h3 className="text-lg font-semibold preview-text-primary font-heading">
                              Track your expenses
                            </h3>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium">Expenses</h4>
                            <span className="text-xl font-bold preview-text-primary">$12,543</span>
                          </div>
                          <div className="h-[120px] flex items-end justify-between gap-1">
                            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => {
                              const heights = [40, 25, 15, 35, 20, 30]
                              return (
                                <div key={month} className="flex flex-col items-center flex-1">
                                  <motion.div
                                    className="w-full preview-primary-400 rounded-t-sm"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heights[i]}%` }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                  ></motion.div>
                                  <span className="text-xs mt-1">{month}</span>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Card className="overflow-hidden">
                        <div className="h-32 preview-primary-200 relative">
                          <img
                            src="/diverse-people-paying.png"
                            alt="Gain control"
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute bottom-0 left-0 p-4">
                            <h3 className="text-lg font-semibold preview-text-primary font-heading">Gain control</h3>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <motion.div
                              className="flex justify-between items-center"
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                                  <ShoppingBag className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                  <div className="font-medium">Groceries</div>
                                  <div className="text-xs text-muted-foreground">9 transactions</div>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                            <motion.div
                              className="flex justify-between items-center"
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                                  <CreditCard className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                  <div className="font-medium">Household</div>
                                  <div className="text-xs text-muted-foreground">12 transactions</div>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                            <motion.div
                              className="flex justify-between items-center"
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                                  <Plane className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                  <div className="font-medium">Travel</div>
                                  <div className="text-xs text-muted-foreground">8 transactions</div>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-heading">Income</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold preview-text-primary">$15,989</span>
                          <div className="h-10 w-24 relative">
                            <div className="absolute inset-0 flex items-end">
                              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full preview-primary rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: "70%" }}
                                  transition={{ delay: 0.3, duration: 0.8 }}
                                ></motion.div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">$18,871 last period</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-heading">Expenses</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold preview-text-primary">$12,543</span>
                          <div className="h-10 w-24 relative">
                            <div className="absolute inset-0 flex items-end">
                              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full preview-primary rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: "60%" }}
                                  transition={{ delay: 0.3, duration: 0.8 }}
                                ></motion.div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">$10,221 last period</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cards" className="m-0">
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="preview-text-primary font-heading">Feature Card</CardTitle>
                        <CardDescription>A card showcasing a feature</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-20 preview-muted rounded-md mb-4"></div>
                        <p className="text-sm">
                          This card uses your primary color for the title and muted color for the content area.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button className="preview-primary text-white border-0">Learn More</Button>
                        </motion.div>
                      </CardFooter>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="border preview-border-secondary">
                      <CardHeader className="preview-secondary text-white">
                        <CardTitle className="font-heading">Accent Card</CardTitle>
                        <CardDescription className="text-white/70">A card with accent header</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm">This card uses your secondary color for the header background.</p>
                      </CardContent>
                      <CardFooter>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" className="preview-text-secondary preview-border-secondary">
                            View Details
                          </Button>
                        </motion.div>
                      </CardFooter>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="border-2 preview-border-accent">
                      <CardHeader>
                        <CardTitle className="font-heading">Bordered Card</CardTitle>
                        <CardDescription>A card with accent border</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">This card uses your accent color for the border to create emphasis.</p>
                      </CardContent>
                      <CardFooter>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button className="preview-accent text-white border-0">
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </motion.div>
                      </CardFooter>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="bg-gradient-to-br from-[var(--preview-primary)] to-[var(--preview-secondary)] text-white">
                      <CardHeader>
                        <CardTitle className="font-heading">Gradient Card</CardTitle>
                        <CardDescription className="text-white/70">A card with gradient background</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">This card uses a gradient from your primary to secondary color.</p>
                      </CardContent>
                      <CardFooter>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="secondary">Explore</Button>
                        </motion.div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="buttons" className="m-0">
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium font-heading">Primary Buttons</h3>
                    <div className="flex flex-wrap gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="preview-primary text-white border-0">Primary Button</Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="preview-secondary text-white border-0">Secondary Button</Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="preview-accent text-white border-0">Accent Button</Button>
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium font-heading">Outline Buttons</h3>
                    <div className="flex flex-wrap gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" className="preview-text-primary preview-border-primary">
                          Primary Outline
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" className="preview-text-secondary preview-border-secondary">
                          Secondary Outline
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" className="preview-text-accent preview-border-accent">
                          Accent Outline
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium font-heading">Ghost Buttons</h3>
                    <div className="flex flex-wrap gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" className="preview-text-primary">
                          Primary Ghost
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" className="preview-text-secondary">
                          Secondary Ghost
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" className="preview-text-accent">
                          Accent Ghost
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium font-heading">Button Sizes</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="sm" className="preview-primary text-white border-0">
                          Small
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="preview-primary text-white border-0">Default</Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="lg" className="preview-primary text-white border-0">
                          Large
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium font-heading">Button States</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button className="preview-primary text-white border-0">Default</Button>
                      <Button className="preview-primary text-white border-0 opacity-70">Hover</Button>
                      <Button className="preview-primary text-white border-0 opacity-50">Pressed</Button>
                      <Button disabled className="opacity-50">
                        Disabled
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </CardContent>
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-md shadow-lg z-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
