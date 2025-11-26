import mongoose from "mongoose";

const InsightSchema = new mongoose.Schema({
  end_year: { type: String, default: "" },
  intensity: { type: Number, required: false },
  sector: { type: String, required: false },
  topic: { type: String, required: false },
  insight: { type: String, required: false },
  url: { type: String, required: false },
  region: { type: String, required: false },
  start_year: { type: String, default: "" },
  impact: { type: String, default: "" },
  added: { type: String },
  published: { type: String },
  country: { type: String },
  relevance: { type: Number },
  pestle: { type: String },
  source: { type: String },
  title: { type: String },
  likelihood: { type: Number }
});

export default mongoose.models.Insight ||
  mongoose.model("Insight", InsightSchema);