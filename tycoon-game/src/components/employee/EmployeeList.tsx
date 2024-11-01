import { removeEmployee } from '@/store/employeeSlice';
import { RootState } from '@/store/store';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const EmployeeList: React.FC = () => {
    const dispatch = useDispatch();
    const employees = useSelector((state: RootState) => state.employee.employees);

    const handleFireEmployee = (employeeId: number) => {
        dispatch(removeEmployee(employeeId));
    };

    return (
        <div className="p-2">
            <h2 className="mb-4 bg-white bg-opacity-10">Employees</h2>
            {employees.length === 0 ? (
                <p>No employees hired yet.</p>
            ) : (
                <table className="table table-xs w-full">
                    <thead>
                        <tr>
                            <th className="w-1/5 text-left">First Name</th>
                            <th className="w-1/5 text-left">Last Name</th>
                            <th className="w-1/5 text-left">Birth Year</th>
                            <th className="w-1/5 text-left">Salary</th>
                            <th className="w-1/5 text-left">Research Skill</th>
                            <th className="w-1/5 text-left">Design Skill</th>
                            <th className="w-1/5 text-left">Testing Skill</th>
                            <th className="w-1/5 text-left">Management Skill</th>
                            <th className="w-1/5 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.firstName}</td>
                                <td>{employee.lastName}</td>
                                <td>{employee.birthYear}</td>
                                <td>{employee.salary.toFixed(2)}</td>
                                <td>{employee.researchSkill.toFixed(2)}</td>
                                <td>{employee.designSkill.toFixed(2)}</td>
                                <td>{employee.testingSkill.toFixed(2)}</td>
                                <td>{employee.managementSkill.toFixed(2)}</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleFireEmployee(employee.id)}
                                    >
                                        Fire
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EmployeeList;
