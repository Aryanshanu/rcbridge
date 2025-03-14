
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { ArrowUpRight, TrendingUp, Percent, Building } from 'lucide-react';

// Sample data for charts
const valueRetentionData = [
  { name: 'Traditional', value: 80, fill: '#94A3B8' },
  { name: 'RC Bridge', value: 95, fill: '#10B981' }
];

const growthData = [
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

const roiData = [
  { year: '2023', roi: 8 },
  { year: '2024', roi: 12 },
  { year: '2025', roi: 17 },
  { year: '2026', roi: 23 },
  { year: '2027', roi: 30 }
];

type VisualizationType = 'value-retention' | 'growth' | 'roi';

interface DataVisualizationCardProps {
  title: string;
  description: string;
  type: VisualizationType;
  className?: string;
}

const ValueRetentionChart = () => (
  <ResponsiveContainer width="100%" height={200}>
    <BarChart
      data={valueRetentionData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
      <XAxis dataKey="name" axisLine={false} tickLine={false} />
      <YAxis 
        domain={[0, 100]} 
        axisLine={false} 
        tickLine={false} 
        tickFormatter={(value) => `${value}%`} 
      />
      <Tooltip 
        formatter={(value: number) => [`${value}%`, 'Value Retention']}
        contentStyle={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: '8px', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
        }}
      />
      <Bar 
        dataKey="value" 
        radius={[4, 4, 0, 0]} 
        maxBarSize={60}
        animationDuration={1500}
      />
    </BarChart>
  </ResponsiveContainer>
);

const GrowthChart = () => (
  <ResponsiveContainer width="100%" height={200}>
    <AreaChart
      data={growthData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <defs>
        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
      <XAxis dataKey="month" axisLine={false} tickLine={false} />
      <YAxis axisLine={false} tickLine={false} />
      <Tooltip 
        formatter={(value: number) => [`${value}`, 'Value']}
        contentStyle={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: '8px', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
        }}
      />
      <Area 
        type="monotone" 
        dataKey="value" 
        stroke="#1E3A8A" 
        fillOpacity={1} 
        fill="url(#colorValue)"
        animationDuration={1500}
      />
    </AreaChart>
  </ResponsiveContainer>
);

const ROIChart = () => (
  <ResponsiveContainer width="100%" height={200}>
    <LineChart
      data={roiData}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
      <XAxis dataKey="year" axisLine={false} tickLine={false} />
      <YAxis 
        axisLine={false} 
        tickLine={false} 
        tickFormatter={(value) => `${value}%`}
      />
      <Tooltip 
        formatter={(value: number) => [`${value}%`, 'ROI']}
        contentStyle={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: '8px', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
        }}
      />
      <Line 
        type="monotone" 
        dataKey="roi" 
        stroke="#10B981" 
        strokeWidth={3}
        dot={{ r: 6, fill: '#10B981', strokeWidth: 2, stroke: '#FFFFFF' }}
        activeDot={{ r: 8 }}
        animationDuration={1500}
      />
    </LineChart>
  </ResponsiveContainer>
);

export const DataVisualizationCard = ({ title, description, type, className }: DataVisualizationCardProps) => {
  let Icon;
  let badgeColor;
  let chartComponent;
  
  switch (type) {
    case 'value-retention':
      Icon = Percent;
      badgeColor = 'bg-blue-500';
      chartComponent = <ValueRetentionChart />;
      break;
    case 'growth':
      Icon = TrendingUp;
      badgeColor = 'bg-primary';
      chartComponent = <GrowthChart />;
      break;
    case 'roi':
      Icon = ArrowUpRight;
      badgeColor = 'bg-accent';
      chartComponent = <ROIChart />;
      break;
    default:
      Icon = Building;
      badgeColor = 'bg-gray-500';
      chartComponent = <ValueRetentionChart />;
  }
  
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className || ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={`${badgeColor} p-2 text-white font-medium flex items-center`}>
        <Icon className="h-5 w-5 mr-2" />
        {title}
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 mb-4">{description}</p>
        {chartComponent}
      </div>
    </motion.div>
  );
};
