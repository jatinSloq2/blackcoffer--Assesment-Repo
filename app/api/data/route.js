
import connectDB from "@/lib/mongodb";
import Insight from "@/models/Insight";

export async function GET() {
  try {
    await connectDB();

    const data = await Insight.find({}).lean();

    return Response.json(
      {
        success: true,
        count: data.length,
        data
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to fetch data",
        error: error.message
      },
      { status: 500 }
    );
  }
}