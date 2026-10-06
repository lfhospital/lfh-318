import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DoctorAbout from '../Components/Doctor-profile-page-Components/About/DoctorAbout';
import DoctorProfile from '../Components/Doctor-profile-page-Components/DoctorProfile/DoctorProfile';
import Footer from '../Components/Doctor-profile-page-Components/Footer/DoctorFooter';
import Navbar from '../Components/Doctor-profile-page-Components/Navbar/Navbar';

export default function Doctors_Profle() {
    const { docId } = useParams();
    const [doctorData, setDoctorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                setLoading(true);
                console.log('Fetching doctor with ID:', docId);
                
                // Use GET request
                const response = await fetch(`https://ishah.in/api/lfhospital/doctor/getdoctor?docId=${docId}`);
                
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('API Response:', data);
                
                if (data.success && data.doctorData) {
                    console.log('Doctor data received:', data.doctorData);
                    setDoctorData(data.doctorData);
                } else {
                    console.error('API returned unexpected structure:', data);
                    setError('Failed to fetch doctor details: ' + (data.message || 'No doctor data found'));
                }
            } catch (err) {
                console.error('Error fetching doctor details:', err);
                setError('Error loading doctor details: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        if (docId) {
            fetchDoctorDetails();
        }
    }, [docId]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ padding: '100px 20px', textAlign: 'center' }}>
                    <p>Loading doctor details...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div style={{ padding: '100px 20px', textAlign: 'center', color: 'red' }}>
                    <p>{error}</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <DoctorProfile doctorData={doctorData} />
            <DoctorAbout doctorData={doctorData} doctorId={docId} />
            <Footer/>
        </>
    );
}