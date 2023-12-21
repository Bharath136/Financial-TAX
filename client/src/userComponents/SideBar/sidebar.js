import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import domain from '../../domain/domain';

import './sidebar.css';
import {
    MdPayments,
    // MdDarkMode,
    // MdOutlineDarkMode,
    MdDashboardCustomize
} from 'react-icons/md';
import { RiContactsFill } from "react-icons/ri";
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
    FaComments,
    FaFileUpload
} from 'react-icons/fa';
import AuthContext from '../../AuthContext/AuthContext';
import { IoPersonAddSharp } from "react-icons/io5";
import EditModal from '../../SweetPopup/sweetPopup';
import axios from 'axios';

const menuItems = [
    { path: '/user/dashboard', label: 'Home', icon: <MdDashboardCustomize size={25} /> },
    { path: '/user/tax-interview', label: 'Tax Interview', icon: <FaUser size={25} /> },
    { path: '/user/upload-document', label: 'Upload Document', icon: <FaFileUpload size={25} /> },
    { path: '/user/comment-to-document', label: 'Add Comment', icon: <FaComments size={25} /> },
    { path: '/user/tax-return-review', label: 'Taxreturn Review', icon: <HiDocumentDuplicate size={25} /> },
    { path: '/user/make-payment', label: 'Payments', icon: <MdPayments size={25} /> },
    // { path: '/my-tax-documents', label: 'Documents', icon: <FaFileAlt size={25} /> },
];

const staffMenuItems = [
    { path: '/staff/dashboard', label: 'Dashboard', icon: <MdDashboardCustomize size={25} /> },
    { path: '/staff/assigned-clients', label: 'Clients', icon: <FaUser size={25} /> },
    { path: '/staff/tax-documents', label: 'Tax Document', icon: <FaFileAlt size={25} /> },
    { path: '/staff/customer-tax-return', label: 'Tax Return', icon: <FaCheck size={25} /> }
];

const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <MdDashboardCustomize size={25} /> },
    { path: '/admin/clients', label: 'Clients', icon: <FaUser size={25} /> },
    { path: '/admin/staff', label: 'Staff', icon: <FaUser size={25} /> },
    { path: '/admin/client-tax-documents', label: 'Tax Document', icon: <FaFileAlt size={25} /> },
    { path: '/admin/add-staff', label: 'Add Staff', icon: <IoPersonAddSharp size={25} /> },
    { path: '/admin/user-contact/info', label: 'Contacts', icon: <RiContactsFill  size={25}/>}
];

const Sidebar = () => {
    const [activeMenuItems, setActiveMenuItems] = useState([]);
    const user = JSON.parse(localStorage.getItem('currentUser'));


    const navigate = useNavigate();

    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname);
    const [currentUser, setCurrentUser] = useState('');
    const [profileId, setProfileId] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // const [isDarkMode, setDarkMode] = useState(false);

    useEffect(() => {
        
        
        if (user) {
            setCurrentUser(user.first_name);
        }
        setActiveItem(location.pathname);

        const getMyStaff = async () => {
            try{
                const response = await axios.get(`${domain.domain}/user/my-staff/details/${user.user_id}`)
                setProfileId(response.data[0].user_id)
            }catch(error){
                console.log(error)
            }
        }

        getMyStaff()
        const token = localStorage.getItem('customerJwtToken');
        if (token) {
           if(user){
               if (user.role === 'ADMIN') {
                   setActiveMenuItems(adminMenuItems);
               } else if (user.role === 'STAFF') {
                   setActiveMenuItems(staffMenuItems);
               } else {
                   setActiveMenuItems(menuItems);
               }
           }
        }
    }, [location.pathname]);

    // const onChangeMode = () => {
    //     setDarkMode(!isDarkMode);
    // };

    const handleEditClick = () => {
        setIsEditModalOpen(!isEditModalOpen);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    return (
        <AuthContext.Consumer>
            {(value) => {
                const { changeRole, hideSidebar, changeSidebar } = value;

                const onLogout = () => {
                    changeRole();
                    navigate('/accounts/login');
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
                                                {hideSidebar ? <span>{item.icon}</span> : <><span>{item.icon} </span><span style={{fontSize:'17px'}}>{item.label}</span></>}
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
                            {user && user.role === 'CUSTOMER' && profileId &&
                                <button className='btn d-flex align-items-center w-100' style={{ padding: hideSidebar && '14px ' }} onClick={handleEditClick} title='Profile'>
                                    <FaUser className="text-dark" size={25} /> <Link className="logout-link" style={{ display: hideSidebar && 'none' }}>
                                        My Staff
                                    </Link>
                                </button>
                            }
                            {/* <button className='btn d-flex align-items-center w-100' style={{ padding: hideSidebar && '14px ' }} onClick={onChangeMode} title={`${isDarkMode ? 'Light Mode' : 'Dark Mode'}`}>
                                {isDarkMode ? (
                                    <MdOutlineDarkMode className="text-dark" size={25} />
                                ) : (
                                    <MdDarkMode className="text-dark" size={25} />
                                )}{' '}
                                <Link className="logout-link" style={{ display: hideSidebar && 'none' }}>
                                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                </Link>
                            </button> */}

                            <EditModal
                                isOpen={isEditModalOpen}
                                profileId={profileId}
                                onRequestClose={handleEditModalClose}
                                handleOpenClick={handleEditClick}
                                isEditable={false}
                            />
                        </div>
                    </div>
                );
            }}
        </AuthContext.Consumer>
    );
};

export default Sidebar;
