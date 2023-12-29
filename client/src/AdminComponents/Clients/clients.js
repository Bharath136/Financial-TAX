// Libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Components
import domain from '../../domain/domain';
import EditModal from '../../SweetPopup/sweetPopup';
import SweetLoading from '../../SweetLoading/SweetLoading';

// Assets
import noClient from '../../Assets/no-customers.png'

// Styled Components
import {
    ClientListContainer,
    H1,
    NoClientContainer,
    TableContainer,
} from './styledComponents';
import showAlert from '../../SweetAlert/sweetalert';
import ClientTable from './clientTable';
import ClientFilter from './clientFilter';
import FailureComponent from '../../FailureComponent/failureComponent';


// Constants for API status
const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const Clients = () => {
    // State variables
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [assignmentClients, setAssignedClients] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileId, setProfileId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setFilterType] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const token = localStorage.getItem('customerJwtToken');

    // User details
    const user = JSON.parse(localStorage.getItem('currentUser'))

    // Navigation hook
    const navigate = useNavigate();

    const fetchClients = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const response = await axios.get(`${domain.domain}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data;
            if (response.status === 200) {
                setApiStatus(apiStatusConstants.success)
                const filteredData = data.filter((user) => user.role === 'CUSTOMER');
                setClients(filteredData); // Set the filtered data by name
                setFilteredClients(filteredData)
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

        getAllAssignedClients();
        fetchClients();
    }, [token, navigate]);

    // Handle search term change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle filter change
    const handleFilterChange = (filterType) => {
        setFilterType(filterType);

        let filteredData = [];

        if (filterType === 'assigned') {
            filteredData = clients.filter((client) =>
                assignmentClients.some((assignmentClient) => assignmentClient.client_id === client.user_id)
            );
        } else if (filterType === 'unassigned') {
            filteredData = clients.filter((client) =>
                !assignmentClients.some((assignmentClient) => assignmentClient.client_id === client.user_id)
            );
        } else {
            filteredData = clients;
        }
        setFilteredClients(filteredData);
    };

    // Fetch all assigned clients
    const getAllAssignedClients = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        setInterval(async () => {
            try {
                const assignedClientsResponse = await axios.get(`${domain.domain}/staff-customer-assignments`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (assignedClientsResponse.status === 200) {
                    setApiStatus(apiStatusConstants.success)
                    const assignedClients = assignedClientsResponse.data;
                    setAssignedClients(assignedClients);
                }

            } catch (error) {
                setApiStatus(apiStatusConstants.failure)
                setErrorMsg(error)
            }
        }, 500)
    };

    // Handle edit button click
    const handleEditClick = () => {
        setIsEditModalOpen(!isEditModalOpen);
    };

    // Handle modal close
    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    // Handle search button click
    const onSearch = () => {
        // Filter users by name, mobile number, or email
        if (searchTerm) {
            const filteredData = clients.filter((user) =>
                user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user?.contact_number?.includes(searchTerm) ||
                user?.email_address?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredClients(filteredData);
        } else {
            setFilteredClients(clients);
        }
    };

    // Handle staff deletion
    const onDeleteClient = async (id) => {
        const userConfirmed = window.confirm("Are you sure you want to delete?");
        if (userConfirmed) {
            setApiStatus(apiStatusConstants.inProgress);

            try {
                await axios.delete(`${domain.domain}/user/${id}`, {
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
                <H1>Clients</H1>
                {filteredClients.length > 0 ?
                    <TableContainer className="shadow">
                        <ClientFilter
                            selectedFilter={selectedFilter}
                            handleFilterChange={handleFilterChange}
                            handleSearchChange={handleSearchChange}
                            onSearch={onSearch}
                            searchTerm={searchTerm}
                        />
                        <ClientTable
                            clients={filteredClients}
                            onDeleteClient={onDeleteClient}
                            handleEditClick={handleEditClick}
                            setProfileId={setProfileId}
                        />
                    </TableContainer>
                    :
                    <NoClientContainer>
                        <img src={noClient} alt='img' className='img-fluid' />
                        <H1>No Clients Registered</H1>
                        <p>Oops! It seems there are no clients registered here.</p>
                    </NoClientContainer>}

                <EditModal
                    isOpen={isEditModalOpen}
                    profileId={profileId}
                    onRequestClose={handleEditModalClose}
                    handleOpenClick={handleEditClick}
                    isEditable={true}
                />
            </ClientListContainer>
        )
    }


    // Render different components based on API status
    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <FailureComponent errorMsg={errorMsg} />;
            case apiStatusConstants.inProgress:
                return <SweetLoading />;
            case apiStatusConstants.success:
                return renderSuccess();

            default:
                return null
        }
    }

    // Return JSX for the component
    return (
        renderComponents()
    );
};

export default Clients;
