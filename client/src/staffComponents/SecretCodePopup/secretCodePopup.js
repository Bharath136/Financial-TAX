import React, { useState } from 'react';
import Modal from 'react-modal';
import { ViewButton } from '../AssignedClients/styledComponents';

const SecretCode = ({ isOpen, onRequestClose, onChangeAccess, myCode, team, selectedCard }) => {
    const [secretCode, setSecretCode] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const customStyles = {
        content: {
            width: '30vw',
            height: '22vh',
            margin: 'auto',
            backgroundColor: '#ffffff',
        },
        overlay: {
            backgroundColor: 'rgba(128, 128, 140, 0.75)',
            backdropFilter: 'blur(3px)',
        },
    };

    const handleSecretCodeChange = (event) => {
        setSecretCode(event.target.value);
        setErrorMsg('');
    };

    const handleSubmit = () => {
        if (secretCode === myCode) {
            onChangeAccess();
            onRequestClose();
        } else {
            setErrorMsg('Incorrect code. Please double-check and try again.');
        }
    };



    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit Modal"
            style={customStyles}
        >
            <div className="d-flex flex-column">
                <input
                    type="text"
                    className="p-2 text-dark"
                    style={{ border: '1px solid grey', borderRadius: '4px', outline: 'none' }}
                    placeholder="Enter Secret Code"
                    value={secretCode}
                    onChange={handleSecretCodeChange}
                    required
                />
                {errorMsg && <p className="text-danger m-0">{errorMsg}</p>}
                <div className="d-flex align-items-center justify-content-end mt-2">
                    <ViewButton onClick={handleSubmit} disabled={!secretCode.trim()}>
                        Submit
                    </ViewButton>
                </div>
            </div>
        </Modal>
    );
};

export default SecretCode;
