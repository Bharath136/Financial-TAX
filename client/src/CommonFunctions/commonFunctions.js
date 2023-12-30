import { getToken } from "../StorageMechanism/storageMechanism";
import domain from "../domain/domain";
import pdfIcon from '../Assets/PDF_file_icon.svg.png';
import docIcon from '../Assets/doc.png';
import docxIcon from '../Assets/docx.png';

const accessToken = getToken();

export const handleDownloadClick = async (document) => {
    try {
        const downloadUrl = `${domain.domain}/customer-tax-document/download/${document.document_id}`;
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };
        const response = await fetch(downloadUrl, { headers });
        const blob = await response.blob();

        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${document.document_id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (error) {
        console.log(error)
    }
};


export const renderDocumentThumbnail = (document) => {
    const fileExtension = document.document_path.split('.').pop().toLowerCase();
    const fileTypeIcons = {
        pdf: <img src={pdfIcon} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
        doc: <img src={docIcon} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
        docx: <img src={docxIcon} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
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
