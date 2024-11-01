import React from 'react';
import { useSelector } from 'react-redux';
import { BarChart, PieArcSeries, PieChart, RadialBarSeries } from 'reaviz';
import { RootState } from '../../store/store';
import { ConsumerPopulation } from '../../models/ConsumerPopulation';

interface ChartData {
    key: string;
    data: number;
}

const ConsumerPopulationChart: React.FC = () => {
    const populations = useSelector((state: RootState) => state.consumers.populations);

    const data: ChartData[] = populations.map((pop) => ({
        key: pop.name,
        data: pop.currentPopulation,
    }));

    const totalPopulation = populations.reduce((sum, pop) => sum + pop.currentPopulation, 0);

    return (
        <div className="w-full max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Consumer Population Distribution</h2>
            <div className="h-[400px]">
                <PieChart
                    // height={400}
                    // width={400}
                    data={data}
                    series={<PieArcSeries colorScheme="unifyviz" />}
                />
                {/* <RadialBarSeries  colorScheme="unifyviz" />; */}
            </div>
            <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Population Details:</h3>
                <ul className="list-disc list-inside">
                    {populations.map((pop: ConsumerPopulation) => (
                        <li key={pop.name} className="mb-1">
                            {pop.name}: {pop.currentPopulation.toLocaleString()}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">Total Population:</h3>
                <p>{totalPopulation.toLocaleString()}</p>
            </div>
        </div>
    );
};

export default ConsumerPopulationChart;
