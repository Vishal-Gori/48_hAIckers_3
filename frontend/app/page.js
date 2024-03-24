
"use client"
import Select from 'react-select';



import Image from "next/image";
import { useEffect, useState } from "react";
import AppScreenshotWithCTAsHero from "@/components/appss"
import DefaultFeatureListSection from "@/components/default"
import DefaultNewsletterSection from "@/components/newsletter"
import AlternateImageWithFeatureListSection from "@/components/alternate"
import IllustrationWithStatisticsSocialProof from "@/components/illustration"

export default function Home() {
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [ugPrograms, setUgPrograms] = useState([]);
  const [selectedUg, setSelectedUg] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const fetchData = async () => {
    const res = await fetch('http://localhost:5000/api/home');
    const data = await res.json();
    console.log(data);
    setUgPrograms(data.ug_programs || []);
    setSkills(data.key_skills || []);
    setInterests(data.interests || []);
  };


  useEffect(() => {
    fetchData();
  }, []);

  // Map your skills and interests to a format `react-select` understands
  const skillOptions = skills.map(skill => ({ value: skill, label: skill }));
  const interestOptions = interests.map(interest => ({ value: interest, label: interest }));


  const handleSkillsChange = (selectedOptions) => {
    // `react-select` provides the selected options as an array of objects
    setSelectedSkills(selectedOptions ? selectedOptions.map(option => option.value) : []);
  };

  // Handler for when new interests are selected
  const handleInterestsChange = (selectedOptions) => {
    setSelectedInterests(selectedOptions ? selectedOptions.map(option => option.value) : []);
  };

  const handleRecommendation = async () => {
    try {
      console.log("Sending data to backend:", { ug: selectedUg, skills: selectedSkills, interests: selectedInterests });
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ug: selectedUg,
          skills: selectedSkills,
          interests: selectedInterests,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }

      const data = await response.json();
      console.log("Received data from backend:", data);
      console.log("Received recommendations:", data.jobs);
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    }

  };


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
