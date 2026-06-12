import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AgreementModal } from '../components/AgreementModal';

export function Root() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#F8F9F5', minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AgreementModal />
    </div>
  );
}
