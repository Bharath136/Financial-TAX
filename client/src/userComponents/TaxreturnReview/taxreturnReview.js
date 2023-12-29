import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import BreadCrumb from '../../breadCrumb/breadCrumb';
import domain from '../../domain/domain';
import { message } from '../../components/Footer/footer';

import pdfIcon from '../../Assets/PDF_file_icon.svg.png';
import docIcon from '../../Assets/doc.png';
import docxIcon from '../../Assets/docx.png';
import noDocIcon from '../../Assets/no-documents.png';

import {
    DocumentName,
    EmptyDocumentContainer,
    ViewButton
} from '../../userComponents/CommentDocument/styledComponents';

import {
    CtaSection,
    DocumentTable,
    DocumentTableContainer,
    H1,
    TaxDescription,
    TaxDocumentContainer,
    Td,
    Th
} from './styledComponents';

import formatDateTime from '../../FormatDateTime/DateTime';
import SweetLoading from '../../SweetLoading/SweetLoading';
import FailureComponent from '../../FailureComponent/failureComponent';


const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}

const TaxreturnReview = () => {
    
    const [documents, setDocuments] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const navigate = useNavigate();

    const fetchDocuments = async () => {
        setApiStatus(apiStatusConstants.inProgress);
        setInterval(async () => {
            try {
                const accessToken = localStorage.getItem('customerJwtToken');
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                const response = await axios.get(`${domain.domain}/tax-return-document`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (response.status === 200) {
                    const filteredData = response.data.documents.filter(document => document.customer_id === currentUser.user_id);
                    setDocuments(filteredData);
                    setApiStatus(apiStatusConstants.success);
                }
            } catch (error) {
                setApiStatus(apiStatusConstants.failure);
                setErrorMsg(error)
            }
        },500)
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (user.role === 'STAFF') {
                navigate('/staff/dashboard');
            }
        }
        fetchDocuments();
    }, []);

    const handleDownloadClick = async (document) => {
        setApiStatus(apiStatusConstants.inProgress);
        try {
            const accessToken = localStorage.getItem('customerJwtToken');
            const downloadUrl = `${domain.domain}/tax-return-document/download/${document.taxreturn_id}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await fetch(downloadUrl, { headers });
            const blob = await response.blob();

            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${document.taxreturn_id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setApiStatus(apiStatusConstants.success);
        } catch (error) {
            setApiStatus(apiStatusConstants.failure);
            setErrorMsg(error)
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

    const EmptyDocumentsState = () => (
        <EmptyDocumentContainer>
            <img src={noDocIcon} alt="Empty Documents State" />
            <H1>No Documents available</H1>
            <p>No tax documents available to add comment. Please wait for your tax return documents.</p>
        </EmptyDocumentContainer>
    );

    const renderDocuments = () => {
        return(
            <TaxDocumentContainer>
                <BreadCrumb />
                <H1>Taxreturn Review</H1>
                <TaxDescription>
                    Welcome to our Tax Return service! Download the tax notes below, fill in the required information, and upload the necessary tax documents to get started on your tax return process.
                </TaxDescription>

                {documents.length > 0 ? (
                    <CtaSection className='cta-section shadow'>
                        <DocumentTableContainer>
                            <H1>Tax Return Documents</H1>
                            <DocumentTable>
                                <thead>
                                    <tr>
                                        <Th>Document ID</Th>
                                        <Th>Document</Th>
                                        <Th>Date & Time</Th>
                                        <Th>Payment Status</Th>
                                        <Th>Payment Amount</Th>
                                        <Th>Staff</Th>
                                        <Th>Amount</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((document) => (
                                        <tr key={document.taxreturn_id}>
                                            <Td>{document.taxreturn_id}</Td>
                                            <Td>
                                                <div className='d-flex flex-column'>
                                                    <a
                                                        href={`${domain.domain}/tax-return-document/download/${document.taxreturn_id}`}
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
                                                        document.payment_status === 'Pending' ? 'orange' :
                                                            document.payment_status === 'Rejected' ? 'red' :
                                                                document.payment_status === 'Paid' ? 'green' :
                                                                    'inherit'
                                                }}
                                            >
                                                <strong>{document.payment_status}</strong>
                                            </Td>
                                            <Td>{document.payment_amount}</Td>
                                            <Td>{document.created_by}</Td>
                                            <Td>
                                                {document.payment_status === 'Paid' ?
                                                    <button disabled={true} title='Payment completed'>
                                                        Payment completed
                                                    </button>
                                                    :
                                                    <Link style={{ textDecoration: 'none' }} to={`/user/make-payment/${document.taxreturn_id}`}>
                                                        <ViewButton title='Pay Now'>
                                                            Pay Now
                                                        </ViewButton>
                                                    </Link>}
                                            </Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </DocumentTable>
                        </DocumentTableContainer>
                    </CtaSection>
                ) : (
                    EmptyDocumentsState()
                )}
                {message}
            </TaxDocumentContainer>
        )
    }


    const onRenderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return <SweetLoading />;
            case apiStatusConstants.success:
                return renderDocuments();
            case apiStatusConstants.failure:
                return <FailureComponent errorMsg={errorMsg} />;
            default:
                return null;
        }
    }

    return (
        onRenderComponents()
    );
};

export default TaxreturnReview;
