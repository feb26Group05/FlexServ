import CategoryCard from "./CategoryCard";
import "./Categories.css";


import {
    FaFan,
    FaBroom,
    FaBolt,
    FaTint,
    FaCut,
    FaPaintRoller,
    FaTools,
    FaChair
} from "react-icons/fa";



export default function CategoryGrid(){


    const categories=[


        {
            id:1,
            title:"AC Repair",
            description:"Fast and reliable AC services",
            icon:<FaFan/>
        },


        {
            id:2,
            title:"Home Cleaning",
            description:"Deep cleaning by experts",
            icon:<FaBroom/>
        },


        {
            id:3,
            title:"Electrician",
            description:"Electrical repair solutions",
            icon:<FaBolt/>
        },


        {
            id:4,
            title:"Plumbing",
            description:"Leakage and fitting services",
            icon:<FaTint/>
        },


        {
            id:5,
            title:"Salon At Home",
            description:"Beauty services at doorstep",
            icon:<FaCut/>
        },


        // {
        //     id:6,
        //     title:"Painting",
        //     description:"Professional wall painting",
        //     icon:<FaPaintRoller/>
        // },


        {
            id:7,
            title:"Appliance Repair",
            description:"Repair all appliances",
            icon:<FaTools/>
        },


        // {
        //     id:8,
        //     title:"Carpentry",
        //     description:"Furniture and wood work",
        //     icon:<FaChair/>
        // }


    ];



    return(


        <section className="categories">


            <h2>
                Explore Our Services
            </h2>


            <p>
                Trusted professionals for every home need.
            </p>



            <div className="category-grid">


                {
                    categories.map((category)=>(


                        <CategoryCard

                            key={category.id}

                            category={category}

                        />


                    ))
                }


            </div>



        </section>


    );

}