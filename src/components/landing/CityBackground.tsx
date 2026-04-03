import { useEffect, useRef } from "react";

const HospitalBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Interfaces
    interface Vehicle {
      x: number;
      y: number;
      speed: number;
      color: string;
      width: number;
      lane: number;
      isAmbulance: boolean;
    }

    interface HospitalBlock {
      xOffset: number;
      width: number;
      height: number;
      color: string;
      windows: { row: number; col: number }[];
    }

    interface Hospital {
      x: number;
      totalWidth: number;
      blocks: HospitalBlock[];
      hasCross: boolean;
      crossX: number;
      crossY: number;
    }

    interface Cloud {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
    }

    const hospitals: Hospital[] = [];
    const vehicles: Vehicle[] = [];
    const clouds: Cloud[] = [];

    // 1. Generate Clouds
    for (let i = 0; i < 8; i++) {
      clouds.push({
        x: Math.random() * 2000,
        y: Math.random() * 0.25,
        size: Math.random() * 80 + 40,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.15,
      });
    }

    // 2. Generate Hospitals
    const hospitalColors = [
      "#f0f4f8", // Off white
      "#e1e9f0", // Very light gray-blue
      "#d9e2ec", // Light steel
      "#e6f7ff", // Very pale cyan
    ];

    let bx = 0;
    while (bx < 2500) {
      // Ek hospital mein 1 se 3 connected blocks ho sakte hain
      const numBlocks = Math.floor(Math.random() * 3) + 1;
      const blocks: HospitalBlock[] = [];
      let totalWidth = 0;
      let maxHeight = 0;
      let highestBlockIndex = 0;

      for (let i = 0; i < numBlocks; i++) {
        const bw = Math.random() * 80 + 60; // Thodi chaudi buildings
        const bh = Math.random() * 200 + 80;
        
        if (bh > maxHeight) {
          maxHeight = bh;
          highestBlockIndex = i;
        }

        const winRows = Math.floor(bh / 25);
        const winCols = Math.floor(bw / 20);
        const windows: { row: number; col: number }[] = [];
        
        for (let r = 0; r < winRows; r++) {
          for (let c = 0; c < winCols; c++) {
            // Hospitals mein zyada lights on rehti hain
            if (Math.random() > 0.15) windows.push({ row: r, col: c });
          }
        }

        blocks.push({
          xOffset: totalWidth,
          width: bw,
          height: bh,
          color: hospitalColors[Math.floor(Math.random() * hospitalColors.length)],
          windows,
        });

        totalWidth += bw;
      }

      hospitals.push({
        x: bx,
        totalWidth,
        blocks,
        hasCross: true, // Har complex mein ek cross
        crossX: blocks[highestBlockIndex].xOffset + blocks[highestBlockIndex].width / 2,
        crossY: maxHeight - 30, // Top ke thoda neeche
      });

      // Do hospitals ke beech ka gap
      bx += totalWidth + Math.random() * 80 + 40;
    }

    // 3. Generate Vehicles (Cars + Ambulances)
    const carColors = ["#38bdf8", "#a78bfa", "#34d399", "#fb923c", "#ffffff", "#475569"];
    const lanes = [0.72, 0.76, 0.8, 0.84];
    
    for (let i = 0; i < 20; i++) {
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      const isAmbulance = Math.random() > 0.85; // ~15% ambulances
      
      vehicles.push({
        x: Math.random() * 2000 - 200,
        y: lane,
        speed: (lane < 0.78 ? 1 : -1) * (isAmbulance ? Math.random() * 1.0 + 1.5 : Math.random() * 1.5 + 0.8), // Ambulances faster
        color: isAmbulance ? "#ffffff" : carColors[Math.floor(Math.random() * carColors.length)],
        width: isAmbulance ? 35 : Math.random() * 20 + 25,
        lane: lanes.indexOf(lane),
        isAmbulance,
      });
    }

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      time += 0.016;

      // --- Background Sky ---
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.7);
      skyGrad.addColorStop(0, "#cbe3fa");
      skyGrad.addColorStop(0.5, "#e6f0fa");
      skyGrad.addColorStop(1, "#f2f7fc");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // --- Draw Clouds ---
      clouds.forEach((c) => {
        c.x += c.speed;
        if (c.x > W + 200) c.x = -200;
        const cx = c.x;
        const cy = c.y * H;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${c.opacity})`;
        ctx.arc(cx, cy, c.size * 0.5, 0, Math.PI * 2);
        ctx.arc(cx + c.size * 0.3, cy - c.size * 0.15, c.size * 0.4, 0, Math.PI * 2);
        ctx.arc(cx - c.size * 0.25, cy + c.size * 0.05, c.size * 0.35, 0, Math.PI * 2);
        ctx.arc(cx + c.size * 0.55, cy + c.size * 0.1, c.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Draw Hospitals ---
      const roadY = H * 0.7;
      
      hospitals.forEach((hospital) => {
        // Move hospitals slowly for parallax effect (optional, set to 0 for static)
        const currentX = (hospital.x - (time * 10)) % (2500) - 200;
        
        // Render if within screen bounds roughly
        if(currentX + hospital.totalWidth > -100 && currentX < W + 100) {
          
          hospital.blocks.forEach((block) => {
            const bx = currentX + block.xOffset;
            const by = roadY - block.height;
            
            // Building Body
            ctx.fillStyle = block.color;
            ctx.fillRect(bx, by, block.width, block.height);
            
            // Outline/Structure lines for medical look
            ctx.strokeStyle = "rgba(100, 130, 160, 0.15)";
            ctx.lineWidth = 1;
            ctx.strokeRect(bx, by, block.width, block.height);

            // Windows (Bright, clinical lights)
            block.windows.forEach((w) => {
              const wx = bx + 8 + w.col * 20;
              const wy = by + 12 + w.row * 25;
              
              // Gentle pulse for some windows
              const isPulsing = Math.sin(time * 0.5 + w.row * 2 + w.col) > 0.8;
              ctx.fillStyle = isPulsing 
                ? "rgba(220, 240, 255, 0.9)" // Brighter pulse
                : "rgba(180, 210, 230, 0.6)"; // Normal light

              ctx.fillRect(wx, wy, 12, 15);
            });
          });

          // Draw Red Cross
          if (hospital.hasCross) {
            const crossRealX = currentX + hospital.crossX;
            const crossRealY = roadY - hospital.crossY;
            const crossSize = 16;
            const thickness = 6;

            // Glow around cross
            const glow = ctx.createRadialGradient(crossRealX, crossRealY, 0, crossRealX, crossRealY, 20);
            glow.addColorStop(0, "rgba(239, 68, 68, 0.4)");
            glow.addColorStop(1, "transparent");
            ctx.fillStyle = glow;
            ctx.fillRect(crossRealX - 25, crossRealY - 25, 50, 50);

            ctx.fillStyle = "#ef4444"; // Red color
            // Horizontal bar
            ctx.fillRect(crossRealX - crossSize/2, crossRealY - thickness/2, crossSize, thickness);
            // Vertical bar
            ctx.fillRect(crossRealX - thickness/2, crossRealY - crossSize/2, thickness, crossSize);
          }
        }
      });

      // --- Draw Road ---
      const roadGrad = ctx.createLinearGradient(0, roadY, 0, H);
      roadGrad.addColorStop(0, "#cbd1d9");
      roadGrad.addColorStop(1, "#a0aab5");
      ctx.fillStyle = roadGrad;
      ctx.fillRect(0, roadY, W, H - roadY);

      // Road lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.setLineDash([40, 20]);
      ctx.lineWidth = 3;
      [0.74, 0.78, 0.82].forEach((ly) => {
        ctx.beginPath();
        ctx.moveTo(0, H * ly);
        ctx.lineTo(W, H * ly);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // --- Draw Vehicles ---
      vehicles.forEach((v) => {
        v.x += v.speed;
        if (v.speed > 0 && v.x > W + 100) v.x = -100;
        if (v.speed < 0 && v.x < -100) v.x = W + 100;

        const cx = v.x;
        const cy = H * v.y;

        // Vehicle Shadow
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.beginPath();
        ctx.ellipse(cx, cy + 6, v.width/2 + 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Vehicle Body
        ctx.fillStyle = v.color;
        ctx.beginPath();
        if (v.isAmbulance) {
          // Boxy ambulance shape
          ctx.roundRect(cx - v.width / 2, cy - 8, v.width, 14, 2);
        } else {
          // Sleeker car shape
          ctx.roundRect(cx - v.width / 2, cy - 5, v.width, 10, 4);
        }
        ctx.fill();

        // Ambulance specific details
        if (v.isAmbulance) {
          // Red stripe
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(cx - v.width/2, cy - 2, v.width, 3);
          
          // Flashing lights (Red and Blue alternating)
          const flashRed = Math.floor(time * 8) % 2 === 0;
          
          // Top light bar
          ctx.fillStyle = flashRed ? "#ef4444" : "#3b82f6";
          ctx.fillRect(cx - 5, cy - 11, 10, 3);
          
          // Light glow
          const sirenGlow = ctx.createRadialGradient(cx, cy - 10, 0, cx, cy - 10, 15);
          sirenGlow.addColorStop(0, flashRed ? "rgba(239, 68, 68, 0.6)" : "rgba(59, 130, 246, 0.6)");
          sirenGlow.addColorStop(1, "transparent");
          ctx.fillStyle = sirenGlow;
          ctx.fillRect(cx - 20, cy - 25, 40, 30);
        }

        // Headlights / taillights
        const headX = v.speed > 0 ? cx + v.width / 2 : cx - v.width / 2;
        const tailX = v.speed > 0 ? cx - v.width / 2 : cx + v.width / 2;

        ctx.beginPath();
        ctx.arc(headX, cy, v.isAmbulance ? 4 : 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(tailX, cy, v.isAmbulance ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 80, 80, 0.9)";
        ctx.fill();
      });

      // --- Foreground fade ---
      const bottomFade = ctx.createLinearGradient(0, H * 0.9, 0, H);
      bottomFade.addColorStop(0, "transparent");
      bottomFade.addColorStop(1, "rgba(230, 240, 250, 0.6)");
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, H * 0.9, W, H * 0.1);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default HospitalBackground;
