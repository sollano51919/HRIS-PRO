import React, { useState, useMemo, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Spinner from './ui/Spinner';
import Modal from './ui/Modal';
import { useAppContext } from '../context/AppContext';
import { checkLeaveAvailability } from '../services/geminiService';
import { Employee, LeaveRequest, TimeRecord } from '../types';
import AttendanceDashboard from './AttendanceDashboard';

type AdminTab = 'dashboard' | 'timeRecord' | 'leaves' | 'schedule' | 'inactive';

const LeaveRequestModal: React.FC<{
    onClose: () => void;
    onSubmit: (request: Omit<LeaveRequest, 'id' | 'status' | 'employeeName'>) => void;
    activeEmployees: Employee[];
    currentUser: Employee;
    userRole: 'Admin' | 'Employee';
}> = ({ onClose, onSubmit, activeEmployees, currentUser, userRole }) => {
    const { employees } = useAppContext();
    const [employeeId, setEmployeeId] = useState<string>(currentUser.id.toString());
    const [leaveType, setLeaveType] = useState<'Vacation' | 'Sick Leave' | 'Personal'>('Vacation');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState('');

    useEffect(() => {
        // Debounced AI check
        if (employeeId && startDate && endDate) {
            const handler = setTimeout(() => {
                handleCheckAvailability();
            }, 1000);
            return () => clearTimeout(handler);
        }
    }, [employeeId, leaveType, startDate, endDate]);
    
    const handleCheckAvailability = async () => {
        const employee = employees.find(e => e.id === Number(employeeId));
        if (!employee || !startDate || !endDate) return;
        
        setIsLoading(true);
        setAiResponse('');
        const result = await checkLeaveAvailability(employee.name, employee.leaveCredits, leaveType, startDate, endDate);
        setAiResponse(result);
        setIsLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (aiResponse.startsWith('ERROR:')) {
            alert("Please resolve the errors before submitting.");
            return;
        }
        onSubmit({ employeeId: Number(employeeId), type: leaveType, startDate, endDate });
        onClose();
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title="Request Time Off">
            <form onSubmit={handleSubmit} className="space-y-4">
                 {userRole === 'Admin' && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee</label>
                        <select
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                        >
                            {activeEmployees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                 )}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Leave Type</label>
                    <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                    >
                        <option>Vacation</option>
                        <option>Sick Leave</option>
                        <option>Personal</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                    <Input label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                </div>
                
                <div className="h-20">
                {isLoading && <div className="flex items-center"><Spinner /> <span className="ml-2 text-gray-500">AI is checking leave balance...</span></div>}
                {aiResponse && (
                    <div className={`p-3 rounded-md text-sm ${
                        aiResponse.startsWith('CONFIRMED:') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        aiResponse.startsWith('WARNING:') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                        <p className="font-semibold">AI Assistant:</p>
                        <p>{aiResponse}</p>
                    </div>
                )}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>Submit Request</Button>
                </div>
            </form>
        </Modal>
    );
};

const TimeRecordTab: React.FC = () => {
    const { timeRecords } = useAppContext();
    const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));

    const filteredRecords = useMemo(() => {
        return timeRecords.filter(record => record.date === filterDate);
    }, [timeRecords, filterDate]);
    
    const getStatusColor = (status: TimeRecord['status']) => {
        switch(status) {
            case 'On Time': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Late': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Absent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        }
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Daily Time Record</h3>
                <Input label="" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4">Employee</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Time In</th>
                            <th className="p-4">Time Out</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.length > 0 ? filteredRecords.map(rec => (
                            <tr key={rec.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="p-4 font-medium">{rec.employeeName}</td>
                                <td className="p-4">{rec.date}</td>
                                <td className="p-4">{rec.timeIn}</td>
                                <td className="p-4">{rec.timeOut}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rec.status)}`}>
                                        {rec.status}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} className="text-center p-8 text-gray-500">No time records for this date.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

const LeaveRequestsTab: React.FC<{ requests: LeaveRequest[], title: string, showActions: boolean }> = ({ requests, title, showActions }) => {
    const { updateLeaveRequestStatus } = useAppContext();
    const getStatusColor = (status: LeaveRequest['status']) => {
        switch(status) {
            case 'Approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        }
    }
    return (
         <Card>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4">Employee</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Dates</th>
                            <th className="p-4">Status</th>
                            {showActions && <th className="p-4">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length > 0 ? requests.map(req => (
                            <tr key={req.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="p-4 font-medium">{req.employeeName}</td>
                                <td className="p-4">{req.type}</td>
                                <td className="p-4">{req.startDate} to {req.endDate}</td>
                                <td className="p-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                                        {req.status}
                                    </span>
                                </td>
                                {showActions && (
                                    <td className="p-4 space-x-2">
                                        {req.status === 'Pending' && (
                                            <>
                                                <Button size="sm" onClick={() => updateLeaveRequestStatus(req.id, 'Approved')}>Approve</Button>
                                                <Button size="sm" variant="secondary" onClick={() => updateLeaveRequestStatus(req.id, 'Rejected')}>Reject</Button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        )) : (
                            <tr><td colSpan={showActions ? 5: 4} className="text-center p-8 text-gray-500">No leave requests found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

const ScheduleTab: React.FC = () => {
    const { schedules, employees } = useAppContext();
    const activeEmployeeIds = useMemo(() => new Set(employees.filter(e => e.status === 'Active').map(e => e.id)), [employees]);
    const activeSchedules = useMemo(() => schedules.filter(s => activeEmployeeIds.has(s.employeeId)), [schedules, activeEmployeeIds]);
    
    return (
        <Card>
             <h3 className="text-xl font-bold mb-4">Employee Schedules</h3>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4">Employee</th>
                            <th className="p-4 text-center">Monday</th>
                            <th className="p-4 text-center">Tuesday</th>
                            <th className="p-4 text-center">Wednesday</th>
                            <th className="p-4 text-center">Thursday</th>
                            <th className="p-4 text-center">Friday</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeSchedules.map(sch => (
                             <tr key={sch.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="p-4 font-medium">{sch.employeeName}</td>
                                <td className="p-4 text-center">{sch.monday}</td>
                                <td className="p-4 text-center">{sch.tuesday}</td>
                                <td className="p-4 text-center">{sch.wednesday}</td>
                                <td className="p-4 text-center">{sch.thursday}</td>
                                <td className="p-4 text-center">{sch.friday}</td>
                             </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </Card>
    );
};


const AdminView: React.FC = () => {
    const { employees, leaveRequests, addLeaveRequest } = useAppContext();
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const activeEmployees = useMemo(() => employees.filter(e => e.status === 'Active'), [employees]);
    const activeLeaveRequests = useMemo(() => leaveRequests.filter(lr => activeEmployees.some(e => e.id === lr.employeeId)), [leaveRequests, activeEmployees]);
    const inactiveLeaveRequests = useMemo(() => leaveRequests.filter(lr => !activeEmployees.some(e => e.id === lr.employeeId)), [leaveRequests, activeEmployees]);
    
    const handleAddLeaveRequestAdmin = (request: Omit<LeaveRequest, 'id' | 'status' | 'employeeName'>) => {
        const employee = employees.find(e => e.id === request.employeeId);
        if (!employee) return;
        addLeaveRequest({
            ...request,
            employeeName: employee.name,
            status: 'Pending'
        });
    };

    const renderAdminContent = () => {
        switch (activeTab) {
            case 'dashboard': return <AttendanceDashboard />;
            case 'timeRecord': return <TimeRecordTab />;
            case 'leaves': return <LeaveRequestsTab requests={activeLeaveRequests} title="Active Employee Leave Requests" showActions={true}/>;
            case 'schedule': return <ScheduleTab />;
            case 'inactive': return <LeaveRequestsTab requests={inactiveLeaveRequests} title="Inactive Employee Leave Records" showActions={false} />;
        }
    };
    
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                 <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {(['dashboard', 'timeRecord', 'leaves', 'schedule', 'inactive'] as AdminTab[]).map(tab => (
                             <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                                    activeTab === tab
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab === 'timeRecord' ? 'Time Record' : tab === 'leaves' ? 'Leave Requests' : tab === 'inactive' ? 'Inactive Records' : tab}
                            </button>
                        ))}
                    </nav>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>Request Time Off</Button>
            </div>
            <div>
                {renderAdminContent()}
            </div>
            {isModalOpen && (
                 <LeaveRequestModal 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleAddLeaveRequestAdmin}
                    activeEmployees={activeEmployees}
                    currentUser={activeEmployees[0]} // Admin can select any employee
                    userRole="Admin"
                />
            )}
        </div>
    );
}

const EmployeeView: React.FC = () => {
    const { leaveRequests, currentUser, employees, addLeaveRequest, userRole } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    if (!currentUser || !userRole) return null;

    const myLeaveRequests = useMemo(() => {
        return leaveRequests.filter(lr => lr.employeeId === currentUser.id);
    }, [leaveRequests, currentUser]);
    
    const handleAddLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'status' | 'employeeName'>) => {
        addLeaveRequest({
            ...request,
            employeeName: currentUser.name,
            status: 'Pending'
        });
    };

    return (
         <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={() => setIsModalOpen(true)}>Request Time Off</Button>
            </div>
            <LeaveRequestsTab requests={myLeaveRequests} title="My Leave Requests" showActions={false}/>
            {isModalOpen && (
                 <LeaveRequestModal 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleAddLeaveRequest}
                    activeEmployees={employees.filter(e => e.status === 'Active')}
                    currentUser={currentUser}
                    userRole={userRole}
                />
            )}
        </div>
    );
}


const Attendance: React.FC = () => {
    const { userRole } = useAppContext();
    return userRole === 'Admin' ? <AdminView /> : <EmployeeView />;
};

export default Attendance;