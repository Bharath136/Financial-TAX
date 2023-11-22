import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './staff.css';
import domain from '../../domain/domain';
import Sidebar from '../../userComponents/SideBar/sidebar';
import EditModal from '../../SweetPopup/sweetPopup';

const Staff = () => {
    const [staffList, setStaff] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileId, setProfileId] = useState(19);
    const token = localStorage.getItem('customerJwtToken');

    const fetchStaff = async () => {
        try {
            const response = await axios.get(`${domain.domain}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;
            const filteredData = data.filter((user) => {
                return user.role === 'STAFF';
            });
            setStaff(filteredData);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleEditClick = () => {
        setIsEditModalOpen(!isEditModalOpen);
        fetchStaff();
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    const onDeleteStaff = async (id) => {
        try {
            await axios.delete(`${domain.domain}/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchStaff();
        } catch (error) {
            console.error('Error Deleting staff:', error);
        }
    };

    const actionOptions = [
        { value: 'edit', label: 'Edit / View' },
        { value: 'hold', label: 'Hold' },
        { value: 'delete', label: 'Delete' },
    ];

    const handleActionChange = (selectedOption) => {
        setSelectedAction(selectedOption);
    };

    const handleExecuteAction = (staffId) => {
        if (selectedAction) {
            switch (selectedAction.value) {
                case 'edit':
                    handleEditClick();
                    setProfileId(staffId);
                    break;
                case 'hold':
                    // Implement hold action
                    break;
                case 'delete':
                    onDeleteStaff(staffId);
                    setProfileId(staffId);
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="staff-list-container">
                <h4>Staff</h4>
                <div className="table-container shadow mt-4">
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((staff) => (
                                <tr key={staff.user_id} className="staff-row">
                                    <td>{staff.user_id}</td>
                                    <td>{staff.first_name}</td>
                                    <td>{staff.email_address}</td>
                                    <td>{staff.contact_number}</td>
                                    <td className='d-flex'>
                                        <Select className='select'
                                            options={actionOptions}
                                            onChange={handleActionChange}
                                            placeholder="Select Action"
                                        />
                                        <button
                                            className="execute-action-button profile-button"
                                            onClick={() => handleExecuteAction(staff.user_id)}
                                        >
                                            Execute
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <EditModal
                isOpen={isEditModalOpen}
                profileId={profileId}
                onRequestClose={handleEditModalClose}
                handleOpenClick={handleEditClick}
                isEditable={true}
            />
        </div>
    );
};

export default Staff;
