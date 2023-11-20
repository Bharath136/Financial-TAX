import Swal from 'sweetalert2';

const showAlert = ({ title, text, icon, confirmButtonText, cancelButtonText }) => {
    Swal.fire({
        title,
        text,
        icon,
        confirmButtonText,
        cancelButtonText
    });
};

export default showAlert