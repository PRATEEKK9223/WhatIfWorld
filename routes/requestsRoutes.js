import express from 'express';
const router= express.Router();
import Result from "../Models/result.js";
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import asyncWrap from "../utils/asyncWrap.js";
import {validateScenario} from "../utils/validationScenario.js";
import {isLoggedIn} from "../utils/middlewares.js";

router.get("/scenario",isLoggedIn,(req,res)=>{
    res.render("./Components/scenario",{title:"What-If Scenario Prediction",activePage: "explore"});
});

router.post("/scenario",validateScenario,asyncWrap(async(req,res)=>{
    let scenario=req.body.scenario;
    let domain=req.body.domain;
     const client = new Cerebras({
        apiKey: process.env.CEREBRAS_API_KEY, // This is the default and can be omitted
      });

    const completion = await client.chat.completions.create({
            messages: [
                    {
                      role: "system",
                      content: `
                      You are an AI future scenario predictor.
                      Given a "What if" scenario and its domain, respond strictly in the following JSON structure:

                    { 
                      "textual_analysis": {
                        "scenario": "string",
                        "domain": "string",
                        "probability": number (between 0 and 100, rounded to two decimals),
                        "key_implications": ["string", "string", ...],
                        "potential_challenges": ["string", "string", ...]
                      },
                      "statistics": {
                        "Metric1": number,
                        "Metric2": number,
                        "Metric3": number,
                        "Metric4": number
                      }
                    }
                      Always provide numeric values between 0–100, no exponents or scientific notation.
                     - Probability represents how plausible this scenario is relative to our current world.

                    The response should change dynamically based on the domain provided.
                    Use domain-specific metrics. Example domains include:
                    - Environment → CO2 Reduction, Job Creation, Cost Reduction, Efficiency Gain
                    - Health → Life Expectancy, Recovery Rate, Healthcare Cost Reduction, Innovation Index
                    - Education → Literacy Rate, Student Engagement, Digital Access, Teaching Quality
                    - Technology → Innovation Rate, Adoption Level, Automation Impact, Cyber Risk
                    - Economy → GDP Growth, Employment Rate, Inflation Stability, Market Confidence
                    - Society → Social Welfare, Equality Index, Safety Level, Cultural Growth
                    - Politics → Stability Score, Policy Impact, Voter Engagement, International Relations
                    `
              },
              {
                role: "user",
                content: `Scenario: ${scenario}\nDomain: ${domain}`
            }
          ],
          model: "llama-3.3-70b",
          response_format: { type: "json_object" }
});

      // console.log(completion.choices[0].message.content);
    // const result = JSON.parse(completion.choices[0].message.content);
      let result;
      try {
          result = JSON.parse(completion.choices[0].message.content);
      } catch (err) {
          console.error("❌ JSON parse failed. Raw output:", completion.choices[0].message.content);
          console.error(err);
          return res.status(500).send("Model returned invalid JSON");
      }
    // result.textual_analysis.probability*=100;  
  
  // persist result and then render the result page with the saved document id
  const newResult = new Result(result);
  await newResult.save();
  res.render("./Components/result", { result, resultId: newResult._id,title:"What-If Scenario Result",activePage:"result"});

}));

export default router;