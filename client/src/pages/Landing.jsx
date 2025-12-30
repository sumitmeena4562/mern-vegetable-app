import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../components/Header.jsx';
import HeroSection from '../components/HeroSection.jsx'
import LiveMarketRates from '../components/LiveMarketRates'
import WhyChooseAgriConnect from '../components/WhyChooseAgriConnect'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import Stats from '../components/Stats'
import AppDownload from '../components/AppDownload'
import Footer from '../components/Footer'

function Landingpage() {
  return (
      <div className="bg-background-light dark:bg-background-dark text-text-main font-display antialiased ">
        <Header />
        <HeroSection />
        <LiveMarketRates />
        <WhyChooseAgriConnect />
        <HowItWorks />
        <Features />
        <Stats />
        <AppDownload />
        <Footer />
      </div>
  )
}

export default Landingpage;