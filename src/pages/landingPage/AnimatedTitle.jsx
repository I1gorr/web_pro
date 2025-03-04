import { useEffect, useRef } from "react";
import "./heropage.css";

const AnimatedTitle = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext("2d");
    let particles = [];
    let w, h, animationFrameId;

    const resizeCanvas = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    class Vector2 {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      set(x, y) {
        this.x = x;
        this.y = y;
      }
    }

    const opts = {
      color: "#646cff", // Neon pink stroke
      amount: 30,
      thickness: 5,
      radius: 12,
      rotSpeed: 0.4,
      gravity: 0.8,
    };

    class Shape {
      constructor() {
        this.vertices = Math.floor(Math.random() * 5);
        this.pos = new Vector2(
          opts.radius / 2 + Math.random() * w - opts.radius,
          Math.random() * h - opts.radius
        );
        this.angle = Math.random() * 180;
        this.d = Math.random() < 0.5 ? 1 : -1;
      }

      update() {
        if (this.pos.y - opts.radius - opts.thickness < h) {
          this.pos.y += opts.gravity;
          this.angle += opts.rotSpeed * this.d;
        } else {
          this.pos.set(Math.random() * w, -opts.radius);
        }
      }

      render() {
        if (this.vertices > 0) {
          ctx.beginPath();
          ctx.moveTo(
            Math.cos(this.angle * (Math.PI / 180)) * opts.radius + this.pos.x,
            Math.sin(this.angle * (Math.PI / 180)) * opts.radius + this.pos.y
          );
          for (let i = 1; i < this.vertices; i++) {
            let a = (Math.PI * 2) / this.vertices * i;
            let aa = this.angle * (Math.PI / 180);
            ctx.lineTo(
              Math.cos(a + aa) * opts.radius + this.pos.x,
              Math.sin(a + aa) * opts.radius + this.pos.y
            );
          }
          ctx.closePath();
          ctx.lineWidth = opts.thickness;
          ctx.strokeStyle = opts.color;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(this.pos.x, this.pos.y, opts.radius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.lineWidth = opts.thickness;
          ctx.strokeStyle = opts.color;
          ctx.stroke();
        }
      }
    }

    const populate = () => {
      particles = [];
      for (let i = 0; i < opts.amount; i++) {
        particles.push(new Shape());
      }
    };

    const drawBg = () => {
      ctx.fillStyle = "#282a36"; // Dracula background color
      ctx.fillRect(0, 0, w, h);
    };

    const animate = () => {
      drawBg();
      particles.forEach((p) => {
        p.update();
        p.render();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    populate();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="animated-title-container">
      <canvas ref={canvasRef} className="animation-canvas" />
      <h1 className="title-text">EDDIE</h1>
    </div>
  );
};

export default AnimatedTitle;
