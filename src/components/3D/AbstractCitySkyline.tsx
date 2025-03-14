
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { AbstractCitySkylineProps } from './types/SkylineTypes';
import { setupLighting } from './utils/SkylineLighting';
import { createBuildings, createBasePlane } from './utils/SkylineBuildings';
import { createWindowTexture } from './utils/SkylineMaterials';
import { addNightSkyEffects } from './utils/NightSkyEffects';

export const AbstractCitySkyline = ({ className, nightMode = false }: AbstractCitySkylineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(nightMode ? '#0a1529' : '#1E3A8A');
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 15, 30);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minPolarAngle = Math.PI / 4;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Add lighting
    setupLighting({ scene, nightMode });
    
    // Create base plane
    createBasePlane(scene, nightMode);
    
    // Create window texture for night mode
    const windowTexture = nightMode ? createWindowTexture() : null;
    
    // Create buildings
    const buildings = createBuildings({ scene, nightMode, windowTexture });
    
    // Add night sky effects if in night mode
    let updateDronesFunction: (() => void) | null = null;
    if (nightMode) {
      const { updateDrones } = addNightSkyEffects(scene);
      updateDronesFunction = updateDrones;
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update controls
      controls.update();
      
      // Subtle building animations
      buildings.forEach((building, i) => {
        const time = Date.now() * 0.001;
        // Very subtle y-position animation based on sine wave
        building.position.y += Math.sin(time + i) * 0.0005;
      });
      
      // Update drones in night mode
      if (nightMode && updateDronesFunction) {
        updateDronesFunction();
      }
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      controls.dispose();
    };
  }, [nightMode]);
  
  return (
    <div 
      ref={containerRef} 
      className={`${className || ''} w-full h-full min-h-[400px]`}
      aria-label={`Abstract 3D visualization of Hyderabad ${nightMode ? 'nighttime' : ''} skyline`}
    />
  );
};
