import pdf from "pdf-parse";

export const config = {
  api: {
    bodyParser: false, // Disable default body parser
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const buffers = [];
    req.on("data", (chunk) => buffers.push(chunk));
    req.on("end", async () => {
      const fileBuffer = Buffer.concat(buffers);
      try {
        const data = await pdf(fileBuffer);
        res.status(200).json({ text: data.text });
      } catch (error) {
        console.error("Error parsing PDF:", error);
        res.status(500).json({ error: "Failed to parse the PDF file." });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed. Use POST." });
  }
}
