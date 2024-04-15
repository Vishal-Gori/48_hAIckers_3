"use client";

import Loader from "@/components/Loader";
import React, { useEffect, useState } from "react";

const Job = ({ params }) => {
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/job/${params.id}`, {
          method: "GET",
        });
        const data = await response.json();
        console.log("Fetched job data:", data); // Debugging point

        // Assuming data is an array with a single object
        if (Array.isArray(data) && data.length > 0) {
          setJob(data[0]); // Set the first object in the array as the job
        } else {
          console.error("Invalid job data format:", data);
        }
      } catch (error) {
        console.error("Error fetching job data:", error); // Debugging point
      }
    };

    fetchJob();
  }, [params.id]);

  console.log("Current job state:", job); // Debugging point

  if (job === null) {
    return <Loader />;
  } else {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Job Title: {job.jobTitle}</h1>
        <p className="text-lg">Job Description: {job.jobDescription}</p>
        {/* Render other job details here */}
      </div>
    );
  }
};

export default Job;
