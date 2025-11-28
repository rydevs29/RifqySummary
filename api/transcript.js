import { YoutubeTranscript } from 'youtube-transcript';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;

    try {
        // 1. Validasi URL YouTube
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
            throw new Error("Bukan link YouTube yang valid");
        }

        // 2. Ambil Transkrip
        // Mengambil array transcript dan menggabungkannya jadi satu teks panjang
        const transcriptItems = await YoutubeTranscript.fetchTranscript(url);
        const fullText = transcriptItems.map(item => item.text).join(' ');

        // 3. Kirim balik teksnya
        return res.status(200).json({ text: fullText });

    } catch (error) {
        console.error("Transcript Error:", error);
        return res.status(500).json({ 
            error: 'Gagal mengambil transkrip. YouTube mungkin memblokir server.',
            details: error.message 
        });
    }
}
