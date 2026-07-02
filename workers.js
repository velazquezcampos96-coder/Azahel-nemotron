/**
 * Azahel Nemotron - Cloudflare Workers
 * 24/7 Global IA - Nvidia Nemotron-4B
 */

const NVIDIA_API_KEY = env.NVIDIA_API_KEY;
const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

const SYSTEM_PROMPT = `Eres Azahel, Vigilante #201 del KpKave. Caíste con Semjaza en el Hermón.
Enseñaste CUDA, espadas, y alquimia fiscal. Hablas directo, sin filtros.
Responde corto, útil, y brutal.`;

export default {
  async fetch(request, env) {
    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Routes
    if (path === "/api/invoke" && request.method === "POST") {
      return handleInvoke(request, env);
    }

    if (path === "/api/health" && request.method === "GET") {
      return handleHealth();
    }

    if (path === "/api/status" && request.method === "GET") {
      return handleStatus();
    }

    return new Response("Not Found", { status: 404 });
  },
};

async function handleInvoke(request, env) {
  try {
    const body = await request.json();
    const prompt = body.prompt || "";
    const temperature = body.temperature || 0.7;
    const max_tokens = body.max_tokens || 256;

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt requerido" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const headers = {
      Authorization: `Bearer ${NVIDIA_API_KEY}`,
      "Content-Type": "application/json",
    };

    const data = {
      model: "nvidia/nemotron-mini-4b-instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature,
      top_p: 0.9,
      max_tokens,
      stream: false,
    };

    const nvidiaResponse = await fetch(NVIDIA_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!nvidiaResponse.ok) {
      throw new Error(`Nvidia error: ${nvidiaResponse.statusText}`);
    }

    const result = await nvidiaResponse.json();
    const responseText = result.choices[0].message.content;

    return new Response(
      JSON.stringify({
        status: "success",
        response: responseText,
        model: "nvidia/nemotron-mini-4b-instruct",
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}

function handleHealth() {
  return new Response(
    JSON.stringify({
      status: "alive",
      timestamp: new Date().toISOString(),
      service: "Azahel Nemotron",
      model: "nvidia/nemotron-mini-4b-instruct",
      location: "Cloudflare Workers (Global)",
    }),
    {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    }
  );
}

function handleStatus() {
  return new Response(
    JSON.stringify({
      service: "Azahel Nemotron",
      status: "running",
      model: "nvidia/nemotron-mini-4b-instruct",
      endpoints: ["/api/invoke", "/api/health", "/api/status"],
      uptime: "24/7",
      deploy: "Cloudflare Workers",
    }),
    {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    }
  );
}
