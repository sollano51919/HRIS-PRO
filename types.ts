import { ReactNode } from 'react';

export interface Address {
  street: string;
  city: string;

  state: string;
  zip: string;
}

export interface EmploymentHistory {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
}

export interface Contract {
  type: 'Full-Time' | 'Part-Time' | 'Contract';
  startDate: string;
  endDate?: string;
}

export interface Performance {
  lastReview: string;
  achievements: string[];
  areasForImprovement: string[];
}

export interface LeaveCredits {
  vacation: number;
  sick: number;
  personal: number;
}

export type UserRole = 'Admin' | 'Employee';

export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  avatar: string;
  status: 'Active' | 'Inactive';
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  supervisorId: number | null;
  address: Address;
  employmentHistory: EmploymentHistory[];
  contracts: Contract[];
  performance: Performance;
  leaveCredits: LeaveCredits;
  password?: string;
  accessibleModules?: string[];
}

export interface JobPosting {
  id: number;
  title: string;
  department: string;
  status: 'Open' | 'Closed';
  candidates: number;
}

export interface OnboardingPlan {
    id: number;
    employeeName: string;
    role: string;
    startDate: string;
    manager: string;
    progress: number;
}

export interface OnboardingTask {
    task: string;
    completed: boolean;
}

export interface OnboardingWeek {
    week: number;
    title: string;
    tasks: OnboardingTask[];
}

export interface GeneratedOnboardingPlan {
    plan: OnboardingWeek[];
}

export interface PerformanceReview {
    id: number;
    employeeId: number;
    employeeName: string;
    date: string;
    status: 'Pending' | 'Completed';
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}

export interface LeaveRequest {
    id: number;
    employeeId: number;
    employeeName: string;
    type: 'Vacation' | 'Sick Leave' | 'Personal';
    startDate: string;
    endDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export interface TimeRecord {
    id: number;
    employeeId: number;
    employeeName: string;
    date: string;
    timeIn: string;
    timeOut: string;
    status: 'On Time' | 'Late' | 'Absent';
}

export interface EmployeeSchedule {
    id: number;
    employeeId: number;
    employeeName: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
}


export interface AppContextType {
    // State
    employees: Employee[];
    jobPostings: JobPosting[];
    onboardingPlans: OnboardingPlan[];
    performanceReviews: PerformanceReview[];
    leaveRequests: LeaveRequest[];
    timeRecords: TimeRecord[];
    schedules: EmployeeSchedule[];
    activeModule: string;
    activeSubModule: string | null;
    viewingEmployeeId: number | null;
    
    // Auth
    isAuthenticated: boolean;
    currentUser: Employee | null;
    userRole: UserRole | null;
    login: (employeeId: number) => void;
    logout: () => void;

    // Actions
    setActiveModule: (module: string) => void;
    addEmployee: (employee: Employee) => void;
    updateEmployee: (employee: Employee) => void;
    addLeaveRequest: (request: Omit<LeaveRequest, 'id'>) => void;
    updateLeaveRequestStatus: (id: number, status: LeaveRequest['status']) => void;
    setActiveSubModule: (subModule: string | null) => void;
    clearSubModule: () => void;
    setViewingEmployeeId: (id: number | null) => void;
}