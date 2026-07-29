import {
    FaSearch
} from "react-icons/fa";


import "./Hero.css";



export default function Hero(){


    return(


        <section className="hero">


            <div className="hero-left">


                <h1>

                    Home Services

                    <br/>

                    At Your

                    <span>
                        Doorstep
                    </span>


                </h1>



                <p>

                    Book trusted professionals for cleaning,
                    beauty, repairs and maintenance in just
                    a few clicks.

                </p>



                <div className="search-box">


                    <FaSearch />


                    <input

                        type="text"

                        placeholder="Search AC Repair, Cleaning..."

                    />


                    <button>

                        Search

                    </button>


                </div>



                <div className="popular-tags">


                    {/* <span>
                        Popular :
                    </span> */}


                    <button>
                        Cleaning
                    </button>


                    <button>
                        AC Repair
                    </button>


                    <button>
                        Electrician
                    </button>


                    <button>
                        Salon
                    </button>



                </div>


            </div>



            <div className="hero-right">


                <img

                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900"

                    alt="professional"

                />


            </div>


        </section>


    );

}