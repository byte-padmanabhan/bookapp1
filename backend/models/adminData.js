const mongoose=require("mongoose")
const adminActionSchema = new mongoose.Schema(
    {
      photoUrl: { type: String, required: true },
      rewardPoints: { type: Number, required: true },
      userAction: { type: String, required: true },
      causesSolved: { type: String, required: true },
      actorName: { type: String, required: true },
      actorContact: { type: String },
      createdById: { type: String, required: true }, // Clerk user ID
      createdByName: { type: String },
      createdByEmail: { type: String },
    },
    { timestamps: true }
  );
  
  module.exports  = mongoose.model("NewAdminAction", adminActionSchema);