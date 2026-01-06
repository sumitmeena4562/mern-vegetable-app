import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../components/common/Header.jsx';
import HeroSection from '../components/home/HeroSection.jsx'
import LiveMarketRates from '../components/market/LiveMarketRates'
import WhyChooseAgriConnect from '../components/home/WhyChooseAgriConnect'
import HowItWorks from '../components/home/HowItWorks'
import Features from '../components/home/Features'
import Stats from '../components/home/Stats'
import AppDownload from '../components/home/AppDownload'
import Footer from '../components/common/Footer'

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