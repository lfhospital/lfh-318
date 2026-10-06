import DoctorAbout from '../Components/Doctor-profile-page-Components/About/DoctorAbout';
import DoctorProfile from '../Components/Doctor-profile-page-Components/DoctorProfile/DoctorProfile';
import Footer from '../Components/Doctor-profile-page-Components/Footer/DoctorFooter';
import Navbar from '../Components/Doctor-profile-page-Components/Navbar/Navbar';

export default function Doctors_Profle() {
    return (
        <>
            <Navbar />
            <DoctorProfile />
            <DoctorAbout />
            <Footer/>
        </>
    );
}   