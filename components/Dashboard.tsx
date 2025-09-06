
import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useAppContext } from '../context/AppContext';
import { LeaveRequest } from '../types';

const AdminDashboard: React.FC = () => {
    const { employees, jobPostings, performanceReviews, onboardingPlans } = useAppContext();

    const activeEmployees = employees.filter(e => e.status === 'Active').length;
    const openPositions = jobPostings.filter(p => p.status === 'Open').length;
    const pendingReviews = performanceReviews.filter(r => r.status === 'Pending').length;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Welcome back, Admin!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Active Employees</h3>
                    <p className="text-4xl font-bold mt-2">{activeEmployees}</p>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Open Job Positions</h3>
                    <p className="text-4xl font-bold mt-2">{openPositions}</p>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Pending Reviews</h3>
                    <p className="text-4xl font-bold mt-2">{pendingReviews}</p>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-xl font-bold mb-4">Upcoming Reviews</h3>
                     <ul>
                        {performanceReviews.filter(r => r.status === 'Pending').slice(0, 5).map(review => (
                            <li key={review.id} className="flex justify-between items-center py-2 border-b dark:border-gray-700 last:border-b-0">
                                <span>{review.employeeName}</span>
                                <span className="text-sm text-gray-500">{review.date}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card>
                    <h3 className="text-xl font-bold mb-4">Recent Hires (Onboarding)</h3>
                    <ul>
                        {onboardingPlans.slice(0, 5).map(plan => (
                             <li key={plan.id} className="flex justify-between items-center py-2 border-b dark:border-gray-700 last:border-b-0">
                                <div>
                                    <p className="font-medium">{plan.employeeName}</p>
                                    <p className="text-sm text-gray-500">{plan.role}</p>
                                </div>
                                <span className="text-sm text-gray-500">Started: {plan.startDate}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};


const EmployeeDashboard: React.FC = () => {
    const { currentUser, leaveRequests, schedules, setActiveModule } = useAppContext();

    if (!currentUser) {
        return <p>Loading...</p>;
    }

    const myLeaveRequests = leaveRequests
        .filter(lr => lr.employeeId === currentUser.id)
        .slice(0, 5); // Get latest 5 requests

    const mySchedule = schedules.find(s => s.employeeId === currentUser.id);

    const getStatusColor = (status: LeaveRequest['status']) => {
        switch(status) {
            case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Welcome back, {currentUser.name}!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Vacation Days Left</h3>
                    <p className="text-4xl font-bold mt-2 text-green-500">{currentUser.leaveCredits.vacation}</p>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Sick Days Left</h3>
                    <p className="text-4xl font-bold mt-2 text-yellow-500">{currentUser.leaveCredits.sick}</p>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Personal Days Left</h3>
                    <p className="text-4xl font-bold mt-2 text-blue-500">{currentUser.leaveCredits.personal}</p>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Recent Leave Requests</h3>
                        <Button size="sm" onClick={() => setActiveModule('attendance')}>View All</Button>
                    </div>
                     {myLeaveRequests.length > 0 ? (
                        <ul className="space-y-3">
                            {myLeaveRequests.map(req => (
                                <li key={req.id} className="flex justify-between items-center py-2 border-b dark:border-gray-700 last:border-b-0">
                                    <div>
                                        <p className="font-medium">{req.type}</p>
                                        <p className="text-sm text-gray-500">{req.startDate} to {req.endDate}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                                        {req.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                     ) : (
                        <p className="text-gray-500 dark:text-gray-400 pt-4 text-center">You haven't made any leave requests yet.</p>
                     )}
                </Card>
                <Card>
                    <h3 className="text-xl font-bold mb-4">My Weekly Schedule</h3>
                    {mySchedule ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-center">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr>
                                        <th className="p-2 font-semibold">Mon</th>
                                        <th className="p-2 font-semibold">Tue</th>
                                        <th className="p-2 font-semibold">Wed</th>
                                        <th className="p-2 font-semibold">Thu</th>
                                        <th className="p-2 font-semibold">Fri</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-2">{mySchedule.monday}</td>
                                        <td className="p-2">{mySchedule.tuesday}</td>
                                        <td className="p-2">{mySchedule.wednesday}</td>
                                        <td className="p-2">{mySchedule.thursday}</td>
                                        <td className="p-2">{mySchedule.friday}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 pt-4 text-center">Your schedule has not been set up.</p>
                    )}
                </Card>
            </div>
        </div>
    );
};


const Dashboard: React.FC = () => {
    const { userRole } = useAppContext();

    if (userRole === 'Admin') {
        return <AdminDashboard />;
    }
    
    return <EmployeeDashboard />;
};


export default Dashboard;
