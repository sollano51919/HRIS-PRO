import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Employee } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

const Profile: React.FC = () => {
    const { userRole, currentUser, employees, viewingEmployeeId, setActiveModule } = useAppContext();
    const [employeeToShow, setEmployeeToShow] = useState<Employee | null>(null);

    useEffect(() => {
        let employee: Employee | undefined;
        if (userRole === 'Admin') {
            // Admin can view any profile specified by viewingEmployeeId
            employee = employees.find(e => e.id === viewingEmployeeId);
        } else {
            // Employee can only view their own profile
            employee = currentUser || undefined;
        }
        setEmployeeToShow(employee || null);
    }, [userRole, currentUser, employees, viewingEmployeeId]);

    if (!employeeToShow) {
        return (
            <Card>
                <p>No employee profile to display. Select an employee from the list or check your permissions.</p>
            </Card>
        );
    }
    
    const supervisor = employees.find(e => e.id === employeeToShow.supervisorId);
    const latestContract = employeeToShow.contracts[employeeToShow.contracts.length - 1];

    const isAdminViewingOther = userRole === 'Admin' && currentUser?.id !== employeeToShow.id;

    return (
        <div className="space-y-6">
            {isAdminViewingOther && (
                <div>
                    <Button variant="secondary" onClick={() => setActiveModule('employees')}>
                        <span className="flex items-center">
                            <ArrowLeftIcon className="w-4 h-4 mr-2"/>
                            Back to Employee List
                        </span>
                    </Button>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="text-center">
                        <img src={employeeToShow.avatar} alt={employeeToShow.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-indigo-200 dark:border-indigo-700" />
                        <h2 className="text-2xl font-bold">{employeeToShow.name}</h2>
                        <p className="text-indigo-500 dark:text-indigo-400">{employeeToShow.position}</p>
                        <p className="text-gray-500 dark:text-gray-400">{employeeToShow.department}</p>
                        <span className={`mt-4 inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                            employeeToShow.status === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                            {employeeToShow.status}
                        </span>
                    </Card>
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h3 className="text-xl font-bold mb-4 border-b pb-2">Contact & Reporting</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Email Address</p>
                                <p className="font-medium">{employeeToShow.email}</p>
                            </div>
                             <div>
                                <p className="text-sm text-gray-500">Supervisor</p>
                                <p className="font-medium">{supervisor ? supervisor.name : 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="font-medium">{`${employeeToShow.address.street}, ${employeeToShow.address.city}, ${employeeToShow.address.state} ${employeeToShow.address.zip}`}</p>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold mb-4 border-b pb-2">Leave Balances</h3>
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="text-2xl font-bold text-green-500">{employeeToShow.leaveCredits.vacation}</p>
                                <p className="text-sm text-gray-500">Vacation Days</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-yellow-500">{employeeToShow.leaveCredits.sick}</p>
                                <p className="text-sm text-gray-500">Sick Days</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-500">{employeeToShow.leaveCredits.personal}</p>
                                <p className="text-sm text-gray-500">Personal Days</p>
                            </div>
                        </div>
                    </Card>
                     <Card>
                        <h3 className="text-xl font-bold mb-4 border-b pb-2">Contract Details</h3>
                        {latestContract ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Contract Type</p>
                                    <p className="font-medium">{latestContract.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Start Date</p>
                                    <p className="font-medium">{latestContract.startDate}</p>
                                </div>
                             </div>
                        ) : (
                            <p className="text-gray-500">No active contract on file.</p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);


export default Profile;
