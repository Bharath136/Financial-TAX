import React, { useState } from 'react';
import axios from 'axios';
import domain from '../../domain/domain';
// import { MdDelete } from 'react-icons/md';
import Sidebar from '../../userComponents/SideBar/sidebar';
import { ButtonContainer, CtaSection, DocumentImage, DragDropArea, Form, H1, InputField, InputFieldsContainer, InputFieldsSubContainer, TaxDescription, TaxDocumentContainer, UploadButton } from './styledComponents';

const TaxReturnDocument = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

    const handleUpload = async (e) => {
        e.preventDefault();

        try {
            if (!selectedFile) {
                setErrorMsg('Please select a file to upload.');
                return;
            }

            formData.append('file', selectedFile);

            console.log(formData);

            const response = await axios.post(`${domain.domain}/customer-tax-document/upload`, { file: selectedFile });

            console.log(response)
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

    return (
        <div className='d-flex'>
            <Sidebar />
            <TaxDocumentContainer className="tax-interview-container" onDragOver={handleDragOver} onDrop={handleDrop}>
                <H1>Upload Tax Return Document</H1>
                <TaxDescription className='tax-description'>
                    Welcome to our Tax Return service! Download the tax notes below, fill in the required information, and upload the necessary tax documents to get started on your tax return process.
                </TaxDescription>
                <CtaSection className='cta-section shadow'>
                    <H1>Enter Tax Return Document Details Below</H1>
                    <Form onSubmit={handleUpload} encType="multipart/form-data" >
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
                                        value={formData[field.name] || ''}
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
                        <ButtonContainer className='w-100 text-center'>
                            <UploadButton type='submit'>
                                Upload Documents
                            </UploadButton>
                        </ButtonContainer>
                    </Form>

                    {/* {documents.length > 0 &&
                        <div className="document-table-container">
                            <h4 className='text-dark'>Uploaded Tax Return Documents</h4>
                            <table className="document-table">
                                <thead>
                                    <tr>
                                        <th>Document Name</th>
                                        <th>Date & Time</th>
                                        <th>Assigned Status</th>
                                        <th>Review Status</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((document) => (
                                        <tr key={document.document_id}>
                                            <td>{document.document_path}</td>
                                            <td>{formatDateTime(document.created_on)}</td>
                                            <td className={`status-${document.assigned_status.toLowerCase()}`}><strong>{document.assigned_status}</strong></td>
                                            <td className={`status-${document.review_status.toLowerCase()}`}><strong>{document.review_status}</strong></td>
                                            <td>
                                                <button className='btn btn-light ml-2' title='delete document' onClick={() => {
                                                    onDeleteDocument(document.document_id)
                                                }}>{<MdDelete size={25} className='text-danger' />}</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    } */}
                </CtaSection>
            </TaxDocumentContainer>
        </div>
    );
}

export default TaxReturnDocument;
