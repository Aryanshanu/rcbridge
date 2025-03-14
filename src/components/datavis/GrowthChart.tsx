
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
import { ChartComponentProps } from './types';
import { growthData } from './mockData';

export const GrowthChart = ({ viewType }: ChartComponentProps) => {
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
