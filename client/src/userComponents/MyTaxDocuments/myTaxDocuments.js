import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditModal from '../../SweetPopup/sweetPopup';
import Sidebar from '../SideBar/sidebar';
import domain from '../../domain/domain';
import './myTaxDocuments.css';

const MyTaxDocuments = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [taxDocuments, setTaxDocuments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('customerJwtToken');
                // Fetch tax documents from the API
                const response = await axios.get(`${domain.domain}/customer-tax-document`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        // Add other headers if needed
                    },
                });
                const data = response.data; // Use response.data instead of response.dacuments
                setTaxDocuments(data.documents);
            } catch (error) {
                console.error('Error fetching tax documents:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures the effect runs only once on component mount

    const handleEditClick = (data) => {
        setSelectedData(data);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    const handleSave = async (editedData) => {
        try {
            const token = localStorage.getItem('customerJwtToken');
            const response = await axios.put(`${domain.domain}/user/${editedData.id}`, editedData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('Successfully updated data:', response.data);
        } catch (error) {
            console.error('Error updating data:', error);
        }

        setIsEditModalOpen(false);
    };

    return (
        <div className='d-flex'>
            <Sidebar />
            <div className="my-tax-documents-container">
                <h3>Documents</h3>
                {taxDocuments.map(document => (
                    <div key={document.document_id}>
                        {/* Render your document data */}
                        <button onClick={() => handleEditClick(document)}>
                            Edit
                        </button>
                    </div>
                ))}

                <EditModal
                    isOpen={isEditModalOpen}
                    onRequestClose={handleEditModalClose}
                    onSave={handleSave}
                    inputData={selectedData}
                />
            </div>
        </div>
    );
}

export default MyTaxDocuments;
