import React from 'react';
import { useAppContext } from '../context/AppContext';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const { activeModule, setActiveModule, setActiveSubModule, userRole, currentUser, setViewingEmployeeId } = useAppContext();

    const handleNav = (module: any, subModule: string | null = null) => {
        if (module === 'profile' && currentUser) {
            setViewingEmployeeId(currentUser.id);
        }
        setActiveModule(module);
        if (subModule) {
            setActiveSubModule(subModule);
        }
        if (window.innerWidth < 1024) { // Close sidebar on nav in mobile
            setIsOpen(false);
        }
    }

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon />, roles: ['Admin', 'Employee'] },
        { id: 'profile', label: 'Profile', icon: <UserCircleIcon />, roles: ['Admin', 'Employee'] },
        { id: 'employees', label: 'Employees', icon: <UsersIcon />, roles: ['Admin'] },
        { id: 'recruitment', label: 'Recruitment', icon: <BriefcaseIcon />, roles: ['Admin'], subItems: [
            {id: 'postings', label: 'Job Postings'},
            {id: 'onboarding', label: 'Onboarding Plans'},
        ]},
        { id: 'performance', label: 'Performance', icon: <TrendingUpIcon />, roles: ['Admin'] },
        { id: 'attendance', label: 'Attendance', icon: <CalendarIcon />, roles: ['Admin', 'Employee'] },
        { id: 'reporting', label: 'Reporting', icon: <ChartBarIcon />, roles: ['Admin'] },
        { id: 'assistant', label: 'AI Assistant', icon: <SparklesIcon />, roles: ['Admin', 'Employee'] },
    ];

    const accessibleNavItems = navItems.filter(item => {
        if (!userRole || !currentUser) return false;
        if (!item.roles.includes(userRole)) return false;

        if (userRole === 'Employee') {
            // Employee access is controlled by the list on their profile
            return currentUser.accessibleModules?.includes(item.id);
        }
        
        // Admin has access to all items designated for the 'Admin' role
        return true;
    });


    return (
        <>
            <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
            <div className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 w-64 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:w-64 flex-shrink-0`}>
                <div className="flex items-center justify-between p-4 h-16 border-b dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">HR Core</h1>
                     <button onClick={() => setIsOpen(false)} className="lg:hidden">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <nav className="p-4 space-y-2">
                    {accessibleNavItems.map(item => (
                        <div key={item.id}>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); handleNav(item.id); }}
                                className={`flex items-center p-2 rounded-md transition-colors ${activeModule === item.id ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                <span>{item.label}</span>
                            </a>
                            {item.subItems && activeModule === item.id && (
                                <div className="pl-8 mt-1 space-y-1">
                                    {item.subItems.map(sub => (
                                         <a
                                            key={sub.id}
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); handleNav(item.id, sub.id); }}
                                            className="block p-1 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {sub.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </>
    );
};

// Icons
const HomeIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const UserCircleIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UsersIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const BriefcaseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const TrendingUpIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const CalendarIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ChartBarIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const SparklesIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4m-2 2l1.5-1.5M12 3v4m-2 2h4m-2 2l1.5 1.5M19 3v4m-2 2h4m-2 2l1.5-1.5M5 17v4m-2-2h4m-2 2l1.5-1.5M12 17v4m-2 2h4m-2 2l1.5 1.5M19 17v4m-2-2h4m-2 2l1.5-1.5" /></svg>;

export default Sidebar;