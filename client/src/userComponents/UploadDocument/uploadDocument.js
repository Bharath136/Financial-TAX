import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';
import Sidebar from '../SideBar/sidebar';
import domain from '../../domain/domain';
import pdf from '../../Assets/PDF_file_icon.svg.png'
import doc from '../../Assets/doc.png';
import docx from '../../Assets/docx.png'
import {
    TaxInterviewContainer,
    H1,
    TaxDescription,
    CtaSection,
    InputFieldsContainer,
    InputFieldsSubContainer,
    InputField,
    UploadButton,
    DragDropArea,
    ButtonContainer,
    DocumentImage,
    DocumentTableContainer,
    DocumentTable,
    Form,
    Th,
    Td
} from './styledComponents';
import showAlert from '../../SweetAlert/sweetalert';

const UploadDocument = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [data, setFormData] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);
    const [documents, setDocuments] = useState([]);
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get(`${domain.domain}/customer-tax-document`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });
                const filteredData = response.data.documents.filter(document => document.customer_id === user.user_id);
                setDocuments(filteredData);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();
    }, [user.user_id, accessToken]);

    const handleChange = (e) => {
        setFormData({ ...data, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();

        try {
            if (!selectedFile) {
                setErrorMsg('Please select a file to upload.');
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('customer_id', user.user_id);
            formData.append('financial_year', data.financial_year)
            formData.append('financial_month', data.financial_month)
            formData.append('financial_quarter', data.financial_quarter)

            const res = await axios.post(`${domain.domain}/customer-tax-document/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                data: { customer_id: user.user_id }
            });
            if(res.status === 201){
                showAlert({
                    title: 'Document Uploaded Successfully!',
                    text: 'The document has been uploaded successfully. You can now view or download the document.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            }
            setSelectedFile(null);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const initialFormFields = [
        { label: 'Year', name: 'financial_year', type: 'number', placeholder: 'Ex:- 2023' },
        { label: 'Month', name: 'financial_month', type: 'number', placeholder: 'Ex:- 5' },
        { label: 'Quarter', name: 'financial_quarter', type: 'number', placeholder: 'Ex:- 1' }
    ];

    const formatDateTime = (dateTimeString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return new Date(dateTimeString).toLocaleString('en-US', options);
    };

    const onDeleteDocument = async (id) => {
        const result = window.confirm("Are you sure you want to delete this document?");
        if (result) {
            try {
                await axios.delete(`${domain.domain}/customer-tax-document/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setDocuments((prevDocuments) => prevDocuments.filter(document => document.document_id !== id));
            } catch (error) {
                console.error('Error deleting document:', error.message);
            }
        }
    };


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

    // Function to render a document thumbnail based on the document type
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

        // Check if the file extension is in the supported types
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
        <div className='d-flex'>
            <Sidebar />
            <TaxInterviewContainer onDragOver={handleDragOver} onDrop={handleDrop}>
                <H1>Upload Tax Document</H1>
                <TaxDescription>
                    Welcome to our Tax Interview service! Download the tax notes below, fill in the required information, and upload the necessary tax documents to get started on your tax return process.
                </TaxDescription>
                <CtaSection className='shadow'>
                    <H1>Enter Tax Document Details Below</H1>
                    <Form onSubmit={handleFileUpload}>
                        <InputFieldsContainer>
                            {initialFormFields.map((field, index) => (
                                <InputFieldsSubContainer className='w-100' key={index}>
                                    <label htmlFor={field.name} >
                                        <strong>{field.label}</strong>
                                    </label>
                                    <InputField
                                        type={field.type}
                                        className="text-dark w-100"
                                        id={field.name}
                                        placeholder={field.placeholder}
                                        name={field.name}
                                        value={data[field.name] || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </InputFieldsSubContainer>
                            ))}
                        </InputFieldsContainer>
                        <input type="file" onChange={handleFileChange} name='documents' style={{ display: 'none' }} />
                        <DragDropArea
                            onClick={() => document.querySelector('input[type="file"]').click()}
                        >
                            <p>Drag & Drop or Click to Upload</p>
                            <DocumentImage src='https://www.computerhope.com/jargon/d/doc.png' alt="Document" />
                        </DragDropArea>
                        {errorMsg && <p className='text-danger'>{errorMsg}</p>}
                        <ButtonContainer>
                            <UploadButton type='submit'>
                                Upload Tax Documents
                            </UploadButton>
                        </ButtonContainer>
                    </Form>

                    {documents.length > 0 &&
                        <DocumentTableContainer >
                            <H1 >Uploaded Documents</H1>
                            <DocumentTable>
                                <thead>
                                    <tr>
                                        <Th>Document</Th>
                                        <Th>Date & Time</Th>
                                        <Th>Assigned Status</Th>
                                        <Th>Review Status</Th>
                                        <Th>Delete</Th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {documents.map((document) => (
                                        <tr key={document.document_id}>
                                            <Td>
                                                <a
                                                    href={`${domain.domain}/customer-tax-document/download/${document.document_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download
                                                    onClick={(e) => handleDownloadClick(document)}
                                                >
                                                    {renderDocumentThumbnail(document)}
                                                </a>
                                            </Td>
                                            <Td>{formatDateTime(document.created_on)}</Td>
                                            <Td className={`status-${document.assigned_status.toLowerCase()}`}>
                                                <strong>{document.assigned_status}</strong>
                                            </Td>
                                            <Td className={`status-${document.review_status.toLowerCase()}`}>
                                                <strong>{document.review_status}</strong>
                                            </Td>
                                            <Td>
                                                <button className='btn btn-light' title='delete document' onClick={() => onDeleteDocument(document.document_id)}>
                                                    {<MdDelete size={25} className='text-danger' />}
                                                </button>
                                            </Td>
                                        </tr>
                                    ))}

                                </tbody>
                            </DocumentTable>
                        </DocumentTableContainer>
                    }
                </CtaSection>
            </TaxInterviewContainer>
        </div>
    );
}

export default UploadDocument;


