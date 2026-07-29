import "./Footer.css";


export default function Footer(){


    return(


        <footer className="footer">


            <div className="footer-container">


                {/* Brand */}

                <div className="footer-brand">


                    <h1>
                        FlexServ
                    </h1>


                    <p>

                        Trusted home services at your doorstep.
                        Book verified professionals anytime.

                    </p>


                </div>




                {/* Services */}

                <div className="footer-links">


                    <h3>
                        Services
                    </h3>


                    <a>
                        AC Repair
                    </a>

                    <a>
                        Cleaning
                    </a>

                    <a>
                        Electrician
                    </a>

                    <a>
                        Plumbing
                    </a>

                    <a>
                        Salon
                    </a>


                </div>




                {/* Company */}

                <div className="footer-links">


                    <h3>
                        Company
                    </h3>


                    <a>
                        About Us
                    </a>


                    <a>
                        Careers
                    </a>


                    <a>
                        Contact
                    </a>


                    <a>
                        Partner With Us
                    </a>


                </div>




                {/* Support */}

                <div className="footer-links">


                    <h3>
                        Support
                    </h3>


                    <a>
                        Help Center
                    </a>


                    <a>
                        Privacy Policy
                    </a>


                    <a>
                        Terms & Conditions
                    </a>


                    <a>
                        Refund Policy
                    </a>


                </div>


            </div>




            <div className="footer-bottom">


                <p>

                    © 2026 FlexServ. All rights reserved.

                </p>


            </div>



        </footer>


    );

}