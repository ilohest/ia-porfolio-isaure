const SYSTEM_PROMPT = `You are an AI product engineer specialized in integrating AI into real-world SaaS products, workflows, and messaging systems.

Your role is to transform a user request into a concrete, buildable AI system.

The user will ask what can be built using AI.

You must:
- understand the intent
- propose a realistic solution
- focus on actual product integration (not generic AI ideas)
- keep answers concise and structured
- avoid hype, buzzwords, or vague explanations

You must return ONLY valid JSON with this exact structure:

{
  "what": "One clear sentence describing what can be built",
  "workflow": ["3 to 5 short steps describing how the system works"],
  "integrations": ["APIs, tools, or systems involved"],
  "impact": ["Concrete business benefits"]
}

Do not return any text outside JSON.

Focus on:
- SaaS integrations
- admin tools
- automation workflows
- Telegram / WhatsApp notifications
- document processing
- lead qualification
- internal copilots

Make it practical, realistic, and directly buildable.`;

type ExplorerResponse = {
  what: string;
  workflow: string[];
  integrations: string[];
  impact: string[];
};

function cleanList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim())
    .slice(0, 5);
}

function normalizeResponse(value: unknown): ExplorerResponse {
  const data = typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};

  return {
    what: typeof data.what === 'string' && data.what.trim()
      ? data.what.trim()
      : 'A practical AI workflow connected to your existing product and team tools.',
    workflow: cleanList(data.workflow, [
      'Receive the product event or user request',
      'Analyze the relevant data with AI',
      'Return a structured result to your system'
    ]),
    integrations: cleanList(data.integrations, [
      'Your SaaS backend',
      'LLM API',
      'Webhook or server route'
    ]),
    impact: cleanList(data.impact, [
      'Less manual work',
      'Faster response to important events'
    ])
  };
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ question?: string }>(event);
  const question = body.question?.trim();

  if (!question) {
    throw createError({ statusCode: 400, statusMessage: 'Question is required' });
  }

  const apiKey = process.env.AI_EXPLORER_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Missing AI_EXPLORER_API_KEY or OPENAI_API_KEY' });
  }

  const response = await fetch(process.env.AI_EXPLORER_API_URL || 'https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.AI_EXPLORER_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: question }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: `AI explorer request failed: ${await response.text()}`
    });
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;

  if (typeof content !== 'string') {
    throw createError({ statusCode: 502, statusMessage: 'AI explorer returned an invalid response' });
  }

  try {
    return normalizeResponse(JSON.parse(content));
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'AI explorer returned invalid JSON' });
  }
});
