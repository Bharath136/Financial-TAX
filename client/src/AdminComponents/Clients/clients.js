// Libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Components
import domain from '../../domain/domain';
import Sidebar from '../../userComponents/SideBar/sidebar';
import EditModal from '../../SweetPopup/sweetPopup';
import SweetLoading from '../../SweetLoading/SweetLoading';

// Icons
import { BiSearch } from 'react-icons/bi';
import { MdFilterList } from 'react-icons/md';

// Assets
import noClient from '../../Assets/no-customers.jpg'

// Styled Components
import {
    ClientListContainer,
    ClientsHeaderContainer,
    FilterSelect,
    H1,
    NoClientContainer,
    SearchBar,
    SearchBarContainer,
    SearchButton,
    Table,
    TableContainer,
    Td,
    Th,
    ViewButton,
} from './styledComponents';


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
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const token = localStorage.getItem('customerJwtToken');

    // User details
    const user = JSON.parse(localStorage.getItem('currentUser'))

    // Navigation hook
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect based on user role
        if(user){
            if (user.role === 'STAFF') {
                navigate('/staff-dashboard')
            } else if (user.role === 'CUSTOMER') {
                navigate('/user-dashboard')
            }
        }

        // Fetch assigned clients and all clients
        getAllAssignedClients();
        const fetchClients = async () => {
            setApiStatus(apiStatusConstants.initial)
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
                console.error('Error fetching clients:', error);
            }
        };

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
            console.error('Error fetching assigned clients:', error);
        }
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



    // Render different components based on API status
    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <div>failure</div>
            case apiStatusConstants.inProgress:
                return <SweetLoading />
            case apiStatusConstants.success:
                return <TableContainer className="shadow">
                    <ClientsHeaderContainer>
                        <SearchBarContainer>
                            <SearchBar
                                type="text"
                                placeholder="Search client by N.., E.., P.."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <SearchButton onClick={onSearch} type='button'><BiSearch size={25} /></SearchButton>
                        </SearchBarContainer>
                        <div>
                            <label htmlFor="filterDropdown">
                                <MdFilterList size={20} />
                            </label>
                            <FilterSelect
                                id="filterDropdown"
                                value={selectedFilter}
                                onChange={(e) => handleFilterChange(e.target.value)}
                            >
                                <option value="">All Clients</option>
                                <option value="assigned">Assigned Clients</option>
                                <option value="unassigned">Unassigned Clients</option>
                            </FilterSelect>
                        </div>
                    </ClientsHeaderContainer>
                    <Table>
                        <thead>
                            <tr>
                                <Th>ID</Th>
                                <Th>Name</Th>
                                <Th>Email</Th>
                                <Th>Phone</Th>
                                <Th>Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map((client) => (
                                <tr key={client.user_id}>
                                    <Td>{client.user_id}</Td>
                                    <Td>{client.first_name}</Td>
                                    <Td>{client.email_address}</Td>
                                    <Td>{client.contact_number}</Td>
                                    <Td>
                                        <ViewButton
                                            onClick={() => {
                                                handleEditClick();
                                                setProfileId(client.user_id);
                                            }}
                                        >
                                            View
                                        </ViewButton>
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableContainer>
            default:
                return null
        }
    }

    // Return JSX for the component
    return (
        <div className="d-flex">
            <Sidebar />
            <ClientListContainer>
                <H1>Clients</H1>

                {clients.length > 0 ? renderComponents() :
                    <NoClientContainer>
                        <img src={noClient} alt='img' className='img-fluid' />
                        <H1>No Clients Registered</H1>
                        <p>Oops! It seems there are no clients registered here.</p>
                    </NoClientContainer>
                }

            </ClientListContainer>

            <EditModal
                isOpen={isEditModalOpen}
                profileId={profileId}
                onRequestClose={handleEditModalClose}
                handleOpenClick={handleEditClick}
                isEditable={true}
            />
        </div>
    );
};

export default Clients;
