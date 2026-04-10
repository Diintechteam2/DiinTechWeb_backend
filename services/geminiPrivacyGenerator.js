const fallbackJson = (text) => {
  const trimmed = text.trim();

  if (trimmed.startsWith('{')) {
    return trimmed;
  }

  const fencedMatch = trimmed.match(/```json\s*([\s\S]*?)```/i) || trimmed.match(/```\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
};

const buildPrompt = ({ projectName, websiteUrl, promptInputs }) => {
  const normalizedWebsiteUrl = websiteUrl || '';
  const domain = normalizedWebsiteUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const fallbackEmail = domain ? `privacy@${domain}` : 'contact@example.com';

  return `
You are generating a privacy policy draft for a software product.

Return ONLY valid JSON. Do not return markdown, explanation, or code fences.

Project details:
- Project name: ${projectName}
- Website URL: ${websiteUrl || 'Not provided'}
- Project description: ${promptInputs.projectDescription || 'Not provided'}
- Target users: ${promptInputs.targetUsers || 'Not provided'}
- Core features: ${promptInputs.coreFeatures || 'Not provided'}
- Data collected: ${promptInputs.dataCollected || 'Not provided'}
- Third-party services used: ${promptInputs.thirdPartyServices || 'Not provided'}
- Additional notes: ${promptInputs.additionalNotes || 'Not provided'}
- Has login/signup: ${promptInputs.hasAuthentication ? 'Yes' : 'No'}
- Has file/image uploads: ${promptInputs.hasUploads ? 'Yes' : 'No'}
- Uses AI-generated output: ${promptInputs.usesAI ? 'Yes' : 'No'}
- Has payments/subscriptions: ${promptInputs.hasPayments ? 'Yes' : 'No'}
- Contact email: ${promptInputs.contactEmail || fallbackEmail}

Write a realistic privacy policy draft based on the provided details. Avoid fake company names. Keep the language professional and website-ready.

Return this exact JSON shape:
{
  "content": {
    "introduction": "string",
    "informationCollect": {
      "personal": ["string"],
      "userContent": ["string"],
      "deviceUsage": ["string"]
    },
    "howWeUse": ["string"],
    "dataSharing": ["string"],
    "dataSecurity": "string",
    "dataRetention": "string",
    "dataDeletion": {
      "instruction": "string",
      "email": "string",
      "subject": "string"
    },
    "childrenPrivacy": "string",
    "thirdParty": "string",
    "changesToPolicy": "string",
    "imageProcessing": "string",
    "disclaimer": "string",
    "contactUs": {
      "instruction": "string",
      "email": "string"
    }
  }
}

Rules:
- Every array must contain at least 2 meaningful items when relevant.
- If uploads or AI are not used, keep imageProcessing and disclaimer as empty strings.
- If details are missing, make conservative, generic assumptions rather than inventing risky specifics.
- Use the provided contact email in both dataDeletion.email and contactUs.email when possible.
`.trim();
};

exports.generatePrivacyDraft = async ({ projectName, websiteUrl, promptInputs }) => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    throw new Error('OPENAI_KEY or OPENAI_API_KEY is not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: {
        type: 'json_object'
      },
      messages: [
        {
          role: 'system',
          content:
            'You generate structured privacy policy drafts for admin panels. Always return valid JSON only.'
        },
        {
          role: 'user',
          content: buildPrompt({ projectName, websiteUrl, promptInputs })
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${errorText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || '';

  if (!text) {
    throw new Error('OpenAI returned an empty response');
  }

  const parsed = JSON.parse(fallbackJson(text));

  if (!parsed?.content) {
    throw new Error('OpenAI response did not contain the expected content object');
  }

  return parsed;
};
