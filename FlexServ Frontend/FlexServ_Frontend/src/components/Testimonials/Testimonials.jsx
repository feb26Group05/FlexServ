import "./Testimonials.css";


export default function Testimonials(){


    const reviews=[


        {
            name:"Rahul Patil",
            review:
            "Excellent service. The electrician arrived on time and solved the issue quickly.",
            rating:"★★★★★"
        },


        {
            name:"Sneha Sharma",
            review:
            "The cleaning service was amazing. Very professional and affordable.",
            rating:"★★★★★"
        },


        {
            name:"Amit Joshi",
            review:
            "Easy booking process and great customer support.",
            rating:"★★★★☆"
        }


    ];



    return(


        <section className="testimonial-section">


            <h2>
                What Our Customers Say
            </h2>



            <div className="testimonial-grid">


                {
                    reviews.map((item,index)=>(


                        <div
                        className="testimonial-card"
                        key={index}
                        >


                            <div className="stars">

                                {item.rating}

                            </div>


                            <p>

                                "{item.review}"

                            </p>


                            <h4>

                                - {item.name}

                            </h4>


                        </div>


                    ))
                }


            </div>


        </section>


    );

}