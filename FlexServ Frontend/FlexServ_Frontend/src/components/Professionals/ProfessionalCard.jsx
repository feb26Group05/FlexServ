export default function ProfessionalCard({person}){


    return(


        <div className="professional-card">


            <img

                src={person.image}

                alt={person.name}

            />


            <h3>

                {person.name}

            </h3>


            <span>

                {person.role}

            </span>


            <p>

                ⭐ {person.rating}
                {" | "}
                {person.jobs} Jobs

            </p>



            <button>

                View Profile

            </button>


        </div>


    );

}