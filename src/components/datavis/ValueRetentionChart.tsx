
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
  Cell
} from 'recharts';
import { ChartComponentProps } from './types';
import { valueRetentionData, COLORS } from './mockData';

export const ValueRetentionChart = ({ viewType }: ChartComponentProps) => {
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
