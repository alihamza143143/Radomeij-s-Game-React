import officeData from '../data/office_data.json';
import { Office } from '../store/officeSlice';

interface OfficeDataRaw {
    offices: {
        id: number;
        name: string;
        rentCost: number;
        maxEmployees: number;
    }[];
}

export const loadOffices = (): Office[] => {
    const data: OfficeDataRaw = officeData;
    const offices: Office[] = [];

    data.offices.forEach(officeData => {
        offices.push({
            id: officeData.id,
            name: officeData.name,
            rentCost: officeData.rentCost,
            maxEmployees: officeData.maxEmployees
        });
    });

    console.log("load offices", offices);
    return offices;
};
