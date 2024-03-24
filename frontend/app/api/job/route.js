import Job from "@/models/job";
import { connectToDb } from "@/utils/database";

export const POST = async (request) => {
    const {creator: userId,  jobDescription, jobTitle } = await request.json();

    try {
        await connectToDb();
        await Job.create({
            creator: userId,
            jobDescription,
            jobTitle
        })
        
        return new Response(JSON.stringify(newJob), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}