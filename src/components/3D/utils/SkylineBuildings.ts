
import * as THREE from 'three';
import { BuildingProps } from '../types/SkylineTypes';
import { createMaterials, createWindowTexture } from './SkylineMaterials';

export const createBuildings = ({ scene, nightMode, windowTexture }: BuildingProps): THREE.Mesh[] => {
  const buildings: THREE.Mesh[] = [];
  const buildingCount = 75;
  
  // Get materials
  const { residentialMaterial, commercialMaterial, investmentMaterial } = createMaterials(nightMode);
  
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
  
  return buildings;
};

export const createBasePlane = (scene: THREE.Scene, nightMode: boolean): void => {
  const { planeMaterial } = createMaterials(nightMode);
  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;
  scene.add(plane);
};
