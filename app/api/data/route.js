import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Insight from "@/models/Insight";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // Extract possible filters
    const topic = searchParams.get("topic");
    const sector = searchParams.get("sector");
    const city = searchParams.get("city");
    const id = searchParams.get("id");

    // Build query dynamically
    const query = {};

    if (topic) query.topic = topic;
    if (sector) query.sector = sector;
    if (city) query.city = city;
    if (id) query._id = id;

    // Fetch filtered or full data
    const data = await Insight.find(query).lean();

    return NextResponse.json(
      {
        success: true,
        count: data.length,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch insights",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
