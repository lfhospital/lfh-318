import { useState } from "react";
import DoctorsDirectoryHero from "../Components/All-Doctors-page-Components/DoctorsDirectoryHero/DoctorsDirectoryHero";
import DoctorsListing from "../Components/All-Doctors-page-Components/DoctorsListing/DoctorsListing";
import Footer from "../Components/Home-page-Components/Footer/HomeFooter";
import Navbar from "../Components/Home-page-Components/Navbar/Navbar";

export default function All_Doctors() {
    const [doctorCount, setDoctorCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <>
            <Navbar />
            <DoctorsDirectoryHero
                doctorCount={doctorCount}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
            <DoctorsListing
                onDoctorsLoaded={setDoctorCount}
                searchQuery={searchQuery}
            />
            <Footer />
        </>
    );
}