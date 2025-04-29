"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, X, Trash2, AlertCircle, Sparkles, Zap, PaintBucket } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import chroma from "chroma-js"

interface ColorChatProps {
  setBaseColor: (color: string) => void
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function ColorChat({ setBaseColor }: ColorChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastColor, setLastColor] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load messages from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem("huegan-chat-history")
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages)
          if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
            setMessages(parsedMessages)

            // Extract the last color from the assistant messages
            const assistantMessages = parsedMessages.filter((m) => m.role === "assistant")
            if (assistantMessages.length > 0) {
              const lastAssistantMessage = assistantMessages[assistantMessages.length - 1]
              const colorMatch = lastAssistantMessage.content.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g)
              if (colorMatch && colorMatch.length > 0) {
                setLastColor(colorMatch[0])
              }
            }
          }
        } catch (e) {
          console.error("Error parsing saved messages:", e)
        }
      }
    }
  }, [])

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Extract color codes from AI responses and save messages to localStorage
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === "assistant") {
      // Look for hex color codes in the response
      const colorMatch = lastMessage.content.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g)
      if (colorMatch && colorMatch.length > 0) {
        setBaseColor(colorMatch[0])
        setLastColor(colorMatch[0])
      }
    }

    // Save messages to localStorage whenever they change
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem("huegan-chat-history", JSON.stringify(messages))
    }
  }, [messages, setBaseColor])

  const toggleChat = () => setIsOpen(!isOpen)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  // Basic color name to hex mapping
  const colorNameMap: Record<string, string> = {
    red: "#e74c3c",
    orange: "#f39c12",
    yellow: "#f1c40f",
    green: "#2ecc71",
    blue: "#3498db",
    purple: "#9b59b6",
    pink: "#e84393",
    brown: "#795548",
    gray: "#95a5a6",
    black: "#2c3e50",
    white: "#ecf0f1",
    teal: "#1abc9c",
    navy: "#34495e",
    lime: "#c6ff00",
    cyan: "#00bcd4",
    magenta: "#e91e63",
    lavender: "#967bb6",
    maroon: "#800000",
    olive: "#808000",
    mint: "#00b894",
    coral: "#ff7f50",
    salmon: "#fa8072",
    turquoise: "#40e0d0",
    beige: "#f5f5dc",
    indigo: "#3f51b5",
    violet: "#8e44ad",
    gold: "#ffd700",
    silver: "#bdc3c7",
    tan: "#d2b48c",
    aqua: "#00ffff",
  }

  // Function to generate a color based on user input
  const generateColorResponse = (userInput: string): { color: string; explanation: string } => {
    const input = userInput.toLowerCase()

    // Check if the user is asking for a modification of the previous color
    if (
      lastColor &&
      (input.includes("lighter") ||
        input.includes("brighter") ||
        input.includes("darker") ||
        input.includes("more vivid") ||
        input.includes("more saturated") ||
        input.includes("less saturated") ||
        input.includes("duller") ||
        input.includes("paler") ||
        input.includes("shade") ||
        input.includes("tint") ||
        input.includes("tone"))
    ) {
      try {
        let newColor = chroma(lastColor)
        let explanation = ""

        if (input.includes("lighter") || input.includes("brighter")) {
          const amount = input.includes("much") || input.includes("very") ? 0.3 : 0.15
          newColor = newColor.brighten(amount)
          explanation = `I've made the previous color (${lastColor}) lighter.`
        } else if (input.includes("darker")) {
          const amount = input.includes("much") || input.includes("very") ? 0.3 : 0.15
          newColor = newColor.darken(amount)
          explanation = `I've made the previous color (${lastColor}) darker.`
        } else if (input.includes("more vivid") || input.includes("more saturated")) {
          newColor = newColor.saturate(1)
          explanation = `I've made the previous color (${lastColor}) more saturated.`
        } else if (input.includes("less saturated") || input.includes("duller") || input.includes("paler")) {
          newColor = newColor.desaturate(1)
          explanation = `I've made the previous color (${lastColor}) less saturated.`
        } else if (input.includes("shade")) {
          newColor = chroma.mix(lastColor, "black", 0.3)
          explanation = `I've created a shade of the previous color (${lastColor}).`
        } else if (input.includes("tint")) {
          newColor = chroma.mix(lastColor, "white", 0.3)
          explanation = `I've created a tint of the previous color (${lastColor}).`
        } else if (input.includes("tone")) {
          newColor = chroma.mix(lastColor, "gray", 0.3)
          explanation = `I've created a tone of the previous color (${lastColor}).`
        }

        return { color: newColor.hex(), explanation }
      } catch (e) {
        console.error("Error modifying color:", e)
      }
    }

    // Check for specific color names
    for (const [colorName, hexValue] of Object.entries(colorNameMap)) {
      if (input.includes(colorName)) {
        // Check for modifiers
        try {
          let color = chroma(hexValue)
          let explanation = `Here's a ${colorName} color.`

          if (input.includes("light") || input.includes("bright")) {
            color = color.brighten(0.5)
            explanation = `Here's a lighter shade of ${colorName}.`
          } else if (input.includes("dark")) {
            color = color.darken(0.5)
            explanation = `Here's a darker shade of ${colorName}.`
          } else if (input.includes("vivid") || input.includes("saturated")) {
            color = color.saturate(1)
            explanation = `Here's a more vivid ${colorName}.`
          } else if (input.includes("dull") || input.includes("muted")) {
            color = color.desaturate(1)
            explanation = `Here's a more muted ${colorName}.`
          }

          return { color: color.hex(), explanation }
        } catch (e) {
          console.error("Error generating color:", e)
        }
      }
    }

    // Handle mood/theme-based requests
    if (input.includes("calm") || input.includes("peaceful") || input.includes("relax")) {
      return {
        color: "#a8d8ea",
        explanation: "This soft blue creates a calm, peaceful atmosphere.",
      }
    } else if (input.includes("energetic") || input.includes("vibrant") || input.includes("lively")) {
      return {
        color: "#ff7e67",
        explanation: "This vibrant coral color brings energy and excitement.",
      }
    } else if (input.includes("professional") || input.includes("corporate") || input.includes("business")) {
      return {
        color: "#34495e",
        explanation: "This deep navy blue conveys professionalism and trust.",
      }
    } else if (input.includes("natural") || input.includes("organic") || input.includes("earth")) {
      return {
        color: "#8d8741",
        explanation: "This earthy green represents natural and organic themes.",
      }
    } else if (input.includes("luxury") || input.includes("elegant") || input.includes("premium")) {
      return {
        color: "#c0b283",
        explanation: "This gold tone conveys luxury and elegance.",
      }
    } else if (input.includes("tech") || input.includes("modern") || input.includes("digital")) {
      return {
        color: "#0984e3",
        explanation: "This bright blue represents technology and innovation.",
      }
    } else if (input.includes("warm") || input.includes("cozy")) {
      return {
        color: "#e17055",
        explanation: "This warm orange creates a cozy, inviting feeling.",
      }
    } else if (input.includes("cool") || input.includes("fresh")) {
      return {
        color: "#74b9ff",
        explanation: "This cool blue creates a fresh, airy feeling.",
      }
    }

    // If no specific request is matched, generate a random color
    const randomHue = Math.floor(Math.random() * 360)
    const color = chroma.hsl(randomHue, 0.7, 0.6).hex()
    return {
      color,
      explanation: `I've generated a random color based on your request. This should work well for "${userInput}".`,
    }
  }

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setError(null)
    setIsLoading(true)

    // Create a user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    }

    // Add user message to state
    setMessages((prev) => [...prev, userMessage])

    // Clear input
    setInput("")

    try {
      // Simulate typing delay
      await new Promise((resolve) => setTimeout(resolve, 600))

      // Generate color response
      const { color, explanation } = generateColorResponse(userMessage.content)

      // Create assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `${explanation} (${color})`,
      }

      // Add assistant message to state
      setMessages((prev) => [...prev, assistantMessage])

      // Update the base color
      setBaseColor(color)
      setLastColor(color)
    } catch (err) {
      console.error("Error generating response:", err)
      setError("Failed to generate a color. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Clear chat history
  const clearChat = () => {
    setMessages([])
    setError(null)
    setLastColor(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("huegan-chat-history")
    }
  }

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        className="fixed bottom-4 left-4 px-4 py-2 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
      >
        {isOpen ? (
          <X size={18} className="mr-1" />
        ) : (
          <>
            <PaintBucket size={18} className="mr-2" />
            <span className="font-medium">Ask AI</span>
          </>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 left-4 w-80 z-10"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="shadow-xl border-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-heading flex items-center">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Color Assistant
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={clearChat}
                      title="Clear chat history"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-xs">
                  Ask for colors or modifications (lighter, darker, more vivid)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3">
                {/* Error message */}
                {error && (
                  <div className="mb-2 p-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md text-xs flex items-start">
                    <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Messages */}
                <div className="h-60 overflow-y-auto mb-2 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm p-4">
                      Try asking for:
                      <ul className="text-xs mt-2 space-y-1 text-left list-disc pl-4">
                        <li>A specific color: "dark blue"</li>
                        <li>A mood: "calm" or "energetic"</li>
                        <li>Modifications: "lighter" or "more vivid"</li>
                      </ul>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {message.role === "user" ? (
                              <User className="h-3 w-3" />
                            ) : (
                              <Zap className="h-3 w-3 text-primary" />
                            )}
                            <span className="text-xs font-medium">{message.role === "user" ? "You" : "Assistant"}</span>
                          </div>
                          <div>
                            {message.content}
                            {message.role === "assistant" &&
                              message.content.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g) && (
                                <div
                                  className="w-full h-4 mt-1 rounded"
                                  style={{
                                    backgroundColor: message.content.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g)?.[0],
                                  }}
                                />
                              )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <form onSubmit={sendMessage} className="flex w-full gap-2">
                  <Input
                    placeholder="Describe a color or mood..."
                    value={input}
                    onChange={handleInputChange}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                    {isLoading && <span className="sr-only">Loading...</span>}
                  </Button>
                </form>
              </CardFooter>
              <div className="text-center text-xs text-muted-foreground pb-2">
                <span>
                  © 2025 by{" "}
                  <a
                    href="https://ashxinkumar.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Ashwin Kumar
                  </a>
                </span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
