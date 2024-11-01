export type Attributes = {
    [key: string]: number;
};

export interface ConsumerPopulation {
    name: string;
    initialPopulation: number;
    currentPopulation: number;
    targetPopulations: { [year: number]: number };
    attributes: Attributes;
    exhaused: number;
}

export const createConsumerPopulation = (
    name: string,
    initialPopulation: number,
    targetPopulations: { [year: number]: number },
    attributes: Attributes,
    exhaused: number = 0
): ConsumerPopulation => {
    return {
        name,
        initialPopulation,
        currentPopulation: initialPopulation,
        targetPopulations: interpolatePopulations(targetPopulations),
        attributes,
        exhaused
    };
};

const interpolatePopulations = (targetPopulations: { [year: number]: number }): { [year: number]: number } => {
    const years = Object.keys(targetPopulations).map(Number).sort((a, b) => a - b);
    const interpolatedPopulations: { [year: number]: number } = {};

    for (let i = 0; i < years.length - 1; i++) {
        const startYear = years[i];
        const endYear = years[i + 1];
        const startPopulation = targetPopulations[startYear];
        const endPopulation = targetPopulations[endYear];

        interpolatedPopulations[startYear] = startPopulation;

        const yearsDiff = endYear - startYear;
        const populationDiff = endPopulation - startPopulation;
        const annualGrowth = populationDiff / yearsDiff;

        for (let year = startYear + 1; year < endYear; year++) {
            interpolatedPopulations[year] = startPopulation + annualGrowth * (year - startYear);
        }
    }

    interpolatedPopulations[years[years.length - 1]] = targetPopulations[years[years.length - 1]];
    return interpolatedPopulations;
};

export const updateMonthlyPopulation = (population: ConsumerPopulation, year: number, month: number): ConsumerPopulation => {
    const targetYearPopulation = population.targetPopulations[year] || population.currentPopulation;
    const previousYearPopulation = population.targetPopulations[year - 1] || population.currentPopulation;
    const monthlyGrowthRate = (targetYearPopulation - previousYearPopulation) / 12;

    const updatedPopulation = Math.round(previousYearPopulation + (monthlyGrowthRate * month));

    return {
        ...population,
        currentPopulation: updatedPopulation,
    };
};
