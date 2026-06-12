import { useState, useCallback } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { GlobeLoader } from '@components/GlobeLoader';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import { Hero } from '@sections/Hero';
import { About } from '@sections/About';
import { Skills } from '@sections/Skills';
import { Projects } from '@sections/Projects';
import { Experience } from '@sections/Experience';
import { Contact } from '@sections/Contact';
import { ChatWidget } from '@components/ChatWidget';


function App() {
  // introDone: globe found Lagos, fade-out started — mount the app beneath it
  // loaderGone: fade-out finished — remove the loader from the DOM
  const [introDone, setIntroDone] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);

  // Stable callbacks so GlobeLoader's effect doesn't restart on re-render
  const handleFound = useCallback(() => setIntroDone(true), []);
  const handleComplete = useCallback(() => setLoaderGone(true), []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Okoro Emmanuel — Full-Stack Engineer</title>
        <meta
          name="description"
          content="Full-Stack & Frontend Engineer. Expert in React, Next.js, TypeScript, and Node.js. Currently building Terapage."
        />
      </Helmet>

      {!loaderGone && <GlobeLoader onFound={handleFound} onComplete={handleComplete} />}

      {introDone && (
        <>
          <Navbar />

          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Contact />
          </main>

          <Footer />
          <ChatWidget />
        </>
      )}
    </HelmetProvider>
  );
}

export default App;
