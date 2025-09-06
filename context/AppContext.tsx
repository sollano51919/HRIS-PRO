import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, JobPosting, OnboardingPlan, PerformanceReview, LeaveRequest, AppContextType, UserRole, TimeRecord, EmployeeSchedule } from '../types';
import * as storage from '../services/storageService';

const MOCK_EMPLOYEES_DATA: Employee[] = [
  { id: 1, name: 'John Doe', position: 'Software Engineer', department: 'Technology', email: 'john.doe@example.com', password: 'password', avatar: 'https://i.pravatar.cc/150?u=1', status: 'Active', gender: 'Male', supervisorId: 3, address: { street: '123 Main St', city: 'Techville', state: 'CA', zip: '90210' }, employmentHistory: [], contracts: [{ type: 'Full-Time', startDate: '2022-01-15' }], performance: { lastReview: '2023-12-01', achievements: ['Launched new feature ahead of schedule'], areasForImprovement: ['Improve documentation for complex code sections'] }, leaveCredits: { vacation: 12, sick: 8, personal: 5 }, accessibleModules: ['dashboard', 'attendance', 'assistant', 'profile'] },
  { id: 2, name: 'Jane Smith', position: 'Product Manager', department: 'Product', email: 'jane.smith@example.com', password: 'password', avatar: 'https://i.pravatar.cc/150?u=2', status: 'Active', gender: 'Female', supervisorId: 3, address: { street: '456 Oak Ave', city: 'Productburg', state: 'CA', zip: '90211' }, employmentHistory: [], contracts: [{ type: 'Full-Time', startDate: '2021-06-01' }], performance: { lastReview: '2024-01-15', achievements: ['Successfully managed Q4 product roadmap'], areasForImprovement: ['Increase frequency of stakeholder updates'] }, leaveCredits: { vacation: 15, sick: 10, personal: 5 }, accessibleModules: ['dashboard', 'attendance'] },
  { id: 3, name: 'Alice Johnson', position: 'Engineering Manager', department: 'Technology', email: 'admin@hr-core.com', password: 'password', avatar: 'https://i.pravatar.cc/150?u=3', status: 'Active', gender: 'Female', supervisorId: null, address: { street: '789 Pine Ln', city: 'Techville', state: 'CA', zip: '90210' }, employmentHistory: [], contracts: [{ type: 'Full-Time', startDate: '2020-03-10' }], performance: { lastReview: '2024-02-01', achievements: ['Mentored junior developers', 'Improved team velocity by 15%'], areasForImprovement: ['Delegate more tasks to senior engineers'] }, leaveCredits: { vacation: 20, sick: 10, personal: 5 }, accessibleModules: ['dashboard', 'employees', 'recruitment', 'performance', 'attendance', 'reporting', 'assistant', 'profile'] },
  { id: 4, name: 'Bob Brown', position: 'UX Designer', department: 'Design', email: 'bob.brown@example.com', password: 'password', avatar: 'https://i.pravatar.cc/150?u=4', status: 'Active', gender: 'Male', supervisorId: 2, address: { street: '101 Maple Dr', city: 'Design City', state: 'CA', zip: '90212' }, employmentHistory: [], contracts: [{ type: 'Full-Time', startDate: '2023-02-20' }], performance: { lastReview: '2023-11-20', achievements: ['Redesigned the user onboarding flow, increasing completion rate'], areasForImprovement: ['Contribute more to design system documentation'] }, leaveCredits: { vacation: 10, sick: 5, personal: 2 }, accessibleModules: ['dashboard', 'assistant'] },
  { id: 5, name: 'Charlie Davis', position: 'HR Specialist', department: 'Human Resources', email: 'charlie.d@example.com', password: 'password', avatar: 'https://i.pravatar.cc/150?u=5', status: 'Inactive', gender: 'Prefer not to say', supervisorId: null, address: { street: '212 Birch Rd', city: 'HR Town', state: 'CA', zip: '90213' }, employmentHistory: [], contracts: [], performance: { lastReview: '2023-05-10', achievements: [], areasForImprovement: [] }, leaveCredits: { vacation: 0, sick: 0, personal: 0 }, accessibleModules: [] },
];

const MOCK_JOB_POSTINGS_DATA: JobPosting[] = [
  { id: 1, title: 'Senior Backend Engineer', department: 'Technology', status: 'Open', candidates: 42 },
  { id: 2, title: 'Marketing Coordinator', department: 'Marketing', status: 'Open', candidates: 78 },
  { id: 3, title: 'Data Scientist', department: 'Data', status: 'Closed', candidates: 112 },
];

const MOCK_ONBOARDING_PLANS_DATA: OnboardingPlan[] = [
  { id: 1, employeeName: 'Emily White', role: 'Junior Frontend Developer', startDate: '2024-07-01', manager: 'Alice Johnson', progress: 75 },
  { id: 2, employeeName: 'Michael Green', role: 'Sales Development Rep', startDate: '2024-07-15', manager: 'Jane Smith', progress: 25 },
];

const MOCK_PERFORMANCE_REVIEWS_DATA: PerformanceReview[] = [
  { id: 1, employeeId: 1, employeeName: 'John Doe', date: '2024-06-01', status: 'Completed' },
  { id: 2, employeeId: 2, employeeName: 'Jane Smith', date: '2024-07-15', status: 'Pending' },
  { id: 4, employeeId: 4, employeeName: 'Bob Brown', date: '2024-05-20', status: 'Completed' },
];

const MOCK_LEAVE_REQUESTS_DATA: LeaveRequest[] = [
    { id: 1, employeeId: 1, employeeName: 'John Doe', type: 'Vacation', startDate: '2024-08-05', endDate: '2024-08-09', status: 'Approved' },
    { id: 2, employeeId: 2, employeeName: 'Jane Smith', type: 'Sick Leave', startDate: '2024-07-22', endDate: '2024-07-22', status: 'Approved' },
    { id: 3, employeeId: 4, employeeName: 'Bob Brown', type: 'Personal', startDate: '2024-09-02', endDate: '2024-09-02', status: 'Pending' },
    { id: 4, employeeId: 5, employeeName: 'Charlie Davis', type: 'Vacation', startDate: '2023-04-10', endDate: '2023-04-14', status: 'Approved' },
];

const today = new Date().toISOString().slice(0, 10);
const MOCK_TIME_RECORDS_DATA: TimeRecord[] = [
    { id: 1, employeeId: 1, employeeName: 'John Doe', date: today, timeIn: '09:05', timeOut: '17:02', status: 'On Time' },
    { id: 2, employeeId: 2, employeeName: 'Jane Smith', date: today, timeIn: '09:15', timeOut: '17:30', status: 'Late' },
    { id: 3, employeeId: 3, employeeName: 'Alice Johnson', date: today, timeIn: '08:58', timeOut: '17:05', status: 'On Time' },
    { id: 4, employeeId: 4, employeeName: 'Bob Brown', date: today, timeIn: '09:00', timeOut: '16:55', status: 'On Time' },
];

const MOCK_SCHEDULES_DATA: EmployeeSchedule[] = [
    { id: 1, employeeId: 1, employeeName: 'John Doe', monday: '9-5', tuesday: '9-5', wednesday: '9-5', thursday: '9-5', friday: '9-5' },
    { id: 2, employeeId: 2, employeeName: 'Jane Smith', monday: '9-5', tuesday: '9-5', wednesday: '9-5', thursday: '9-5', friday: '9-5' },
    { id: 3, employeeId: 3, employeeName: 'Alice Johnson', monday: '9-5', tuesday: '9-5', wednesday: '9-5', thursday: '9-5', friday: '9-5' },
    { id: 4, employeeId: 4, employeeName: 'Bob Brown', monday: '10-6', tuesday: '10-6', wednesday: '10-6', thursday: '10-6', friday: 'Day Off' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State
    const [employees, setEmployees] = useState<Employee[]>(() => storage.getEmployees(MOCK_EMPLOYEES_DATA));
    const [jobPostings, setJobPostings] = useState<JobPosting[]>(() => storage.getJobPostings(MOCK_JOB_POSTINGS_DATA));
    const [onboardingPlans, setOnboardingPlans] = useState<OnboardingPlan[]>(() => storage.getOnboardingPlans(MOCK_ONBOARDING_PLANS_DATA));
    const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(() => storage.getPerformanceReviews(MOCK_PERFORMANCE_REVIEWS_DATA));
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => storage.getLeaveRequests(MOCK_LEAVE_REQUESTS_DATA));
    const [timeRecords, setTimeRecords] = useState<TimeRecord[]>(() => storage.getTimeRecords(MOCK_TIME_RECORDS_DATA));
    const [schedules, setSchedules] = useState<EmployeeSchedule[]>(() => storage.getSchedules(MOCK_SCHEDULES_DATA));
    const [activeModule, setActiveModule] = useState<string>('dashboard');
    const [activeSubModule, setActiveSubModule] = useState<string | null>(null);
    const [viewingEmployeeId, setViewingEmployeeId] = useState<number | null>(null);

    // Auth
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<Employee | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);

    useEffect(() => {
        const session = storage.getSession();
        if (session) {
            login(session.userId);
        }
    }, []);

    useEffect(() => { storage.setEmployees(employees); }, [employees]);
    useEffect(() => { storage.setJobPostings(jobPostings); }, [jobPostings]);
    useEffect(() => { storage.setOnboardingPlans(onboardingPlans); }, [onboardingPlans]);
    useEffect(() => { storage.setPerformanceReviews(performanceReviews); }, [performanceReviews]);
    useEffect(() => { storage.setLeaveRequests(leaveRequests); }, [leaveRequests]);
    useEffect(() => { storage.setTimeRecords(timeRecords); }, [timeRecords]);
    useEffect(() => { storage.setSchedules(schedules); }, [schedules]);

    // Actions
    const addEmployee = (employee: Employee) => {
        setEmployees(prev => [...prev, { ...employee, id: Date.now() }]);
    };

    const updateEmployee = (updatedEmployee: Employee) => {
        setEmployees(prev => prev.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
    };
    
    const addLeaveRequest = (request: Omit<LeaveRequest, 'id'>) => {
        const newRequest: LeaveRequest = { ...request, id: Date.now() };
        setLeaveRequests(prev => [newRequest, ...prev]);
    };

    const updateLeaveRequestStatus = (id: number, status: LeaveRequest['status']) => {
        setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    };
    
    const clearSubModule = () => setActiveSubModule(null);

    // Auth Actions
    const login = (employeeId: number) => {
        const user = employees.find(e => e.id === employeeId);
        if (user) {
            setCurrentUser(user);
            // Admin is a user with no supervisor
            const role = user.supervisorId === null ? 'Admin' : 'Employee';
            setUserRole(role);
            setIsAuthenticated(true);
            storage.saveSession({ userId: user.id });
        }
    };

    const logout = () => {
        setCurrentUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
        storage.clearSession();
        setActiveModule('dashboard');
    };

    const value: AppContextType = {
        employees,
        jobPostings,
        onboardingPlans,
        performanceReviews,
        leaveRequests,
        timeRecords,
        schedules,
        activeModule,
        setActiveModule,
        addEmployee,
        updateEmployee,
        addLeaveRequest,
        updateLeaveRequestStatus,
        activeSubModule,
        setActiveSubModule,
        clearSubModule,
        isAuthenticated,
        currentUser,
        userRole,
        login,
        logout,
        viewingEmployeeId,
        setViewingEmployeeId,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};