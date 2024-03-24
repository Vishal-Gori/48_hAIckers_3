"use client"
import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/router"; // Correct import statement

const Page = () => {
    // const router = useRouter();
    const { data: session } = useSession();
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Here you can do something with the jobTitle and jobDescription values, such as sending them to a server
        try {
            const response = await fetch("/api/job", {
                method: "POST",
                body: JSON.stringify({
                    userId: session?.user.id,
                    jobTitle: jobTitle,
                    jobDescription: jobDescription,
                }),
            });

            if (response.ok) {
                console.log('okk')
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex justify-center mb-9">
            <form onSubmit={handleSubmit} className="max-w-md w-full p-8 bg-white shadow-md rounded-md">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobTitle">
                        Job Title:
                    </label>
                    <input
                        id="jobTitle"
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobDescription">
                        Job Description:
                    </label>
                    <textarea
                        id="jobDescription"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Page;
