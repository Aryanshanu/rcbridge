
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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { ChartComponentProps } from './types';
import { roiData, roiBreakdownData, COLORS } from './mockData';

export const ROIChart = ({ viewType }: ChartComponentProps) => {
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
