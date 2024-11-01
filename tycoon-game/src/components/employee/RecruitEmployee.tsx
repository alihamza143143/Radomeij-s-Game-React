import { addEmployee } from '@/store/employeeSlice';
import { RootState } from '@/store/store';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateRandomName } from '@/utils/randomNameGenerator';

interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    birthYear: number;
    salary: number;
    researchSkill: number;
    designSkill: number;
    testingSkill: number;
    managementSkill: number;
}

const RecruitEmployee: React.FC = () => {
    const [budget, setBudget] = useState(1000);
    const [candidates, setCandidates] = useState<Employee[]>([]);
    const dispatch = useDispatch();
    const gameYear = useSelector((state: RootState) => state.game.year);

    const handleRoll = () => {
        const skillRange = getSkillRange(budget);
        const numCandidates = getNumberOfCandidates(budget);
        const generatedCandidates = Array.from({ length: numCandidates }, () =>
            generateRandomEmployee(skillRange, gameYear)
        );
        setCandidates(generatedCandidates);
    };

    const handleHireEmployee = (employee: Employee) => {
        dispatch(addEmployee(employee));
        setCandidates(candidates.filter((candidate) => candidate.id !== employee.id));
    };

    const getSkillRange = (budget: number) => {
        if (budget === 1000) {
            return { min: 0, max: 0.2 };
        } else if (budget === 50000) {
            return { min: 0.5, max: 2.0 };
        } else {
            const min = 0.5 * (budget / 50000);
            const max = 2.0 * (budget / 50000);
            return { min, max };
        }
    };

    const getNumberOfCandidates = (budget: number) => {
        const baseCandidates = 2;
        const additionalChance = Math.floor((budget / 50000) * 8); // Maksymalnie 8 dodatkowych kandydatów
        return baseCandidates + additionalChance;
    };

    const generateRandomEmployee = ({ min, max }: { min: number; max: number }, gameYear: number): Employee => {
        const minAge = 18;
        const maxAge = 60;

        const getRandomSkill = () => Math.random() * (max - min) + min;
        const scaleToPercentage = (skill: number) => Math.floor((skill / 2.0) * 100);

        const [firstName, lastName] = generateRandomName().split(' ');

        return {
            id: Date.now() + Math.random(), // Unikalne ID
            firstName,
            lastName,
            birthYear: Math.floor(Math.random() * (maxAge - minAge + 1)) + (gameYear - maxAge),
            salary: budget,
            researchSkill: scaleToPercentage(getRandomSkill()),
            designSkill: scaleToPercentage(getRandomSkill()),
            testingSkill: scaleToPercentage(getRandomSkill()),
            managementSkill: scaleToPercentage(getRandomSkill()),
        };
    };

    return (
        <div className="p-4">
            <h2 className="mb-4 bg-white bg-opacity-10">Recruit New Employee</h2>
            <div className="mb-4">
                <label htmlFor="budget" className="block mb-2">Select Budget: ${budget}</label>
                <input
                    type="range"
                    id="budget"
                    name="budget"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                    className="w-full"
                />
            </div>
            <button
                className="btn btn-primary btn-lg mb-4"
                onClick={handleRoll}
            >
                Roll
            </button>

            {candidates.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {candidates.map((candidate) => (
                        <div key={candidate.id} className="mb-4 p-4 border border-gray-300 rounded">
                            <p><strong>Name:</strong> {candidate.firstName} {candidate.lastName}</p>
                            <p><strong>Birth Year:</strong> {candidate.birthYear}</p>
                            <p><strong>Salary:</strong> ${candidate.salary.toFixed(2)}</p>
                            <div className="mb-2">
                                <p><strong>Research Skill:</strong> {candidate.researchSkill}%</p>
                                <progress className="progress w-56" value={candidate.researchSkill} max="100"></progress>
                            </div>
                            <div className="mb-2">
                                <p><strong>Design Skill:</strong> {candidate.designSkill}%</p>
                                <progress className="progress w-56" value={candidate.designSkill} max="100"></progress>
                            </div>
                            <div className="mb-2">
                                <p><strong>Testing Skill:</strong> {candidate.testingSkill}%</p>
                                <progress className="progress w-56" value={candidate.testingSkill} max="100"></progress>
                            </div>
                            <div className="mb-2">
                                <p><strong>Management Skill:</strong> {candidate.managementSkill}%</p>
                                <progress className="progress w-56" value={candidate.managementSkill} max="100"></progress>
                            </div>
                            <button
                                className="btn btn-success btn-lg mt-2"
                                onClick={() => handleHireEmployee(candidate)}
                            >
                                Hire Employee
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecruitEmployee;
