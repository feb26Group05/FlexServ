import "./HowItWorks.css";


export default function HowItWorks(){


    const steps=[

        {
            number:"01",
            title:"Select Service",
            description:
            "Choose from hundreds of home services available."
        },


        {
            number:"02",
            title:"Pick Schedule",
            description:
            "Select your preferred date and convenient time."
        },


        {
            number:"03",
            title:"Professional Arrives",
            description:
            "A verified expert reaches your doorstep."
        },


        {
            number:"04",
            title:"Get Service Done",
            description:
            "Relax while your work gets completed."
        }

    ];



    return(

        <section className="how-section">


            <h2>
                How FlexServ Works
            </h2>


            <p>
                Book your service in four simple steps.
            </p>



            <div className="steps-container">


                {
                    steps.map((step,index)=>(


                        <div 
                        className="step-card"
                        key={index}
                        >


                            <div className="step-number">

                                {step.number}

                            </div>


                            <h3>

                                {step.title}

                            </h3>


                            <p>

                                {step.description}

                            </p>


                        </div>


                    ))
                }


            </div>


        </section>

    );

}