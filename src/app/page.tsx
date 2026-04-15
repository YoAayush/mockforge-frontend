// import { redirect } from 'next/navigation'

// export default function Home() {
//   redirect('/auth/login')
// }

"use client";
import { Header } from "@/components/landing-page-components/header";
import { Hero } from "@/components/landing-page-components/hero";
import { Features } from "@/components/landing-page-components/features";
import { CTA } from "@/components/landing-page-components/cta";
import { Footer } from "@/components/landing-page-components/footer";

const Home = () => {
  return (
    <div className="bg-primary">
    {/* <div className="bg-foreground text-background">
      sdgdfgdfgdfgdfg
    </div> */}
      <Header />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
};

export default Home;
