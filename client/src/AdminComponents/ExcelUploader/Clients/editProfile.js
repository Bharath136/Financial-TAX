import React, { useEffect, useState } from 'react';
import axios from 'axios';
import domain from '../../../domain/domain';
import showAlert from '../../../SweetAlert/sweetalert';
import '../../../userComponents/UserProfile/userProfile.css'
import { H1 } from '../../../AdminComponents/ClientTaxDocuments/styledComponents';
import { IoMdClose } from "react-icons/io";
import { MdOutlineClose, MdOutlineEdit } from 'react-icons/md';
import renderLoader from '../../../SweetLoading/ButtonLoader';

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

let password = ''
const EditProfile = ({ isOpen, profileId, isEditable }) => {

    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [apiStatusOTP, setApiStatusOTP] = useState(apiStatusConstants.initial)
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [timer, setTimer] = useState(); 

    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({});
    const [editedData, setEditedData] = useState({});
    const token = localStorage.getItem('customerJwtToken');

    const handleEditClick = () => {
        setIsEditing(!isEditing);
        setEditedData({ ...userData });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({ ...prevData, [name]: value }));
    };

    function generateRandomPassword(length) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
        let password = "";

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
        }
        return password;
    }


    const handleGetUserProfile = async () => {

        try {
            const response = await axios.get(`${domain.domain}/dummy-users/${profileId}`, {
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
        let interval;
        handleGetUserProfile();

        if (otpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        return () => clearInterval(interval); 
        
    }, [timer, otpSent]);


    const randomColors = [
        '#42A5F5',
        '#FF7043',
        '#4CAF50',
        '#9C27B0',
        '#EF5350',
        '#00E676',
        '#FFC107',
        '#03A9F4',
        '#FF5722'
    ];

    function getRandomColor() {
        return randomColors[Math.floor(Math.random() * randomColors.length)];
    }

    const validateFields = () => {
        const requiredFields = ['first_name', 'last_name', 'contact_number', 'email_address'];

        for (const field of requiredFields) {
            if (!editedData[field] || editedData[field].trim() === '') {
                setErrorMsg("All fields must be filled");
                return false;
            }
        }

        return true;
    };


    const handleGetOtp = async () => {
        password = generateRandomPassword(8)

        try {
            setApiStatusOTP(apiStatusConstants.inProgress);
            if (editedData.email_address === undefined || '') {
                setErrorMsg("Email is required to get OTP.")
            }

            const response = await axios.post(`${domain.domain}/email/send-otp`, {
                email_address: editedData.email_address,
                name: editedData.first_name
            });

            if (response) {
                setTimer(120);
                setOtpSent(true);
                showAlert({
                    title: 'OTP Sent!',
                    text: 'OTP has been sent to your email address.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setApiStatusOTP(apiStatusConstants.success);
            } else {
                showAlert({
                    title: 'Error',
                    text: 'Failed to send OTP. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
                setApiStatusOTP(apiStatusConstants.success);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            setApiStatusOTP(apiStatusConstants.success);
        }
    };

    const handleSubmit = async () => {
        try {
            setApiStatus(apiStatusConstants.inProgress);

            const data = { ...editedData, password}

            const res = await axios.post(`${domain.domain}/user/register`, data);

            if (res.status === 201) {
                showAlert({
                    title: 'Email Verified, Registration Successful!',
                    text: "Welcome to our financial tax app. Let's log in and explore!",
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setApiStatus(apiStatusConstants.success);
                localStorage.setItem('profileBg', getRandomColor());
                isOpen()
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.error('Server error:', error.response);
                setErrorMsg(error.response.data.error || 'Registration failed. Please try again.');
            } else {
                console.error('Error registering user:', error);
                setErrorMsg('Registration failed. Please try again.');
            }

            setApiStatus(apiStatusConstants.failure);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setApiStatus(apiStatusConstants.inProgress);
            if (!validateFields()) {
                setApiStatus(apiStatusConstants.success);
                return;
            } else {
                setErrorMsg('')
            }

            const response = await axios.post(`${domain.domain}/email/verify-otp`, {
                email_address: editedData.email_address,
                otp,
            });

            if (response) {

                setApiStatus(apiStatusConstants.success);
                handleSubmit()


            } else {
                showAlert({
                    title: 'Error',
                    text: 'Invalid OTP. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
                setApiStatus(apiStatusConstants.success);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);

            if (error.response && error.response.status === 401) {
                // Handle 400 Bad Request error
                const errorMessage = error.response.data.error || 'Invalid OTP. Please try again.';
                setErrorMsg(errorMessage);
                setApiStatus(apiStatusConstants.failure);
            } else {
                // Handle other errors
                const errorMessage = 'Error verifying OTP. Please try again.';
                setErrorMsg(errorMessage);
                setApiStatus(apiStatusConstants.failure);
            }
        }
    };

    const renderOtpSection = () => (
        <div className="otp-section">
            <label htmlFor="otp" className="form-label text-dark m-0">
                Enter OTP sent to your email:
            </label>
            <div className='d-flex' style={{ border: '1px solid grey', borderRadius: '4px', }}>
                <input
                    type="text"
                    className="w-100"
                    style={{ padding: '14px', backgroundColor: 'transparent', border: 'none', borderRadius: '4px', outline: 'none' }}
                    id="otp"
                    placeholder="Enter OTP"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button
                    disabled={timer > 0}
                    style={{
                        outline: 'none',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        backgroundColor: `var(--accent-background)`,
                        cursor: timer > 0 ? 'not-allowed' : 'pointer',
                        color: '#fff',
                        width: "100px"
                    }}
                    type="button"
                    onClick={handleGetOtp}
                >
                    {apiStatusOTP === apiStatusConstants.inProgress ? renderLoader() : <span>Resend</span>}
                </button>
            </div>
            <div className="timer mt-2">
                {timer > 0 && <span>Your OTP expires in {timer} seconds</span>}
                {timer === 0 && <span className='text-danger'>OTP expired. Please request a new one.</span>}
            </div>
            {errorMsg && <span className='text-danger'>{errorMsg}</span>}
            <button type="button" onClick={handleVerifyOtp} className="register-button w-100 mt-2">
                {apiStatus === apiStatusConstants.inProgress ? renderLoader() : <span>Verify</span>}
            </button>
        </div>
    );

    return (
        <div className='main-container'>
            <div className='d-flex align-items-center justify-content-end'>
                <button className="btn" style={{ position: 'fixed', marginTop: '20px' }} onClick={() => isOpen()}>
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


                {!isEditing && (
                    <div className="user-profile-item d-flex">
                          <strong style={{ width: '200px', textAlign: "start" }}>Alter Number: </strong>
                        <label> {userData.alt_contact_number}</label>
                    </div>
                )}




                {/* Action Buttons */}
                {isEditable && (
                    <div className="user-profile-buttons d-flex align-items-center justify-content-between">
                        {isEditing ? (
                            <button className="apply-button" onClick={handleVerifyOtp}>
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
                {otpSent ? renderOtpSection() : null}
                {!otpSent && errorMsg && <span className='text-danger'>{errorMsg}</span>}
                {!otpSent && <button type="button" onClick={handleGetOtp} className="register-button w-100 mt-2">
                    {apiStatusOTP === apiStatusConstants.inProgress ? renderLoader() : <span>Get OTP</span>}
                </button>}
            </div>
        </div>
    );
};

export default EditProfile;
