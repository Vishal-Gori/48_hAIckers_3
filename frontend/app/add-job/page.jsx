"use client"
import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/router"; // Correct import statement

const Page = () => {
    // const router = useRouter();
    const { data: session } = useSession();
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [category, setCategory]=useState('');
    const [experience, setExperience] = useState(0);
    const [salary, setSalary] = useState(0);
    const [skills, setSkills] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Here you can do something with the jobTitle and jobDescription values, such as sending them to a server
        try {
            const response = await fetch("/api/job", {
                method: "POST",
                body: JSON.stringify({
                    creator: session?.user.id,
                    jobTitle: jobTitle,
                    jobDescription: jobDescription,
                    category: category,
                    experience: experience,
                    salary: salary,
                    skills: skills
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
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobCategory">
                        Category:
                    </label>
                    <textarea
                        id="jobCategory"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobExperience">
                        Experience:
                    </label>
                    <input
                        type='number'
                        id="jobExperience"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobSalary">
                        Salary:
                    </label>
                    <input
                        type='number'
                        id="jobSalary"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobSkills">
                        Skills:
                    </label>
                    <textarea
                        id="jobSkills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
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
