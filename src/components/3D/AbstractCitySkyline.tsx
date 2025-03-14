
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface AbstractCitySkylineProps {
  className?: string;
}

export const AbstractCitySkyline = ({ className }: AbstractCitySkylineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1E3A8A');
    
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Building materials
    const residentialMaterial = new THREE.MeshStandardMaterial({
      color: 0x10B981, // accent color
      metalness: 0.3,
      roughness: 0.7,
    });
    
    const commercialMaterial = new THREE.MeshStandardMaterial({
      color: 0x3B82F6, // blue
      metalness: 0.5,
      roughness: 0.5,
    });
    
    const investmentMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B5CF6, // purple
      metalness: 0.7,
      roughness: 0.3,
    });
    
    // Base plane
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
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
    const buildingCount = 75;
    
    for (let i = 0; i < buildingCount; i++) {
      // Determine building type and material
      let material;
      const buildingType = Math.random();
      
      if (buildingType < 0.5) {
        material = residentialMaterial; // 50% residential
      } else if (buildingType < 0.8) {
        material = commercialMaterial; // 30% commercial
      } else {
        material = investmentMaterial; // 20% investment
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
      aria-label="Abstract 3D visualization of Hyderabad skyline"
    />
  );
};
