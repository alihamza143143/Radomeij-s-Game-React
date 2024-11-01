import consumerData from '../data/consumer_data.json';
import { Attributes, ConsumerPopulation, createConsumerPopulation } from '../models/ConsumerPopulation';

interface ConsumerDataRaw {
    class: string;
    initialPopulation: number;
    attributes: Attributes;
    targetPopulations: {
        [year: string]: number;
    };
}

export const loadConsumerPopulations = (): ConsumerPopulation[] => {
    const data: ConsumerDataRaw[] = consumerData as ConsumerDataRaw[];
    return data.map(consumer => createConsumerPopulation(
        consumer.class,
        consumer.initialPopulation,
        consumer.targetPopulations,
        consumer.attributes
    ));
};
