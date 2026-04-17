import React from "react";
import { ArrowRight, Droplet, Users, Heart, ShieldCheck } from "lucide-react";
import Button from "../../ui/Button";
import Hero from "./Home/components/Hero";
import Stats from "./Home/components/Stats";
import Features from "./Home/components/Features";
import QnASection from "./Home/components/Qna";
import Services from "../../components/client/Services";

const Home = () => {
  return (
    <div>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Stats Section */}
      <Stats />

      {/* 3. Features Section */}
      <Features />
      <Services />
      <QnASection />
    </div>
  );
};

export default Home;
