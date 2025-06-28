"use client"

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ReactiveButtonProps {
    children: React.ReactNode;
    baseColor?: string;
    gradient?: boolean;
    gradientColor?: string;
    className?: string;
    onClick?: () => void;
}

function ReactiveButton({
    children,
    baseColor = "#3b82f6",
    gradient = true,
    gradientColor = "#FF6B35",
    className,
    onClick,
    ...props
}: ReactiveButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current || !gradient) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMousePosition({ x, y });
    }

    const handleMouseEnter = () => {
        setIsHovered(true);
    }

    const handleMouseLeave = () => {
        setIsHovered(false);
    } 

    const gradientStyle = 
        gradient && isHovered ? {
            background: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, ${gradientColor}40, transparent 70%), ${baseColor}`,
        } : {
            background: baseColor,
        };
    
    return (
        <button 
            ref={buttonRef}
            className={cn(
                "relative px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ease-out overflow-hidden",
                "hover:shadow-lg active:scale-95",
                className
            )}
            style={gradientStyle}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    )
}

export default ReactiveButton;