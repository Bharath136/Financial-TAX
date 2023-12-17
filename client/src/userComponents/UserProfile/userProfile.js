import React, { useEffect, useState } from 'react';
import axios from 'axios';
import domain from '../../domain/domain';
import showAlert from '../../SweetAlert/sweetalert';
import './userProfile.css'; // Import your CSS file for styling
import { Td, th } from '../../staffComponents/AssignedClients/styledComponents';

const UserProfile = ({ isOpen, profileId, isEditable }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({});
    const [editedData, setEditedData] = useState({});

    const handleEditClick = () => {
        setIsEditing(!isEditing);
        setEditedData({ ...userData });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleGetUserProfile = async () => {
        const token = localStorage.getItem('customerJwtToken');

        try {
            const response = await axios.get(`${domain.domain}/user/${profileId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        handleGetUserProfile();
    }, []);

    const handleApplyClick = async () => {
        const token = localStorage.getItem('customerJwtToken');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        try {
            const newData = { ...editedData, updated_by: currentUser.first_name}
            const response = await axios.put(
                `${domain.domain}/user/${profileId}`,
                newData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setIsEditing(false);
                showAlert({
                    title: 'Profile Updated Successfully',
                    icon: 'success',
                    text: 'Your profile has been updated.',
                    confirmButtonText: 'OK',
                });
                localStorage.setItem('currentUser', JSON.stringify(response.data.user))
                isOpen();
            }
        } catch (error) {
            console.error('Error updating data:', error);
            showAlert({
                title: 'Update Failed',
                icon: 'error',
                text: 'Failed to update your profile.',
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <div className="user-profile-container p-4">
            <h1 className='mb-3'>Profile</h1>

            {/* User Profile Items */}
            <div className="user-profile-item">
                <th style={{width:'160px', textAlign:"start" }}><strong>First Name: </strong></th>
                {isEditing ? (
                    <input
                        className="input-field"
                        type="text"
                        name="first_name"
                        value={editedData.first_name}
                        onChange={handleInputChange}
                    />
                ) : (
                        <Td style={{width:'170px', textAlign:"start" }}>{userData.first_name}</Td>
                )}
            </div>

            <div className="user-profile-item">
                <th style={{ width: '160px', textAlign: "start" }}><strong>Last Name: </strong></th>
                {isEditing ? (
                    <input
                        className="input-field"
                        type="text"
                        name="last_name"
                        value={editedData.last_name}
                        onChange={handleInputChange}
                    />
                ) : (
                        <Td style={{width:'170px', textAlign:"start" }}>{userData.last_name}</Td>
                )}
            </div>

            <div className="user-profile-item">
                <th style={{ width: '160px', textAlign: "start" }}><strong>Email Address: </strong></th>
                {isEditing ? (
                    <input
                        className="input-field"
                        type="text"
                        name="email_address"
                        value={editedData.email_address}
                        onChange={handleInputChange}
                    />
                ) : (
                        <Td style={{width:'170px', textAlign:"start" }}>{userData.email_address}</Td>
                )}
            </div>

            <div className="user-profile-item">
                <th style={{ width: '160px', textAlign: "start" }}><strong>Contact Number: </strong></th>
                {isEditing ? (
                    <input
                        className="input-field"
                        type="text"
                        name="contact_number"
                        value={editedData.contact_number}
                        onChange={handleInputChange}
                    />
                ) : (
                        <Td style={{width:'170px', textAlign:"start" }}>{userData.contact_number}</Td>
                )}
            </div>

            {userData.secret_code && <div className="user-profile-item">
                <th style={{ width: '160px', textAlign: "start" }}><strong>Secret Code: </strong></th>
                {isEditing ? (
                    <input
                        className="input-field"
                        type="text"
                        name="secret_code"
                        value={editedData.secret_code}
                        onChange={handleInputChange}
                    />
                ) : (
                        <Td style={{width:'170px', textAlign:"start" }}>{userData.secret_code}</Td>
                )}
            </div>}

            {userData.current_step && !isEditing && (
                <div className="user-profile-item d-flex">
                    <th style={{ width: '160px', textAlign: "start" }}><strong>Current Step: </strong></th> <Td style={{width:'170px', textAlign:"start" }}>{userData.current_step}</Td>
                </div>
            )}

            {userData.staff_team && !isEditing && (
                <div className="user-profile-item d-flex">
                   <th style={{ width: '160px', textAlign: "start" }}> <strong>Staff Team: </strong></th> <Td style={{width:'170px', textAlign:"start" }}>{userData.staff_team}</Td>
                </div>
            )}

            {!isEditing && (
                <div className="user-profile-item d-flex">
                    <th style={{ width: '160px', textAlign: "start" }}><strong>Role: </strong></th> <Td style={{width:'170px', textAlign:"start" }}>{userData.role}</Td>
                </div>
            )}

            {!isEditing && (
                <div className="user-profile-item d-flex">
                    <th style={{ width: '160px', textAlign: "start" }}><strong>Status: </strong></th> <Td style={{width:'170px', textAlign:"start" }}>{userData.status}</Td>
                </div>
            )}

            {/* Action Buttons */}
            {isEditable && (
                <div className="user-profile-buttons d-flex align-items-center justify-content-between">
                    {isEditing ? (
                        <button className="apply-button" onClick={handleApplyClick}>
                            Apply
                        </button>
                    ) : (
                        <button className="edit-button" onClick={handleEditClick}>
                            Edit
                        </button>
                    )}
                    {!isEditing ? <button className="close-button" onClick={() => isOpen()}>
                        Close
                    </button> : <button className="close-button" onClick={() => handleEditClick()}>
                        Cancel
                    </button>}
                </div>
            )}
        </div>
    );
};

export default UserProfile;
