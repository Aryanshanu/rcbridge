
import { ChartViewType } from './types';
import { AreaChart, LineChart as LineChartIcon, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface ChartControlsProps {
  viewType: ChartViewType;
  setViewType: (type: ChartViewType) => void;
}

export const ChartControls = ({ viewType, setViewType }: ChartControlsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => setViewType('area')} 
        className={`p-1 rounded-md ${viewType === 'area' ? 'bg-white/30' : 'hover:bg-white/10'}`}
        title="Area Chart"
      >
        <AreaChart size={16} />
      </button>
      <button 
        onClick={() => setViewType('line')} 
        className={`p-1 rounded-md ${viewType === 'line' ? 'bg-white/30' : 'hover:bg-white/10'}`}
        title="Line Chart"
      >
        <LineChartIcon size={16} />
      </button>
      <button 
        onClick={() => setViewType('bar')} 
        className={`p-1 rounded-md ${viewType === 'bar' ? 'bg-white/30' : 'hover:bg-white/10'}`}
        title="Bar Chart"
      >
        <BarChart3 size={16} />
      </button>
      <button 
        onClick={() => setViewType('pie')} 
        className={`p-1 rounded-md ${viewType === 'pie' ? 'bg-white/30' : 'hover:bg-white/10'}`}
        title="Pie Chart"
      >
        <PieChartIcon size={16} />
      </button>
    </div>
  );
};
