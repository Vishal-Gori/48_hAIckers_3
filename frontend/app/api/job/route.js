import Job from "@/models/job";
import { connectToDb } from "@/utils/database";

export const GET = async (request) => {
    try {
        await connectToDb()

        const jobs = await Job.find({})

        return new Response(JSON.stringify(jobs), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 })
    }
} 

export const POST = async (request) => {
    const {creator: userId,  jobDescription, jobTitle,  category, salary, experience, skills} = await request.json();

    try {
        await connectToDb();
        await Job.create({
            creator: userId,
            jobDescription,
            jobTitle, 
            category,
            salary,
            experience,
            skills
        })
        
        return new Response(JSON.stringify(newJob), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}
