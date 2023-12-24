// EditModal.js
import React from 'react';
import Modal from 'react-modal';
import UserProfile from '../userComponents/UserProfile/userProfile';
import './sweetPopup.css';

const EditModal = ({ isOpen, onRequestClose, profileId, handleOpenClick, isEditable, isCustomer }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit Modal"
            style={{
                content: {
                    width:'60%',
                    height: '74%',
                    margin: 'auto',
                    backgroundColor: '#ffffff',
                },
                overlay: {
                    backgroundColor: 'rgba(128, 128, 140, 0.75)',
                    backdropFilter: 'blur(3px)',
                },
            }}
        >
            <UserProfile profileId={profileId} isEditable={isEditable} isOpen={handleOpenClick} isCustomer={isCustomer} />
        </Modal>
    );
};

export default EditModal;
