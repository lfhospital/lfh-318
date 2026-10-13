import React from 'react';
import Navbar from '../Components/Home-page-Components/Navbar/Navbar';
import Login from '../Components/Login-page-Components/Login/Login';
import Footer from '../Components/Home-page-Components/Footer/HomeFooter';

export default function SignupPage() {
    return (
        <>
            <Navbar />
            <Login mode="signup" />
            <Footer />
        </>
    );
}
