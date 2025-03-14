
import { ValueRetentionDataPoint, GrowthDataPoint, ROIDataPoint, ROIBreakdownDataPoint } from './types';

// Sample data for charts
export const valueRetentionData: ValueRetentionDataPoint[] = [
  { name: 'Traditional', value: 80, fill: '#94A3B8' },
  { name: 'RC Bridge', value: 95, fill: '#10B981' }
];

export const growthData: GrowthDataPoint[] = [
  { month: 'Jan', value: 100 },
  { month: 'Feb', value: 120 },
  { month: 'Mar', value: 125 },
  { month: 'Apr', value: 135 },
  { month: 'May', value: 148 },
  { month: 'Jun', value: 160 },
  { month: 'Jul', value: 175 },
  { month: 'Aug', value: 190 },
  { month: 'Sep', value: 215 },
  { month: 'Oct', value: 230 },
  { month: 'Nov', value: 255 },
  { month: 'Dec', value: 280 }
];

export const roiData: ROIDataPoint[] = [
  { year: '2023', roi: 8 },
  { year: '2024', roi: 12 },
  { year: '2025', roi: 17 },
  { year: '2026', roi: 23 },
  { year: '2027', roi: 30 }
];

export const roiBreakdownData: ROIBreakdownDataPoint[] = [
  { name: 'Rental Income', value: 45 },
  { name: 'Capital Appreciation', value: 35 },
  { name: 'Tax Benefits', value: 20 }
];

export const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];
