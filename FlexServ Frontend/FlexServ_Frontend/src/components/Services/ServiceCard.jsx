export default function ServiceCard({service}){


    return(


        <div className="service-card">


            <img

                src={service.image}

                alt={service.title}

            />



            <div className="service-content">


                <h3>

                    {service.title}

                </h3>



                <span>

                    ⭐ {service.rating}
                    {" "}
                    ({service.bookings})

                </span>



                <p>

                    Starting from ₹{service.price}

                </p>



                <button>

                    Book Now

                </button>


            </div>


        </div>


    );

}