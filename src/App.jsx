import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { NAVIGATE_EVENT, clearNavParams } from './navigation';
import HomePage from './pages/Home-page';
import Doctors_Profile from './pages/Doctor-profile-page';
import Specialty from './pages/Specialty-page';
import Healthpackages from './pages/Health-packages-page';
import All_Doctors from './pages/All-Doctors-page';
import ComparePage from './pages/Compare-page';
import PackageDetail1 from './pages/Package-detail-page1';
import PackageDetail2 from './pages/Package-detail-page2';
import PackageDetail3 from './pages/Package-detail-page3';
import All_Specialties from './pages/All-specility-page';
import HealthLibrary from './pages/HealthLibrary-page';
import HealthLibraryBrowse from './pages/HealthLibraryBrowse-page';
import HealthArticle from './pages/HealthArticle-page';
import LoginPage from './pages/Login-page';
import SignupPage from './pages/Signup-page';
import ContactPage from './pages/Contact-page';
import AboutPage from './pages/About-page';
import PatientDashboard from './pages/Patient-dashboard-page';
import PatientAppointments from './pages/Patient-appointments-page';
import PatientPrescriptions from './pages/Patient-prescriptions-page';
import PatientStoriesPage from './pages/Patient-stories-page';
import PatientReportsPage from './pages/Patient-reports-page';
import PatientSecondOpinionPage from './pages/Patient-second-opinion-page';
import PatientPaymentsPage from './pages/Patient-payments-page';
import PatientFamilyMembersPage from './pages/Patient-family-members-page';
import PatientProfilePage from './pages/Patient-profile-page';
import SecondOpinionPage from './pages/Second-opinion-page';
import SignupDetailsPage from './pages/Signup-details-page';
import HealthConditionPage from './pages/Health-condition-page';
import BookingFlowPage from './Components/Doctor-profile-page-Components/Booking-flow-Component/Booking-flow-page';
import PatientInfo from './Components/Doctor-profile-page-Components/Booking-flow-Component/Step-1/PatientInfo';
import Review from './Components/Doctor-profile-page-Components/Booking-flow-Component/Step-2/Review';
import AppointmentConfirmation from './Components/Doctor-profile-page-Components/Booking-flow-Component/Step-3/AppointmentConfirmation';
import AppointmentSlot from './Components/Doctor-profile-page-Components/Reschedule-booking-flow-Component/Step-4/AppointmentSlot';
import AppointmentConfirmation_rs from './Components/Doctor-profile-page-Components/Reschedule-booking-flow-Component/Step-5/AppointmentConfirmation-rs';
import RAppointmentConfirmation from './Components/Doctor-profile-page-Components/Reschedule-booking-flow-Component/Step-6/RAppointmentConfirmation';
import CancelAppointment from './Components/Doctor-profile-page-Components/Cancel-appointment-Component/Step-7/CancelAppointment';
import CancellationComplete from './Components/Doctor-profile-page-Components/Cancel-appointment-Component/Step-8/CancellationComplete';
import NoRefundCancellation from './Components/Doctor-profile-page-Components/Cancel window expired-Component/NoRefundCancellation';
import PartialRefund from './Components/Doctor-profile-page-Components/Partial refund-Component/PartialRefund';
import ConnectionLost from './Components/Doctor-profile-page-Components/Network failure during cancel-Component/ConnectionLost';
import AlreadyCancelled from './Components/Doctor-profile-page-Components/Already cancelled/AlreadyCancelled';
import ServiceUnavailable from './Components/Doctor-profile-page-Components/Error 404-Component/ServiceUnavailable';
import SlotTaken from './Components/Doctor-profile-page-Components/Selected slot just got taken-Component/Step-9/SlotTaken';
import RescheduleConfirm from './Components/Doctor-profile-page-Components/Selected slot just got taken-Component/Step-10/RescheduleConfirm';
import Doc_unavailable from './Components/Doctor-profile-page-Components/Doc unavailable-Component/Doc_unavailable';
import PaymentFailed from './Components/Doctor-profile-page-Components/Payment failed-Components/PaymentFailed';
import DoubleBooking from './Components/Doctor-profile-page-Components/Double booking attempt-Component/DoubleBooking';

// Pages imported from the design handoff call navigateTo() (see ./navigation);
// this turns those requests into react-router navigation.
function NavigationBridge() {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const location = useLocation();

  useEffect(() => {
    const handleNavigate = (event) => navigate(event.detail);
    window.addEventListener(NAVIGATE_EVENT, handleNavigate);
    return () => window.removeEventListener(NAVIGATE_EVENT, handleNavigate);
  }, [navigate]);

  // Back/forward opens a page without data from an earlier navigateTo()
  useEffect(() => {
    if (navigationType === 'POP') clearNavParams();
  }, [location, navigationType]);

  return null;
}

function DevNavigation() {
  const location = useLocation();
  const routes = [
    { path: '/', label: 'home' },
    { path: '/doctors', label: 'allDoctors' },
    { path: '/doctor-profile', label: 'doctorProfile' },
    { path: '/specialty', label: 'specialty' },
    { path: '/all-specialties', label: 'allSpecialties' },
    { path: '/health-packages', label: 'healthPackages' },
    { path: '/package-detail-1', label: 'PackageDetail1' },
    { path: '/package-detail-2', label: 'PackageDetail2' },
    { path: '/package-detail-3', label: 'PackageDetail3' },
    { path: '/compare', label: 'compare' },
    { path: '/health-library', label: 'healthLibrary' },
    { path: '/health-library/condition/coronary-artery-disease', label: 'healthCondition' },
    { path: '/about', label: 'about' },
    { path: '/patient-stories', label: 'patientStories' },
    { path: '/contact', label: 'contact' },
    { path: '/login', label: 'login' },
    { path: '/signup', label: 'signup' },
    { path: '/signup/details', label: 'signupDetails' },
    { path: '/dashboard', label: 'dashboard' },
    { path: '/dashboard/reports', label: 'reports' },
    { path: '/dashboard/second-opinion', label: 'secondOpinions' },
    { path: '/dashboard/payments', label: 'payments' },
    { path: '/dashboard/family-members', label: 'familyMembers' },
    { path: '/dashboard/profile', label: 'profile' },
    { path: '/second-opinion', label: 'secondOpinionFlow' },
    { path: '/booking-flow', label: 'bookingFlow' },
    { path: '/patient-info', label: 'patientInfo' },
    { path: '/review', label: 'review' },
    { path: '/appointment-confirmation', label: 'confirmation' },
    { path: '/reschedule-slot', label: 'rescheduleSlot' },
    { path: '/reschedule-confirm', label: 'rescheduleConfirm' },
    { path: '/reschedule-complete', label: 'rescheduleComplete' },
    { path: '/cancel-appointment', label: 'cancelAppt' },
    { path: '/cancellation-complete', label: 'cancelComplete' },
    { path: '/no-refund', label: 'noRefund' },
    { path: '/partial-refund', label: 'partialRefund' },
    { path: '/connection-lost', label: 'connectionLost' },
    { path: '/already-cancelled', label: 'alreadyCancelled' },
    { path: '/service-unavailable', label: '404' },
    { path: '/slot-taken', label: 'slotTaken' },
    { path: '/slot-taken-confirm', label: 'slotTakenConfirm' },
    { path: '/doc-unavailable', label: 'docUnavailable' },
    { path: '/payment-failed', label: 'paymentFailed' },
    { path: '/double-booking', label: 'doubleBooking' },
  ];

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#1e293b', color: '#fff', padding: '8px 16px',
      display: 'flex', gap: '8px', flexWrap: 'wrap', zIndex: 9999,
      fontSize: '12px'
    }}>
      <span style={{ opacity: 0.6, alignSelf: 'center' }}>Pages:</span>
      {routes.map(route => (
        <Link
          key={route.path}
          to={route.path}
          style={{
            background: location.pathname === route.path ? '#3b82f6' : '#334155',
            color: '#fff', border: 'none', borderRadius: '4px',
            padding: '4px 10px', cursor: 'pointer', fontSize: '12px',
            textDecoration: 'none'
          }}
        >
          {route.label}
        </Link>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      {/* Dev Navigation - remove in production */}
      <DevNavigation />
      <NavigationBridge />
      
      <div style={{ paddingBottom: '50px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<All_Doctors />} />
          <Route path="/doctor-profile/:docId" element={<Doctors_Profile />} />
          <Route path="/doctor-profile" element={<Doctors_Profile />} />
          <Route path="/specialty" element={<Specialty />} />
          <Route path="/all-specialties" element={<All_Specialties />} />
          <Route path="/health-packages" element={<Healthpackages />} />
          <Route path="/package-detail-1" element={<PackageDetail1 />} />
          <Route path="/package-detail-2" element={<PackageDetail2 />} />
          <Route path="/package-detail-3" element={<PackageDetail3 />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/health-library" element={<HealthLibrary />} />
          <Route path="/health-library/browse" element={<HealthLibraryBrowse />} />
          <Route path="/health-library/article/:bookId/:pageId" element={<HealthArticle />} />
          <Route path="/health-library/condition/:slug" element={<HealthConditionPage />} />
          {/* Old mock-up URLs; browse shows these states itself now */}
          <Route path="/health-library/no-results" element={<Navigate to="/health-library/browse" replace />} />
          <Route path="/health-library/unavailable" element={<Navigate to="/health-library/browse" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/patient-stories" element={<PatientStoriesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/details" element={<SignupDetailsPage />} />
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/dashboard/appointments" element={<PatientAppointments />} />
          <Route path="/dashboard/prescriptions" element={<PatientPrescriptions />} />
          <Route path="/dashboard/reports" element={<PatientReportsPage />} />
          <Route path="/dashboard/second-opinion" element={<PatientSecondOpinionPage />} />
          <Route path="/dashboard/payments" element={<PatientPaymentsPage />} />
          <Route path="/dashboard/family-members" element={<PatientFamilyMembersPage />} />
          <Route path="/dashboard/profile" element={<PatientProfilePage />} />
          <Route path="/second-opinion" element={<SecondOpinionPage />} />
          
          {/* Booking Flow Routes */}
          <Route path="/booking-flow" element={<BookingFlowPage />} />
          <Route path="/patient-info" element={<PatientInfo />} />
          <Route path="/review" element={<Review />} />
          <Route path="/appointment-confirmation" element={<AppointmentConfirmation />} />
          
          {/* Reschedule Flow Routes */}
          <Route path="/reschedule-slot" element={<AppointmentSlot />} />
          <Route path="/reschedule-confirm" element={<AppointmentConfirmation_rs />} />
          <Route path="/reschedule-complete" element={<RAppointmentConfirmation />} />
          
          {/* Cancellation Flow Routes */}
          <Route path="/cancel-appointment" element={<CancelAppointment />} />
          <Route path="/cancellation-complete" element={<CancellationComplete />} />
          
          {/* Error & Edge Case Routes */}
          <Route path="/no-refund" element={<NoRefundCancellation />} />
          <Route path="/partial-refund" element={<PartialRefund />} />
          <Route path="/connection-lost" element={<ConnectionLost />} />
          <Route path="/already-cancelled" element={<AlreadyCancelled />} />
          <Route path="/service-unavailable" element={<ServiceUnavailable />} />
          <Route path="/slot-taken" element={<SlotTaken />} />
          <Route path="/slot-taken-confirm" element={<RescheduleConfirm />} />
          <Route path="/doc-unavailable" element={<Doc_unavailable />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/double-booking" element={<DoubleBooking />} />
        </Routes>
      </div>
    </Router>
  );
}
