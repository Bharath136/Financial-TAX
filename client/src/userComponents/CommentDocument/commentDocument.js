import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import BreadCrumb from '../../breadCrumb/breadCrumb';
import SweetLoading from '../../SweetLoading/SweetLoading';
import domain from '../../domain/domain';
import FailureComponent from '../../FailureComponent/failureComponent'

import pdfIcon from '../../Assets/PDF_file_icon.svg.png';
import docIcon from '../../Assets/doc.png';
import docxIcon from '../../Assets/docx.png';
import noDoc from '../../Assets/no-documents.png';

import showAlert from '../../SweetAlert/sweetalert';
import { MdDelete } from 'react-icons/md';
import { message } from '../../components/Footer/footer';


import {
    CommentDescription,
    CommentDocumentContainer,
    H1,
    CtaSection,
    DocumentsTableContainer,
    DocumentTableContainer,
    DocumentTable,
    CommentButton,
    ViewButton,
    CommentSectionContainer,
    CommentSection,
    CommentInputFieldsContainer,
    InputField,
    SendButton,
    ButtonContainer,
    TextArea,
    Button,
    Th,
    Td,
    DocumentName,
    EmptyDocumentContainer,
    Lable,
} from './styledComponents';

import formatDateTime from '../../FormatDateTime/DateTime';

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const CommentDocument = () => {
    const [documents, setDocuments] = useState([]);
    const [formData, setFormData] = useState({});
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState({});
    const [comments, setComments] = useState([]);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const [errorMsg, setErrorMsg] = useState(null);

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

        const fetchData = async () => {
            setApiStatus(apiStatusConstants.inProgress);
            setInterval(async () => {
                try {
                    const response = await axios.get(`${domain.domain}/customer-tax-document`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    const filteredData = response.data.documents.filter((doc) => doc.customer_id === user.user_id);

                    if (response.status === 200) {
                        setDocuments(filteredData);
                        setApiStatus(apiStatusConstants.success);
                    } else {
                        setApiStatus(apiStatusConstants.failure);
                    }
                } catch (error) {
                    setApiStatus(apiStatusConstants.failure);
                    setErrorMsg(error)
                }
            },1000)
        };

        fetchData();
    }, [accessToken]);

    const handleToggleCommentInput = (document) => {
        setShowCommentInput(!showCommentInput);
        setSelectedDocument(document);
    };

    const handleCommentSubmit = async () => {
        if (!formData.comment || !formData.financial_year) {
            setErrorMsg('Please fill in all required fields.');
            return;
        }

        try {
            setApiStatus(apiStatusConstants.inProgress);
            const token = localStorage.getItem('customerJwtToken');
            const newComment = {
                customer_id: user.user_id,
                staff_id: selectedDocument.assigned_staff,
                document_id: selectedDocument.document_id,
                comment: formData.comment,
                financial_year: formData.financial_year,
            };

            await axios.post(`${domain.domain}/customer-tax-comment/create`, newComment, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            handleGetComments(selectedDocument)

            setApiStatus(apiStatusConstants.success);
            showAlert({ title: 'Comment Submitted Successfully!', icon: 'success', confirmButtonText: 'Ok' });
        } catch (error) {
            console.error('Error submitting comment:', error);
        }

        setShowCommentInput(false);
    };

    const handleGetComments = async (document) => {
        setApiStatus(apiStatusConstants.inProgress);
        try {
            const token = localStorage.getItem('customerJwtToken');
            const response = await axios.get(`${domain.domain}/customer-tax-comment/get-comments/${document.document_id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.status === 200) {
                setComments(response.data);
                setShowComments(!showComments);
                setSelectedDocument(document);
                setApiStatus(apiStatusConstants.success);
                window.scrollTo(0, 0);
            } else {
                setApiStatus(apiStatusConstants.failure);
            }
        } catch (error) {
            console.error('Error getting comments:', error);
        }
    };

    const onDeleteDocumentComment = async (id) => {
        setApiStatus(apiStatusConstants.inProgress);
        try {
            const token = localStorage.getItem('customerJwtToken');

            await axios.delete(`${domain.domain}/customer-tax-comment/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            setApiStatus(apiStatusConstants.success);
            handleGetComments(selectedDocument);
            showAlert({ title: 'Comment Deleted Successfully!', icon: 'success', confirmButtonText: 'Ok' });
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const initialFormFields = [
        { label: 'Year', name: 'financial_year', type: 'number', placeholder: 'Ex:- 2023' },
    ];

    const handleDownloadClick = async (document) => {
        try {
            const downloadUrl = `${domain.domain}/customer-tax-document/download/${document.document_id}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const response = await fetch(downloadUrl, { headers });
            const blob = await response.blob();

            setApiStatus(apiStatusConstants.success);
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

        if (fileExtension in fileTypeIcons) {
            return <span style={{ fontSize: '24px' }}>{fileTypeIcons[fileExtension]}</span>;
        } else {
            return <span>📁</span>;
        }
    };

    const renderSuccess = () => {
        return(
            <CommentDocumentContainer>
                <BreadCrumb />
                <H1>Comment on Document</H1>
                <CommentDescription>
                    Welcome to our Comment Document service! Add comments to the documents for your tax return process.
                </CommentDescription>
            {documents.length > 0 ? <CtaSection className="shadow">
                <DocumentsTableContainer>
                    {documents.length > 0 && (
                        <DocumentTableContainer>
                            <H1>Documents with Comments</H1>
                            <DocumentTable>
                                <thead>
                                    <tr>
                                        <Th>Document</Th>
                                        <Th>Date</Th>
                                        <Th>Review Status</Th>
                                        <Th>Add Comment</Th>
                                        <Th>Comments</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((document) => (
                                        <tr key={document.document_id}>
                                            <Td>
                                                <div className="d-flex flex-column">
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
                                            <Td>{formatDateTime(document.created_on)}</Td>
                                            <Td
                                                style={{
                                                    color:
                                                        document.comment_status === 'Pending'
                                                            ? 'orange'
                                                            : document.comment_status === 'Rejected'
                                                                ? 'red'
                                                                : document.comment_status === 'Reviewed'
                                                                    ? 'green'
                                                                    : 'inherit',
                                                }}
                                            >
                                                <strong>{document.review_status}</strong>
                                            </Td>
                                            <Td>
                                                <CommentButton type="button" onClick={() => handleToggleCommentInput(document)}>
                                                    Comment
                                                </CommentButton>
                                            </Td>
                                            <Td>
                                                <ViewButton type="button" onClick={() => handleGetComments(document)} className="view-button button">
                                                    View
                                                </ViewButton>
                                            </Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </DocumentTable>
                        </DocumentTableContainer>
                    )}

                    {showCommentInput && selectedDocument && (
                        <CommentSectionContainer>
                            <Lable>
                                <strong>Comment for Document:</strong>{' '}
                                <strong style={{ color: `var(--accent-background)` }}>
                                    {documents.find((doc) => doc.document_id === selectedDocument.document_id)?.document_name}
                                </strong>
                            </Lable>
                            <CommentSection>
                                {initialFormFields.map((field, index) => (
                                    <CommentInputFieldsContainer key={index}>
                                        <Lable htmlFor={field.name}>
                                            <strong>{field.label}</strong>
                                        </Lable>
                                        <InputField
                                            type={field.type}
                                            id={field.name}
                                            placeholder={field.placeholder}
                                            name={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={handleChange}
                                            required
                                        />
                                    </CommentInputFieldsContainer>
                                ))}
                            </CommentSection>
                            <Lable>
                                <strong>Comment</strong>
                            </Lable>
                            <TextArea
                                id="commentInput"
                                rows={6}
                                value={formData.comment || ''}
                                placeholder="Write your comment to the document..."
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                required
                            />
                            {errorMsg && <p className='text-danger'>{errorMsg}</p>}
                            <ButtonContainer>
                                <SendButton
                                    type="button"
                                    onClick={handleCommentSubmit}
                                // disabled={!formData.comment?.trim()}
                                >
                                    Send Comment
                                </SendButton>

                            </ButtonContainer>
                        </CommentSectionContainer>
                    )}

                    {showComments && (
                        <DocumentTableContainer className="mt-4">
                            <Lable>
                                <strong>Comments for Document:</strong>{' '}
                                <strong style={{ color: `var(--accent-background)` }}> {selectedDocument.document_name}</strong>{' '}
                            </Lable>
                            {comments.length > 0 ? (
                                <DocumentTable>
                                    <thead>
                                        <tr>
                                            <Th>Document</Th>
                                            <Th>Comment</Th>
                                            <Th>Comment Status</Th>
                                            <Th>Created On</Th>
                                            <Th>Updated On</Th>
                                            <Th>Delete</Th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comments.map((comment) => (
                                            <tr key={comment.comment_id}>
                                                <Td>
                                                    <div className="d-flex flex-column">
                                                        <a
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
                                                <Td
                                                    style={{
                                                        color:
                                                            comment.comment_status === 'Pending'
                                                                ? 'orange'
                                                                : comment.comment_status === 'Rejected'
                                                                    ? 'red'
                                                                    : comment.comment_status === 'Reviewed'
                                                                        ? 'green'
                                                                        : 'inherit',
                                                    }}
                                                >
                                                    <strong>{comment.comment_status}</strong>
                                                </Td>
                                                <Td>{formatDateTime(comment.created_on)}</Td>
                                                <Td>{formatDateTime(comment.updated_on)}</Td>
                                                <Td>
                                                    <Button title="delete document" onClick={() => onDeleteDocumentComment(comment.comment_id)}>
                                                        <MdDelete size={25} className="text-danger" />
                                                    </Button>
                                                </Td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </DocumentTable>
                            ) : (
                                <p className="text-danger">No Comments to this document.</p>
                            )}
                        </DocumentTableContainer>
                    )}
                </DocumentsTableContainer>
            </CtaSection>:emptyDocumentsState()}
            {message}
            </CommentDocumentContainer>
        )
    }

    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <FailureComponent />;
            case apiStatusConstants.success:
                return renderSuccess();
            case apiStatusConstants.inProgress:
                return <SweetLoading />;

            default:
                return null;
        }
    };

    const emptyDocumentsState = () => (
        <EmptyDocumentContainer>
            <img src={noDoc} alt="Empty Documents State" />
            <H1>No Documents available</H1>
            <p>No tax documents available to add comment. Please upload your tax documents.</p>
        </EmptyDocumentContainer>
    );


    return (
        
            renderComponents()
    );
};

export default CommentDocument;
