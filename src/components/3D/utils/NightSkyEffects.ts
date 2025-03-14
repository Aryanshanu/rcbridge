
import * as THREE from 'three';

export const addNightSkyEffects = (scene: THREE.Scene): { 
  drones: THREE.Mesh[],
  updateDrones: () => void 
} => {
  // Add stars
  addStars(scene);
  
  // Add flying drones/vehicles
  const drones = addDrones(scene);
  
  // Update drone positions function
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
  
  return { drones, updateDrones };
};

const addStars = (scene: THREE.Scene): void => {
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
};

const addDrones = (scene: THREE.Scene): THREE.Mesh[] => {
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
  
  return drones;
};
