import { faChartLine, faRightFromBracket, faStore } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../live-selling-logo.png'

function NavBar() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const logout = () => {
        sessionStorage.clear();
    }

    return (

        <nav className="navbar navbar-expand sticky-top navbar-dark bg-dark">
            <div className="navbar-nav mr-auto">
                <li className="nav-item"><Link to={"/home"} className="nav-link"><img style={{ height: '30px' }} src={logo} alt="logo"/></Link></li>
                {
                    !user ? null :
                        <>
                            {
                                user.isVerified === false ? null :
                                    <>
                                        <li className="nav-item"><Link to={"/dashboard"} className="nav-link"><FontAwesomeIcon icon={faChartLine} /> Dashboard</Link></li>
                                        <li className="nav-item"><Link to={"/mystore"} className="nav-link"><FontAwesomeIcon icon={faStore} /> My Store</Link></li>
                                    </>
                            }
                            <li className="nav-item"><Link onClick={logout} to={"/home"} className="nav-link"><FontAwesomeIcon icon={faRightFromBracket} /> Logout {user.firstName}</Link></li>
                        </>
                }
            </div>
        </nav>

    );
}

export default NavBar; 