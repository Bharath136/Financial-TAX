import React from 'react';
import LoadingOverlay from 'react-loading-overlay';
import Swal from 'sweetalert2';

const SweetLoading = ({ loading, setLoading }) => {
    const showSweetAlert = () => {
        Swal.fire({
            title: 'Loading...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            },
        });
    };

    const hideSweetAlert = () => {
        Swal.close();
    };

    return (
        <LoadingOverlay
            active={loading}
            spinner
            text="Loading..."
            onClick={() => setLoading(false)}
            styles={{
                wrapper: {
                    position: 'fixed',
                    height: '100vh',
                    width: '100vw',
                    top: 0,
                    left: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                },
                overlay: (base) => ({
                    ...base,
                    background: '#e8e8e8',
                }),
                content: (base) => ({
                    ...base,
                    color: 'var(--accent-background)',
                }),
                spinner: (base) => ({
                    ...base,
                    '& svg circle': {
                        stroke: 'var(--accent-background)', // Modify this line to change the spinner color
                    },
                }),
            }}
            className="your-custom-class"
            fadeSpeed={1000}
        >
            {loading && showSweetAlert()}
            <div>
                <h1>Your Content Here</h1>
            </div>
            {loading && hideSweetAlert()}
        </LoadingOverlay>
    );
};

export default SweetLoading;
