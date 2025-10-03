import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import svg2img from "svg2img";
import PDFDocument from "pdfkit";

const app = express();
const PORT = 3000;


const upload = multer({ dest: "backend/uploads/" });

app.use(express.json());
app.use(express.static("frontend"));


app.post("/convert", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const format = req.body.format; 

    if (!file) {
      return res.status(400).send("Nenhum arquivo enviado.");
    }

    const ext = path.extname(file.originalname);
    const inputPath = file.path;
    const outputPath = `backend/uploads/${Date.now()}.${format}`;

 
    if (format === "svg") {
      return res.status(400).send("Conversão para SVG não suportada.");
    }


    if (format === "pdf") {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);
      doc.image(inputPath, {
        fit: [500, 700],
        align: "center",
        valign: "center"
      });
      doc.end();
      stream.on("finish", () => {
        res.download(outputPath, `convertido.${format}`, () => {
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        });
      });
      return;
    }


    if (ext === ".svg" || file.mimetype === "image/svg+xml") {
      svg2img(fs.readFileSync(inputPath, "utf8"), { format }, (err, buffer) => {
        if (err) return res.status(500).send("Erro na conversão SVG.");
        fs.writeFileSync(outputPath, buffer);
        res.download(outputPath, `convertido.${format}`, () => {
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        });
      });
    } else {
    
      await sharp(inputPath).toFormat(format).toFile(outputPath);

      res.download(outputPath, `convertido.${format}`, () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro na conversão.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
