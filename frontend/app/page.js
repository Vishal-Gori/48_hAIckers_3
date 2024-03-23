"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import AppScreenshotWithCTAsHero from "@/components/appss"
import DefaultFeatureListSection from "@/components/default"
import DefaultNewsletterSection from "@/components/newsletter"
import AlternateImageWithFeatureListSection from "@/components/alternate"
import IllustrationWithStatisticsSocialProof from "@/components/illustration"
export default function Home() {

  const [data, setData] = useState(null);
  const fetchData = async() => {
    debugger;
      const res = await fetch('http://localhost:5000/api/home');
      const mess = await res.json();
      setData(mess.message);
    }
  useEffect(() => {
      fetchData();
  }, [])
  
  return (
    <div>
      <h1>{data}</h1>
      <AppScreenshotWithCTAsHero/>
      <DefaultFeatureListSection/>
      {/* <DefaultNewsletterSection/> */}
      <AlternateImageWithFeatureListSection/>
      <IllustrationWithStatisticsSocialProof/>
    </div>
    
  );
}

