// DocumentTable.js
import React from 'react';
import { DocumentName, DocumentTable, Td, Th } from './styledComponents';
import domain from '../../domain/domain';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const DocumentTableComponent = ({ onDeleteDocument, documents, formatDateTime, handleDownloadClick, onChangeDocumentStatus, renderDocumentThumbnail }) => (
    <DocumentTable>
        <thead>
            <tr>
                <Th>Document</Th>
                <Th>Financial Year</Th>
                <Th>Date</Th>
                <Th>Review Status</Th>
                <Th>Change Status</Th>
                <Th>Delete</Th>
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
                    <Td style={{
                        color:
                            document.review_status === 'Pending' ? 'orange' :
                                document.review_status === 'Rejected' ? 'red' :
                                    document.review_status === 'Reviewed' ? 'green' :
                                        'inherit'
                    }}><strong>{document.review_status}</strong>
                    </Td>
                    <Td>
                        <div className='d-flex align-items-center justify-content-center'>
                            <DropdownButton id={`dropdown-button-${document.document_id}`} className='btn bg-warning' title="Change" variant="warning">
                                {['Pending', 'Reviewed', 'Rejected'].map((statusOption) => (
                                    <Dropdown.Item key={statusOption} onClick={() => onChangeDocumentStatus(document.document_id, statusOption)}>
                                        {statusOption}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </div>
                    </Td>
                    <Td>
                        <div className='d-flex justify-content-center align-items-center'>
                            <button type='button' className='btn text-danger' onClick={() => onDeleteDocument(document.document_id)}>Delete</button>
                        </div>
                    </Td>
                </tr>
            ))}
        </tbody>
    </DocumentTable>
);

export default DocumentTableComponent;
