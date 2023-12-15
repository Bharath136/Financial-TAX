// Libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

// Components
import domain from '../../domain/domain';
import Sidebar from '../../userComponents/SideBar/sidebar';
import EditModal from '../../SweetPopup/sweetPopup';
import showAlert from '../../SweetAlert/sweetalert';
import SweetLoading from '../../SweetLoading/SweetLoading';

// Assets
import noClient from '../../Assets/no-customers.jpg'
import { BiSearch } from 'react-icons/bi';

// Styled Components
import {
    SearchButton,
    ClientsHeaderContainer,
    Container,
    ExecuteButton,
    H1,
    SearchBar,
    SearchBarContainer,
    StaffListContainer,
    Table,
    TableContainer,
    Td,
    Th,
    NoClientContainer
} from './styledComponents';


// Constants for API status
const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const Staff = () => {
    // State variables
    const [staffList, setStaff] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileId, setProfileId] = useState(19);
    const [clients, setClients] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [assignedClients, setAssignedClients] = useState([])
    const [viewAssignedClients, setViewAssignedClients] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState({})
    const [searchTerm, setSearchTerm] = useState('');
    const [unassignedClients, setUnassignedClients] = useState([]);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const token = localStorage.getItem('customerJwtToken');

    // Handle search term change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle search button click
    const onSearch = () => {
        // Filter users by name, mobile number, or email
        if (searchTerm) {
            const filteredData = staffList.filter((staff) =>
                staff?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                staff?.contact_number?.includes(searchTerm) ||
                staff?.email_address?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredStaff(filteredData);
        } else {
            setFilteredStaff(staffList);
        }
    };


    // Fetch data from API
    const fetchData = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const staffResponse = axios.get(`${domain.domain}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const assignedClientsResponse = axios.get(`${domain.domain}/staff-customer-assignments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const [staffData, assignedClientsData] = await Promise.all([staffResponse, assignedClientsResponse]);

            // Filter staff and clients
            const filteredStaff = staffData.data.filter((user) => user.role === 'STAFF');
            const filteredClients = staffData.data.filter((user) => user.role === 'CUSTOMER');
            setClients(filteredClients);
            setFilteredStaff(filteredStaff)
            setStaff(filteredStaff);

            // Find unassigned clients
            const assignedClients = assignedClientsData.data;
            const unassignedClients = filteredClients.filter((client) => {
                return !assignedClients.some((assignedClient) => assignedClient.client_id === client.user_id);
            });
            setApiStatus(apiStatusConstants.success)
            setUnassignedClients(unassignedClients);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Navigation hook
    const navigate = useNavigate();

    // User details
    const user = JSON.parse(localStorage.getItem('currentUser'))

    useEffect(() => {
        // Redirect based on user role
        if(user){
            if (user.role === 'STAFF') {
                navigate('/staff-dashboard')
            } else if (user.role === 'CUSTOMER') {
                navigate('/user-dashboard')
            }
        }
        fetchData();
    }, []);

    // Handle edit button click
    const handleEditClick = () => {
        setIsEditModalOpen(!isEditModalOpen);
        fetchData();
    };

    // Handle modal close
    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    // Handle staff deletion
    const onDeleteStaff = async (id) => {
        setApiStatus(apiStatusConstants.inProgress);

        try {
            await axios.delete(`${domain.domain}/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setApiStatus(apiStatusConstants.success);
            fetchData();

            // Show success alert
            showAlert({
                title: 'Staff Deleted Successfully!',
                text: 'The staff member has been deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } catch (error) {
            console.error('Error Deleting staff:', error);
            setApiStatus(apiStatusConstants.failure);

            // Show error alert
            showAlert({
                title: 'Error Deleting Staff',
                text: 'An error occurred while deleting the staff member.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };


    // Action options for staff
    const actionOptions = [
        { value: 'edit', label: 'Edit / View' },
        { value: 'hold', label: 'Hold' },
        { value: 'delete', label: 'Delete' },
    ];

    // Handle action change
    const handleActionChange = (selectedOption) => {
        setSelectedAction(selectedOption);
    };

    // Handle executing selected action
    const handleExecuteAction = (staffId) => {
        if (selectedAction) {
            switch (selectedAction.value) {
                case 'edit':
                    handleEditClick();
                    setProfileId(staffId);
                    break;
                case 'hold':
                    // Implement hold action
                    break;
                case 'delete':
                    onDeleteStaff(staffId);
                    setProfileId(staffId);
                    break;
                default:
                    break;
            }
        }
    };

    // Get client label
    const getClientLabel = (client) => {
        return `${client.first_name} ${client.last_name}`;
    };

    // Get assigned clients for a staff member
    const getAssignedClients = async (id) => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            // Fetch assignments for the staff
            const assignmentsResponse = await axios.get(`${domain.domain}/staff-customer-assignments/staff/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const selectedStaff = staffList.filter((staff) => staff.user_id === id)
            setSelectedStaff(selectedStaff[0].first_name)

            // Extract client IDs from assignments
            const assignedClientIds = assignmentsResponse.data.map((assignment) => assignment.client_id);

            // Filter clients based on assignedClientIds
            const assignedClients = clients.filter((client) => assignedClientIds.includes(client.user_id));
            setApiStatus(apiStatusConstants.success)
            setAssignedClients(assignedClients);
            setViewAssignedClients(!viewAssignedClients);
        } catch (error) {
            console.error('Error fetching assigned clients:', error);
        }
    };

    // Handle assigning a client to a staff member
    const handleAssign = async (staffId) => {
        const assignData = { client_id: selectedAction.data.user_id, staff_id: staffId }
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const response = await axios.post(`${domain.domain}/staff-customer-assignments/assign`, assignData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setApiStatus(apiStatusConstants.success)
                showAlert({
                    title: 'Client Assigned Successfully!',
                    text: 'The selected client has been successfully assigned.',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                });
                fetchData()
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Render different components based on API status
    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <div>failure</div>
            case apiStatusConstants.inProgress:
                return <SweetLoading />
            case apiStatusConstants.success:
                return <TableContainer className='shadow'>
                    <ClientsHeaderContainer>
                        <SearchBarContainer>
                            <SearchBar
                                type="text"
                                placeholder="Search client by N.., E.., P.."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <SearchButton onClick={onSearch}><BiSearch size={25} /></SearchButton>
                        </SearchBarContainer>
                    </ClientsHeaderContainer>
                    <Container>
                        <Table>
                            <thead>
                                <tr>
                                    <Th>ID</Th>
                                    <Th>Name</Th>
                                    <Th>Email</Th>
                                    <Th>Phone</Th>
                                    <Th>Secret Code</Th>
                                    <Th>Assign Clients</Th>
                                    <Th>Assigned Clients</Th>
                                    <Th>Actions</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStaff.map((staff) => (
                                    <tr key={staff.user_id}>
                                        <Td>{staff.user_id}</Td>
                                        <Td>{staff.first_name}</Td>
                                        <Td>{staff.email_address}</Td>
                                        <Td>{staff.contact_number}</Td>
                                        <Td>{staff.secret_code}</Td>
                                        <Td>
                                            <div className='d-flex'>
                                                <Select
                                                    options={unassignedClients.map((client) => ({
                                                        value: client.user_id,
                                                        label: getClientLabel(client),
                                                        data: client,
                                                    }))}
                                                    onChange={handleActionChange}
                                                    placeholder="Select Client"
                                                />
                                                <ExecuteButton
                                                    onClick={() => handleAssign(staff.user_id)}
                                                >
                                                    Assign
                                                </ExecuteButton>
                                            </div>
                                        </Td>
                                        <Td>
                                            <ExecuteButton
                                                onClick={() => getAssignedClients(staff.user_id)}
                                            >
                                                View
                                            </ExecuteButton>
                                        </Td>
                                        <Td>
                                            <div className='d-flex'>
                                                <Select
                                                    options={actionOptions}
                                                    onChange={handleActionChange}
                                                    placeholder="Select Action"
                                                />
                                                <ExecuteButton
                                                    onClick={() => handleExecuteAction(staff.user_id)}
                                                >
                                                    Execute
                                                </ExecuteButton>
                                            </div>
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>

                    {viewAssignedClients && selectedStaff && <p className='mt-5'>Staff Member: {selectedStaff}</p>}
                    {viewAssignedClients && assignedClients.length > 0 && <Table >

                        <thead>
                            <tr>
                                <Th>ID</Th>
                                <Th>Name</Th>
                                <Th>Email</Th>
                                <Th>Phone</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignedClients.map((client) => (
                                <tr key={client.user_id} >
                                    <Td>{client.user_id}</Td>
                                    <Td>{client.first_name}</Td>
                                    <Td>{client.email_address}</Td>
                                    <Td>{client.contact_number}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>}
                    {viewAssignedClients && assignedClients.length === 0 && <p>No Clients Assigned</p>}
                </TableContainer>
            default:
                return null
        }
    }

    return (
        <div className="d-flex">
            <Sidebar />
            <StaffListContainer>
                <H1>Staff</H1>
                {staffList.length > 0 ? renderComponents() :
                    <NoClientContainer>
                        <img src={noClient} alt='img' className='img-fluid' />
                        <H1>No Staff Added</H1>
                        <p>Oops! It seems there are no staff Added here.</p>
                    </NoClientContainer>
                }
            </StaffListContainer>

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

export default Staff;
