import 'bootstrap/dist/css/bootstrap.css';
import { Nav, Navbar } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { BiLogIn } from 'react-icons/bi';
import { HiBars3 } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
    BiSolidArrowToLeft,
    BiSolidArrowToRight,
} from 'react-icons/bi';
import './header.css';
import { useEffect, useState } from 'react';
import AuthContext from '../../AuthContext/AuthContext';

const Header = () => {
    const token = localStorage.getItem('customerJwtToken');
    const [navItemId, setNavItemId] = useState('1');

    const location = useLocation();

    useEffect(() => {
        setNavItemId(location.pathname);
    }, [location.pathname]);

    const handleChange = (id) => {
        setNavItemId(id);
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
                const { changeRole, hideSidebar, changeSidebar } = value;

                const toggleSidebar = () => {
                    changeSidebar();
                };

                return (<div>
                    <Navbar
                        fixed="top"
                        className="p-2"
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
                                <button className='d-block d-md-none three-dots' title='Close' onClick={toggleSidebar}>
                                <BsThreeDotsVertical size={25} />
                                </button>
                            <div className='d-none d-md-block'>
                                <Navbar.Toggle aria-controls="navbarSupportedContent" id="navbar-toggle" />
                                <Navbar.Collapse id="navbarSupportedContent">
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


                                            {!token &&
                                                <NavLink to='/login' className="auth-button ml-2 d-flex align-items-center pl-2 pr-2 pt-0 pb-0">
                                                    <BiLogIn /><span className="nav-span">Login</span>
                                                </NavLink>
                                            }

                                        </Nav>
                                    </div>
                                </Navbar.Collapse>
                            </div>
                        </div>
                    </Navbar>
                </div>)
            }}
        </AuthContext.Consumer>
    );
};

export default Header;
