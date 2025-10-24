import mongoose from "mongoose";

const resultSchema=new mongoose.Schema({
    textual_analysis: {
        scenario: String,
        domain: String,
        probability: Number,
        key_implications: [String],
        potential_challenges: [String],
    },
    chartImages: {
        barChart: String,
        pieChart: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    
});

const Result=mongoose.model("Result",resultSchema);

export default Result;