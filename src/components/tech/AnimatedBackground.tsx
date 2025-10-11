import React, { useEffect, useRef } from 'react';

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

    // Color palette
    const colors = [
      { main: 'rgba(59, 130, 246, ', glow: 'rgba(96, 165, 250, ' }, // blue
      { main: 'rgba(139, 92, 246, ', glow: 'rgba(167, 139, 250, ' }, // purple
      { main: 'rgba(6, 182, 212, ', glow: 'rgba(34, 211, 238, ' }, // cyan
    ];

    // Data streams flowing upward
    const dataStreams: Array<{
      x: number;
      y: number;
      speed: number;
      length: number;
      color: typeof colors[0];
      segments: number[];
    }> = [];

    for (let i = 0; i < 30; i++) {
      const streamColor = colors[Math.floor(Math.random() * colors.length)];
      const segments: number[] = [];
      for (let j = 0; j < 8; j++) {
        segments.push(Math.random());
      }
      dataStreams.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 1,
        length: Math.random() * 100 + 50,
        color: streamColor,
        segments
      });
    }

    // Geometric nodes
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      rotation: number;
      rotationSpeed: number;
      size: number;
      sides: number;
      color: typeof colors[0];
      pulsePhase: number;
    }> = [];

    for (let i = 0; i < 20; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        size: Math.random() * 20 + 10,
        sides: Math.random() > 0.5 ? 6 : 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    // Energy pulses
    const pulses: Array<{
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      color: typeof colors[0];
      opacity: number;
    }> = [];

    const createPulse = () => {
      if (Math.random() < 0.02) {
        pulses.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 0,
          maxRadius: Math.random() * 150 + 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 0.4
        });
      }
    };

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      // Create occasional pulses
      createPulse();

      // Draw and update energy pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.radius += 3;
        pulse.opacity -= 0.008;

        if (pulse.opacity <= 0) {
          pulses.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.strokeStyle = pulse.color.glow + pulse.opacity + ')';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner glow
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius - 5, 0, Math.PI * 2);
        ctx.strokeStyle = pulse.color.main + (pulse.opacity * 0.5) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw and update data streams
      dataStreams.forEach(stream => {
        stream.y -= stream.speed;
        
        if (stream.y < -stream.length) {
          stream.y = canvas.height;
          stream.x = Math.random() * canvas.width;
        }

        // Draw segmented stream
        for (let i = 0; i < stream.segments.length; i++) {
          const segmentY = stream.y + (i * stream.length / stream.segments.length);
          const segmentHeight = stream.length / stream.segments.length * 0.7;
          const opacity = stream.segments[i] * 0.6;
          
          const gradient = ctx.createLinearGradient(
            stream.x, segmentY,
            stream.x, segmentY + segmentHeight
          );
          gradient.addColorStop(0, stream.color.glow + '0)');
          gradient.addColorStop(0.5, stream.color.main + opacity + ')');
          gradient.addColorStop(1, stream.color.glow + '0)');

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(stream.x, segmentY);
          ctx.lineTo(stream.x, segmentY + segmentHeight);
          ctx.stroke();
        }
      });

      // Draw and update geometric nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        node.rotation += node.rotationSpeed;

        // Wrap around edges
        if (node.x < -50) node.x = canvas.width + 50;
        if (node.x > canvas.width + 50) node.x = -50;
        if (node.y < -50) node.y = canvas.height + 50;
        if (node.y > canvas.height + 50) node.y = -50;

        const pulse = Math.sin(time + node.pulsePhase) * 0.3 + 0.7;
        
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(node.rotation);

        // Draw polygon
        ctx.beginPath();
        for (let i = 0; i <= node.sides; i++) {
          const angle = (Math.PI * 2 / node.sides) * i;
          const x = Math.cos(angle) * node.size;
          const y = Math.sin(angle) * node.size;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Outer glow
        ctx.strokeStyle = node.color.glow + (0.2 * pulse) + ')';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = node.color.glow + (0.4 * pulse) + ')';
        ctx.stroke();
        
        // Inner line
        ctx.strokeStyle = node.color.main + (0.4 * pulse) + ')';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.stroke();

        ctx.restore();
      });

      // Connect nearby nodes
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach(otherNode => {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const opacity = (200 - distance) / 200 * 0.1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.strokeStyle = node.color.main + opacity + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

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