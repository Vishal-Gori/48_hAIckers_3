"use client"
import Link from "next/link";
import {useState, useEffect} from "react";
import { useSession } from "next-auth/react";

const JobCard = ({ post }) => {
  const { data: session } = useSession();
  const [myJob, setMyPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();

      setMyPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);


  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/job/${post._id}`, {
          method: "DELETE",
        });

        const filteredPosts = myJob.filter((item) => item._id !== post._id);

        setMyPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
    <Link href={`/job/${post._id}`} className="flex flex-col bg-white mx-auto rounded-lg hover:scale-105 duration-200 ease-in-out md:w-[300px]">
      <h1 className="text-xl md:text-2xl font-bold mb-2">{post.jobTitle}</h1>
      <p className="text-gray-600">{post.jobDescription}</p>

    </Link>
    <p
    className='font-inter text-sm orange_gradient cursor-pointer'
    onClick={handleDelete}
  >
    Delete
  </p>
  </>
    
  );
};

export default JobCard;