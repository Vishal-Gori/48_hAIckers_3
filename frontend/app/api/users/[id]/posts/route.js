import { connectToDb } from "@/utils/database";
import Job from "@/models/job";

export const GET = async(request, { params }) => {
    try {
        await connectToDb();

        const jobs = await Job.find({creator: params.id});

        return new Response(JSON.stringify(jobs), {status:200})
    } catch (error) {
        return new Response("Failed to fetch jobs", {status:500})
    }
}