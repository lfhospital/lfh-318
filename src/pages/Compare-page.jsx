import ComparePackages from "../Components/Compare-page-Components/ComparePackages/ComparePackages";
import ComparePackagesHeader from "../Components/Compare-page-Components/ComparePackagesHeader/ComparePackagesHeader";
import ComparisonDetails from "../Components/Compare-page-Components/ComparisonDetails/ComparisonDetails";
import ComparisonOverview from "../Components/Compare-page-Components/ComparisonOverview/ComparisonOverview";
import Footer from "../Components/Home-page-Components/Footer/HomeFooter";
import Navbar from "../Components/Home-page-Components/Navbar/Navbar";

export default function ComparePage() {
    return (
        <>
            <Navbar />
            <ComparePackagesHeader/>
            <ComparePackages/>
            <ComparisonOverview/>
            <ComparisonDetails/>
            <Footer />
        </>
    );
}