"use client";

import { useState, useEffect } from "react";

import JobCard from "./JobCard";

const JobCardList = ({ data }) => {
  return (
    <div className="mx-auto bg-slate-200">
      <div className="feed flex flex-col items-center px-10 md:p-10 md:pt-16 sm:p-0 pt-16">
        <div className="my-8 space-y-10 grid grid-cols-1 md:grid-cols-4 md:space-y-0 gap-9">
          {data.map((post) => (
            <JobCard key={post._id} post={post} />
          ))}
        </div>
      </div>
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
