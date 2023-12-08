import { useEffect, useState } from 'react';
import Sidebar from '../SideBar/sidebar'
import axios from 'axios';
import domain from '../../domain/domain';
import './taxreturnReview.css'
import {  CtaSection, DocumentTable, DocumentTableContainer, H1,  TaxDescription, Td, Th } from '../../staffComponents/TaxReturnDocument/styledComponents';
import { DocumentName, EmptyDocumentContainer } from '../../userComponents/CommentDocument/styledComponents';
import pdf from '../../Assets/PDF_file_icon.svg.png'
import doc from '../../Assets/doc.png';
import docx from '../../Assets/docx.png'
import BreadCrumb from '../../breadCrumb/breadCrumb';
import { useNavigate } from 'react-router-dom';
import { message } from '../../components/Footer/footer';
import noDoc from '../../Assets/no-documents.jpg'

const TaxreturnReview = () => {
    const [documents, setDocuments] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');
    const user = JSON.parse(localStorage.getItem('currentUser'))

    const navigate = useNavigate()

    const fetchDocuments = async () => {
        // setApiStatus(apiStatusConstants.inProgress)
        try {
            const response = await axios.get(`${domain.domain}/tax-return-document`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            if (response.status === 200) {
                const filteredData = response.data.documents.filter(document => document.customer_id === currentUser.user_id);
                setDocuments(filteredData);
                // setApiStatus(apiStatusConstants.success)
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };


    useEffect(() => {
        if (user.role === 'ADMIN') {
            navigate('/admin-dashboard')
        } else if (user.role === 'STAFF') {
            navigate('/staff-dashboard')
        }
        fetchDocuments()
    }, [])




    const formatDateTime = (dateTimeString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return new Date(dateTimeString).toLocaleString('en-US', options);
    };


    const handleDownloadClick = async (document) => {
        // setApiStatus(apiStatusConstants.inProgress)
        try {
            const downloadUrl = `${domain.domain}/tax-return-document/download/${document.taxreturn_id}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await fetch(downloadUrl, { headers });
            const blob = await response.blob();

            // setApiStatus(apiStatusConstants.success)
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${document.taxreturn_id}.pdf`);
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

        return fileExtension in fileTypeIcons ? (
            <span style={{ fontSize: '24px' }}>{fileTypeIcons[fileExtension]}</span>
        ) : (
            <span>📁</span>
        );
    };

    const EmptyDocumentsState = () => (
        <EmptyDocumentContainer>
            <img src={noDoc} alt="Empty Documents State" />
            <H1>No Documents available</H1>
            <p>No tax documents available to add comment. Please wait for your tax return documents.</p>
        </EmptyDocumentContainer>
    );

    return (
        <div className='d-flex'>
            <Sidebar />
            <div className="my-taxreturn-container">
                <BreadCrumb />
                <H1>Taxreturn Review</H1>
                <TaxDescription className='tax-description'>
                    Welcome to our Tax Return service! Download the tax notes below, fill in the required information, and upload the necessary tax documents to get started on your tax return process.
                </TaxDescription>
                
                {documents.length > 0 ? (<CtaSection className='cta-section shadow'>
                    
                        <DocumentTableContainer>
                            <H1>Tax Return Documents</H1>
                            <DocumentTable>
                                <thead>
                                    <tr>
                                        <Th>Document</Th>
                                        <Th>Date & Time</Th>
                                        <Th>Payment Status</Th>
                                        <Th>Payment Amount</Th>
                                        <Th>Agent</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((document) => (
                                        <tr key={document.taxreturn_id}>
                                            <Td>
                                                <div className='d-flex flex-column'>
                                                    {/* <div className='d-flex align-items-center justify-content-center'> */}
                                                    <a
                                                        href={`${domain.domain}/tax-return-document/download/${document.taxreturn_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                        onClick={(e) => handleDownloadClick(document)}
                                                    >
                                                        {renderDocumentThumbnail(document)}
                                                    </a>
                                                    {/* <FaDownload size={25} />
                                                    </div> */}
                                                    <DocumentName>{document.document_path.split('-')[1]}</DocumentName>
                                                </div>

                                            </Td>
                                            <Td>{formatDateTime(document.created_on)}</Td>
                                            <Td style={{
                                                color:
                                                    document.payment_status === 'Pending' ? 'orange' :
                                                        document.payment_status === 'Rejected' ? 'red' :
                                                            document.payment_status === 'Paid' ? 'green' :
                                                                'inherit'
                                            }}><strong>{document.payment_status}</strong></Td>
                                            <Td>{document.payment_amount}</Td>
                                            <Td>{document.created_by}</Td>

                                        </tr>
                                    ))}
                                </tbody>
                            </DocumentTable>
                        </DocumentTableContainer>
                    
                </CtaSection>) : EmptyDocumentsState()}
                {message}
            </div>
        </div>
    )
}

export default TaxreturnReview