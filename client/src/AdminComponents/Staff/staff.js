import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import domain from '../../domain/domain';
import Sidebar from '../../userComponents/SideBar/sidebar';
import EditModal from '../../SweetPopup/sweetPopup';
import { SearchButton, ClientsHeaderContainer,Container, ExecuteButton, FilterSelect, H1, SearchBar, SearchBarContainer, StaffListContainer, Table, TableContainer, Td, Th } from './styledComponents';
import { BiSearch } from 'react-icons/bi';
import { MdFilterList } from 'react-icons/md';
import showAlert from '../../SweetAlert/sweetalert';

const Staff = () => {
    const [staffList, setStaff] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileId, setProfileId] = useState(19);
    const [clients, setClients] = useState([])
    const [assignedClients, setAssignedClients] = useState([])
    const [viewAssignedClients, setViewAssignedClients] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState({})
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setFilterType] = useState('');
    const [unassignedClients, setUnassignedClients] = useState([]);
    const token = localStorage.getItem('customerJwtToken');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (filterType) => {
        setFilterType(filterType);
    };

    const fetchData = async () => {
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

            const filteredStaff = staffData.data.filter((user) => user.role === 'STAFF');
            const filteredClients = staffData.data.filter((user) => user.role === 'CUSTOMER');
            setClients(filteredClients);
            setStaff(filteredStaff);

            const assignedClients = assignedClientsData.data;
            const unassignedClients = filteredClients.filter((client) => {
                return !assignedClients.some((assignedClient) => assignedClient.client_id === client.user_id);
            });

            setUnassignedClients(unassignedClients);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleEditClick = () => {
        setIsEditModalOpen(!isEditModalOpen);
        fetchData();
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    const onDeleteStaff = async (id) => {
        try {
            await axios.delete(`${domain.domain}/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchData();
        } catch (error) {
            console.error('Error Deleting staff:', error);
        }
    };

    const actionOptions = [
        { value: 'edit', label: 'Edit / View' },
        { value: 'hold', label: 'Hold' },
        { value: 'delete', label: 'Delete' },
    ];

    const handleActionChange = (selectedOption) => {
        setSelectedAction(selectedOption);
    };

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

    const getClientLabel = (client) => {
        return `${client.first_name} ${client.last_name}`;
    };

    const getAssignedClients = async (id) => {
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

            setAssignedClients(assignedClients);
            setViewAssignedClients(!viewAssignedClients);
        } catch (error) {
            console.error('Error fetching assigned clients:', error);
        }
    };    

    const handleAssign = async (staffId) => {
        const assignData = { client_id: selectedAction.data.user_id, staff_id:staffId}
        
        try{
            const response = await axios.post(`${domain.domain}/staff-customer-assignments/assign`, assignData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(response.status === 200){
                showAlert({
                    title: 'Client Assigned Successfully!',
                    text: 'The selected client has been successfully assigned.',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                });
                fetchData()
            }
        }catch(error){
            console.log(error)
        }
    }


    return (
        <div className="d-flex">
            <Sidebar />
            <StaffListContainer>
                <H1>Staff</H1>
                <TableContainer className='shadow'>
                    <ClientsHeaderContainer>
                        <SearchBarContainer>
                            <SearchBar
                                type="text"
                                placeholder="Search client by name"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <SearchButton><BiSearch size={25} /></SearchButton>
                        </SearchBarContainer>
                        <div>
                            <label htmlFor="filterDropdown"><MdFilterList size={20} /></label>
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
                    <Container>
                        <Table>
                            <thead>
                                <tr>
                                    <Th>ID</Th>
                                    <Th>Name</Th>
                                    <Th>Email</Th>
                                    <Th>Phone</Th>
                                    <Th>Actions</Th>
                                    <Th>Assign Clients</Th>
                                    <Th>Assigned Clients</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {staffList.map((staff) => (
                                    <tr key={staff.user_id}>
                                        <Td>{staff.user_id}</Td>
                                        <Td>{staff.first_name}</Td>
                                        <Td>{staff.email_address}</Td>
                                        <Td>{staff.contact_number}</Td>
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
