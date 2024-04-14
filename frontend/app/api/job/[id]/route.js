import Job from "@/models/job";
import { connectToDb } from "@/utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDb();

    const job = await Job.find(params._id);
    if (!job) return new Response("blog Not Found", { status: 404 });

    return new Response(JSON.stringify(job), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};