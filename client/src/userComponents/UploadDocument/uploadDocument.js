// import React, { useState } from 'react';
// import './uploadDocument.css';

// const UploadDocument = () => {
//     const [uploadedDocument, setUploadedDocument] = useState(null);

//     const handleFileChange = (e) => {
//         const file = e.target.files[0];

//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 const content = e.target.result;
//                 // Display the content in the console
//                 console.log(content);
//                 setUploadedDocument(content);
//             };
//             reader.readAsText(file);
//         }
//     };

//     return (
//         <div className="upload-document-container">
//             <h1>Upload Your Documents</h1>
//             <div className="upload-form">
//                 <div className="input-container">
//                     <input type="file" id="fileInput" accept=".pdf, .doc, .docx" onChange={handleFileChange} />
//                     <label htmlFor="fileInput">Choose a file</label>
//                 </div>
//                 <p>Supported file formats: PDF, Word Documents</p>
//                 <button className="upload-button">Upload</button>
//             </div>
//             <div className="instructions">
//                 <h2>Instructions:</h2>
//                 <ul>
//                     <li>Make sure your document is in PDF or Word format.</li>
//                     <li>Use a descriptive file name for your document.</li>
//                     <li>Ensure the document is accurate and complete.</li>
//                     <li>Double-check for any sensitive information before uploading.</li>
//                 </ul>
//             </div>
//             {/* {uploadedDocument && (
//                 <div className="uploaded-content">
//                     <h2>Uploaded Document Content:</h2>
//                     <pre>{uploadedDocument}</pre>
//                 </div>
//             )} */}
//         </div>
//     );
// };

// export default UploadDocument;

import React, { useState } from 'react';
import './uploadDocument.css';
import Sidebar from '../SideBar/sidebar';

const UploadDocument = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
    };

    const handleUpload = () => {
        // Implement your upload logic here, e.g., send the file to the server
        if (selectedFile) {
            console.log('Uploading file:', selectedFile);
            // You can use libraries like Axios or fetch to send the file to your server
        } else {
            console.log('No file selected for upload.');
        }
    };

    return (
        <div className='d-flex'>
            <Sidebar />
            <div className="upload-document-container" onDragOver={handleDragOver} onDrop={handleDrop}>
                <h1>Upload Document</h1>
                <p className='document-description'>
                    Welcome to our Upload Document service! Upload the necessary documents for your tax return process.
                </p>
                <div className='cta-section'>

                    <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                    <div
                        className='drag-drop-area'
                        onClick={() => document.querySelector('input[type="file"]').click()}
                    >
                        <p>Drag & Drop or Click to Upload</p>
                        <img src='https://www.computerhope.com/jargon/d/doc.png' alt="Document" className="document-image" />
                    </div>
                    <button className='btn upload-button ' onClick={handleUpload}>
                        Upload Documents
                    </button>
                    {selectedFile && (
                        <div className="selected-file">
                            Selected File: {selectedFile.name}
                            <button className="download-button">
                                {/* <a href="#" download="tax_notes.pdf">Download Tax Notes</a> */}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UploadDocument;
