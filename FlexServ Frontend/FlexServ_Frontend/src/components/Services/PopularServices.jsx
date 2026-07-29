import ServiceCard from "./ServiceCard";

import "./Services.css";


export default function PopularServices(){


    const services = [

        {
            id:1,
            title:"Home Cleaning",
            rating:"4.9",
            bookings:"2.1k",
            price:"599",
            image:
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700"
        },


        {
            id:2,
            title:"AC Repair",
            rating:"4.8",
            bookings:"1.8k",
            price:"299",
            image:
            "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700"
        },


        // {
        //     id:3,
        //     title:"Wall Painting",
        //     rating:"4.9",
        //     bookings:"850",
        //     price:"1499",
        //     image:
        //     "https://images.unsplash.com/photo-1562259949-e8bd807712a5?w=700"
        // },


        {
            id:4,
            title:"Salon Service",
            rating:"5.0",
            bookings:"3k",
            price:"499",
            image:
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700"
        }

    ];



    return(


        <section className="popular-services">


            <h2>
                Popular Services
            </h2>


            <p>
                Most booked services by our customers
            </p>



            <div className="service-grid">


                {
                    services.map((service)=>(


                        <ServiceCard

                            key={service.id}

                            service={service}

                        />


                    ))
                }


            </div>


        </section>


    );

}