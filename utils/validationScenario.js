import Cerebras from "@cerebras/cerebras_cloud_sdk";

function basicValidation(scenario) {
  if (!scenario) 
    return false;
  const trimmed = scenario.trim().toLowerCase();
  if (!trimmed.startsWith("what if"))
    return false;
  if (trimmed.length < 15) 
    return false;
  return true;
}

export async function validateScenario(req, res, next) {
  const { scenario } = req.body;

  // ✅ Basic validation first
  if (!basicValidation(scenario)) {
    return res.render("Error/error", {message: "❌ Please enter a meaningful scenario starting with 'What if ...'"});
  }

  // ✅ AI-powered validation
  try {
    const client = new Cerebras({
      apiKey: process.env.CEREBRAS_API_KEY,
    });

    const validationResponse = await client.chat.completions.create({
      model: "llama-3.3-70b",
      messages: [
        {
          role: "system",
          content: `
          You are a scenario validation assistant.
            A valid "What if" scenario must:
            Describe a hypothetical situation
            Allow for multiple outcomes

            Do NOT judge realism, feasibility, probability, or morality.
            Even unrealistic scenarios are valid.

            Respond ONLY in JSON:
            {
              "is_valid": true/false,
              "reason": "Clear explanation when is_valid = false"
            }
          `
        },
        {
          role: "user",
          content: scenario
        }
      ],
      response_format: { type: "json_object" }
    });

    const validation = JSON.parse(validationResponse.choices[0].message.content);

    if (!validation.is_valid) {
      return res.render("./Error/error", {
        message: validation.reason || "Invalid scenario format."
      });
    }

    next(); // ✅ Everything OK → continue to next middleware/handler

  } catch (error) {
    console.log("AI Validation Error:", error);
    return res.render("./Error/error", { message: "AI validation failed. Try again later." });
  }
}



