
import { ReactNode } from "react";

export type VisualizationType = 'value-retention' | 'growth' | 'roi';
export type ChartViewType = 'bar' | 'line' | 'area' | 'pie';

export interface DataVisualizationCardProps {
  title: string;
  description: string;
  type: VisualizationType;
  className?: string;
}

// Sample data types
export interface ValueRetentionDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface GrowthDataPoint {
  month: string;
  value: number;
}

export interface ROIDataPoint {
  year: string;
  roi: number;
}

export interface ROIBreakdownDataPoint {
  name: string;
  value: number;
}

export interface ChartComponentProps {
  viewType: ChartViewType;
}
