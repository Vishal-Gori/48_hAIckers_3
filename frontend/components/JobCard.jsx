import Image from "next/image";
import Link from "next/link";
import React from "react";

const JobCard = ({ post }) => {
  return (
    <Link href={`/job/${post._id}`} className="flex flex-col bg-white mx-auto rounded-lg hover:scale-105 duration-200 ease-in-out md:w-[300px]">
      <h1>{post.jobTitle}</h1>
      <p>{post.jobDescription}</p>
    </Link>
  );
};

export default JobCard;