import { Link } from "react-router-dom";
import "./Navbar.css";


export default function Navbar(){

    return(

        <nav className="navbar">


            <div className="navbar-logo">

                <h1>
                    <Link to="/">FlexServ</Link>
                </h1>

            </div>



            <ul className="nav-links">

                <li>
                    <Link to="/">Home</Link>
                </li>

                <li>
                    <Link to="/services">Services</Link>
                </li>

                <li>
                    <Link to="/">Providers</Link>
                </li>

                <li>
                    <Link to="/">About</Link>
                </li>

            </ul>



            <div className="nav-buttons">

              <Link to="/login">
                <button className="nav-login-btn">
                    Login
                </button>
              </Link> 

            </div>

        </nav>

    );

}