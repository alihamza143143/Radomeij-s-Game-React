import React from 'react';
import { useSelector } from 'react-redux';
import { Pie } from 'react-chartjs-2';
import { RootState } from '../../store/store';

const ConsumerDashboard: React.FC = () => {
    const populations = useSelector((state: RootState) => state.consumers.populations);

    const data = {
        labels: populations.map(population => population.name),
        datasets: [
            {
                label: 'Consumer Populations',
                data: populations.map(population => population.currentPopulation),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw} people`,
                },
            },
        },
    };


    return (
        <div className="bg-white p-8 rounded shadow-lg max-w-3xl w-full">
            <h2 className="text-2xl mb-4">Consumer Population Dashboard</h2>
            <div className="mb-8">
                <Pie data={data} options={options} />
            </div>
        </div>
    );
};

export default ConsumerDashboard;
