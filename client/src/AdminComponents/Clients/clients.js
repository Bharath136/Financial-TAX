import React, { useState, useEffect } from 'react';
import axios from 'axios';
import domain from '../../domain/domain';
import Sidebar from '../../userComponents/SideBar/sidebar';
import EditModal from '../../SweetPopup/sweetPopup';
import SweetLoading from '../../SweetLoading/SweetLoading';
import { BiSearch } from 'react-icons/bi';
import { MdFilterList } from 'react-icons/md';
import {
    ClientListContainer,
    ClientsHeaderContainer,
    FilterSelect,
    H1,
    SearchBar,
    SearchBarContainer,
    SearchButton,
    Table,
    TableContainer,
    Td,
    Th,
    ViewButton,
} from './styledComponents';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [assignmentClients, setAssignedClients] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileId, setProfileId] = useState(19);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setFilterType] = useState('');
    const token = localStorage.getItem('customerJwtToken');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

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

    const getAllAssignedClients = async () => {
        try {
            const assignedClientsResponse = await axios.get(`${domain.domain}/staff-customer-assignments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const assignedClients = assignedClientsResponse.data;
            setAssignedClients(assignedClients);
        } catch (error) {
            console.error('Error fetching assigned clients:', error);
        }
    };

    useEffect(() => {
        setLoading(true);

        getAllAssignedClients();

        const fetchClients = async () => {
            try {
                const response = await axios.get(`${domain.domain}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = response.data;

                // Filter users with role 'CUSTOMER'
                const filteredData = data.filter((user) => user.role === 'CUSTOMER');

                // Filter users by name
                const filteredDataByName = filteredData.filter((user) =>
                    user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
                );

                setClients(filteredDataByName); // Set the filtered data by name
                setFilteredClients(filteredDataByName)
                setLoading(false);
            } catch (error) {
                console.error('Error fetching clients:', error);
                setLoading(false);
            }
        };

        fetchClients();
    }, [token, searchTerm]);

    const handleEditClick = () => {
        setIsEditModalOpen(!isEditModalOpen);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <ClientListContainer>
                <H1>Clients</H1>
                {loading ? (
                    <SweetLoading loading={loading} setLoading={setLoading} />
                ) : (
                    <TableContainer className="shadow">
                        <ClientsHeaderContainer>
                            <SearchBarContainer>
                                <SearchBar
                                    type="text"
                                    placeholder="Search client by name"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="p-2 search-input"
                                />
                                <SearchButton>
                                    <BiSearch size={25} />
                                </SearchButton>
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
                )}
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
