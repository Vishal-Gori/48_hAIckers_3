import Job from "@/models/job";
import { connectToDb } from "@/utils/database";

export const POST = async (request) => {
    const {creator: userId,  jobDescription, jobTitle,  category} = await request.json();

    try {
        await connectToDb();
        await Job.create({
            creator: userId,
            jobDescription,
            jobTitle, 
            category
        })
        
        return new Response(JSON.stringify(newJob), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}