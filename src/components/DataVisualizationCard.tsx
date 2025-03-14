
import { motion } from 'framer-motion';
import { useState } from 'react';
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
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { ArrowUpRight, TrendingUp, Percent, Building, PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon } from 'lucide-react';

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

// Add pie chart data for ROI breakdown
const roiBreakdownData = [
  { name: 'Rental Income', value: 45 },
  { name: 'Capital Appreciation', value: 35 },
  { name: 'Tax Benefits', value: 20 }
];

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

type VisualizationType = 'value-retention' | 'growth' | 'roi';
type ChartViewType = 'bar' | 'line' | 'area' | 'pie';

interface DataVisualizationCardProps {
  title: string;
  description: string;
  type: VisualizationType;
  className?: string;
}

const ValueRetentionChart = ({ viewType }: { viewType: ChartViewType }) => {
  if (viewType === 'bar') {
    return (
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
  } else if (viewType === 'line') {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
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
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 6, fill: '#10B981', strokeWidth: 2, stroke: '#FFFFFF' }}
            activeDot={{ r: 8 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  } else if (viewType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={valueRetentionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            animationDuration={1500}
          >
            {valueRetentionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Value Retention']}
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '8px', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  
  // Default to area chart
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
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
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#10B981" 
          fill="#10B981"
          fillOpacity={0.3}
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const GrowthChart = ({ viewType }: { viewType: ChartViewType }) => {
  if (viewType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={growthData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
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
          <Bar 
            dataKey="value" 
            fill="#3B82F6" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={20}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (viewType === 'line') {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={growthData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
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
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#FFFFFF' }}
            activeDot={{ r: 6 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  
  // Default to area chart
  return (
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
};

const ROIChart = ({ viewType }: { viewType: ChartViewType }) => {
  if (viewType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
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
          <Bar 
            dataKey="roi" 
            fill="#8B5CF6" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={40}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (viewType === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={roiBreakdownData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            animationDuration={1500}
          >
            {roiBreakdownData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}%`, '']}
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '8px', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  
  // Default to line chart
  return (
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
          stroke="#8B5CF6" 
          strokeWidth={3}
          dot={{ r: 6, fill: '#8B5CF6', strokeWidth: 2, stroke: '#FFFFFF' }}
          activeDot={{ r: 8 }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

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
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setViewType('area')} 
            className={`p-1 rounded-md ${viewType === 'area' ? 'bg-white/30' : 'hover:bg-white/10'}`}
            title="Area Chart"
          >
            <AreaChart strokeWidth={1.5} size={16} />
          </button>
          <button 
            onClick={() => setViewType('line')} 
            className={`p-1 rounded-md ${viewType === 'line' ? 'bg-white/30' : 'hover:bg-white/10'}`}
            title="Line Chart"
          >
            <LineChartIcon strokeWidth={1.5} size={16} />
          </button>
          <button 
            onClick={() => setViewType('bar')} 
            className={`p-1 rounded-md ${viewType === 'bar' ? 'bg-white/30' : 'hover:bg-white/10'}`}
            title="Bar Chart"
          >
            <BarChart3 strokeWidth={1.5} size={16} />
          </button>
          <button 
            onClick={() => setViewType('pie')} 
            className={`p-1 rounded-md ${viewType === 'pie' ? 'bg-white/30' : 'hover:bg-white/10'}`}
            title="Pie Chart"
          >
            <PieChartIcon strokeWidth={1.5} size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 mb-4">{description}</p>
        {chartComponent}
      </div>
    </motion.div>
  );
};
