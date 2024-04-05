"use client";

import { useState, useEffect } from "react";

import JobCard from "./JobCard";

const JobCardList = ({ data }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <>
        <JobCard key={post._id} post={post} />
        <br/>
        </>
        
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const fetchPosts = async () => {
    const response = await fetch("/api/job");
    const data = await response.json();

    setAllPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div>
      <JobCardList data={allPosts} />
    </div>
  );
};

export default Feed;
