const https = require("https");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key not configured. Add ANTHROPIC_API_KEY in Netlify environment variables." }),
    };
  }

  try {
    const { system, content, messages, max_tokens } = JSON.parse(event.body);

    const requestBody = JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: max_tokens || 2000,
      system: system || "",
      messages: messages || [{ role: "user", content: content }],
    });

    const data = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: "api.anthropic.com",
          path: "/v1/messages",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "Content-Length": Buffer.byteLength(requestBody),
          },
        },
        (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => {
            try { resolve(JSON.parse(body)); }
            catch (e) { reject(new Error("Invalid response: " + body.substring(0, 200))); }
          });
        }
      );
      req.on("error", reject);
      req.write(requestBody);
      req.end();
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
