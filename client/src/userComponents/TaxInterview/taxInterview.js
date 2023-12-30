import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import BreadCrumb from '../../breadCrumb/breadCrumb';
import { message } from '../../components/Footer/footer';
import SweetLoading from '../../SweetLoading/SweetLoading';

import domain from '../../domain/domain';
import formatDateTime from '../../FormatDateTime/DateTime';

import {
    CtaSection,
    DocumentName,
    DocumentTable,
    DocumentTableContainer,
    H1,
    TaxDescription,
    TaxInterviewContainer,
    Th,
    Td
} from './styledComponents';

import doc from '../../Assets/doc.png';
import docx from '../../Assets/docx.png';
import noDoc from '../../Assets/no-documents.png';
import pdf from '../../Assets/PDF_file_icon.svg.png';
import { EmptyDocumentContainer } from '../CommentDocument/styledComponents';
import FailureComponent from '../../FailureComponent/failureComponent';
import { getToken, getUserData } from '../../StorageMechanism/storageMechanism';


const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}

const TaxInterview = () => {
    const [documents, setDocuments] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const [showFooter, setShowFooter] = useState(false)
    const user = getUserData()
    const accessToken = getToken()

    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard')
            } else if (user.role === 'STAFF') {
                navigate('/staff/dashboard')
            }
        }
        fetchDocuments();
    }, [navigate]);

    const fetchDocuments = async () => {
        setApiStatus(apiStatusConstants.inProgress);

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
                setShowFooter(true);
            }
        } catch (error) {
            setApiStatus(apiStatusConstants.failure);
            setErrorMsg(error || 'An unexpected error occurred. Please try again later.');
        }
    };


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
            pdf: <img src={pdf} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
            doc: <img src={doc} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
            docx: <img src={docx} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
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
            <TaxInterviewContainer >
                <BreadCrumb />
                <H1>Tax Interview</H1>
                <TaxDescription>
                    Welcome to our Tax Interview service! Download the tax notes below, and upload the necessary tax documents to get started on your tax return process.
                </TaxDescription>
                {documents.length > 0 ? <CtaSection className='shadow'>
                {documents.length > 0 && (
                    <DocumentTableContainer>
                        <H1>Your Tax Notes Documents</H1>
                        <DocumentTable>
                            <thead>
                                <tr>
                                    <Th>Document</Th>
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
                </CtaSection> : EmptyDocumentsState()}
                {showFooter && message}
            </TaxInterviewContainer>
        )
    }

    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <FailureComponent errorMsg={errorMsg} />;
            case apiStatusConstants.success:
                return renderSuccess();
            case apiStatusConstants.inProgress:
                return <SweetLoading />
            default:
                return null
        }
    }

    const EmptyDocumentsState = () => (
        <EmptyDocumentContainer>
            <img src={noDoc} alt="Empty Documents State" />
            <H1>No Documents available</H1>
            <p>No tax documents notes available. Please wait for agent reply.</p>
        </EmptyDocumentContainer>
    );

    return (
        renderComponents()
    );
}

export default TaxInterview;
