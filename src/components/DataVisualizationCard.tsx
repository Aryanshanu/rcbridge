import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
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
import { 
  fetchValueRetentionData, 
  fetchGrowthData, 
  fetchROIData 
} from '@/utils/chartDataFetcher';

type VisualizationType = 'value-retention' | 'growth' | 'roi';

interface DataVisualizationCardProps {
  title: string;
  description: string;
  type: VisualizationType;
  className?: string;
}

const ValueRetentionChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={200}>
    <BarChart
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
      <XAxis 
        dataKey="name" 
        axisLine={false} 
        tickLine={false}
        className="fill-gray-600 dark:fill-gray-300" 
      />
      <YAxis 
        domain={[0, 100]} 
        axisLine={false} 
        tickLine={false} 
        tickFormatter={(value) => `${value}%`}
        className="fill-gray-600 dark:fill-gray-300"
      />
      <Tooltip 
        formatter={(value: number) => [`${value}%`, 'Value Retention']}
        contentStyle={{ 
          backgroundColor: 'hsl(var(--background))', 
          borderRadius: '8px', 
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))'
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

const GrowthChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={200}>
    <AreaChart
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <defs>
        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
      <XAxis 
        dataKey="month" 
        axisLine={false} 
        tickLine={false}
        className="fill-gray-600 dark:fill-gray-300"
      />
      <YAxis 
        axisLine={false} 
        tickLine={false}
        className="fill-gray-600 dark:fill-gray-300"
      />
      <Tooltip 
        formatter={(value: number) => [`${value}`, 'Value']}
        contentStyle={{ 
          backgroundColor: 'hsl(var(--background))', 
          borderRadius: '8px', 
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))'
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

const ROIChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={200}>
    <LineChart
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
      <XAxis 
        dataKey="year" 
        axisLine={false} 
        tickLine={false}
        className="fill-gray-600 dark:fill-gray-300"
      />
      <YAxis 
        axisLine={false} 
        tickLine={false} 
        tickFormatter={(value) => `${value}%`}
        className="fill-gray-600 dark:fill-gray-300"
      />
      <Tooltip 
        formatter={(value: number) => [`${value}%`, 'ROI']}
        contentStyle={{ 
          backgroundColor: 'hsl(var(--background))', 
          borderRadius: '8px', 
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))'
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
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let result;
        switch (type) {
          case 'value-retention':
            result = await fetchValueRetentionData();
            break;
          case 'growth':
            result = await fetchGrowthData();
            break;
          case 'roi':
            result = await fetchROIData();
            break;
          default:
            result = [];
        }
        setData(result);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type]);

  let Icon;
  let badgeColor;
  let chartComponent;
  
  switch (type) {
    case 'value-retention':
      Icon = Percent;
      badgeColor = 'bg-blue-500 dark:bg-blue-600';
      chartComponent = <ValueRetentionChart data={data} />;
      break;
    case 'growth':
      Icon = TrendingUp;
      badgeColor = 'bg-primary dark:bg-primary/90';
      chartComponent = <GrowthChart data={data} />;
      break;
    case 'roi':
      Icon = ArrowUpRight;
      badgeColor = 'bg-accent dark:bg-accent/90';
      chartComponent = <ROIChart data={data} />;
      break;
    default:
      Icon = Building;
      badgeColor = 'bg-gray-500 dark:bg-gray-600';
      chartComponent = <ValueRetentionChart data={data} />;
  }
  
  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 overflow-hidden border border-gray-100 dark:border-gray-700 ${className || ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={`${badgeColor} p-2 text-white font-medium flex items-center`}>
        <Icon className="h-5 w-5 mr-2" />
        {title}
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        {isLoading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          chartComponent
        )}
      </div>
    </motion.div>
  );
};
