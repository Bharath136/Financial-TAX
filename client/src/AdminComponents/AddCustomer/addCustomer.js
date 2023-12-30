import React, { useEffect, useState } from 'react';
import domain from '../../domain/domain';
import axios from 'axios';
import showAlert from '../../SweetAlert/sweetalert';
import { AddStaffButton, AddStaffCard, AddStaffContainer, ButtonContainer, FormLabel, MarginBottom2 } from '../AddStaff/styledComponents';
import { useNavigate } from 'react-router-dom';
import { H1 } from '../Staff/styledComponents';
import { getToken, getUserData } from '../../StorageMechanism/storageMechanism';

const AddCustomer = () => {
    const initialFormFields = [
        { label: 'First Name', name: 'first_name', type: 'text', placeholder: 'First Name' },
        { label: 'Last Name', name: 'last_name', type: 'text', placeholder: 'Last Name' },
        { label: 'Email', name: 'email_address', type: 'email', placeholder: 'Email' },
        { label: 'Phone', name: 'contact_number', type: 'number', placeholder: 'Mobile Number' },
        { label: 'Alt Phone', name: 'alt_contact_number', type: 'number', placeholder: 'Mobile Number' }
    ];

    const [formData, setFormData] = useState({});
    const currentUser = getUserData();
    const token = getToken();

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'STAFF') {
                navigate('/staff/dashboard');
            } else if (currentUser.role === 'CUSTOMER') {
                navigate('/user/dashboard');
            }
        }
    }, [currentUser, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newFormData = { ...formData, created_by: currentUser.first_name };
        try {
            await axios.post(`${domain.domain}/dummy-users`, newFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            showAlert({
                title: 'Customer Added Successfully!',
                text: 'You can now use your credentials to log in.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            setFormData({});
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <AddStaffContainer>
            <AddStaffCard className='shadow'>
                <H1>Add Customer</H1>
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        {initialFormFields.map((field, index) => (
                            <div className='col-12 col-md-6' key={index}>
                                <MarginBottom2>
                                    <FormLabel htmlFor={field.name}>
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
                    <ButtonContainer>
                        <AddStaffButton type="submit">
                            Add Customer
                        </AddStaffButton>
                    </ButtonContainer>
                </form>
            </AddStaffCard>
        </AddStaffContainer>
    );
};

export default AddCustomer;
