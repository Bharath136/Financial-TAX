import React, { useEffect, useState } from 'react';
import axios from 'axios';
import domain from '../../domain/domain';
import showAlert from '../../SweetAlert/sweetalert';
import './userProfile.css'; 
import ClientTaxDocuments from '../../AdminComponents/ClientTaxDocuments/clientTaxDocuments';
import ResponseDisplay from '../Response/rensponse';
import { H1 } from '../../AdminComponents/ClientTaxDocuments/styledComponents';
import { IoMdClose } from "react-icons/io";
import { MdOutlineClose, MdOutlineEdit } from 'react-icons/md';
import { getToken, getUserData } from '../../StorageMechanism/storageMechanism';

const UserProfile = ({ isOpen, profileId, isEditable, isCustomer }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({});
    const [editedData, setEditedData] = useState({});
    const [responseData, setCustomerResponse] = useState([]);
    const currentUser = getUserData();
    const token = getToken();

    const handleEditClick = () => {
        setIsEditing(!isEditing);
        setEditedData({ ...userData });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({ ...prevData, [name]: value }));
    };

    const getCustomerResponse = async () => {
        try{
            const response = await axios.get(`${domain.domain}/user/customer-response/${profileId}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            setCustomerResponse(response.data)
        }catch(error){
            console.log(error)
        }
    }

    const handleGetUserProfile = async () => {

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
        getCustomerResponse()
    }, []);

    const handleApplyClick = async () => {
        try {
            const newData = { ...editedData, updated_by: currentUser.first_name };
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
                const user = JSON.stringify(response.data.user)
                localStorage.setItem('currentUser', user.user_id === currentUser.user_id ? user : currentUser);
                setUserData()
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
        <div className='main-container'>
        <div className='d-flex align-items-center justify-content-end'>
                <button className="btn" style={{position:'fixed', marginTop:'20px'}} onClick={() => isOpen()}>
                    <IoMdClose size={25} />
                </button>
        </div>
            <div className="user-profile-container p-3">
                <H1 className='mb-3'>Profile</H1>

                {/* User Profile Items */}
                <div className="user-profile-item">
                    <strong style={{ width: '200px', textAlign: "start" }}>First Name: </strong>
                    {isEditing ? (
                        <input
                            className="input-field"
                            type="text"
                            name="first_name"
                            value={editedData.first_name}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <label style={{ width: '200px', textAlign: "start" }}>{userData.first_name}</label>
                    )}
                </div>

                <div className="user-profile-item">
                    <strong style={{ width: '200px', textAlign: "start" }}>Last Name: </strong>
                    {isEditing ? (
                        <input
                            className="input-field"
                            type="text"
                            name="last_name"
                            value={editedData.last_name}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <label style={{ width: '200px', textAlign: "start" }}>{userData.last_name}</label>
                    )}
                </div>

                <div className="user-profile-item">
                    <strong style={{ width: '200px', textAlign: "start" }}>Email Address: </strong>
                    {isEditing ? (
                        <input
                            className="input-field"
                            type="text"
                            name="email_address"
                            value={editedData.email_address}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <label style={{ width: '200px', textAlign: "start" }}>{userData.email_address}</label>
                    )}
                </div>

                <div className="user-profile-item">
                    <strong style={{ width: '200px', textAlign: "start" }}>Contact Number: </strong>
                    {isEditing ? (
                        <input
                            className="input-field"
                            type="text"
                            name="contact_number"
                            value={editedData.contact_number}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <label style={{ width: '200px', textAlign: "start" }}>{userData.contact_number}</label>
                    )}
                </div>

                {(userData.secret_code !== 'null' && userData.role !== 'CUSTOMER')  && (
                    <div className="user-profile-item">
                        <strong style={{ width: '200px', textAlign: "start" }}>Secret Code: </strong>
                        {isEditing ? (
                            <input
                                className="input-field"
                                type="text"
                                name="secret_code"
                                value={editedData.secret_code}
                                onChange={handleInputChange}
                            />
                        ) : (
                                userData.role !== 'CUSTOMER' && <label style={{ width: '200px', textAlign: "start" }}>{userData.secret_code}</label>
                        )}
                    </div>
                )}

                {!isCustomer && userData.current_step && !isEditing && (
                    <div className="user-profile-item d-flex">
                        <strong >Current Step : </strong>
                        <label > {userData.current_step}</label>
                    </div>
                )}

                {!isCustomer && userData.staff_team && !isEditing && (
                    <div className="user-profile-item d-flex">
                        <strong>Staff Team : </strong>
                        <label> {userData.staff_team}</label>
                    </div>
                )}

                {!isCustomer && !isEditing && (
                    <div className="user-profile-item d-flex">
                        <strong>Role : </strong>
                        <label> {userData.role}</label>
                    </div>
                )}

                {!isEditing && (
                    <div className="user-profile-item d-flex">
                        <strong>Status : </strong>
                        <label> {userData.status}</label>
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
                                    <MdOutlineEdit size={20} /> Edit 
                            </button>
                        )}
                        {!isEditing ? (
                            <button className="close-button" onClick={() => isOpen()}>
                                <MdOutlineClose size={20} /> Close 
                            </button>
                        ) : (
                            <button className="close-button" onClick={() => handleEditClick()}>
                                Cancel
                            </button>
                        )}
                    </div>
                )}
            </div>
            {responseData.length > 0 && currentUser.role !== 'CUSTOMER' && 
                            <ul className='p-0 m-0 w-100 p-3' style={{listStyleType:'none', backgroundColor:`var(--main-background)`}}>
                                <H1>Customer Response</H1>
                                {responseData.map((response) => (
                                    <ResponseDisplay response={response.response} staffId={response.staff_id} key={response.user_id} />
                                ))}
                            </ul>
            }
            {userData && currentUser.role !== 'CUSTOMER' && profileId !== currentUser.user_id && <ClientTaxDocuments clientId={profileId} />}
        </div>
    );
};

export default UserProfile;
