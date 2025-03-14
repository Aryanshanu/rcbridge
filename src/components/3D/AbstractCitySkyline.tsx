
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface AbstractCitySkylineProps {
  className?: string;
  nightMode?: boolean;
}

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
    
    // Lighting
    if (nightMode) {
      // Night lighting setup
      const ambientLight = new THREE.AmbientLight(0x151825, 0.2);
      scene.add(ambientLight);
      
      // Moonlight
      const moonLight = new THREE.DirectionalLight(0x4d65a4, 0.5);
      moonLight.position.set(5, 10, 7.5);
      moonLight.castShadow = true;
      scene.add(moonLight);
      
      // Add point lights for building windows
      const createBuildingLight = (x: number, y: number, z: number, color: number = 0xffcc77, intensity: number = 0.8, distance: number = 15) => {
        const light = new THREE.PointLight(color, intensity, distance);
        light.position.set(x, y, z);
        scene.add(light);
        return light;
      };
      
      // Add a bunch of building lights with different colors
      const buildingLights = [];
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 60 - 30;
        const y = Math.random() * 10 + 5;
        const z = Math.random() * 60 - 30;
        
        // Randomly select light color from common building lights
        const colors = [0xffcc77, 0x66ccff, 0xffaa44, 0xaaccff];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const intensity = Math.random() * 0.5 + 0.5;
        const distance = Math.random() * 10 + 10;
        
        buildingLights.push(createBuildingLight(x, y, z, color, intensity, distance));
      }
    } else {
      // Day lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 7.5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);
    }
    
    // Building materials
    const residentialMaterial = new THREE.MeshStandardMaterial({
      color: nightMode ? 0x102030 : 0x10B981,
      metalness: nightMode ? 0.5 : 0.3,
      roughness: nightMode ? 0.3 : 0.7,
      emissive: nightMode ? 0x223344 : 0x000000,
      emissiveIntensity: nightMode ? 0.3 : 0,
    });
    
    const commercialMaterial = new THREE.MeshStandardMaterial({
      color: nightMode ? 0x1a2a4a : 0x3B82F6,
      metalness: nightMode ? 0.7 : 0.5,
      roughness: nightMode ? 0.2 : 0.5,
      emissive: nightMode ? 0x3a4a6a : 0x000000,
      emissiveIntensity: nightMode ? 0.4 : 0,
    });
    
    const investmentMaterial = new THREE.MeshStandardMaterial({
      color: nightMode ? 0x2a1a4a : 0x8B5CF6,
      metalness: nightMode ? 0.8 : 0.7,
      roughness: nightMode ? 0.1 : 0.3,
      emissive: nightMode ? 0x4a3a6a : 0x000000,
      emissiveIntensity: nightMode ? 0.5 : 0,
    });
    
    // Base plane
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: nightMode ? 0x050a15 : 0x1E293B,
      metalness: 0.2,
      roughness: 0.8,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
    
    // Create city buildings
    const buildings: THREE.Mesh[] = [];
    const buildingCount = 75;
    
    // Window texture for night mode
    const createWindowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 64, 64);
        
        // Draw windows with varying brightness to simulate lit windows in buildings
        for (let y = 4; y < 64; y += 12) {
          for (let x = 4; x < 64; x += 12) {
            const lit = Math.random() > 0.4; // 60% chance of window being lit
            const brightness = lit ? Math.floor(Math.random() * 100 + 155) : 30;
            ctx.fillStyle = `rgb(${brightness}, ${brightness * 0.9}, ${brightness * 0.7})`;
            ctx.fillRect(x, y, 8, 8);
          }
        }
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };
    
    const windowTexture = nightMode ? createWindowTexture() : null;
    
    for (let i = 0; i < buildingCount; i++) {
      // Determine building type and material
      let material;
      const buildingType = Math.random();
      
      if (buildingType < 0.5) {
        material = residentialMaterial.clone(); // 50% residential
      } else if (buildingType < 0.8) {
        material = commercialMaterial.clone(); // 30% commercial
      } else {
        material = investmentMaterial.clone(); // 20% investment
      }
      
      // Add window texture to material only at night
      if (nightMode && windowTexture) {
        material.map = windowTexture;
        
        // Set random texture repeat based on building size
        const repeatX = Math.floor(Math.random() * 3) + 1;
        const repeatY = Math.floor(Math.random() * 5) + 3;
        windowTexture.repeat.set(repeatX, repeatY);
      }
      
      // Building size based on type
      let width = Math.random() * 2 + 1;
      let depth = Math.random() * 2 + 1;
      
      // Taller buildings for commercial/investment
      let maxHeight = buildingType < 0.5 ? 8 : 15;
      let height = Math.random() * maxHeight + 2;
      
      // Create building geometry
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const building = new THREE.Mesh(geometry, material);
      
      // Position in a grid-like pattern with some randomness
      const gridSize = 40;
      const cellSize = 4;
      
      const gridX = Math.floor(Math.random() * gridSize) - gridSize / 2;
      const gridZ = Math.floor(Math.random() * gridSize) - gridSize / 2;
      
      building.position.x = gridX * cellSize + Math.random() * 2;
      building.position.z = gridZ * cellSize + Math.random() * 2;
      building.position.y = height / 2;
      
      building.castShadow = true;
      building.receiveShadow = true;
      
      scene.add(building);
      buildings.push(building);
    }
    
    // Add stars or flying lights at night
    if (nightMode) {
      // Add stars
      const starsGeometry = new THREE.BufferGeometry();
      const starCount = 1000;
      const positions = new Float32Array(starCount * 3);
      
      for (let i = 0; i < starCount; i++) {
        const x = (Math.random() - 0.5) * 500;
        const y = Math.random() * 200 + 50;
        const z = (Math.random() - 0.5) * 500;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      
      starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
      });
      
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);
      
      // Add flying drones/vehicles
      const drones: THREE.Mesh[] = [];
      const droneCount = 15;
      
      for (let i = 0; i < droneCount; i++) {
        const size = Math.random() * 0.5 + 0.2;
        const droneGeometry = new THREE.SphereGeometry(size, 8, 8);
        const droneMaterial = new THREE.MeshStandardMaterial({
          color: Math.random() > 0.5 ? 0xff0000 : 0x00ffff,
          emissive: Math.random() > 0.5 ? 0xff0000 : 0x00ffff,
          emissiveIntensity: 0.5
        });
        
        const drone = new THREE.Mesh(droneGeometry, droneMaterial);
        
        // Random starting position
        drone.position.x = (Math.random() - 0.5) * 100;
        drone.position.y = Math.random() * 20 + 10;
        drone.position.z = (Math.random() - 0.5) * 100;
        
        // Store direction and speed
        (drone as any).direction = new THREE.Vector3(
          (Math.random() - 0.5) * 0.05,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.05
        );
        
        scene.add(drone);
        drones.push(drone);
      }
      
      // Update drone positions in animation
      const updateDrones = () => {
        drones.forEach(drone => {
          drone.position.x += (drone as any).direction.x;
          drone.position.y += (drone as any).direction.y;
          drone.position.z += (drone as any).direction.z;
          
          // Bounce at boundaries
          if (Math.abs(drone.position.x) > 50) (drone as any).direction.x *= -1;
          if (drone.position.y < 5 || drone.position.y > 30) (drone as any).direction.y *= -1;
          if (Math.abs(drone.position.z) > 50) (drone as any).direction.z *= -1;
        });
      };
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
      if (nightMode) {
        const updateDrones = scene.getObjectByName('updateDrones') as any;
        if (updateDrones) updateDrones();
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
