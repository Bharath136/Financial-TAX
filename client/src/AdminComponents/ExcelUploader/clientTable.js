// ClientTable.js
import React from 'react';
import { MdDelete } from 'react-icons/md';
import { Th, Table, Td, ViewButton } from '../Clients/styledComponents';
import { FaCheck } from "react-icons/fa";

const ClientTable = ({ clients, onDeleteClient, handleEditClick, setProfileId }) => {
    return (
        <Table>
            <thead>
                <tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>Alt Phone</Th>
                    <Th>Actions</Th>
                    <Th>Delete</Th>
                </tr>
            </thead>
            <tbody>
                {clients.map((client) => (
                    <tr key={client.user_id}>
                        <Td>{client.user_id}</Td>
                        <Td>{client.first_name}</Td>
                        <Td>{client.email_address}</Td>
                        <Td>{client.contact_number}</Td>
                        <Td>{client.alt_contact_number}</Td>
                        <Td>
                            {client.status === 'registered' ? 
                                <div className='d-flex align-items-center justify-content-center'>
                                    <button className='btn bg-success text-light' disabled={true}>
                                        <FaCheck />
                                    </button>
                                </div>
                             :
                                <ViewButton onClick={() => { handleEditClick(); setProfileId(client.user_id); }}>
                                    Edit
                                </ViewButton>}
                        </Td>
                        <Td>
                            <div className="d-flex align-items-center justify-content-center">
                                <button
                                    type="button"
                                    onClick={() => onDeleteClient(client.user_id)}
                                    className="btn text-danger"
                                >
                                    <MdDelete size={25} />
                                </button>
                            </div>
                        </Td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default ClientTable;
