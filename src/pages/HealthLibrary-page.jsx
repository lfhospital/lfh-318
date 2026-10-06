import React from "react";

import Navbar from "../Components/Home-page-Components/Navbar/Navbar";
import Footer from "../Components/Home-page-Components/Footer/HomeFooter";
import HealthLibrary from "../Components/Health library happy flow-Components/Health library home page-Components/HealthLibrary";
import QuickIndex from "../Components/Health library happy flow-Components/QuickIndex/QuickIndex";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HealthLibrary />
      <QuickIndex/>
      <Footer />
    </>
  );
}
