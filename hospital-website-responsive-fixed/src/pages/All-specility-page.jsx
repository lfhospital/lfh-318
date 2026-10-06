import AllSpecialties from "../Components/All-specialty-page-Components/All_Specialties/AllSpecialties";
import BrowseBySpecialty from "../Components/All-specialty-page-Components/BrowseBySpecialty/BrowseBySpecialty";
import Footer from "../Components/Home-page-Components/Footer/HomeFooter";
import Navbar from "../Components/Home-page-Components/Navbar/Navbar";

export default function All_Specialties() {
  return (
    <>
      <Navbar />
      <AllSpecialties />
      <BrowseBySpecialty />
      <Footer />
    </>
  );
}
