"use client"
import Select from 'react-select';
import { useEffect, useState } from 'react';

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
      <h1>Career Recommendation System</h1>
      <select value={selectedUg} onChange={(e) => setSelectedUg(e.target.value)}>
        <option value="">Select your Undergraduate Program</option>
        {ugPrograms.map((ug) => (
          <option key={ug} value={ug}>{ug}</option>
        ))}
      </select>
      <Select
        isMulti
        name="skills"
        options={skillOptions}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleSkillsChange}
        value={skillOptions.filter(option => selectedSkills.includes(option.value))}
      />
      <Select
        isMulti
        name="interests"
        options={interestOptions}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleInterestsChange}
        value={interestOptions.filter(option => selectedInterests.includes(option.value))}
      />
      

      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleRecommendation}>Get Recommendations</button>

      {recommendations.length > 0 && (
        <div>
          <h2>Recommendations</h2>
          <ul>
            {recommendations.map((job, index) => (
              <li key={index}>{job}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
