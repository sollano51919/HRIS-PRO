import { Employee } from "../types";

const EMPLOYEES_KEY = 'hr_core_employees';
const JOB_POSTINGS_KEY = 'hr_core_job_postings';
const ONBOARDING_PLANS_KEY = 'hr_core_onboarding_plans';
const PERFORMANCE_REVIEWS_KEY = 'hr_core_performance_reviews';
const LEAVE_REQUESTS_KEY = 'hr_core_leave_requests';
const TIME_RECORDS_KEY = 'hr_core_time_records';
const SCHEDULES_KEY = 'hr_core_schedules';
const SESSION_KEY = 'hr_core_session';


const storageService = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key “${key}”:`, error);
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  },
  remove: (key: string): void => {
    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing localStorage key “${key}”:`, error);
    }
  }
};

export const getEmployees = (defaultValue: any[]) => storageService.get(EMPLOYEES_KEY, defaultValue);
export const setEmployees = (value: any[]) => storageService.set(EMPLOYEES_KEY, value);

export const getJobPostings = (defaultValue: any[]) => storageService.get(JOB_POSTINGS_KEY, defaultValue);
export const setJobPostings = (value: any[]) => storageService.set(JOB_POSTINGS_KEY, value);

export const getOnboardingPlans = (defaultValue: any[]) => storageService.get(ONBOARDING_PLANS_KEY, defaultValue);
export const setOnboardingPlans = (value: any[]) => storageService.set(ONBOARDING_PLANS_KEY, value);

export const getPerformanceReviews = (defaultValue: any[]) => storageService.get(PERFORMANCE_REVIEWS_KEY, defaultValue);
export const setPerformanceReviews = (value: any[]) => storageService.set(PERFORMANCE_REVIEWS_KEY, value);

export const getLeaveRequests = (defaultValue: any[]) => storageService.get(LEAVE_REQUESTS_KEY, defaultValue);
export const setLeaveRequests = (value: any[]) => storageService.set(LEAVE_REQUESTS_KEY, value);

export const getTimeRecords = (defaultValue: any[]) => storageService.get(TIME_RECORDS_KEY, defaultValue);
export const setTimeRecords = (value: any[]) => storageService.set(TIME_RECORDS_KEY, value);

export const getSchedules = (defaultValue: any[]) => storageService.get(SCHEDULES_KEY, defaultValue);
export const setSchedules = (value: any[]) => storageService.set(SCHEDULES_KEY, value);

export const saveSession = (session: { userId: number }) => storageService.set(SESSION_KEY, session);
export const getSession = (): { userId: number } | null => storageService.get(SESSION_KEY, null);
export const clearSession = () => storageService.remove(SESSION_KEY);
