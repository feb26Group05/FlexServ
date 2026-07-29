import "./WhyChoose.css";


export default function WhyChoose(){


    const reasons=[

        {
            icon:"✔",
            title:"Verified Professionals",
            description:
            "Every service partner is background verified and experienced."
        },


        {
            icon:"💳",
            title:"Secure Payments",
            description:
            "Safe and secure payment options for every booking."
        },


        {
            icon:"🎧",
            title:"24×7 Support",
            description:
            "Our support team is always available whenever you need help."
        }

    ];



    return(


        <section className="why-section">


            <h2>
                Why Choose FlexServ?
            </h2>


            <div className="why-grid">


                {
                    reasons.map((item,index)=>(


                        <div 
                        className="why-card"
                        key={index}
                        >


                            <div className="why-icon">

                                {item.icon}

                            </div>


                            <h3>

                                {item.title}

                            </h3>


                            <p>

                                {item.description}

                            </p>


                        </div>


                    ))
                }


            </div>


        </section>


    );

}