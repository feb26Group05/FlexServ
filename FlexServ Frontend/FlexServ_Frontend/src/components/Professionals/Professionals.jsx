import ProfessionalCard from "./ProfessionalCard";

import "./Professionals.css";


export default function Professionals(){


    const professionals=[


        {
            id:1,
            name:"Rahul Sharma",
            role:"Electrician",
            rating:"4.9",
            jobs:"520",
            image:
            "https://randomuser.me/api/portraits/men/32.jpg"
        },


        {
            id:2,
            name:"Priya Patel",
            role:"Beautician",
            rating:"5.0",
            jobs:"780",
            image:
            "https://randomuser.me/api/portraits/women/68.jpg"
        },


        {
            id:3,
            name:"Amit Verma",
            role:"Plumber",
            rating:"4.8",
            jobs:"430",
            image:
            "https://randomuser.me/api/portraits/men/65.jpg"
        }


    ];



    return(


        <section className="professionals-section">


            <h2>
                Featured Professionals
            </h2>


            <p>
                Top rated experts near you
            </p>



            <div className="professional-grid">


                {
                    professionals.map((person)=>(


                        <ProfessionalCard

                            key={person.id}

                            person={person}

                        />


                    ))
                }


            </div>


        </section>


    );

}