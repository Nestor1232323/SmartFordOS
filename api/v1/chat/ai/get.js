export default async function handler(req, res) {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  
  // Используем decodeURIComponent для корректной обработки кириллицы
  const apiKey = searchParams.get('key');
  const model = searchParams.get('model');
  const systemPrompt = searchParams.get('system_prompt');
  const userPrompt = searchParams.get('prompt');
  const temperature = searchParams.get('temp') || 0.7;
  const maxTokens = searchParams.get('tokens');

  if (!apiKey || !model || !userPrompt) {
    return res.status(400).send("Error: Missing parameters");
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [
            { role: "user", content: `System: ${systemPrompt}\nContext: ${userPrompt}` }
        ],
        temperature: parseFloat(temperature),
        max_tokens: maxTokens ? parseInt(maxTokens) : undefined
      })
    });

    const data = await response.json();
    res.status(200).send(data.choices[0].message.content);
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  }
}