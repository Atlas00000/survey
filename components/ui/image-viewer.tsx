"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { X, ZoomIn, RotateCw, RotateCcw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageViewerProps {
  src: string
  alt: string
  className?: string
}

export function ImageViewer({ src, alt, className }: ImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)

  const handleRotateClockwise = (e: React.MouseEvent) => {
    e.stopPropagation()
    setRotation((prev) => prev + 90)
  }

  const handleRotateCounterClockwise = (e: React.MouseEvent) => {
    e.stopPropagation()
    setRotation((prev) => prev - 90)
  }

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation()
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation()
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    setRotation(0)
    setZoom(1)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    const link = document.createElement("a")
    link.href = src
    link.download = alt || "image"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClose = () => {
    setIsOpen(false)
    // Reset when closed
    setRotation(0)
    setZoom(1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className={`cursor-pointer aspect-video bg-gray-50 flex items-center justify-center overflow-hidden ${className}`}>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain hover:opacity-90 transition-opacity"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black/90" onInteractOutside={handleClose}>
        <div className="relative w-full h-full flex flex-col">
          {/* Toolbar */}
          <div className="flex justify-between items-center p-2 bg-black/80 text-white">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20" 
                onClick={handleRotateCounterClockwise}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Rotate Left
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20" 
                onClick={handleRotateClockwise}
              >
                <RotateCw className="h-4 w-4 mr-1" />
                Rotate Right
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20" 
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4 mr-1" />
                Zoom In
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20" 
                onClick={handleZoomOut}
              >
                <ZoomIn className="h-4 w-4 mr-1" />
                Zoom Out
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20" 
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20" 
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20" 
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Image container */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            <img
              src={src}
              alt={alt}
              style={{
                transform: `rotate(${rotation}deg) scale(${zoom})`,
                transition: "transform 0.3s ease",
                maxHeight: "calc(90vh - 60px)",
                maxWidth: "100%",
              }}
              className="object-contain"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
