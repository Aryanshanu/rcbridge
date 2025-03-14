
import * as THREE from 'three';

export const createMaterials = (nightMode: boolean): {
  residentialMaterial: THREE.MeshStandardMaterial;
  commercialMaterial: THREE.MeshStandardMaterial;
  investmentMaterial: THREE.MeshStandardMaterial;
  planeMaterial: THREE.MeshStandardMaterial;
} => {
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
  
  const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: nightMode ? 0x050a15 : 0x1E293B,
    metalness: 0.2,
    roughness: 0.8,
  });
  
  return {
    residentialMaterial,
    commercialMaterial,
    investmentMaterial,
    planeMaterial
  };
};

export const createWindowTexture = (): THREE.CanvasTexture => {
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
