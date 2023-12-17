// ClientTaxDocumentHeader.js
import React from 'react';
import { ClientsHeaderContainer, H1, Select } from './styledComponents';

const ClientTaxDocumentHeader = ({ clients, selectedClient, handleClientChange }) => (
    <ClientsHeaderContainer>
        <label><strong>Filter by client</strong></label>
        <Select
            id="clientSelect"
            name="clientSelect"
            value={selectedClient}
            onChange={handleClientChange}
            required
        >
            <option value="">All clients</option>
            {clients.map(client => (
                <option key={client.user_id} value={client.user_id}>
                    {client.first_name}
                </option>
            ))}
        </Select>
    </ClientsHeaderContainer>
);

export default ClientTaxDocumentHeader;
