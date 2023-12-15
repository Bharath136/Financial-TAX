import React, { useState } from 'react';
import Modal from 'react-modal';
import { ViewButton } from '../AssignedClients/styledComponents';

const SecretCode = ({ isOpen, onRequestClose }) => {
    const [secretCode, setSecretCode] = useState('');

    const customStyles = {
        content: {
            width: '20%',
            height: '20%',
            margin: 'auto',
            backgroundColor: '#ffffff',
        },
        overlay: {
            backgroundColor: 'rgba(128, 128, 140, 0.75)', // Set your desired overlay color and transparency
            backdropFilter: 'blur(3px)', // Set the blur effect
        },
    };

    const handleSecretCodeChange = (event) => {
        setSecretCode(event.target.value);
    };

    const handleSubmit = () => {
        // Perform the action with the entered secret code
        // For example, you can send it to the server or perform any other logic
        console.log('Secret Code:', secretCode);

        // Close the modal
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit Modal"
            style={customStyles}
        >
            <div className='d-flex flex-column'>
                {/* Add a field for entering the secret code */}
                <input
                    type="text"
                    placeholder="Enter Secret Code"
                    value={secretCode}
                    onChange={handleSecretCodeChange}
                    className='form-control'
                    required
                />
                {/* Add a button to submit the secret code */}
                <div className='d-flex align-items-center justify-content-end mt-2'>
                    <ViewButton onClick={handleSubmit} disabled={!secretCode.trim()}>Submit</ViewButton>
                </div>
            </div>
        </Modal>
    );
};

export default SecretCode;
