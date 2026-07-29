import {
    FaArrowRight
} from "react-icons/fa";


export default function CategoryCard({category}){


    return(


        <div className="category-card">


            <div className="category-icon">

                {category.icon}

            </div>



            <h3>

                {category.title}

            </h3>



            <p>

                {category.description}

            </p>



            <button>

                Explore

                <FaArrowRight/>

            </button>



        </div>


    );

}