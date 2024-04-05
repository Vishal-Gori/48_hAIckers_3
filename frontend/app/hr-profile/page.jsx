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
        debugger
        const response = await fetch(`/api/users/${session?.user.id}/posts`);
        const data = await response.json();
        console.log(data)

        setPosts(data);
        }

        fetchPosts();
    }, [])

    

    
  return (
    <HrProfile
        name = "My"
        desc = " Welcome to your personalized profile page"
        data = {posts}
    />
  )
}

export default MyProfile
