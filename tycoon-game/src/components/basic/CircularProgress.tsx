import React from 'react';
import { Pie } from 'react-chartjs-2';

interface CircularProgressProps {
    progress: number;
    color?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ progress, color = '#f1913c' }) => {
    const data = {
        labels: ['Progress', 'Remaining'],
        datasets: [
            {
                data: [progress, 100 - progress],
                backgroundColor: [color, '#194077'],
                hoverBackgroundColor: ['#66bb6a', '#f5f5f5'],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        cutout: '70%',
        plugins: {
            tooltip: {
                enabled: false,
            },
            legend: {
                display: false,
            },
            datalabels: {
                display: false,
            },
        },
        maintainAspectRatio: false
    };

    return (
        <div className="relative h-full max-h-12">
            <Pie data={data} options={options} />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-primary-content">{progress.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default CircularProgress;
