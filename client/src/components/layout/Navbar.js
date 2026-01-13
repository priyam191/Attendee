import React from 'react'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './home.css';


function Navbar() {

    const { authenticated, role, logout, user } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
    };


  return (
        <nav className='navbar'>
            <div className='navbar-brand'>
                <Link to="/">
                    Attendee            
                </Link>
            </div>

            <ul className='navbar-links'>
                {!authenticated ? (
                    <>
                        <li className='nav-item'>
                            <Link to="/"> Home </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to="/login"> Login </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li className='nav-item'>
                            <Link to= {role ==='student' ? '/student/dashboard' : '/teacher/dashboard'}>
                                Dashboard
                            </Link>
                        </li>
                        <li className="navbar-item user-info">
                            {user.name}
                            <span className="user-role"> {role} </span>
                        </li>


                        <li className='nav-item'>
                            <button onClick={handleLogout}> Logout </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar