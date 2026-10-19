import React from "react";

import Navbar from "../Components/Home-page-Components/Navbar/Navbar";
import Footer from "../Components/Home-page-Components/Footer/HomeFooter";
import HealthLibraryBrowse from "../Components/Health library happy flow-Components/HealthLibraryBrowse/HealthLibraryBrowse";

export default function HealthLibraryBrowsePage() {
  return (
    <>
      <Navbar />
      <HealthLibraryBrowse />
      <Footer />
    </>
  );
}
