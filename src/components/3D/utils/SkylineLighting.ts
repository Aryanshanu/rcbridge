
import * as THREE from 'three';
import { LightingProps, BuildingLight } from '../types/SkylineTypes';

export const setupLighting = ({ scene, nightMode }: LightingProps): void => {
  if (nightMode) {
    // Night lighting setup
    const ambientLight = new THREE.AmbientLight(0x151825, 0.2);
    scene.add(ambientLight);
    
    // Moonlight
    const moonLight = new THREE.DirectionalLight(0x4d65a4, 0.5);
    moonLight.position.set(5, 10, 7.5);
    moonLight.castShadow = true;
    scene.add(moonLight);
    
    // Add building lights
    addBuildingLights(scene);
  } else {
    // Day lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
  }
};

const addBuildingLights = (scene: THREE.Scene): void => {
  const createBuildingLight = (
    x: number, 
    y: number, 
    z: number, 
    color: number = 0xffcc77, 
    intensity: number = 0.8, 
    distance: number = 15
  ): THREE.PointLight => {
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(x, y, z);
    scene.add(light);
    return light;
  };
  
  // Add a bunch of building lights with different colors
  const buildingLights: THREE.PointLight[] = [];
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
};
