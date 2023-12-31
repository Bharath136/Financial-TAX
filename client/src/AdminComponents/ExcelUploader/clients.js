// Libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Components
import domain from '../../domain/domain';
import EditPopup from './editPopup';
import SweetLoading from '../../SweetLoading/SweetLoading';

// Assets
import noClient from '../../Assets/no-customers.png'

// Styled Components
import {
    ClientListContainer,
    H1,
    NoClientContainer,
    TableContainer,
} from '../Clients/styledComponents';
import showAlert from '../../SweetAlert/sweetalert';
import ClientTable from './clientTable';
import { getToken, getUserData } from '../../StorageMechanism/storageMechanism';
import FailureComponent from '../../FailureComponent/failureComponent';
import ExcelUploader from './excelUploader';



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
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const [errorMsg, setErrorMsg] = useState('')
    const token = getToken();

    // User details
    const user = getUserData();

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
            const filtered = data.filter((user) => user.status === 'registered')
            console.log(filtered)
            if (response.status === 200) {
                setApiStatus(apiStatusConstants.success)
                setClients(data);
            }
        } catch (error) {
            setApiStatus(apiStatusConstants.failure)
            setErrorMsg(error)
        }
    };

    useEffect(() => {
        // Redirect based on user role
        if (user) {
            if (user.role === 'STAFF') {
                navigate('/staff/dashboard')
            } else if (user.role === 'CUSTOMER') {
                navigate('/user/dashboard')
            }
        } else {
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
        if (userConfirmed) {
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
                setErrorMsg(error)
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

    const renderSuccess = () => {
        return (

            <ClientListContainer>
                <H1>Unregistered Clients</H1>

                {clients.length <= 0 ? <NoClientContainer>
                    <img src={noClient} alt='img' className='img-fluid' />
                    <H1>No Clients Added</H1>
                    <p>Oops! It seems there are no clients added here.</p>
                </NoClientContainer> :
                    <TableContainer className="shadow">
                        <ExcelUploader />
                        <ClientTable
                            clients={clients}
                            onDeleteClient={onDeleteClient}
                            handleEditClick={handleEditClick}
                            setProfileId={setProfileId}
                        />
                    </TableContainer>}
            </ClientListContainer>
        )
    }

    // Render different components based on API status
    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <FailureComponent errorMsg={errorMsg} />
            case apiStatusConstants.inProgress:
                return <SweetLoading />
            case apiStatusConstants.success:
                return renderSuccess();
            default:
                return null
        }
    }

    // Return JSX for the component
    return (
        <>
            {renderComponents()}

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
