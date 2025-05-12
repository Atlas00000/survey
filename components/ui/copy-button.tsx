"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  value: string
  className?: string
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  showText?: boolean
}

export function CopyButton({
  value,
  className,
  variant = "outline",
  size = "icon",
  showText = false,
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false)

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(value)
      setHasCopied(true)
      setTimeout(() => setHasCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "transition-all",
        hasCopied && "bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700",
        className
      )}
      onClick={copyToClipboard}
      type="button"
    >
      {hasCopied ? (
        <>
          <Check className="h-4 w-4" />
          {showText && <span className="ml-2">Copied!</span>}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {showText && <span className="ml-2">Copy</span>}
        </>
      )}
    </Button>
  )
}
