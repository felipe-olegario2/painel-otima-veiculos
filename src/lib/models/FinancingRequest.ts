import mongoose from "mongoose";

const FinancingRequestSchema = new mongoose.Schema(
  {
    carId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    document: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["PENDING", "DOING", "DONE"], 
      default: "PENDING",
      required: true 
    },
    descriptionService: { type: String },
    entryValue: { type: Number },
    installments: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.FinancingRequest || 
       mongoose.model("FinancingRequest", FinancingRequestSchema);