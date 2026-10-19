import React from "react";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import Footer from "../../Home-page-Components/Footer/HomeFooter";
import ConditionDetailsHome from "./Coronary Artery Disease Hero/ConditionDetailsHome";
import DiseaseOverview from "./DiseaseOverview/DiseaseOverview";
import DiseaseAdditionalSections from "./DiseaseAdditionalSections/DiseaseAdditionalSections";
import RelatedConditions from "./RelatedConditions/RelatedConditions";
import DiseaseSectionNav from "./DiseaseSectionNav/DiseaseSectionNav";

export default function CoronaryArteryDiseasePage() {
  return (
    <>
      <Navbar active="Health Library" />
      <ConditionDetailsHome />
      {/* The section menu stays pinned while reading any part of the article */}
      <div className="disease-article">
        <DiseaseSectionNav />
        <DiseaseOverview />
        <DiseaseAdditionalSections />
        <RelatedConditions />
      </div>
      <Footer />
    </>
  );
}
