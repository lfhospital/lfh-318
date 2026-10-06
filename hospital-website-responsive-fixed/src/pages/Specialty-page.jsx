import Navbar from "../Components/Doctor-profile-page-Components/Navbar/Navbar";
import Footer from "../Components/Home-page-Components/Footer/HomeFooter";
import CardiacHero from "../Components/Specialty-page-Components/CardiacHero/CardiacHero";
import CardiologyOverview from "../Components/Specialty-page-Components/CardiologyOverview/CardiologyOverview";
import ConditionsWeTreat from "../Components/Specialty-page-Components/ConditionsWeTreat/ConditionsWeTreat";
import DoctorsSection from "../Components/Specialty-page-Components/DoctorsSection/DoctorsSection";
import ProceduresSection from "../Components/Specialty-page-Components/ProceduresSection/ProceduresSection";

export default function Specialty() {
    return (
        <>
            <Navbar/>
            <CardiacHero/>
            <CardiologyOverview/>
            <ConditionsWeTreat/>
            <ProceduresSection/>
            <DoctorsSection/>
            <Footer/>
        </>
    );
}