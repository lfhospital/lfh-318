import React from "react";

import Navbar from "../Components/Home-page-Components/Navbar/Navbar";
import Footer from "../Components/Home-page-Components/Footer/HomeFooter";
import HealthArticle from "../Components/Health library happy flow-Components/HealthArticle/HealthArticle";

export default function HealthArticlePage() {
  return (
    <>
      <Navbar />
      <HealthArticle />
      <Footer />
    </>
  );
}
