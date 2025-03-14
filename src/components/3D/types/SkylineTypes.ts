
import * as THREE from 'three';

export interface AbstractCitySkylineProps {
  className?: string;
  nightMode?: boolean;
}

export interface BuildingProps {
  scene: THREE.Scene;
  nightMode: boolean;
  windowTexture?: THREE.Texture | null;
}

export interface LightingProps {
  scene: THREE.Scene;
  nightMode: boolean;
}

export interface BuildingLight {
  x: number;
  y: number;
  z: number;
  color: number;
  intensity: number;
  distance: number;
}
