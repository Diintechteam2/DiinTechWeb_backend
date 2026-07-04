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
You are generating a privacy policy draft and optionally a refund policy draft for a software product.

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

Refund Policy Specific Details:
- Generate refund policy: ${promptInputs.generateRefundPolicy ? 'Yes' : 'No'}
- Refund company processing buffer: ${promptInputs.refundBuffer || 'Not provided'}
- Refund gateway settlement time: ${promptInputs.gatewayTat || 'Not provided'}
- Refund rules/eligibility guidelines: ${promptInputs.refundRules || 'Not provided'}

Terms & Conditions Specific Details:
- Generate terms and conditions: ${promptInputs.generateTerms ? 'Yes' : 'No'}
- Terms and conditions guidelines/notes: ${promptInputs.termsNotes || 'Not provided'}

Write a realistic policy draft based on the provided details. Avoid fake company names. Keep the language professional and website-ready.

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
  },
  "refundPolicy": {
    "enabled": boolean,
    "content": {
      "introduction": "string",
      "eligibility": "string",
      "timeline": "string",
      "process": "string"
    }
  },
  "termsConditions": {
    "enabled": boolean,
    "content": {
      "introduction": "string",
      "userAgreement": "string",
      "intellectualProperty": "string",
      "userConduct": "string",
      "limitationLiability": "string",
      "governingLaw": "string",
      "contactUs": "string"
    }
  }
}

Rules:
- Every array must contain at least 2 meaningful items when relevant.
- If uploads or AI are not used, keep imageProcessing and disclaimer as empty strings.
- If details are missing, make conservative, generic assumptions rather than inventing risky specifics.
- Use the provided contact email in both dataDeletion.email and contactUs.email when possible.
- The generated policy draft (all text inside the JSON values) must be written in professional, clear English only, even if the input information or additional notes are in another language.
- If "Generate refund policy" is "No", set refundPolicy.enabled to false and keep all refundPolicy.content text fields as empty strings.
- If "Generate refund policy" is "Yes", set refundPolicy.enabled to true and populate all refundPolicy.content text fields. Explain the refund eligibility clearly (e.g. non-refundable if tokens are consumed), specify the processing timeline (company processing buffer + gateway standard settlement time), and detail how to request a refund.
- If "Generate terms and conditions" is "No", set termsConditions.enabled to false and keep all termsConditions.content text fields as empty strings.
- If "Generate terms and conditions" is "Yes", set termsConditions.enabled to true and populate all termsConditions.content text fields. Write comprehensive terms covering user agreement/eligibility, intellectual property, prohibited user conduct, limitation of liability, governing law, and support contact channels.
`.trim();
};

exports.generatePrivacyDraft = async ({ projectName, websiteUrl, promptInputs, provider = 'openai' }) => {
  const isGemini = provider?.toLowerCase() === 'gemini';

  if (isGemini) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in backend .env');
    }

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: buildPrompt({ projectName, websiteUrl, promptInputs })
                }
              ]
            }
          ],
          systemInstruction: {
            parts: [
              {
                text: 'You generate structured privacy policy drafts for admin panels. Always return valid JSON only.'
              }
            ]
          },
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.4
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini request failed: ${errorText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      throw new Error('Gemini returned an empty response');
    }

    const parsed = JSON.parse(fallbackJson(text));

    if (!parsed?.content) {
      throw new Error('Gemini response did not contain the expected content object');
    }

    if (!parsed.refundPolicy) {
      parsed.refundPolicy = {
        enabled: false,
        content: { introduction: '', eligibility: '', timeline: '', process: '' }
      };
    }

    if (!parsed.termsConditions) {
      parsed.termsConditions = {
        enabled: false,
        content: {
          introduction: '',
          userAgreement: '',
          intellectualProperty: '',
          userConduct: '',
          limitationLiability: '',
          governingLaw: '',
          contactUs: ''
        }
      };
    }

    return parsed;
  } else {
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

    if (!parsed.refundPolicy) {
      parsed.refundPolicy = {
        enabled: false,
        content: { introduction: '', eligibility: '', timeline: '', process: '' }
      };
    }

    if (!parsed.termsConditions) {
      parsed.termsConditions = {
        enabled: false,
        content: {
          introduction: '',
          userAgreement: '',
          intellectualProperty: '',
          userConduct: '',
          limitationLiability: '',
          governingLaw: '',
          contactUs: ''
        }
      };
    }

    return parsed;
  }
};
