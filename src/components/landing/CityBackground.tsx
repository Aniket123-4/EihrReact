import { useEffect, useRef } from "react";

const CityBackground = () => {
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

    interface Car {
      x: number;
      y: number;
      speed: number;
      color: string;
      width: number;
      lane: number;
    }

    interface Building {
      x: number;
      width: number;
      height: number;
      windows: { row: number; col: number }[];
      color: string;
    }

    interface Cloud {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
    }

    const buildings: Building[] = [];
    const cars: Car[] = [];
    const clouds: Cloud[] = [];

    // Generate soft clouds
    for (let i = 0; i < 8; i++) {
      clouds.push({
        x: Math.random() * 2000,
        y: Math.random() * 0.25,
        size: Math.random() * 80 + 40,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.15,
      });
    }

    // Generate buildings — bright tones
    const buildingColors = [
      "rgba(200, 215, 235, 0.85)",
      "rgba(190, 210, 230, 0.9)",
      "rgba(210, 220, 240, 0.85)",
      "rgba(195, 205, 225, 0.9)",
      "rgba(220, 230, 245, 0.8)",
    ];
    let bx = 0;
    while (bx < 2000) {
      const w = Math.random() * 60 + 30;
      const h = Math.random() * 300 + 100;
      const winRows = Math.floor(h / 20);
      const winCols = Math.floor(w / 15);
      const windows: { row: number; col: number }[] = [];
      for (let r = 0; r < winRows; r++) {
        for (let c = 0; c < winCols; c++) {
          if (Math.random() > 0.3) windows.push({ row: r, col: c });
        }
      }
      buildings.push({
        x: bx,
        width: w,
        height: h,
        windows,
        color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
      });
      bx += w + Math.random() * 15 + 5;
    }

    // Generate cars — bright neon colors
    const carColors = ["#38bdf8", "#f472b6", "#a78bfa", "#34d399", "#fb923c", "#06b6d4"];
    const lanes = [0.72, 0.76, 0.8, 0.84];
    for (let i = 0; i < 18; i++) {
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      cars.push({
        x: Math.random() * 2000 - 200,
        y: lane,
        speed: (lane < 0.78 ? 1 : -1) * (Math.random() * 1.5 + 0.8),
        color: carColors[Math.floor(Math.random() * carColors.length)],
        width: Math.random() * 20 + 25,
        lane: lanes.indexOf(lane),
      });
    }

    const streetLights: { x: number; y: number }[] = [];
    for (let i = 0; i < 20; i++) {
      streetLights.push({ x: i * 100 + 50, y: 0.68 });
    }

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      time += 0.016;

      // Bright sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.7);
      skyGrad.addColorStop(0, "#d0e8ff");
      skyGrad.addColorStop(0.3, "#b8dbff");
      skyGrad.addColorStop(0.6, "#a8d4ff");
      skyGrad.addColorStop(1, "#c5e0f8");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Soft clouds
      clouds.forEach((c) => {
        c.x += c.speed;
        if (c.x > W + 200) c.x = -200;
        const cx = c.x;
        const cy = c.y * H;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${c.opacity})`;
        // Draw cloud as overlapping circles
        ctx.arc(cx, cy, c.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + c.size * 0.3, cy - c.size * 0.15, c.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx - c.size * 0.25, cy + c.size * 0.05, c.size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + c.size * 0.55, cy + c.size * 0.1, c.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Sun glow
      const sunGrad = ctx.createRadialGradient(W * 0.15, H * 0.12, 20, W * 0.15, H * 0.12, 120);
      sunGrad.addColorStop(0, "rgba(255, 230, 140, 0.6)");
      sunGrad.addColorStop(0.3, "rgba(255, 210, 100, 0.2)");
      sunGrad.addColorStop(1, "transparent");
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, W * 0.4, H * 0.35);

      // Buildings
      const roadY = H * 0.7;
      buildings.forEach((b) => {
        const bx = b.x % (W + 200) - 100;
        const by = roadY - b.height;
        ctx.fillStyle = b.color;
        ctx.fillRect(bx, by, b.width, b.height);

        // Windows — bright reflections
        b.windows.forEach((w) => {
          const wx = bx + 5 + w.col * 15;
          const wy = by + 8 + w.row * 20;
          const shimmer = Math.sin(time * 0.4 + w.row + w.col * 3 + b.x) > -0.2;
          if (shimmer) {
            const colorChoice = Math.random() > 0.5
              ? `rgba(100, 180, 255, ${0.35 + Math.sin(time + w.row) * 0.15})`
              : `rgba(180, 220, 255, ${0.4 + Math.sin(time + w.col) * 0.15})`;
            ctx.fillStyle = colorChoice;
            ctx.fillRect(wx, wy, 8, 12);
            // Subtle glow
            ctx.fillStyle = `rgba(100, 180, 255, 0.04)`;
            ctx.fillRect(wx - 2, wy - 2, 12, 16);
          } else {
            ctx.fillStyle = "rgba(160, 190, 220, 0.3)";
            ctx.fillRect(wx, wy, 8, 12);
          }
        });

        // Rooftop details
        if (b.height > 200) {
          const antennaH = 20 + Math.random() * 15;
          ctx.strokeStyle = "rgba(160, 180, 210, 0.5)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(bx + b.width / 2, by);
          ctx.lineTo(bx + b.width / 2, by - antennaH);
          ctx.stroke();
          const blink = Math.sin(time * 2 + b.x) > 0.7;
          if (blink) {
            ctx.beginPath();
            ctx.arc(bx + b.width / 2, by - antennaH, 2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 100, 100, 0.7)";
            ctx.fill();
          }
        }
      });

      // Road — light gray
      const roadGrad = ctx.createLinearGradient(0, roadY, 0, H);
      roadGrad.addColorStop(0, "#c8cdd5");
      roadGrad.addColorStop(0.15, "#b8bfc8");
      roadGrad.addColorStop(1, "#a8b0ba");
      ctx.fillStyle = roadGrad;
      ctx.fillRect(0, roadY, W, H - roadY);

      // Road lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.setLineDash([30, 20]);
      ctx.lineWidth = 2;
      [0.74, 0.78, 0.82].forEach((ly) => {
        ctx.beginPath();
        ctx.moveTo(0, H * ly);
        ctx.lineTo(W, H * ly);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Street lights
      streetLights.forEach((sl) => {
        const lx = sl.x % (W + 100);
        const ly = H * sl.y;
        ctx.strokeStyle = "rgba(140, 150, 170, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lx, ly + H * 0.02);
        ctx.lineTo(lx, ly - 30);
        ctx.stroke();
        const glowIntensity = Math.sin(time * 0.3 + sl.x * 0.1) * 0.1 + 0.9;
        const lightGrad = ctx.createRadialGradient(lx, ly - 28, 2, lx, ly - 28, 30);
        lightGrad.addColorStop(0, `rgba(255, 220, 130, ${glowIntensity * 0.3})`);
        lightGrad.addColorStop(1, "transparent");
        ctx.fillStyle = lightGrad;
        ctx.fillRect(lx - 30, ly - 58, 60, 60);
      });

      // Cars
      cars.forEach((car) => {
        car.x += car.speed;
        if (car.speed > 0 && car.x > W + 100) car.x = -100;
        if (car.speed < 0 && car.x < -100) car.x = W + 100;

        const cx = car.x;
        const cy = H * car.y;

        // Car body
        ctx.fillStyle = `${car.color}55`;
        ctx.beginPath();
        ctx.roundRect(cx - car.width / 2, cy - 5, car.width, 10, 4);
        ctx.fill();

        // Car glow
        const carGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 20);
        carGlow.addColorStop(0, `${car.color}44`);
        carGlow.addColorStop(1, "transparent");
        ctx.fillStyle = carGlow;
        ctx.fillRect(cx - 20, cy - 20, 40, 40);

        // Headlights / taillights
        const headX = car.speed > 0 ? cx + car.width / 2 : cx - car.width / 2;
        const tailX = car.speed > 0 ? cx - car.width / 2 : cx + car.width / 2;

        ctx.beginPath();
        ctx.arc(headX, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(tailX, cy, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 80, 80, 0.7)";
        ctx.fill();
      });

      // Soft bottom gradient fade
      const bottomFade = ctx.createLinearGradient(0, H * 0.88, 0, H);
      bottomFade.addColorStop(0, "transparent");
      bottomFade.addColorStop(1, "rgba(200, 215, 235, 0.4)");
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, H * 0.88, W, H * 0.12);

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
        position: 'fixed', /* Ye bahut zaroori hai */
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

export default CityBackground;
