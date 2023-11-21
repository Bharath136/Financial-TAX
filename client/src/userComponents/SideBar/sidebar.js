import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import './sidebar.css';
import {
    MdPayments,
    MdDarkMode,
    MdOutlineDarkMode,
    MdDashboardCustomize
} from 'react-icons/md';
import {
    BiSolidArrowToLeft,
    BiSolidArrowToRight,
} from 'react-icons/bi';
import { HiDocumentDuplicate } from 'react-icons/hi';
import { TbLogout2 } from 'react-icons/tb';
import {
    FaUser,
    FaFileAlt,
    FaCheck,
    FaCalculator,
    FaCog,
    FaCloudUploadAlt,
    FaComments
} from 'react-icons/fa';
import AuthContext from '../../AuthContext/AuthContext';

const menuItems = [
    { path: '/user-dashboard', label: 'Dashboard', icon: <MdDashboardCustomize size={25} /> },
    { path: '/tax-interview', label: 'Upload Document', icon: <FaCloudUploadAlt size={25} /> },
    { path: '/comment-to-document', label: 'Add Comment', icon: <FaComments size={25} /> },
    { path: '/my-summary', label: 'Summary', icon: <HiDocumentDuplicate size={25} /> },
    { path: '/make-payment', label: 'Payments', icon: <MdPayments size={25} /> },
    { path: '/my-tax-documents', label: 'Documents', icon: <FaFileAlt size={25} /> },
];

const staffMenuItems = [
    { path: '/staff-dashboard', label: 'Dashboard', icon: <MdDashboardCustomize size={25} /> },
    { path: '/assigned-clients', label: 'Clients', icon: <FaUser size={25} /> },
    { path: '/staff-tax-documents', label: 'Tax Document', icon: <FaFileAlt size={25} /> },
    { path: '/review', label: 'Summary', icon: <FaCheck size={25} /> },
    { path: '/calculator', label: 'Calculator', icon: <FaCalculator size={25} /> },
    { path: '/settings', label: 'Settings', icon: <FaCog size={25} /> },
];

const adminMenuItems = [
    { path: '/admin-dashboard', label: 'Dashboard', icon: <MdDashboardCustomize size={25} /> },
    { path: '/clients', label: 'Clients', icon: <FaUser size={25} /> },
    { path: '/staff-tax-documents', label: 'Tax Document', icon: <FaFileAlt size={25} /> },
    { path: '/review', label: 'Summary', icon: <FaCheck size={25} /> },
    { path: '/calculator', label: 'Calculator', icon: <FaCalculator size={25} /> },
    { path: '/settings', label: 'Settings', icon: <FaCog size={25} /> },
];

const Sidebar = () => {
    const [activeMenuItems, setActiveMenuItems] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('customerJwtToken');
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if(token){
            if (user.role === 'ADMIN') {
                setActiveMenuItems(adminMenuItems);
            } else if (user.role === 'STAFF') {
                setActiveMenuItems(staffMenuItems);
            } else {
                setActiveMenuItems(menuItems);
            }
        }
    }, []);

    const navigate = useNavigate();

    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname);
    const [currentUser, setCurrentUser] = useState('');
    const [isDarkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            setCurrentUser(user.first_name);
        }
        setActiveItem(location.pathname);
    }, [location.pathname]);

    const onChangeMode = () => {
        setDarkMode(!isDarkMode);
    };

    return (
        <AuthContext.Consumer>
            {(value) => {
                const { changeRole, hideSidebar, changeSidebar } = value;

                const onLogout = () => {
                    changeRole();
                    navigate('/login');
                };

                const toggleSidebar = () => {
                    changeSidebar();
                };

                return (
                    <div className={`sidebar ${hideSidebar ? 'hide-icons' : ''} border d-flex flex-column justify-content-between`}>
                        <div>
                            <div className={`header-container d-flex align-items-center ${hideSidebar ? 'justify-content-center' : 'justify-content-between'} mt-3`}>
                                <div className={`logo-text ${!hideSidebar && 'p-3'}`}>
                                    {!hideSidebar && <p className='m-0 p-0 text-dark' style={{ fontSize: '24px' }}>{currentUser}</p>}
                                </div>
                                {!hideSidebar ? (
                                    <button className='btn' title='Close' onClick={toggleSidebar}>
                                        <BiSolidArrowToLeft size={25} />
                                    </button>
                                ) : (
                                    <button className='btn' title='Close' onClick={toggleSidebar}>
                                        <BiSolidArrowToRight size={25} />
                                    </button>
                                )}
                            </div>
                            <ul className="sidebar-menu mt-4 p-2">
                                {activeMenuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            title={item.label}
                                            to={item.path}
                                            className={`sidebar-link ${activeItem === item.path ? 'active' : ''}`}
                                        >
                                            <div className='d-flex' style={{ gap: '15px' }}>
                                                {hideSidebar ? <span>{item.icon}</span> : <><span>{item.icon} </span><span>{item.label}</span></>}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='p-2' style={{ borderTop: '1px solid var(--border)' }}>
                            <button className='btn d-flex align-items-center w-100' style={{ padding: hideSidebar && '14px ' }} onClick={onLogout} title='Logout'>
                                <TbLogout2 className="text-dark" size={25} /> <Link to='/login' className="logout-link" style={{ display: hideSidebar && 'none' }}>
                                    Logout
                                </Link>
                            </button>
                            <button className='btn d-flex align-items-center w-100' style={{ padding: hideSidebar && '14px ' }} onClick={onChangeMode} title={`${isDarkMode ? 'Light Mode' : 'Dark Mode'}`}>
                                {isDarkMode ? (
                                    <MdOutlineDarkMode className="text-dark" size={25} />
                                ) : (
                                    <MdDarkMode className="text-dark" size={25} />
                                )}{' '}
                                <Link className="logout-link" style={{ display: hideSidebar && 'none' }}>
                                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                </Link>
                            </button>
                        </div>
                    </div>
                );
            }}
        </AuthContext.Consumer>
    );
};

export default Sidebar;
