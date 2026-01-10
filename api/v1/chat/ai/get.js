export default async function handler(req, res) {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  
  const apiKey = searchParams.get('key');
  const model = searchParams.get('model');
  const systemPrompt = searchParams.get('system_prompt');
  const userPrompt = searchParams.get('prompt'); // Добавим сам текст вопроса
  const temperature = searchParams.get('temp') || 0.7;
  const maxTokens = searchParams.get('tokens');

  if (!apiKey || !model || !userPrompt) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const fullContent = `System Instruction: ${systemPrompt}\n${userPrompt}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: fullContent }],
        temperature: parseFloat(temperature),
        max_tokens: maxTokens ? parseInt(maxTokens) : undefined
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      // Возвращаем чистый текст для упрощения обработки в VBA
      res.status(200).send(data.choices[0].message.content);
    } else {
      res.status(500).send(data.error?.message || "AI Error");
    }
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
}