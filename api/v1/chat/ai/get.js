export default async function handler(req, res) {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  
  // Пробуем взять либо 'api', либо 'key' для надежности
  const apiKey = searchParams.get('api') || searchParams.get('key');
  const model = searchParams.get('model');
  const systemPrompt = searchParams.get('system_prompt') || "";
  const userPrompt = searchParams.get('prompt');
  const temperature = searchParams.get('temp') || "0.7";
  const maxTokens = searchParams.get('tokens');

  // Отладка в консоль Vercel
  console.log("Params received:", { model, hasKey: !!apiKey, hasPrompt: !!userPrompt });

  if (!apiKey || !model || !userPrompt) {
    return res.status(400).send(`Error: Missing parameters. Key: ${!!apiKey}, Model: ${!!model}, Prompt: ${!!userPrompt}`);
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
          { role: "user", content: `System: ${systemPrompt}\n\n${userPrompt}` }
        ],
        temperature: parseFloat(temperature),
        max_tokens: maxTokens ? parseInt(maxTokens) : undefined
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      res.status(200).send(data.choices[0].message.content);
    } else {
      res.status(500).send(data.error?.message || "OpenRouter Error");
    }
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
}