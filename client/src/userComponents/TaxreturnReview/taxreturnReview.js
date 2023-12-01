import { useEffect, useState } from 'react';
import Sidebar from '../SideBar/sidebar'
import axios from 'axios';
import domain from '../../domain/domain';
import './taxreturnReview.css'
import {  CtaSection, DocumentTable, DocumentTableContainer, H1,  TaxDescription, Td, Th } from '../../staffComponents/TaxReturnDocument/styledComponents';
import { DocumentName } from '../../userComponents/CommentDocument/styledComponents';
import { DeleteButton } from '../../userComponents/UploadDocument/styledComponents';
import { MdDelete } from 'react-icons/md';
import pdf from '../../Assets/PDF_file_icon.svg.png'
import doc from '../../Assets/doc.png';
import docx from '../../Assets/docx.png'
import BreadCrumb from '../../breadCrumb/breadCrumb';

const TaxreturnReview = () => {
    const [documents, setDocuments] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');



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
    return (
        <div className='d-flex'>
            <Sidebar />
            <div className="my-taxreturn-container">
                <BreadCrumb />
                <H1>Taxreturn Review</H1>
                <TaxDescription className='tax-description'>
                    Welcome to our Tax Return service! Download the tax notes below, fill in the required information, and upload the necessary tax documents to get started on your tax return process.
                </TaxDescription>
                
                <CtaSection className='cta-section shadow'>
                    {documents.length > 0 && (
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
                                            {/* <Td style={{
                                                color:
                                                    document.review_status === 'Pending' ? 'orange' :
                                                        document.review_status === 'Rejected' ? 'red' :
                                                            document.review_status === 'Reviewed' ? 'green' :
                                                                'inherit'
                                            }}>
                                                <strong>{document.review_status}</strong>
                                            </Td> */}
                                            <Td>{document.created_by}</Td>

                                        </tr>
                                    ))}
                                </tbody>
                            </DocumentTable>
                        </DocumentTableContainer>
                    )}
                </CtaSection>
            </div>
        </div>
    )
}

export default TaxreturnReview