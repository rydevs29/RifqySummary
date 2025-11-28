export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { text } = req.body;
    
    // Ganti dengan API Key Hugging Face kamu di Vercel Environment Variables
    const API_KEY = process.env.HF_API_KEY; 
    const MODEL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

    try {
        const response = await fetch(MODEL, {
            headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                inputs: text,
                parameters: { min_length: 50, max_length: 200, do_sample: false }
            }),
        });

        const result = await response.json();

        if (result.error || !response.ok) throw new Error(result.error || "AI Error");

        return res.status(200).json({ summary: result[0].summary_text });

    } catch (error) {
        return res.status(503).json({ error: 'AI Service Busy', fallback: true });
    }
}
