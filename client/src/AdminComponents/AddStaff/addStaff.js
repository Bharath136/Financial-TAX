import React, { useEffect, useState } from 'react';
import domain from '../../domain/domain';
import axios from 'axios';
import showAlert from '../../SweetAlert/sweetalert';
import { AddStaffButton, AddStaffCard, AddStaffContainer, FormLabel, MarginBottom2 } from './styledComponents.js';
import { useNavigate } from 'react-router-dom';
import { H1 } from '../Staff/styledComponents.js';
import { getToken, getUserData } from '../../StorageMechanism/storageMechanism.js';
import renderLoader from '../../SweetLoading/ButtonLoader'
import { setProfileBg } from '../../StorageMechanism/storageMechanism';

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

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const AddStaff = () => {


    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [apiStatusOTP, setApiStatusOTP] = useState(apiStatusConstants.initial)
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const initialFormFields = [
        { label: 'First Name', name: 'first_name', type: 'text', placeholder: 'First Name' },
        { label: 'Last Name', name: 'last_name', type: 'text', placeholder: 'Last Name' },
        { label: 'Email', name: 'email_address', type: 'email', placeholder: 'Email' },
        { label: 'Phone', name: 'contact_number', type: 'umber', placeholder: 'Mobile Number' },
        { label: 'Password', name: 'password', type: 'text', placeholder: 'Password' },
        { label: 'Secret Code', name: 'secret_code', type: 'text', placeholder: 'Secret Code' },
    ];

    const [formData, setFormData] = useState({});
    const currentUser = getUserData();
    const token = getToken();
    const [timer, setTimer] = useState(); 

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'STAFF') {
                navigate('/staff/dashboard')
            } else if (currentUser.role === 'CUSTOMER') {
                navigate('/user/dashboard')
            }
        }
        let interval;

        if (otpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [navigate, otpSent, timer])

    function getRandomColor() {
        return randomColors[Math.floor(Math.random() * randomColors.length)];
    }

    const validateFields = () => {
        const requiredFields = ['first_name', 'last_name', 'contact_number', 'password', 'email_address'];

        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                setErrorMsg("All fields must be filled");
                return false;
            }
        }
        return true;
    };

    const handleGetOtp = async () => {
        if (!validateFields()) {
            setErrorMsg("All fields must be filled.")
            return;
        } else {
            setErrorMsg('')
        }
        try {
            setApiStatusOTP(apiStatusConstants.inProgress);
            if (formData.email_address === undefined || '') {
                setErrorMsg("Email is required to get OTP.")
            }

            const response = await axios.post(`${domain.domain}/email/send-otp`, {
                email_address: formData.email_address,
                name: formData.first_name
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
            setErrorMsg(error);
            setApiStatusOTP(apiStatusConstants.failure);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            if (!validateFields()) {
                return;
            } else {
                setErrorMsg('')
            }

            if (otp.trim() === '') {
                setErrorMsg("OTP is required")
                return;
            } else {
                setErrorMsg('')
                setApiStatus(apiStatusConstants.inProgress);
                const response = await axios.post(`${domain.domain}/email/verify-otp`, {
                    email_address: formData.email_address,
                    otp,
                });

                if (response) {
                    handleSubmit()
                    setApiStatus(apiStatusConstants.success);
                } else {
                    showAlert({
                        title: 'Error',
                        text: 'Invalid OTP. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                    setApiStatus(apiStatusConstants.success);
                }
            }
            
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setApiStatus(apiStatusConstants.failure);
                const errorMessage = error.response.data.error || 'Invalid OTP. Please try again.';
                setErrorMsg(errorMessage);
                setApiStatus(apiStatusConstants.failure);
            } else {
                const errorMessage = 'Error verifying OTP. Please try again.';
                setErrorMsg(errorMessage);
                setApiStatus(apiStatusConstants.failure);
            }
        }
    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {

        const newFormData = { ...formData, created_by: currentUser.first_name }
        try {
            await axios.post(`${domain.domain}/user/add-staff`, newFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            showAlert({
                title: 'Staff Added Successfully!',
                text: "You can now assign a client to the newly added staff member.",
                icon: 'success',
                confirmButtonText: 'OK',
            });
            setTimer(0)
            setApiStatus(apiStatusConstants.success);
            setProfileBg('profileBg', getRandomColor());
            setFormData({})
        } catch (error) {
            setTimer(0)
            setOtpSent(false)
            setErrorMsg(error.response.data.error);
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
        <AddStaffContainer>
            <AddStaffCard className='shadow'>
                <H1 >Add Staff</H1>
                <form >
                    <div className='row'>
                        {initialFormFields.map((field, index) => (
                            <div className='col-12 col-md-6' key={index}>
                                <MarginBottom2 >
                                    <FormLabel htmlFor={field.name} >
                                        <strong>{field.label}</strong>
                                    </FormLabel>
                                    <input
                                        type={field.type}
                                        className="p-2 text-dark" style={{ border: '1px solid grey', borderRadius: '4px', outline: 'none' }}
                                        id={field.name}
                                        placeholder={field.placeholder}
                                        name={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </MarginBottom2>
                            </div>
                        ))}
                        
                    </div>
                    {otpSent ? renderOtpSection() : null}
                    {!otpSent && errorMsg && <span className='text-danger'>{errorMsg}</span>}
                    {!otpSent && <button type="button" onClick={handleGetOtp} className="register-button w-100 mt-2">
                        {apiStatusOTP === apiStatusConstants.inProgress ? renderLoader() : <span>Get OTP</span>}
                    </button>}
                    {/* <ButtonContainer>
                        <AddStaffButton type="submit">
                            Add Staff
                        </AddStaffButton>
                    </ButtonContainer> */}

                </form>
            </AddStaffCard>
        </AddStaffContainer>
    );
};

export default AddStaff;
