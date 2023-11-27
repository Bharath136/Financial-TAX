import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import domain from '../../domain/domain';
import Sidebar from '../../userComponents/SideBar/sidebar';
import showAlert from '../../SweetAlert/sweetalert';
import pdf from '../../Assets/PDF_file_icon.svg.png'
import doc from '../../Assets/doc.png';
import docx from '../../Assets/docx.png'
import { ClientDocumentContainer, CtaSection, Description, DocumentTable, DocumentTableContainer, H1, Td, Th } from './styledComponents';

const ClientTaxDocuments = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');
    const [documents, setDocuments] = useState([]);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get(`${domain.domain}/customer-tax-document`, { headers: { Authorization: `Bearer ${accessToken}` } });
            setDocuments(response.data.documents);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const formatDateTime = (dateTimeString) => new Date(dateTimeString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const onChangeDocumentStatus = async (id, status) => {
        try {
            await axios.put(`${domain.domain}/customer-tax-document/review-status/${id}`, { user_id: user.user_id, review_status: status }, { headers: { Authorization: `Bearer ${accessToken}` } });
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

    const handleDownloadClick = async (document) => {
        try {
            const downloadUrl = `${domain.domain}/customer-tax-document/download/${document.document_id}`;
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await fetch(downloadUrl, { headers });
            const blob = await response.blob();

            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${document.document_id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const renderDocumentThumbnail = (document) => {
        const fileExtension = document.document_path.split('.').pop().toLowerCase();
        const fileTypeIcons = {
            pdf: <img src={pdf} alt='pdf' className='img-fluid' />,
            doc: <img src={doc} alt='pdf' className='img-fluid' />,
            docx: <img src={docx} alt='pdf' className='img-fluid' />,
            jpg: '🖼️',
            jpeg: '🖼️',
            png: '🖼️',
        };

        if (fileExtension in fileTypeIcons) {
            return (
                <div style={{ width: '50px', height: '50px', background: '#eee', textAlign: 'center', lineHeight: '50px' }}>
                    <span style={{ fontSize: '24px' }}>{fileTypeIcons[fileExtension]}</span>
                </div>
            );
        } else {
            // For unsupported types, you can display a generic icon or handle it differently
            return (
                <div style={{ width: '50px', height: '50px', background: '#eee', textAlign: 'center', lineHeight: '50px' }}>
                    📁
                </div>
            );
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <ClientDocumentContainer >
                <H1>Tax Documents</H1>
                <Description >
                    Welcome to our Tax Interview service! Download the tax notes below, fill in the required information, and upload the necessary tax documents to get started on your tax return process.
                </Description>
                <CtaSection className="shadow">
                    {documents.length > 0 && (
                        <DocumentTableContainer >
                            <H1>Uploaded Documents</H1>
                            <DocumentTable >
                                <thead>
                                    <tr>
                                        <Th>Document</Th>
                                        <Th>Date & Time</Th>
                                        <Th>Assigned Status</Th>
                                        <Th>Review Status</Th>
                                        <Th>Change Status</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((document) => (
                                        <tr key={document.document_id}>
                                            <Td>
                                                <a href={`${domain.domain}/customer-tax-document/download/${document.document_id}`} target="_blank" rel="noopener noreferrer" download onClick={(e) => handleDownloadClick(document)}>
                                                    {renderDocumentThumbnail(document)}
                                                </a>
                                            </Td>
                                            <Td>{formatDateTime(document.created_on)}</Td>
                                            <Td pending={document.assigned_status.toLowerCase() === 'pending'} assigned={document.assigned_status.toLowerCase() === 'assigned'} ><strong>{document.assigned_status}</strong></Td>
                                            <Td pending={document.review_status.toLowerCase() === 'pending'} rejected={document.review_status.toLowerCase() === 'rejected'} reviewed={document.review_status.toLowerCase() === 'reviewed'}>
                                                <strong>{document.review_status}</strong>
                                            </Td>
                                            <Td>
                                                <DropdownButton id={`dropdown-button-${document.document_id}`} title="Change" variant="warning">
                                                    {['Pending', 'Reviewed', 'Rejected'].map((statusOption) => (
                                                        <Dropdown.Item key={statusOption} onClick={() => onChangeDocumentStatus(document.document_id, statusOption)}>
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

export default ClientTaxDocuments;
