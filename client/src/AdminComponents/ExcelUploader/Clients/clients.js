// Libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Components
import domain from '../../../domain/domain';
import EditPopup from './editPopup';
import SweetLoading from '../../../SweetLoading/SweetLoading';

// Assets
import noClient from '../../../Assets/no-customers.png'

// Styled Components
import {
    ClientListContainer,
    H1,
    NoClientContainer,
    TableContainer,
} from './styledComponents';
import showAlert from '../../../SweetAlert/sweetalert';
import ClientTable from './clientTable';



// Constants for API status
const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const UnregisteredClients = () => {
    // State variables
    const [clients, setClients] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileId, setProfileId] = useState(null);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const token = localStorage.getItem('customerJwtToken');

    // User details
    const user = JSON.parse(localStorage.getItem('currentUser'))

    // Navigation hook
    const navigate = useNavigate();

    const fetchClients = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const response = await axios.get(`${domain.domain}/dummy-users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;
            if (response.status === 200) {
                setApiStatus(apiStatusConstants.success)
                setClients(data); 
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    useEffect(() => {
        // Redirect based on user role
        if(user){
            if (user.role === 'STAFF') {
                navigate('/staff/dashboard')
            } else if (user.role === 'CUSTOMER') {
                navigate('/user/dashboard')
            }
        }else{
            navigate('/')
        }

        fetchClients();
    }, [token, navigate]);


    // Handle edit button click
    const handleEditClick = () => {
        setIsEditModalOpen(!isEditModalOpen);
    };

    // Handle modal close
    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };


    // Handle staff deletion
    const onDeleteClient = async (id) => {
        const userConfirmed = window.confirm("Are you sure you want to delete?");
        if (userConfirmed){
            setApiStatus(apiStatusConstants.inProgress);

            try {
                await axios.delete(`${domain.domain}/dummy-users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setApiStatus(apiStatusConstants.success);

                // Show success alert
                showAlert({
                    title: 'Client Deleted Successfully!',
                    text: 'The client has been deleted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                fetchClients()
            } catch (error) {
                console.error('Error Deleting Client:', error);
                setApiStatus(apiStatusConstants.failure);

                // Show error alert
                showAlert({
                    title: 'Error Deleting Client',
                    text: 'An error occurred while deleting the client member.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        }
    };



    // Render different components based on API status
    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <TableContainer className="shadow">
                    <ClientTable
                        clients={clients}
                        onDeleteClient={onDeleteClient}
                        handleEditClick={handleEditClick}
                        setProfileId={setProfileId}
                    />

                </TableContainer>
            case apiStatusConstants.inProgress:
                return <SweetLoading />
            case apiStatusConstants.success:
                return <TableContainer className="shadow">
                    <ClientTable
                        clients={clients}
                        onDeleteClient={onDeleteClient}
                        handleEditClick={handleEditClick}
                        setProfileId={setProfileId}
                    />

                </TableContainer>
            default:
                return null
        }
    }

    // Return JSX for the component
    return (
        <>
            <ClientListContainer>
                <H1>Unregistered Clients</H1>

                {clients.length <= 0 ? <NoClientContainer>
                    <img src={noClient} alt='img' className='img-fluid' />
                    <H1>No Clients Added</H1>
                    <p>Oops! It seems there are no clients added here.</p>
                </NoClientContainer> : renderComponents() 
                }

            </ClientListContainer>

            <EditPopup
                isOpen={isEditModalOpen}
                profileId={profileId}
                onRequestClose={handleEditModalClose}
                handleOpenClick={handleEditClick}
                isEditable={true}
            />
        </>
    );
};

export default UnregisteredClients;
