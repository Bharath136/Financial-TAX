// Libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Components
import domain from '../../domain/domain';
import EditPopup from './editPopup';
import SweetLoading from '../../SweetLoading/SweetLoading';

// Styled Components
import {
    ClientListContainer,
    H1,
    SearchBar,
    SearchButton,
    TableContainer,
} from '../Clients/styledComponents';
import showAlert from '../../SweetAlert/sweetalert';
import ClientTable from './clientTable';
import { getToken, getUserData } from '../../StorageMechanism/storageMechanism';
import FailureComponent from '../../FailureComponent/failureComponent';
import ExcelUploader from './excelUploader';
import { SearchBarContainer } from '../Staff/styledComponents';
import { BiSearch } from 'react-icons/bi';



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
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);
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
                setFilteredClients(data)
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const onSearch = () => {
        if (searchTerm) {
            const filteredData = clients.filter((staff) =>
                staff?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                staff?.contact_number?.includes(searchTerm) ||
                staff?.email_address?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredClients(filteredData);
        } else {
            setFilteredClients(clients);
        }
    };


    const renderSuccess = () => {
        return (

            <ClientListContainer>
                <ExcelUploader fetchClients={fetchClients}/>
                {filteredClients.length > 0 &&
                        <TableContainer className="shadow mt-5">
                            <div className='d-flex align-items-center justify-content-between'>
                            <H1>Unregistered Clients</H1>
                            <SearchBarContainer>
                                <SearchBar
                                    type="text"
                                    placeholder="Search client by N.., E.., P.."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <SearchButton onClick={onSearch}><BiSearch size={25} /></SearchButton>
                            </SearchBarContainer>
                            </div>
                            <ClientTable
                                clients={filteredClients}
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
                return <FailureComponent errorMsg={errorMsg} fetchData={fetchClients}/>
            case apiStatusConstants.inProgress:
                return <SweetLoading />
            case apiStatusConstants.success:
                return renderSuccess();
            default:
                return null;
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
                fetchData={fetchClients}
            />
        </>
    );
};

export default UnregisteredClients;
