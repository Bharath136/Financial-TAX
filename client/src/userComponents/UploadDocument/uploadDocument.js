import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import formatDateTime from '../../FormatDateTime/DateTime';
import BreadCrumb from '../../breadCrumb/breadCrumb';
import domain from '../../domain/domain';
import { message } from '../../components/Footer/footer';
import showAlert from '../../SweetAlert/sweetalert';
import SweetLoading from '../../SweetLoading/SweetLoading';
import pdfIcon from '../../Assets/PDF_file_icon.svg.png';
import docIcon from '../../Assets/doc.png';
import docxIcon from '../../Assets/docx.png';

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
    Td,
    DocumentName,
    Label,
    Select
} from './styledComponents';

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}

const UploadDocument = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [data, setFormData] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (user.role === 'STAFF') {
                navigate('/staff/dashboard');
            }
        }
        fetchDocuments();
    }, [navigate]);

    const fetchDocuments = async () => {
        setApiStatus(apiStatusConstants.inProgress);
        setInterval(async () => {
            try {
                const response = await axios.get(`${domain.domain}/customer-tax-document`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });
                if (response.status === 200) {
                    const filteredData = response.data.documents.filter(document => document.customer_id === user.user_id);
                    setDocuments(filteredData);
                    setApiStatus(apiStatusConstants.success);
                }
            } catch (error) {
                setApiStatus(apiStatusConstants.failure);
                setErrorMsg(error)
            }
        },500)
    };

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
        if (!data.document_name || !data.document_type || !data.financial_year || !selectedFile) {
            setErrorMsg('Please fill in all required fields and select a file to upload.');
            return;
        }

        try {
            setApiStatus(apiStatusConstants.inProgress);
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('customer_id', user.user_id);
            formData.append('financial_year', data.financial_year);
            formData.append('document_name', data.document_name);
            formData.append('document_type', data.document_type);

            const res = await axios.post(`${domain.domain}/customer-tax-document/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                data: { customer_id: user.user_id }
            });

            if (res.status === 201) {
                setApiStatus(apiStatusConstants.success);
                showAlert({
                    title: 'Document Uploaded Successfully!',
                    text: 'The document has been uploaded successfully. You can now view or download the document.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                fetchDocuments();
            }

            setSelectedFile(null);
        } catch (error) {
            setApiStatus(apiStatusConstants.failure);
            setErrorMsg(error)
        }
    };

    const documentTypes = [
        { value: 'Personal Tax Notes', label: 'Personal Tax Notes' },
        // ... (other document types)
    ];

    const initialFormFields = [
        { label: 'Document Name', name: 'document_name', type: 'text', placeholder: 'Enter Document Name' },
        { label: 'Document Type', name: 'document_type', type: 'select', options: documentTypes, placeholder: 'Document Type' },
        { label: 'Year', name: 'financial_year', type: 'number', placeholder: 'Ex:- 2023' },
        // ... (other form fields)
    ];

    const handleDownloadClick = async (document) => {
        try {
            const downloadUrl = `${domain.domain}/customer-tax-document/download/${document.document_id}`;
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
            console.log(error)
        }
    };

    const renderDocumentThumbnail = (document) => {
        const fileExtension = document.document_path.split('.').pop().toLowerCase();
        const fileTypeIcons = {
            pdf: <img src={pdfIcon} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
            doc: <img src={docIcon} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
            docx: <img src={docxIcon} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
            jpg: '🖼️',
            jpeg: '🖼️',
            png: '🖼️',
        };

        return fileExtension in fileTypeIcons ? (
            <span style={{ fontSize: '24px' }}>{fileTypeIcons[fileExtension]}</span>
        ) : (
            <span>📁</span>
        );
    };

    const renderSuccess = () => {
        return(
            <TaxInterviewContainer onDragOver={handleDragOver} onDrop={handleDrop}>
                <BreadCrumb />
                <H1>Upload Tax Document</H1>
                <TaxDescription>
                    Welcome to our Tax Interview service! Download the tax notes below, fill in the required information, and upload the necessary tax documents to get started on your tax return process.
                </TaxDescription>
                <CtaSection className='shadow'>
                    <H1>Enter Tax Document Details Below</H1>
                    <Form onSubmit={handleFileUpload}>
                        <InputFieldsContainer className="row">
                            {initialFormFields.map((field, index) => (
                                <InputFieldsSubContainer className="col-lg-4 col-md-6 col-sm-12" key={index}>
                                    <Label htmlFor={field.name}>
                                        <strong>{field.label}</strong>
                                    </Label>
                                    {field.type === 'select' ? (
                                        <Select
                                            className="text-dark w-100"
                                            id={field.name}
                                            name={field.name}
                                            value={data[field.name] || ''}
                                            onChange={handleChange}
                                        >
                                            <option value="">{field.placeholder}</option>
                                            {field.options.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </Select>
                                    ) : (
                                        <InputField
                                            type={field.type}
                                            className="text-dark w-100"
                                            id={field.name}
                                            placeholder={field.placeholder}
                                            name={field.name}
                                            value={data[field.name] || ''}
                                            onChange={handleChange}
                                        />
                                    )}
                                </InputFieldsSubContainer>
                            ))}
                        </InputFieldsContainer>

                        <input type="file" onChange={handleFileChange} name='documents' style={{ display: 'none' }} />
                        <DragDropArea onClick={() => document.querySelector('input[type="file"]').click()}>
                            <p>Drag & Drop or Click to Upload</p>
                            <DocumentImage src='https://www.computerhope.com/jargon/d/doc.png' alt="Document" />
                        </DragDropArea>
                        {errorMsg && <p className='text-danger'>{errorMsg}</p>}
                        {selectedFile && (
                            <div style={{ backgroundColor: '#cdddf7', padding: "20px", marginBottom: '20px' }}>
                                <p className='m-0'>Selected File: {selectedFile.name}</p>
                            </div>
                        )}
                        <ButtonContainer>
                            <UploadButton type='submit'>Upload Tax Documents</UploadButton>
                        </ButtonContainer>
                    </Form>

                    {documents.length > 0 && (
                        <DocumentTableContainer>
                            <H1>Uploaded Documents</H1>
                            <DocumentTable>
                                <thead>
                                    <tr>
                                        <Th>Document</Th>
                                        <Th>Year</Th>
                                        <Th>Date</Th>
                                        <Th>Review Status</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((document) => (
                                        <tr key={document.document_id}>
                                            <Td>
                                                <div className='d-flex flex-column'>
                                                    <a
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
                                            <Td className={`status-${document.review_status.toLowerCase()}`}>
                                                <strong>{document.review_status}</strong>
                                            </Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </DocumentTable>
                        </DocumentTableContainer>
                    )}
                </CtaSection>
                {message}
            </TaxInterviewContainer>
        )
    }

    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <div>failure</div>;
            case apiStatusConstants.success:
                return renderSuccess();
            case apiStatusConstants.inProgress:
                return <SweetLoading />;
            default:
                return null;
        }
    };

    return (
        
            renderComponents()
           
    );
}

export default UploadDocument;
