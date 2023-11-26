import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import domain from '../../domain/domain';
import Sidebar from '../../userComponents/SideBar/sidebar';
import showAlert from '../../SweetAlert/sweetalert';
import { ClientDocumentContainer, CtaSection, Description, DocumentTable, DocumentTableContainer, H1, Td, Th } from './styledComponents';

const ClientDocuments = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');
    const [documents, setDocuments] = useState([]);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get(`${domain.domain}/customer-tax-document`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const filteredData = response.data.documents.filter(
                (document) => document.assigned_staff === user.user_id
            );
            setDocuments(filteredData);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const formatDateTime = (dateTimeString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        return new Date(dateTimeString).toLocaleString('en-US', options);
    };

    const onChangeDocumentStatus = async (id, status) => {
        try {
            await axios.put(
                `${domain.domain}/customer-tax-document/review-status/${id}`,
                { user_id: user.user_id, review_status: status },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            showAlert({
                title: 'Status Updated Successfully!',
                text: '',
                icon: 'success',
                confirmButtonText: 'Ok',
            });
            fetchDocuments();
        } catch (error) {
            console.error('Error updating document status:', error.message);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return (
        <div className="d-flex">
            <Sidebar />
            <ClientDocumentContainer >
                <H1>Tax Documents</H1>
                <Description >
                    Welcome to our Tax Interview service! Download the tax notes below, fill in
                    the required information, and upload the necessary tax documents to get
                    started on your tax return process.
                </Description>
                <CtaSection className="shadow">
                    {documents.length > 0 && (
                        <DocumentTableContainer className="document-table-container">
                            <H1>Uploaded Documents</H1>
                            <DocumentTable className="document-table">
                                <thead>
                                    <tr>
                                        <Th>Document Name</Th>
                                        <Th>Date & Time</Th>
                                        <Th>Assigned Status</Th>
                                        <Th>Review Status</Th>
                                        <Th>Change Status</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((document) => (
                                        <tr key={document.document_id}>
                                            <Td>{document.document_path}</Td>
                                            <Td>{formatDateTime(document.created_on)}</Td>
                                            <Td pending={document.assigned_status.toLowerCase() === 'pending'} assigned={document.assigned_status.toLowerCase() === 'assigned'}  ><strong>{document.assigned_status}</strong></Td>
                                            <Td pending={document.review_status.toLowerCase() === 'pending'} rejected={document.review_status.toLowerCase() === 'rejected'} reviewed={document.review_status.toLowerCase() === 'reviewed'}>
                                                <strong>{document.review_status}</strong>
                                            </Td>
                                            <Td>
                                                <DropdownButton
                                                    id={`dropdown-button-${document.document_id}`}
                                                    title="Change"
                                                    variant="warning"
                                                >
                                                    {['Pending', 'Reviewed', 'Rejected'].map((statusOption) => (
                                                        <Dropdown.Item
                                                            key={statusOption}
                                                            onClick={() => onChangeDocumentStatus(document.document_id, statusOption)}
                                                        >
                                                            {statusOption}
                                                        </Dropdown.Item>
                                                    ))}
                                                </DropdownButton>
                                            </Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </DocumentTable>
                        </DocumentTableContainer>
                    )}
                </CtaSection>
            </ClientDocumentContainer>
        </div>
    );
};

export default ClientDocuments;
