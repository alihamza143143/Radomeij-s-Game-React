import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { updateOffice } from '../../store/officeSlice';

const OfficeSelectView: React.FC = () => {
    const dispatch = useDispatch() as AppDispatch;
    const availableOffices = useSelector((state: RootState) => state.office.availableOffices);
    const currentOffice = useSelector((state: RootState) => state.office.currentOffice);
    const employeesCount = useSelector((state: RootState) => state.employee.employees.length);

    const handleOfficeChange = (officeId: number) => {
        dispatch(updateOffice(officeId));
    };

    return (
        <div className="p-4 bg-primary-content rounded-lg">
            <h2 className="text-lg font-bold mb-2">Select Your Office</h2>
            <div className="space-y-3">
                {availableOffices.map(office => {
                    const isCurrentOffice = currentOffice?.id === office.id;
                    const canMove = employeesCount <= office.maxEmployees;

                    return (
                        <div
                            key={office.id}
                            className={`p-3 border rounded-lg cursor-pointer text-sm ${isCurrentOffice ? 'bg-green-300' : 'bg-base-200'}`}
                        >
                            <h3 className="text-md font-semibold">{office.name}</h3>
                            <p>Rent Cost: ${office.rentCost}</p>
                            <p>Max Employees: {office.maxEmployees}</p>

                            {!isCurrentOffice && (
                                <button
                                    onClick={() => handleOfficeChange(office.id)}
                                    className={`btn btn-sm mt-2 ${canMove ? 'btn-primary' : 'btn-disabled'}`}
                                    disabled={!canMove}
                                >
                                    Move (${office.rentCost})
                                </button>
                            )}

                            {!canMove && !isCurrentOffice && (
                                <p className="text-red-500 text-xs mt-1">Too many employees for this office!</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OfficeSelectView;
