'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import HrProfile from "@/components/HrProfile";

const MyProfile = () => {
    const router = useRouter();
    const {data: session } = useSession();

    const [posts, setPosts] = useState([])
    
    useEffect(() => {
      const fetchPosts = async () => {
          if (!session?.user?.id) {
              // Handle the case where session.user.id is not available
              console.error("User ID is not available in the session");
              return;
          }
  
          try {
              const response = await fetch(`/api/users/${session.user.id}/posts`);
              if (!response.ok) {
                  // Handle non-200 responses
                  console.error("Failed to fetch posts:", response.statusText);
                  return;
              }
              const data = await response.json();
              console.log(data);
              setPosts(data);
          } catch (error) {
              console.error("Error fetching posts:", error);
          }
      };
  
      fetchPosts();
  }, [session]);
  

    

    
  return (
    <HrProfile
        name = "My"
        desc = " Welcome to your personalized profile page"
        data = {posts}
    />
  )
}

export default MyProfile
