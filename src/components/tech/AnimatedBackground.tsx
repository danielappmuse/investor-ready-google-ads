import React, { useEffect, useRef } from 'react';
import logoImage from '@/assets/logo.png';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let resizeTimeout: NodeJS.Timeout;
    
    const resizeCanvas = () => {
      // Use requestAnimationFrame to batch DOM reads/writes
      requestAnimationFrame(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    };

    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    resizeCanvas();
    window.addEventListener('resize', debouncedResize, { passive: true });

    // Color palette - electric tech colors
    const colors = {
      cyan: 'rgba(6, 182, 212, ',
      blue: 'rgba(59, 130, 246, ',
      purple: 'rgba(139, 92, 246, ',
      green: 'rgba(34, 197, 94, '
    };

    // Particle system for logo
    interface Particle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      startX: number;
      startY: number;
      color: string;
      size: number;
      convergenceProgress: number;
      convergenceSpeed: number;
    }

    const logoParticles: Particle[] = [];
    let logoLoaded = false;
    let logoConverged = false;
    let logoShrinkProgress = 0;
    const logoShrinkSpeed = 0.01;
    
    // Final position for logo (centered)
    const finalLogoScale = 0.42; // Smaller for better proportions
    const finalLogoX = canvas.width * 0.5; // Center position
    const finalLogoY = canvas.height * 0.5; // Vertically centered

    // Load and process logo image
    const img = new Image();
    img.src = logoImage;
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Define logo size and position (wider to match original proportions)
      const logoWidth = 120; // Wider to match original logo
      const logoHeight = 100;
      const logoX = canvas.width / 2;
      const logoY = canvas.height / 2.2;

      tempCanvas.width = logoWidth;
      tempCanvas.height = logoHeight;
      tempCtx.drawImage(img, 0, 0, logoWidth, logoHeight);

      const imageData = tempCtx.getImageData(0, 0, logoWidth, logoHeight);
      const data = imageData.data;

      // Sample pixels and create particles (every pixel for maximum sharpness)
      const sampleRate = 1; // Sample every pixel for razor-sharp edges
      for (let y = 0; y < logoHeight; y += sampleRate) {
        for (let x = 0; x < logoWidth; x += sampleRate) {
          const index = (y * logoWidth + x) * 4;
          const alpha = data[index + 3];

          // Only create particles for non-transparent pixels
          if (alpha > 50) {
            const r = Math.floor(data[index] * 0.8); // 20% darker
            const g = Math.floor(data[index + 1] * 0.8); // 20% darker
            const b = Math.floor(data[index + 2] * 0.8); // 20% darker

            // Detect edge pixels for sharper definition
            const isEdge = (
              x === 0 || y === 0 || 
              x === logoWidth - 1 || y === logoHeight - 1 ||
              data[index - 4 + 3] < 50 || // left
              data[index + 4 + 3] < 50 || // right
              data[index - logoWidth * 4 + 3] < 50 || // top
              data[index + logoWidth * 4 + 3] < 50 // bottom
            );

            // Calculate target position (centered)
            const targetX = logoX - logoWidth / 2 + x;
            const targetY = logoY - logoHeight / 2 + y;

            // Random start position (spread out)
            const angle = Math.random() * Math.PI * 2;
            const distance = 200 + Math.random() * 300;
            const startX = targetX + Math.cos(angle) * distance;
            const startY = targetY + Math.sin(angle) * distance;

            logoParticles.push({
              x: startX,
              y: startY,
              targetX,
              targetY,
              startX,
              startY,
              color: `rgba(${r}, ${g}, ${b}, `,
              size: isEdge ? 1.4 : 1.2, // Smaller particles for sharper look, edges slightly larger
              convergenceProgress: 0,
              convergenceSpeed: 0.002 + Math.random() * 0.003
            });
          }
        }
      }

      logoLoaded = true;
    };

    // Circuit paths - like motherboard traces
    const circuitPaths: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      segments: Array<{ x: number; y: number }>;
      color: string;
    }> = [];

    // Generate grid-based circuit paths
    const gridSize = 120;
    const cols = Math.ceil(canvas.width / gridSize);
    const rows = Math.ceil(canvas.height / gridSize);
    const gridPoints: Array<{ x: number; y: number }> = [];

    // Create grid points
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        gridPoints.push({
          x: col * gridSize + Math.random() * 40 - 20,
          y: row * gridSize + Math.random() * 40 - 20
        });
      }
    }

    // Connect nearby grid points to create circuit paths
    gridPoints.forEach((point, i) => {
      const colorKeys = Object.keys(colors);
      const randomColor = colors[colorKeys[Math.floor(Math.random() * colorKeys.length)] as keyof typeof colors];
      
      gridPoints.forEach((otherPoint, j) => {
        if (i >= j) return;
        const dx = point.x - otherPoint.x;
        const dy = point.y - otherPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < gridSize * 1.8 && Math.random() < 0.15) {
          // Create L-shaped path (like circuit board traces)
          const useHorizontalFirst = Math.random() > 0.5;
          const segments = useHorizontalFirst
            ? [point, { x: otherPoint.x, y: point.y }, otherPoint]
            : [point, { x: point.x, y: otherPoint.y }, otherPoint];

          circuitPaths.push({
            x1: point.x,
            y1: point.y,
            x2: otherPoint.x,
            y2: otherPoint.y,
            segments,
            color: randomColor
          });
        }
      });
    });

    // Circuit nodes (connection points)
    const circuitNodes: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      pulsePhase: number;
      active: boolean;
    }> = [];

    gridPoints.forEach(point => {
      if (Math.random() < 0.3) {
        const colorKeys = Object.keys(colors);
        circuitNodes.push({
          x: point.x,
          y: point.y,
          size: Math.random() * 4 + 3,
          color: colors[colorKeys[Math.floor(Math.random() * colorKeys.length)] as keyof typeof colors],
          pulsePhase: Math.random() * Math.PI * 2,
          active: Math.random() < 0.3
        });
      }
    });

    // Electrical signals traveling along paths
    const signals: Array<{
      pathIndex: number;
      progress: number;
      speed: number;
      color: string;
      size: number;
    }> = [];

    const createSignal = () => {
      if (Math.random() < 0.03 && circuitPaths.length > 0) {
        const pathIndex = Math.floor(Math.random() * circuitPaths.length);
        const path = circuitPaths[pathIndex];
        signals.push({
          pathIndex,
          progress: 0,
          speed: Math.random() * 0.008 + 0.005,
          color: path.color,
          size: Math.random() * 3 + 2
        });
      }
    };

    // Electrical arcs between nearby nodes
    const arcs: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      opacity: number;
      color: string;
    }> = [];

    const createArc = () => {
      if (Math.random() < 0.006 && circuitNodes.length > 1) {
        const node1 = circuitNodes[Math.floor(Math.random() * circuitNodes.length)];
        const node2 = circuitNodes[Math.floor(Math.random() * circuitNodes.length)];
        
        if (node1 !== node2) {
          const dx = node1.x - node2.x;
          const dy = node1.y - node2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 200) {
            arcs.push({
              x1: node1.x,
              y1: node1.y,
              x2: node2.x,
              y2: node2.y,
              opacity: 0.8,
              color: node1.color
            });
          }
        }
      }
    };

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.006;

      // Only create signals and arcs if logo hasn't converged
      if (!logoConverged) {
        createSignal();
        createArc();
      }

      // Draw circuit paths (static) - fade out when logo converges
      const circuitOpacity = logoConverged ? Math.max(0, 1 - logoShrinkProgress * 2) : 1;
      if (circuitOpacity > 0) {
        circuitPaths.forEach(path => {
        ctx.strokeStyle = path.color + (0.12 * circuitOpacity) + ')';
        ctx.lineWidth = 2;
        
        // Draw L-shaped path with rounded corners
        ctx.beginPath();
        ctx.moveTo(path.segments[0].x, path.segments[0].y);
        for (let i = 1; i < path.segments.length; i++) {
          ctx.lineTo(path.segments[i].x, path.segments[i].y);
        }
        ctx.stroke();

        // Draw corner highlights
        for (let i = 1; i < path.segments.length - 1; i++) {
          ctx.beginPath();
          ctx.arc(path.segments[i].x, path.segments[i].y, 3, 0, Math.PI * 2);
          ctx.fillStyle = path.color + (0.24 * circuitOpacity) + ')';
          ctx.fill();
        }
      });
      }

      // Draw and update electrical signals (fade out when logo converges)
      if (circuitOpacity > 0) {
      for (let i = signals.length - 1; i >= 0; i--) {
        const signal = signals[i];
        signal.progress += signal.speed;

        if (signal.progress > 1) {
          signals.splice(i, 1);
          continue;
        }

        const path = circuitPaths[signal.pathIndex];
        if (!path) continue;

        // Calculate position along the segmented path
        const totalSegments = path.segments.length - 1;
        const currentSegment = Math.floor(signal.progress * totalSegments);
        const segmentProgress = (signal.progress * totalSegments) - currentSegment;
        
        if (currentSegment < totalSegments) {
          const start = path.segments[currentSegment];
          const end = path.segments[currentSegment + 1];
          
          const x = start.x + (end.x - start.x) * segmentProgress;
          const y = start.y + (end.y - start.y) * segmentProgress;

          // Draw signal glow
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, signal.size * 4);
          gradient.addColorStop(0, signal.color + (0.64 * circuitOpacity) + ')');
          gradient.addColorStop(0.5, signal.color + (0.32 * circuitOpacity) + ')');
          gradient.addColorStop(1, signal.color + '0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(x - signal.size * 4, y - signal.size * 4, signal.size * 8, signal.size * 8);

          // Draw signal core
          ctx.beginPath();
          ctx.arc(x, y, signal.size, 0, Math.PI * 2);
          ctx.fillStyle = signal.color + (0.8 * circuitOpacity) + ')';
          ctx.shadowBlur = 8;
          ctx.shadowColor = signal.color + (0.8 * circuitOpacity) + ')';
          ctx.fill();
          ctx.shadowBlur = 0;

          // Draw trailing effect
          for (let t = 1; t <= 3; t++) {
            const trailProgress = Math.max(0, signal.progress - t * 0.05);
            const trailSegment = Math.floor(trailProgress * totalSegments);
            const trailSegmentProgress = (trailProgress * totalSegments) - trailSegment;
            
            if (trailSegment >= 0 && trailSegment < totalSegments) {
              const trailStart = path.segments[trailSegment];
              const trailEnd = path.segments[trailSegment + 1];
              const tx = trailStart.x + (trailEnd.x - trailStart.x) * trailSegmentProgress;
              const ty = trailStart.y + (trailEnd.y - trailStart.y) * trailSegmentProgress;
              
              ctx.beginPath();
              ctx.arc(tx, ty, signal.size * (1 - t * 0.3), 0, Math.PI * 2);
              ctx.fillStyle = signal.color + ((0.32 - t * 0.08) * circuitOpacity) + ')';
              ctx.fill();
            }
          }
        }
      }
      }

      // Draw circuit nodes (fade out when logo converges)
      if (circuitOpacity > 0) {
      circuitNodes.forEach(node => {
        const pulse = Math.sin(time + node.pulsePhase) * 0.4 + 0.6;
        
        // Outer glow for active nodes
        if (node.active) {
          const glowSize = node.size * 3 * pulse;
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
          gradient.addColorStop(0, node.color + (0.24 * circuitOpacity) + ')');
          gradient.addColorStop(1, node.color + '0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(node.x - glowSize, node.y - glowSize, glowSize * 2, glowSize * 2);
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = node.color + ((node.active ? 0.64 : 0.32) * circuitOpacity) + ')';
        ctx.fill();
        
        // Inner highlight
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color + (0.8 * circuitOpacity) + ')';
        ctx.fill();
      });
      }

      // Draw and update electrical arcs (fade out when logo converges)
      if (circuitOpacity > 0) {
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        arc.opacity -= 0.03;

        if (arc.opacity <= 0) {
          arcs.splice(i, 1);
          continue;
        }

        // Draw arc with distortion effect
        const segments = 8;
        ctx.beginPath();
        ctx.moveTo(arc.x1, arc.y1);
        
        for (let j = 1; j <= segments; j++) {
          const t = j / segments;
          const x = arc.x1 + (arc.x2 - arc.x1) * t;
          const y = arc.y1 + (arc.y2 - arc.y1) * t;
          
          // Add random distortion
          const distortion = Math.sin(t * Math.PI * 3 + time * 10) * 5;
          const angle = Math.atan2(arc.y2 - arc.y1, arc.x2 - arc.x1) + Math.PI / 2;
          const offsetX = Math.cos(angle) * distortion;
          const offsetY = Math.sin(angle) * distortion;
          
          ctx.lineTo(x + offsetX, y + offsetY);
        }
        
        ctx.strokeStyle = arc.color + (arc.opacity * 0.8 * circuitOpacity) + ')';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 6;
        ctx.shadowColor = arc.color + (arc.opacity * 0.8 * circuitOpacity) + ')';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      }

      // Draw and update logo particles
      if (logoLoaded) {
        // Check if all particles have converged
        if (!logoConverged) {
          const allConverged = logoParticles.every(p => p.convergenceProgress >= 0.99);
          if (allConverged) {
            logoConverged = true;
          }
        }

        // Update shrink and move animation
        if (logoConverged && logoShrinkProgress < 1) {
          logoShrinkProgress = Math.min(1, logoShrinkProgress + logoShrinkSpeed);
        }

        const shrinkEase = 1 - Math.pow(1 - logoShrinkProgress, 3);
        const currentScale = logoConverged ? 1 - (1 - finalLogoScale) * shrinkEase : 1;
        
        logoParticles.forEach(particle => {
          // Update convergence progress
          if (particle.convergenceProgress < 1) {
            particle.convergenceProgress = Math.min(1, particle.convergenceProgress + particle.convergenceSpeed);
          }

          // Easing function for smooth convergence
          const easeProgress = 1 - Math.pow(1 - particle.convergenceProgress, 3);

          // Calculate converged position
          const convergedX = particle.startX + (particle.targetX - particle.startX) * easeProgress;
          const convergedY = particle.startY + (particle.targetY - particle.startY) * easeProgress;

          // Calculate final position (centered)
          if (logoConverged) {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2.2;
            const offsetX = (particle.targetX - centerX) * currentScale;
            const offsetY = (particle.targetY - centerY) * currentScale;
            
            // Calculate logo offset to center the logo+text combo
            const logoWidth = 120 * finalLogoScale;
            const textWidth = 150; // Approximate text width
            const spacing = 15;
            const totalWidth = logoWidth + spacing + textWidth;
            const logoOffsetX = -totalWidth / 2 + logoWidth / 2;
            
            particle.x = convergedX + (finalLogoX + logoOffsetX + offsetX - convergedX) * shrinkEase;
            particle.y = convergedY + (finalLogoY + offsetY - convergedY) * shrinkEase;
          } else {
            particle.x = convergedX;
            particle.y = convergedY;
          }

          // Reduce brightness by additional 20%
          const brightnessMultiplier = 0.8; // 20% less bright
          
          // Draw particle glow (minimal for sharper edges)
          const glowSize = particle.size * 1.5 * currentScale;
          const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, glowSize);
          gradient.addColorStop(0, particle.color + (0.4 * brightnessMultiplier) + ')');
          gradient.addColorStop(0.6, particle.color + (0.15 * brightnessMultiplier) + ')');
          gradient.addColorStop(1, particle.color + '0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(particle.x - glowSize, particle.y - glowSize, glowSize * 2, glowSize * 2);

          // Draw particle core (sharp and crisp)
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * currentScale, 0, Math.PI * 2);
          ctx.fillStyle = particle.color + (0.95 * brightnessMultiplier) + ')';
          ctx.fill();
        });

        // Draw "StartWise" text next to logo (centered)
        if (logoConverged && logoShrinkProgress > 0.3) {
          const textOpacity = Math.min(1, (logoShrinkProgress - 0.3) / 0.7);
          
          // Measure text to calculate centered position
          ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
          const textMetrics = ctx.measureText('StartWise');
          const textWidth = textMetrics.width;
          const logoWidth = 120 * finalLogoScale;
          const spacing = 15;
          const totalWidth = logoWidth + spacing + textWidth;
          
          const startX = finalLogoX - totalWidth / 2 + logoWidth + spacing;
          const textY = finalLogoY;
          
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          
          // Create gradient for text
          const textGradient = ctx.createLinearGradient(startX, textY - 16, startX, textY + 16);
          textGradient.addColorStop(0, `rgba(96, 165, 250, ${textOpacity * 0.8})`); // Blue
          textGradient.addColorStop(1, `rgba(168, 85, 247, ${textOpacity * 0.8})`); // Purple
          
          ctx.fillStyle = textGradient;
          ctx.fillText('StartWise', startX, textY);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-50"
      style={{ 
        zIndex: 1,
        contain: 'layout style paint',
        filter: 'blur(0.5px)'
      }}
    />
  );
};

export default AnimatedBackground;