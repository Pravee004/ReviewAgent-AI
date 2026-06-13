import { AzureOpenAI } from "openai";
import { SECURITY_AUDIT_PROMPT } from "../prompts/security-rules";

let clientCache: AzureOpenAI | null = null;
let lastEndpoint = "";
let lastApiKey = "";

export function isLiveConfigured(): boolean {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
  const azureApiKey = process.env.AZURE_OPENAI_API_KEY || "";
  const deploymentId = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "";

  return !!(
    endpoint && !endpoint.includes("<your-") &&
    azureApiKey && !azureApiKey.includes("<your-") &&
    deploymentId && !deploymentId.includes("<your-")
  );
}

export function getAzureClient(): AzureOpenAI | null {
  if (!isLiveConfigured()) {
    clientCache = null;
    return null;
  }

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
  const azureApiKey = process.env.AZURE_OPENAI_API_KEY || "";

  if (!clientCache || lastEndpoint !== endpoint || lastApiKey !== azureApiKey) {
    try {
      clientCache = new AzureOpenAI({
        endpoint,
        apiKey: azureApiKey,
        apiVersion: "2024-02-15-preview"
      });
      lastEndpoint = endpoint;
      lastApiKey = azureApiKey;
    } catch (e) {
      console.error("Failed to initialize Azure OpenAI Client", e);
      clientCache = null;
    }
  }

  return clientCache;
}

export async function analyzeCodeDiff(diff: string, customPrompt?: string) {
  const client = getAzureClient();
  if (!client) {
    console.warn("Azure OpenAI is not configured or failed to initialize. Returning null.");
    return null;
  }

  const deploymentId = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o";

  try {
    const systemPrompt = `You are ReviewAgent AI, an AI-powered Pull Request Security Auditor.
Your objective is to analyze GitHub Pull Request diffs and identify critical vulnerabilities, logical bugs, and style violations based on strict OWASP guidelines and SOLID principles.

You MUST respond ONLY with a strictly formatted JSON object matching the following structure. Do NOT wrap the JSON in Markdown backticks or provide any conversational text. 
Failure to return raw, parsable JSON will break the system.

{
  "findings": [
    {
      "severity": "Critical" | "High" | "Medium" | "Low",
      "category": "Security" | "Performance" | "Logic" | "Style",
      "fileName": "string (the file path)",
      "lineNumber": number (the approximate line number of the issue),
      "description": "string (A clear, concise explanation of the vulnerability or bug)",
      "fixSuggestion": "string (Optional: A one-to-three line code snippet showing the fix)"
    }
  ],
  "riskScore": number (0 to 100, representing overall risk),
  "confidenceScore": number (0 to 100, representing the AI's confidence in findings),
  "risk": "Critical" | "High" | "Medium" | "Low" (overall risk level),
  "aiSummary": "string (a 1-2 sentence high-level summary of the findings and changes)"
}

${customPrompt ? `Additional Team Rules:\n${customPrompt}` : ""}
`;

    const response = await client.chat.completions.create({
      model: deploymentId,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Please review the following PR diff:\n\n${diff}` }
      ],
      response_format: { type: "json_object" }
    });

    const choice = response.choices[0];
    if (choice?.message?.content) {
      return JSON.parse(choice.message.content);
    }
    
    throw new Error("No content returned from AI.");
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
}

export function fallbackMockData() {
  return {
    findings: [
      {
        severity: "Critical",
        category: "Security",
        fileName: "src/backend/auth.ts",
        lineNumber: 18,
        description: "The previous implementation concatenated unsanitized user input directly into the SQL query, exposing the database to SQL injection attacks. The proposed fix correctly uses parameterized queries.",
        fixSuggestion: "const query = \"SELECT * FROM users WHERE username = $1 AND password = $2\";"
      },
      {
        severity: "Medium",
        category: "Performance",
        fileName: "src/backend/auth.ts",
        description: "Ensure that the `username` column in the `users` table has an index to speed up authentication lookups, especially as the user base grows."
      }
    ],
    riskScore: 92,
    confidenceScore: 98,
    risk: "Critical",
    aiSummary: "The pull request refactors the authentication query to fix a critical SQL injection vulnerability, changing raw string concatenation to a parameterized query."
  };
}
