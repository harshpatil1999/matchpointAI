import Banner from "../components/Banner";
import Features from "../components/Features";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing";

function Home() {
  return (
    <div className="bg-page">
      <Hero />
      <Features />
      <Pricing />
      <Banner />
    </div>
  );
}

export default Home;
