import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Lenis from '@studio-freight/lenis';
import Scene from './components/Scene';
import Overlay from './components/Overlay';

function App() {
  
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Custom cursor logic
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    const handleHover = () => cursor.classList.add('hover');
    const handleLeave = () => cursor.classList.remove('hover');

    window.addEventListener('mousemove', moveCursor);
    
    // Add hover effect to links and buttons
    setTimeout(() => {
      const interactables = document.querySelectorAll('a, button, .tag');
      interactables.forEach(el => {
        el.addEventListener('mouseenter', handleHover);
        el.addEventListener('mouseleave', handleLeave);
      });
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      lenis.destroy();
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
    };
  }, []);

  return (
    <>
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Scene />
        </Canvas>
      </div>
      <Overlay />
    </>
  );
}

export default App;
