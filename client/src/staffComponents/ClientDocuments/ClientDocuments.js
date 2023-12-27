import React, { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import domain from '../../domain/domain';
import showAlert from '../../SweetAlert/sweetalert';
import pdf from '../../Assets/PDF_file_icon.svg.png'
import doc from '../../Assets/doc.png';
import docx from '../../Assets/docx.png'
import { ClientDocumentContainer, CtaSection, Description, DocumentName, DocumentTable, DocumentTableContainer, H1, Lable, NoDocumentsContainer, Td, Th, ViewButton } from './styledComponents';
import SweetLoading from '../../SweetLoading/SweetLoading';
import noDocuments from '../../Assets/no-documents.jpg'
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { ClientTaxDocumentsHeaderContainer, ClientsHeaderContainer, Select } from '../../AdminComponents/ClientTaxDocuments/styledComponents';
import formatDateTime from '../../FormatDateTime/DateTime';

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const ClientDocuments = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');
    const [documents, setDocuments] = useState([]);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState({});
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [selectedClient, setSelectedClient] = useState('');
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [clients, setClients] = useState([]);

    const fetchDocuments = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const response = await axios.get(`${domain.domain}/customer-tax-document/get-assigned-client-documents`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (response.status === 200) {
                const filteredData = response.data.filter(
                    (document) => document.staff_id === user.user_id
                );
                setDocuments(filteredData);
                setFilteredDocuments(filteredData);
                setApiStatus(apiStatusConstants.success)
            }

        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    // Fetch clients from the server
    const fetchClients = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        const response = await axios.get(`${domain.domain}/user`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (response.status === 200) {
            const filteredClients = response.data.filter((client) => {
                return client.role === 'CUSTOMER';
            });
            setClients(filteredClients);
            setApiStatus(apiStatusConstants.success)
        }

    };

    const onChangeDocumentStatus = async (id, status) => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            await axios.put(
                `${domain.domain}/customer-tax-document/review-status/${id}`,
                { user_id: user.user_id, review_status: status },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setApiStatus(apiStatusConstants.success)
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

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard')
            } else if (user.role === 'CUSTOMER') {
                navigate('/user/dashboard')
            }
        }
        if(accessToken){
            fetchDocuments();
            fetchClients();
        }
    }, [navigate]);

    const handleDownloadClick = async (document) => {
        try {
            const downloadUrl = `http://localhost:8000/customer-tax-document/download/${document.document_id}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

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
            pdf: <img src={pdf} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
            doc: <img src={doc} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
            docx: <img src={docx} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
            jpg: '🖼️',
            jpeg: '🖼️',
            png: '🖼️',
        };

        // Check if the file extension is in the supported types
        if (fileExtension in fileTypeIcons) {
            return (
                <span style={{ fontSize: '24px' }}>{fileTypeIcons[fileExtension]}</span>
            );
        } else {
            return (
                <span>
                    📁
                </span>
            );
        }
    };

    const handleGetComments = async (document) => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const token = localStorage.getItem('customerJwtToken');
            const response = await axios.get(`${domain.domain}/customer-tax-comment/get-comments/${document.document_id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (response.status === 200) {
                setComments(response.data);
                setShowComments(!showComments)
                setSelectedDocument(document)
                setApiStatus(apiStatusConstants.success)
            } else {
                setApiStatus(apiStatusConstants.failure)
            }

        } catch (error) {
            console.error('Error getting comments:', error);
        }
    };

    const onDeleteDocumentComment = async (id) => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            await axios.delete(`${domain.domain}/customer-tax-comment/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            setApiStatus(apiStatusConstants.success)
            handleGetComments(selectedDocument);
            showAlert({ title: 'Comment Deleted Successfully!', icon: 'success', confirmButtonText: 'Ok' });
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const onChangeCommentStatus = async (id, statusOption) => {
        setApiStatus(apiStatusConstants.inProgress);
        try {
            const response = await axios.put(
                `${domain.domain}/customer-tax-comment/comment-status/${id}`,
                { comment_status: statusOption, staff_id: user.user_id }, // Corrected the object structure
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            if (response.status === 200) {
                setApiStatus(apiStatusConstants.success);
                handleGetComments(selectedDocument);
                showAlert({ title: 'Comment Status Updated Successfully!', icon: 'success', confirmButtonText: 'Ok' });
            } else {
                setApiStatus(apiStatusConstants.failure);
            }
        } catch (error) {
            console.error('Error updating comment status:', error);
            // You might want to handle the error more gracefully, e.g., setApiStatus(apiStatusConstants.error)
        }
    };

    // Handle client change for filtering documents
    const handleClientChange = async (e) => {
        setApiStatus(apiStatusConstants.inProgress)
        const id = e.target.value;
        setSelectedClient(id);
        try {
            const response = await axios.get(`${domain.domain}/customer-tax-document/get-assigned-client-documents/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (response.status === 200) {
                setFilteredDocuments(response.data);
                setApiStatus(apiStatusConstants.success)
            } else {
                setFilteredDocuments(documents);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };


    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <div>failure</div>
            case apiStatusConstants.success:
                return <CtaSection className="shadow">

                    <DocumentTableContainer className="document-table-container">
                        <ClientTaxDocumentsHeaderContainer>
                            <H1>Uploaded Documents</H1>
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
                        </ClientTaxDocumentsHeaderContainer>
                        <DocumentTable className="document-table">
                            <thead>
                                <tr>
                                    <Th>Document</Th>
                                    <Th>Year</Th>
                                    <Th>Date</Th>
                                    <Th>Review Status</Th>
                                    <Th>Change Status</Th>
                                    <Th>Comments</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocuments.map((document) => (

                                    <tr key={document.document_id}>
                                        <Td title='Download'>
                                            <div className='d-flex flex-column'> <a
                                                href={`${domain.domain}/customer-tax-document/download/${document.document_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                                onClick={(e) => handleDownloadClick(document)}
                                            >
                                                {renderDocumentThumbnail(document)}

                                            </a>
                                                <DocumentName>{document.document_path.split('-')[1]}</DocumentName>
                                            </div>
                                        </Td>
                                        <Td>{document.financial_year}</Td>
                                        <Td>{formatDateTime(document.created_on)}</Td>
                                        <Td style={{
                                            color:
                                                document.review_status === 'Pending' ? 'orange' :
                                                    document.review_status === 'Rejected' ? 'red' :
                                                        document.review_status === 'Reviewed' ? 'green' :
                                                            'inherit'
                                        }}>

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
                                        <Td><ViewButton type="button" onClick={() => handleGetComments(document)} className="view-button button">
                                            View
                                        </ViewButton></Td>
                                    </tr>
                                ))}
                            </tbody>
                        </DocumentTable>
                        {showComments && (
                            <DocumentTableContainer className='mt-4'>
                                <Lable><strong>Comments for Document:</strong> <strong style={{ color: `var(--accent-background)` }}> {selectedDocument.document_name}</strong> </Lable>
                                {comments.length > 0 ? <DocumentTable>
                                    <thead>
                                        <tr>
                                            <Th>Document</Th>
                                            <Th>Comment</Th>
                                            <Th>Comment Status</Th>
                                            <Th>Updated On</Th>
                                            <Th>Change status</Th>
                                            <Th>Delete</Th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comments.map((comment) => (
                                            <tr key={comment.comment_id}>
                                                <Td>
                                                    <div className='d-flex flex-column'> <a
                                                        href={`${domain.domain}/customer-tax-document/download/${selectedDocument.document_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                        onClick={(e) => handleDownloadClick(selectedDocument)}
                                                    >
                                                        {renderDocumentThumbnail(selectedDocument)}

                                                    </a>
                                                        <DocumentName>{selectedDocument.document_path.split('-')[1]}</DocumentName>
                                                    </div>
                                                </Td>
                                                <Td>{comment.comment}</Td>
                                                <Td style={{
                                                    color:
                                                        comment.comment_status === 'Pending' ? 'orange' :
                                                            comment.comment_status === 'Rejected' ? 'red' :
                                                                comment.comment_status === 'Reviewed' ? 'green' :
                                                                    'inherit'
                                                }}>
                                                    <strong>{comment.comment_status}</strong>
                                                </Td>
                                                <Td>{formatDateTime(comment.updated_on)}</Td>
                                                <Td>
                                                    <DropdownButton
                                                        id={`dropdown-button-${document.document_id}`}
                                                        title="Change"
                                                        variant="warning"
                                                    >
                                                        {['Pending', 'Reviewed', 'Rejected'].map((statusOption) => (
                                                            <Dropdown.Item
                                                                key={statusOption}
                                                                onClick={() => onChangeCommentStatus(comment.comment_id, statusOption)}
                                                            >
                                                                {statusOption}
                                                            </Dropdown.Item>
                                                        ))}
                                                    </DropdownButton>
                                                </Td>
                                                <Td>
                                                    <Button title="delete document" onClick={() => onDeleteDocumentComment(comment.comment_id)}>
                                                        <MdDelete size={25} className="text-danger" />
                                                    </Button>
                                                </Td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </DocumentTable> : <p className="text-danger">No Comments to this document.</p>}
                            </DocumentTableContainer>
                        )}
                    </DocumentTableContainer>
                </CtaSection>
            case apiStatusConstants.inProgress:
                return <SweetLoading />
            default:
                return null
        }
    }
    return (
        <ClientDocumentContainer >
            <H1>Tax Documents</H1>
            <Description >
                Welcome to our Tax Interview service! Download the tax notes below, fill in
                the required information, and upload the necessary tax documents to get
                started on your tax return process.
            </Description>
            {documents.length > 0 ? renderComponents() :
                <NoDocumentsContainer>
                    <img src={noDocuments} alt='img' className='img-fluid' />
                    <H1>No Clients Assigned</H1>
                    <p>Oops! It seems there are no clients assigned to you.</p>
                </NoDocumentsContainer>
            }
        </ClientDocumentContainer>
    );
};

export default ClientDocuments;
