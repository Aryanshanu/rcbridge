
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// Update the import path to the correct location
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface AbstractCitySkylineProps {
  className?: string;
}

export const AbstractCitySkyline = ({ className }: AbstractCitySkylineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1e3a8a');
    scene.fog = new THREE.FogExp2('#1e3a8a', 0.01);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 20, 40);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      logarithmicDepthBuffer: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.3;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minPolarAngle = Math.PI / 4;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    
    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 25, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.radius = 4;
    directionalLight.shadow.bias = -0.0005;
    scene.add(directionalLight);
    
    // Add colorful point lights for vibrancy
    const pointLight1 = new THREE.PointLight(0x9b87f5, 2, 50); // Purple
    pointLight1.position.set(-15, 10, 15);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x10B981, 2, 50); // Green
    pointLight2.position.set(15, 15, -15);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0x60A5FA, 2, 50); // Blue
    pointLight3.position.set(0, 20, -20);
    scene.add(pointLight3);
    
    // More vibrant building materials
    const colorOptions = [
      0x9b87f5, // Purple accent
      0x10B981, // Green accent
      0x60A5FA, // Blue 
      0xFCA5A5, // Red
      0xFCD34D, // Yellow
      0xD8B4FE, // Lavender
      0xA78BFA  // Light purple
    ];
    
    // Helper function to create building material
    const createBuildingMaterial = (colorIndex: number, isGlass = false) => {
      if (isGlass) {
        return new THREE.MeshPhysicalMaterial({
          color: colorOptions[colorIndex],
          metalness: 0.9,
          roughness: 0.1,
          transmission: 0.5,
          reflectivity: 1.0,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1
        });
      } else {
        return new THREE.MeshStandardMaterial({
          color: colorOptions[colorIndex],
          metalness: 0.3 + Math.random() * 0.4,
          roughness: 0.4 + Math.random() * 0.3,
        });
      }
    };
    
    // Base plane with gradient texture
    const planeGeometry = new THREE.PlaneGeometry(300, 300);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1E293B,
      metalness: 0.2,
      roughness: 0.8,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
    
    // Create city buildings
    const buildings: THREE.Mesh[] = [];
    const buildingCount = 150; // More buildings for a denser city
    
    for (let i = 0; i < buildingCount; i++) {
      // Determine building type
      const buildingType = Math.random();
      const colorIndex = Math.floor(Math.random() * colorOptions.length);
      const isGlass = Math.random() > 0.7;
      
      // Create material
      const material = createBuildingMaterial(colorIndex, isGlass);
      
      // Building size based on type
      let width = Math.random() * 2 + 1;
      let depth = Math.random() * 2 + 1;
      
      // Taller buildings for commercial/investment
      let maxHeight = buildingType < 0.5 ? 8 : 20;
      let height = Math.random() * maxHeight + 2;
      
      // Building type variations 
      let geometry;
      const buildingVariation = Math.random();
      
      if (buildingVariation < 0.7) {
        // Standard buildings
        geometry = new THREE.BoxGeometry(width, height, depth);
      } else if (buildingVariation < 0.9) {
        // Cylindrical buildings
        geometry = new THREE.CylinderGeometry(width/2, width/2, height, 8);
      } else {
        // Pyramid/conical tops
        geometry = new THREE.CylinderGeometry(width/3, width/2, height, 4);
      }
      
      const building = new THREE.Mesh(geometry, material);
      
      // Position in a grid-like pattern with some randomness
      const gridSize = 60;
      const cellSize = 3;
      
      const gridX = Math.floor(Math.random() * gridSize) - gridSize / 2;
      const gridZ = Math.floor(Math.random() * gridSize) - gridSize / 2;
      
      building.position.x = gridX * cellSize + Math.random() * 2;
      building.position.z = gridZ * cellSize + Math.random() * 2;
      building.position.y = height / 2;
      
      building.castShadow = true;
      building.receiveShadow = true;
      
      // Rotate some buildings for variety
      if (Math.random() > 0.7) {
        building.rotation.y = Math.random() * Math.PI * 2;
      }
      
      scene.add(building);
      buildings.push(building);
    }
    
    // Add animated particles for a more vibrant city feel
    const particleCount = 300;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Position particles throughout the scene
      particlePositions[i3] = (Math.random() - 0.5) * 100;
      particlePositions[i3 + 1] = Math.random() * 50;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 100;
      
      // Random sizes
      particleSizes[i] = Math.random() * 0.5 + 0.1;
      
      // Random colors from our palette
      const color = new THREE.Color(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
      particleColors[i3] = color.r;
      particleColors[i3 + 1] = color.g;
      particleColors[i3 + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update controls
      controls.update();
      
      // Animate point lights for dynamic illumination
      const time = Date.now() * 0.001;
      pointLight1.position.y = 10 + Math.sin(time * 0.5) * 5;
      pointLight2.position.y = 15 + Math.sin(time * 0.3) * 5;
      pointLight3.position.y = 20 + Math.sin(time * 0.7) * 5;
      
      // Subtle building animations
      buildings.forEach((building, i) => {
        // Very subtle y-position animation based on sine wave
        building.position.y += Math.sin(time + i) * 0.0003;
        
        // Subtle color pulse effect for glass buildings
        if (building.material instanceof THREE.MeshPhysicalMaterial) {
          const hue = (time * 0.05 + i * 0.01) % 1;
          building.material.color.setHSL(hue, 0.7, 0.6);
        }
      });
      
      // Animate particles
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time + i) * 0.01; // Subtle up/down movement
      }
      particleGeometry.attributes.position.needsUpdate = true;
      
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
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className={`${className || ''} w-full h-full min-h-[400px]`}
      aria-label="Abstract 3D visualization of city skyline"
    />
  );
};
