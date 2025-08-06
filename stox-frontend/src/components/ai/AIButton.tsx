import React from "react";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles } from "lucide-react";

interface AIButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export default function AIButton({ onClick, isActive = false }: AIButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full shadow-2xl
        bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
        border-2 border-white/20 backdrop-blur-sm
        transition-all duration-300 ease-out
        ${isActive ? 'scale-110 shadow-blue-500/50' : 'hover:scale-105'}
        group
      `}
      size="lg"
    >
      <div className="relative">
        <Bot className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
        <Sparkles 
          className={`
            absolute -top-1 -right-1 w-4 h-4 text-yellow-300 
            transition-all duration-500
            ${isActive ? 'animate-pulse scale-125' : 'opacity-75 group-hover:animate-pulse'}
          `} 
        />
      </div>
    </Button>
  );
}