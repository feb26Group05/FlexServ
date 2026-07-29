import "./Navbar.css";


export default function Navbar(){

    return(

        <nav className="navbar">


            <div className="navbar-logo">

                <h1>
                    FlexServ
                </h1>

            </div>



            <ul className="nav-links">

                <li>
                    Home
                </li>

                <li>
                    Services
                </li>

                <li>
                    Providers
                </li>

                <li>
                    About
                </li>

            </ul>



            <div className="nav-buttons">


                {/* <button className="partner-btn">

                    Become Partner

                </button> */}


              <a href="/login"> <button className="nav-login-btn">

                    Login

                </button></a> 


            </div>


        </nav>

    );

}