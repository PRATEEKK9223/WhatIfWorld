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
      model: "llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content: `
          You are a scenario validation assistant.
          Respond ONLY in JSON:
          { "is_valid": true/false, "reason": "short explanation" }

          Rules:
        - Scenario MUST start with "What if"
        - Scenario MUST express a hypothetical idea
        - Grammar mistakes, domain confusion, or short phrasing are acceptable
        - Do NOT reject just because the scenario is uncommon or not fully detailed
        - Reject only if the text is:
          * Random (e.g., "abcd1234")
          * Greeting or unrelated small talk (e.g., "hi", "how are you")
          * No hypothetical change (e.g., "What if what if what if")
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
