// EditModal.js
import React from 'react';
import Modal from 'react-modal';
import EditProfile from './editProfile';

const EditPopup = ({ isOpen, onRequestClose, profileId, handleOpenClick, isEditable, isCustomer }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit Modal"
            style={{
                content: {
                    width: '30%',
                    height: '74%',
                    margin: 'auto',
                    backgroundImage: 'linear-gradient(to bottom, #fff, var(--main-background-shade))',
                },
                overlay: {
                    backgroundColor: 'rgba(128, 128, 140, 0.75)',
                    backdropFilter: 'blur(3px)',
                },
            }}
        >
            <EditProfile profileId={profileId} isEditable={isEditable} isOpen={handleOpenClick} isCustomer={isCustomer} />
        </Modal>
    );
};

export default EditPopup;
