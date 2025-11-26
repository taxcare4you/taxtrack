'use client';

import { Chart as ChartJS } from 'react-chartjs-2';
import { ChartOptions, ChartData } from 'chart.js';

type Props = {
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
};

export default function DashboardChart({ data, options }: Props) {
  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <ChartJS type="bar" data={data} options={options} />
    </div>
  );
}