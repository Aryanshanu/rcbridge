
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ValueComparisonToolProps {
  className?: string;
}

export const ValueComparisonTool = ({ className }: ValueComparisonToolProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [propertyValue, setPropertyValue] = useState(2);
  const [years, setYears] = useState(5);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F8FAFC');
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 5, 10);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Ground plane
    const planeGeometry = new THREE.PlaneGeometry(30, 30);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xF1F5F9,
      metalness: 0,
      roughness: 1
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
    
    // Text loader for labels
    const fontLoader = new THREE.FontLoader();
    let font: THREE.Font;
    
    // Materials
    const traditionalMaterial = new THREE.MeshStandardMaterial({
      color: 0x94A3B8,
      metalness: 0.3,
      roughness: 0.7
    });
    
    const rcBridgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x10B981,
      metalness: 0.3,
      roughness: 0.7
    });
    
    // Create traditional broker building
    const createTraditionalBuilding = (height: number) => {
      const geometry = new THREE.BoxGeometry(3, height, 3);
      const building = new THREE.Mesh(geometry, traditionalMaterial);
      building.position.set(-4, height / 2, 0);
      building.castShadow = true;
      building.receiveShadow = true;
      scene.add(building);
      return building;
    };
    
    // Create RC Bridge building
    const createRCBridgeBuilding = (height: number) => {
      const geometry = new THREE.BoxGeometry(3, height, 3);
      const building = new THREE.Mesh(geometry, rcBridgeMaterial);
      building.position.set(4, height / 2, 0);
      building.castShadow = true;
      building.receiveShadow = true;
      scene.add(building);
      return building;
    };
    
    // Initial buildings
    const traditionalHeight = propertyValue * 0.9;  // 10% less value
    const rcBridgeHeight = propertyValue * (1 + (years * 0.02));  // 2% growth per year
    
    let traditionalBuilding = createTraditionalBuilding(traditionalHeight);
    let rcBridgeBuilding = createRCBridgeBuilding(rcBridgeHeight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Simple camera rotation for better view
      camera.position.x = 10 * Math.sin(Date.now() * 0.0001);
      camera.position.z = 10 * Math.cos(Date.now() * 0.0001);
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Update buildings based on slider values
    const updateBuildings = () => {
      // Remove old buildings
      scene.remove(traditionalBuilding);
      scene.remove(rcBridgeBuilding);
      
      // Calculate new heights
      const newTraditionalHeight = propertyValue * 0.9;  // 10% less value
      const newRCBridgeHeight = propertyValue * (1 + (years * 0.02));  // 2% growth per year
      
      // Create new buildings
      traditionalBuilding = createTraditionalBuilding(newTraditionalHeight);
      rcBridgeBuilding = createRCBridgeBuilding(newRCBridgeHeight);
    };
    
    // Update immediately and when props change
    updateBuildings();
    
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
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [propertyValue, years]);
  
  // Calculate the values for display
  const traditionalValue = propertyValue * 0.9;  // 10% less value
  const rcBridgeValue = propertyValue * (1 + (years * 0.02));  // 2% growth per year
  const difference = rcBridgeValue - traditionalValue;
  const differencePercent = ((difference / traditionalValue) * 100).toFixed(1);
  
  return (
    <div className={`${className || ''} bg-white rounded-lg shadow-lg overflow-hidden`}>
      <div className="bg-primary text-white p-4">
        <h3 className="text-xl font-bold">Property Value Comparison</h3>
        <p className="text-sm opacity-80">
          See how RC Bridge helps maintain and grow your property value over time
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div>
          <div ref={containerRef} className="w-full h-60 bg-gray-50 rounded-lg mb-4" />
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-gray-500 text-sm">Traditional</div>
              <div className="text-gray-700 font-bold text-lg">₹{traditionalValue.toFixed(1)}Cr</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-accent text-sm">RC Bridge</div>
              <div className="text-accent font-bold text-lg">₹{rcBridgeValue.toFixed(1)}Cr</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
            <div className="text-blue-600 text-sm">Value Difference</div>
            <div className="text-blue-700 font-bold text-lg">+₹{difference.toFixed(1)}Cr (+{differencePercent}%)</div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Value (in Crores ₹)
            </label>
            <Slider
              value={[propertyValue]}
              min={1}
              max={10}
              step={0.5}
              onValueChange={(vals) => setPropertyValue(vals[0])}
              className="mb-2"
            />
            <div className="text-right text-sm text-gray-500">₹{propertyValue} Crores</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Period (Years)
            </label>
            <Slider
              value={[years]}
              min={1}
              max={10}
              step={1}
              onValueChange={(vals) => setYears(vals[0])}
              className="mb-2"
            />
            <div className="text-right text-sm text-gray-500">{years} Years</div>
          </div>
          
          <div className="text-gray-700 bg-gray-50 p-4 rounded-lg text-sm">
            <p className="font-medium">How we calculate this:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Traditional brokers: Property value decreases by ~10% due to public listing exposure</li>
              <li>RC Bridge: Property value grows by ~2% per year due to exclusivity and personalized matching</li>
            </ul>
          </div>
          
          <Button className="mt-4 w-full">
            Get Your Personalized Value Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};
