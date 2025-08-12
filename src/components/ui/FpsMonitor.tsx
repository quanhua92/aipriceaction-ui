/**
 * Simple FPS Monitor Component
 * 
 * Monitors the frame rate of the React application by tracking
 * requestAnimationFrame callbacks and displaying real-time FPS.
 */

import { useEffect, useState, useRef } from 'react';

interface FpsMonitorProps {
	className?: string;
	position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
	showOnlyInDev?: boolean;
}

export function FpsMonitor({ 
	className = '', 
	position = 'top-right',
	showOnlyInDev = true 
}: FpsMonitorProps) {
	const [fps, setFps] = useState(0);
	const frameCountRef = useRef(0);
	const lastTimeRef = useRef(performance.now());
	const animationIdRef = useRef<number>();

	useEffect(() => {
		const updateFps = (currentTime: number) => {
			frameCountRef.current++;
			
			if (currentTime >= lastTimeRef.current + 1000) {
				setFps(Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current)));
				frameCountRef.current = 0;
				lastTimeRef.current = currentTime;
			}
			
			animationIdRef.current = requestAnimationFrame(updateFps);
		};

		animationIdRef.current = requestAnimationFrame(updateFps);

		return () => {
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
			}
		};
	}, []);

	// Only show in development if showOnlyInDev is true
	if (showOnlyInDev && process.env.NODE_ENV === 'production') {
		return null;
	}

	const positionClasses = {
		'top-left': 'top-4 left-4',
		'top-right': 'top-16 right-4',
		'bottom-left': 'bottom-4 left-4',
		'bottom-right': 'bottom-4 right-4',
	};

	const fpsColor = fps >= 55 ? 'text-green-600' : fps >= 30 ? 'text-yellow-600' : 'text-red-600';

	return (
		<div 
			className={`fixed ${positionClasses[position]} z-50 pointer-events-none select-none ${className}`}
		>
			<div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-mono">
				<span className={fpsColor}>{fps}</span> FPS
			</div>
		</div>
	);
}