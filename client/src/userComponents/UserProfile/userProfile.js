import React, { useEffect, useState } from 'react';
import axios from 'axios';
import domain from '../../domain/domain';
import showAlert from '../../SweetAlert/sweetalert';
import './userProfile.css'; // Import your CSS file for styling

const UserProfile = ({ isOpen, profileId, isEditable }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({});
    const [editedData, setEditedData] = useState({});

    const handleEditClick = () => {
        setIsEditing(true);
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
                <strong>First Name: </strong>
                {isEditing ? (
                    <input
                        className="input-field"
                        type="text"
                        name="first_name"
                        value={editedData.first_name}
                        onChange={handleInputChange}
                    />
                ) : (
                    userData.first_name
                )}
            </div>

            <div className="user-profile-item">
                <strong>Last Name: </strong>
                {isEditing ? (
                    <input
                        className="input-field"
                        type="text"
                        name="last_name"
                        value={editedData.last_name}
                        onChange={handleInputChange}
                    />
                ) : (
                    userData.last_name
                )}
            </div>

            <div className="user-profile-item">
                <strong>Email Address: </strong>
                {isEditing ? (
                    <input
                        className="input-field"
                        type="text"
                        name="email_address"
                        value={editedData.email_address}
                        onChange={handleInputChange}
                    />
                ) : (
                    userData.email_address
                )}
            </div>

            <div className="user-profile-item">
                <strong>Contact Number: </strong>
                {isEditing ? (
                    <input
                        className="input-field"
                        type="text"
                        name="contact_number"
                        value={editedData.contact_number}
                        onChange={handleInputChange}
                    />
                ) : (
                    userData.contact_number
                )}
            </div>

            {!isEditing && (
                <div className="user-profile-item">
                    <strong>Role: </strong> {userData.role}
                </div>
            )}

            {!isEditing && (
                <div className="user-profile-item">
                    <strong>Status: </strong> {userData.status}
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
                    <button className="close-button" onClick={() => isOpen()}>
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
