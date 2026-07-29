import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import CategoryGrid from "../../components/Categories/CategoryGrid";
import PopularServices from "../../components/Services/PopularServices";
import WhyChoose from "../../components/WhyChoose/WhyChoose";
import Professionals from "../../components/Professionals/Professionals";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import Testimonials from "../../components/Testimonials/Testimonials";
import Footer from "../../components/Footer/Footer";

import "./HomePage.css";


export default function HomePage(){

    return(

        <div className="home-container">

            <Navbar />

            <Hero />

            <CategoryGrid />

            <PopularServices />

            <WhyChoose />

            <Professionals />

            <HowItWorks />

            <Testimonials />

            <Footer />

        </div>

    );
}