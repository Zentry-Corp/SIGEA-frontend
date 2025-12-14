import React from 'react';
import HeroSection from './LandingPage/sections/HeroSection';
import HowItWorksSection from './LandingPage/sections/HowItWorksSection';
import EventsSection from './LandingPage/sections/EventsSection';
import TestimonialsSection from './LandingPage/sections/TestimonialsSection';
import MissionSection from './LandingPage/sections/MissionSection';
import { PublicLayout } from '@/shared/ui/layouts';

const LandingPage = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <HowItWorksSection />
      <EventsSection />
      <TestimonialsSection />
      <MissionSection />
    </PublicLayout>
  );
};

export default LandingPage;