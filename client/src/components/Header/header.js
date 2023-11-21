import 'bootstrap/dist/css/bootstrap.css';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { BiLogIn } from 'react-icons/bi';
import { BsThreeDotsVertical } from "react-icons/bs";
import './header.css';
import { useState } from 'react';
import AuthContext from '../../AuthContext/AuthContext';
import { CgProfile } from "react-icons/cg";
import EditModal from '../../SweetPopup/sweetPopup';

const Header = () => {
    const token = localStorage.getItem('customerJwtToken');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileId, setProfileId] = useState(null)
    const [navItemId, setNavItemId] = useState('1');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const handleChange = (id) => {
        setNavItemId(id);
    };

    const handleEditClick = (id) => {
        setProfileId(id)
        setIsEditModalOpen(!isEditModalOpen);
    };


    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    const navLinks = [
        { id: '1', to: '/', text: 'HOME' },
        { id: '2', to: '/about', text: 'ABOUT US' },
        { id: '3', to: '/services', text: 'SERVICES' },
        { id: '4', to: '/contact', text: 'CONTACT' },
    ];

    return (
        <AuthContext.Consumer>
            {(value) => {
                const { changeSidebar } = value;

                const toggleSidebar = () => {
                    changeSidebar();
                };

                return (<div>
                    <Navbar
                        fixed="top"
                        className="p-2 border"
                        expand="lg"
                        variant="light"
                        style={{ minHeight: '10vh', backgroundColor: 'white' }}
                    >
                        <div className="container-fluid">
                            <Navbar.Brand>
                                <NavLink to="/" className="nav-link">
                                    <div className="logo-text">
                                        <p className="m-0 p-0" style={{ fontSize: '34px' }}>
                                            TAX
                                        </p>
                                        <p className="m-0 p-0">Return</p>
                                    </div>
                                </NavLink>
                            </Navbar.Brand>
                            <button className='d-block d-md-none three-dots align-items-center' title='Close' onClick={toggleSidebar}>
                                <BsThreeDotsVertical size={24} />
                            </button>
                            <Navbar.Toggle aria-controls="navbarSupportedContent" id="navbar-toggle" className='d-none d-md-block d-lg-none' />
                            <Navbar.Collapse id="navbarSupportedContent" >
                                <div className="w-100 d-flex align-items-start justify-content-lg-end">
                                    <Nav className="ml-auto">
                                        {navLinks.map((link, index) => (
                                            <NavLink
                                                key={index}
                                                to={link.to}
                                                className="nav-link text-center"
                                                style={{
                                                    marginRight: '10px',
                                                    borderBottom: navItemId === link.to ? `3px solid var(--cc-baground)` : 'initial',
                                                    color: navItemId === link.to ? `var(--cc-main-text)` : `var(--cc-main-text)`,
                                                }}

                                                onClick={() => {
                                                    handleChange(link.id);
                                                }}
                                            >
                                                {link.text}
                                            </NavLink>
                                        ))}

                                        {token && <div className='d-flex align-items-center' onClick={() => handleEditClick(currentUser.user_id)} style={{ cursor: 'pointer' }}>
                                            <CgProfile size={24} title='Profile' style={{ cursor: 'pointer' }} className="m-2 d-flex align-items-center pl-2 pr-2 pt-0 pb-0" />
                                            <label style={{ cursor: 'pointer' }}>{currentUser.first_name}</label>
                                        </div>}

                                        {!token &&
                                            <NavLink to='/login' className="auth-button ml-2 d-flex align-items-center pl-2 pr-2 pt-0 pb-0">
                                                <BiLogIn /><span className="nav-span">Login</span>
                                            </NavLink>
                                        }
                                    </Nav>
                                </div>
                            </Navbar.Collapse>
                            {/* </div> */}
                        </div>



                        <EditModal
                            isOpen={isEditModalOpen}
                            onRequestClose={handleEditModalClose}
                            profileId={profileId}
                            isEditable={true}
                            handleOpenClick={handleEditClick}
                        />
                    </Navbar>
                </div>)
            }}
        </AuthContext.Consumer>
    );
};

export default Header;
