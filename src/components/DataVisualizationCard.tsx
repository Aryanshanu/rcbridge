
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowUpRight, TrendingUp, Percent, Building } from 'lucide-react';
import { ChartViewType, DataVisualizationCardProps, VisualizationType } from './datavis/types';
import { ValueRetentionChart } from './datavis/ValueRetentionChart';
import { GrowthChart } from './datavis/GrowthChart';
import { ROIChart } from './datavis/ROIChart';
import { ChartControls } from './datavis/ChartControls';

export const DataVisualizationCard = ({ title, description, type, className }: DataVisualizationCardProps) => {
  const [viewType, setViewType] = useState<ChartViewType>('area');
  
  let Icon;
  let badgeColor;
  let chartComponent;
  
  switch (type) {
    case 'value-retention':
      Icon = Percent;
      badgeColor = 'bg-blue-500';
      chartComponent = <ValueRetentionChart viewType={viewType} />;
      break;
    case 'growth':
      Icon = TrendingUp;
      badgeColor = 'bg-primary';
      chartComponent = <GrowthChart viewType={viewType} />;
      break;
    case 'roi':
      Icon = ArrowUpRight;
      badgeColor = 'bg-accent';
      chartComponent = <ROIChart viewType={viewType} />;
      break;
    default:
      Icon = Building;
      badgeColor = 'bg-gray-500';
      chartComponent = <ValueRetentionChart viewType={viewType} />;
  }
  
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className || ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className={`${badgeColor} p-2 text-white font-medium flex items-center justify-between`}>
        <div className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          {title}
        </div>
        <ChartControls viewType={viewType} setViewType={setViewType} />
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 mb-4">{description}</p>
        {chartComponent}
      </div>
    </motion.div>
  );
};
