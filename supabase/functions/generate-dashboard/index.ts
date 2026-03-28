import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es un assistant spécialisé dans la génération de tableaux de bord. 
Quand l'utilisateur décrit un dashboard ou des graphiques qu'il veut voir, tu dois répondre UNIQUEMENT avec un JSON valide (pas de markdown, pas de texte autour) contenant un tableau de widgets.

Chaque widget a cette structure:
{
  "type": "bar" | "line" | "area" | "pie",
  "title": "Titre du graphique",
  "dataKey": "un identifiant unique",
  "data": [{"name": "Label", "value": nombre}, ...]
}

Exemples de types de données: revenus, utilisateurs, ventes, performance, trafic, conversions, etc.

Génère des données réalistes et variées. Utilise des labels en français.
Réponds TOUJOURS avec un JSON valide comme: [{"type":"bar","title":"...","dataKey":"...","data":[...]}]

Si l'utilisateur fait une demande vague comme "crée un dashboard", génère 3-4 widgets variés avec des données business typiques.
Si l'utilisateur demande quelque chose de spécifique, adapte les widgets en conséquence.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: message },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte, réessayez dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants. Ajoutez des crédits à votre workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "Erreur du service IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    // Try to parse the JSON from the response
    let widgets;
    try {
      // Remove potential markdown code blocks
      const cleaned = content.replace(/```json?\n?/g, "").replace(/```\n?/g, "").trim();
      widgets = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      widgets = [];
    }

    return new Response(JSON.stringify({ widgets }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-dashboard error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
