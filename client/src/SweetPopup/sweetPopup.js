import React, { useEffect } from 'react';
import Modal from 'react-modal';
import UserProfile from '../userComponents/UserProfile/userProfile';

const EditModal = ({ isOpen, onRequestClose, profileId, handleOpenClick, isEditable }) => {

    const customStyles = {
        content: {
            width: '80%',
            height: '75%', 
            margin: 'auto',
            backgroundColor: '#ffffff'
        },
        overlay: {
            backgroundColor: 'rgba(128, 128, 140, 0.75)', // Set your desired overlay color and transparency
            backdropFilter: 'blur(3px)', // Set the blur effect
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            profileId={profileId}
            onRequestClose={onRequestClose}
            contentLabel="Edit Modal"
            style={ customStyles}
        >
            <UserProfile profileId={profileId} isEditable={isEditable} isOpen={handleOpenClick} />
        </Modal>
    );
};

export default EditModal;
