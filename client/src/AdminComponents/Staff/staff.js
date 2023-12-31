// Libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

// Components
import domain from '../../domain/domain';
import EditModal from '../../SweetPopup/sweetPopup';
import showAlert from '../../SweetAlert/sweetalert';
import SweetLoading from '../../SweetLoading/SweetLoading';
import FailureComponent from '../../FailureComponent/failureComponent'

// Assets
import noClient from '../../Assets/no-customers.png'
import { BiSearch } from 'react-icons/bi';
import { MdFilterList } from 'react-icons/md';

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
    NoClientContainer,
    FilterSelect,
    ScrollingText,
    ScrollingTextContainer
} from './styledComponents';
import ClientTable from './clientsTable';
import { ViewButton } from '../Clients/styledComponents';
import { getToken, getUserData } from '../../StorageMechanism/storageMechanism';

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const dataOrder = [
    'Scheduling',
    'TaxInterview',
    'Documents',
    'TaxPreparation',
    'Review',
    'Payments',
    'ClientReview',
    'Filing',
];

const Staff = () => {

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
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [selectedFilter, setFilterType] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const token = getToken();
    const user = getUserData();

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const onSearch = () => {
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

            const [staffData] = await Promise.all([staffResponse, assignedClientsResponse]);

            // Filter staff and clients
            const filteredStaff = staffData.data.filter((user) => user.role === 'STAFF');
            const filteredClients = staffData.data.filter((user) => user.role === 'CUSTOMER');
            setClients(filteredClients);
            setFilteredStaff(filteredStaff)
            setStaff(filteredStaff);

           
            setApiStatus(apiStatusConstants.success)
        } catch (error) {
            setApiStatus(apiStatusConstants.failure)
            setErrorMsg(error)
        }
    };

    // Navigation hook
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect based on user role
        if (user) {
            if (user.role === 'STAFF') {
                navigate('/staff/dashboard')
            } else if (user.role === 'CUSTOMER') {
                navigate('/user/dashboard')
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
            setErrorMsg(error)
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
        setSelectedAction()
    };

    // Get client label
    // const getClientLabel = (client) => {
    //     return `${client.first_name} ${client.last_name}`;
    // };

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
            setApiStatus(apiStatusConstants.failure)
            setErrorMsg(error)
        }
    };

    const [team, setTeam] = useState('')

    const handleTeamChange = (team) => {
        setTeam(team.value)
    }

    const handleStaffTeamUpdate = async (id) => {
        const data = {
            staff_team: team, // Assuming 'team' is defined somewhere in your code
            user: user // Assuming 'user' is defined somewhere in your code
        };

        try {
            setApiStatus(apiStatusConstants.inProgress);

            const response = await axios.put(
                `${domain.domain}/user/add/staff-team/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response) {
                setApiStatus(apiStatusConstants.success); // Set success status if the request was successful
                showAlert({
                    title: 'Staff Team Updated Successfully!',
                    text: 'The staff team has been successfully updated.',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                });
            }
            fetchData()
            setTeam()
        } catch (error) {
            setApiStatus(apiStatusConstants.failure);
            setErrorMsg(error)
            showAlert({
                title: 'Error',
                text: 'There was an error updating the staff team. Please try again.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            setTeam()
        }
    };


    // Handle filter change
    const handleFilterChange = (filterType) => {
        setFilterType(filterType);

        let filteredData = [];

        if (filterType === 'assigned') {
            filteredData = staffList.filter((staff) => staff.staff_team !== '' && staff.staff_team !== null);
        } else if (filterType === 'unassigned') {
            filteredData = staffList.filter((staff) => staff.staff_team === '' || staff.staff_team === null);
        } else {
            filteredData = staffList;
        }
        setFilteredStaff(filteredData);
    };


    const renderSuccess = () => {
        return (
            <StaffListContainer>
                <H1>Staff</H1>
                {staffList.length > 0 ?
                    <TableContainer className='shadow'>
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
                            <div>
                                <label htmlFor="filterDropdown">
                                    <MdFilterList size={20} />
                                </label>
                                <FilterSelect
                                    id="filterDropdown"
                                    value={selectedFilter}
                                    onChange={(e) => handleFilterChange(e.target.value)}
                                >
                                    <option value="">All Staff</option>
                                    <option value="assigned">Assigned Staff</option>
                                    <option value="unassigned">Unassigned Staff</option>
                                </FilterSelect>
                            </div>
                        </ClientsHeaderContainer>
                        <div style={{ backgroundColor: `var(--main-background-shade)`, fontSize: '14px' }} className='p-3 mt-2'>
                            <strong>Note: </strong>
                            <ScrollingTextContainer>
                                <ScrollingText>Ensure that team selection is performed only once. Repeatedly changing it may result in data issues. If it is necessary to make changes, please ensure that there are no clients assigned to the staff.</ScrollingText>

                            </ScrollingTextContainer>
                        </div>

                        <Container>
                            {filteredStaff.length > 0 ?
                                <Table>
                                    <thead>
                                        <tr>
                                            <Th>ID</Th>
                                            <Th>Name</Th>
                                            <Th>Email</Th>
                                            {/* <Th>Phone</Th> */}
                                            {/* <Th>Secret Code</Th> */}
                                            <Th>Team</Th>
                                            <Th>Select Team</Th>
                                            {/* <Th>Assign Clients</Th> */}
                                            <Th>Assigned Clients</Th>
                                            <Th>Profile Actions</Th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStaff.map((staff) => (
                                            <tr key={staff.user_id}>
                                                <Td>{staff.user_id}</Td>
                                                <Td>{staff.first_name}</Td>
                                                <Td>{staff.email_address}</Td>
                                                {/* <Td>{staff.contact_number}</Td> */}
                                                {/* <Td>{staff.secret_code}</Td> */}
                                                <Td>{staff.staff_team}</Td>
                                                <Td>
                                                    <div className='d-flex align-items-center justify-content-center' style={{gap:'.8rem'}}>
                                                        <Select
                                                            options={dataOrder.map((team) => ({
                                                                value: team,
                                                                label: team,
                                                                data: team,
                                                            }))}
                                                            onChange={handleTeamChange}
                                                            placeholder="Select Team"
                                                            required
                                                        />
                                                        <ExecuteButton
                                                            onClick={() => handleStaffTeamUpdate(staff.user_id)}
                                                            disabled={!team}
                                                        >
                                                            Add
                                                        </ExecuteButton>
                                                    </div>
                                                </Td>
                                                <Td>
                                                    <ViewButton
                                                        onClick={() => getAssignedClients(staff.user_id)}
                                                    >
                                                        View
                                                    </ViewButton>
                                                </Td>
                                                <Td>
                                                    <div className='d-flex align-items-center justify-content-center' style={{ gap: '.8rem' }}>
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
                                :
                                <NoClientContainer>
                                    <img src={noClient} alt='img' className='img-fluid' />
                                    <H1>No Staff Available!</H1>
                                    <p>Oops! It seems there are no staff Added here.</p>
                                </NoClientContainer>}
                        </Container>

                        {viewAssignedClients && selectedStaff && <p className='mt-5'>Staff Member: {selectedStaff}</p>}

                        <ClientTable assignedClients={assignedClients} viewAssignedClients={viewAssignedClients} selectedStaff={selectedStaff} />

                        {viewAssignedClients && assignedClients.length === 0 && <p>No Clients Assigned</p>}
                    </TableContainer>
                    :
                    <NoClientContainer>
                        <img src={noClient} alt='img' className='img-fluid' />
                        <H1>No Staff Added</H1>
                        <p>Oops! It seems there are no staff Added here.</p>
                    </NoClientContainer>
                }
            </StaffListContainer>
        )
    }


    // Render different components based on API status
    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <FailureComponent errorMsg={errorMsg} fetchData={fetchData} />
            case apiStatusConstants.inProgress:
                return <SweetLoading />
            case apiStatusConstants.success:
                return renderSuccess()

            default:
                return null
        }
    }

    return (
        <>
            {renderComponents()}

            <EditModal
                isOpen={isEditModalOpen}
                profileId={profileId}
                onRequestClose={handleEditModalClose}
                handleOpenClick={handleEditClick}
                isEditable={true}
            />
        </>
    );
};

export default Staff;
