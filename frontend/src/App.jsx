import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvide } from './context/AuthContext'
import { useEffect, useState } from 'react'
import Loading from './components/Loading'
import ScrollToTop from './components/ScrollToTop'
import clarity from '@microsoft/clarity';

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clarity.init("tke6pwgfvi");

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <AuthProvide>
        <ScrollToTop />
        <Navbar />
        <main className="min-h-screen max-w-screen-3xl mx-auto px-0 py-3 font-primary">
          <Outlet />
        </main>
        <Footer />
      </AuthProvide>
    </>
  )
}

export default App
