import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import svg2img from "svg2img";
import PDFDocument from "pdfkit";
import { trace } from "potrace";
import archiver from "archiver"; 
const app = express();
const PORT = 3000;


const upload = multer({
  dest: "backend/uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 10                  
  }
});

app.use(express.json());
app.use(express.static("frontend"));
app.use("/uploads", express.static("backend/uploads"));


app.post("/convert", upload.array("images", 10), async (req, res) => {
  try {
    const files = req.files;
    const format = req.body.format;
    const downloadType = req.body.downloadType || "zip";

    if (!files || files.length === 0) {
      return res.status(400).send("Nenhum arquivo enviado.");
    }

    const outputFiles = [];

    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      const inputPath = file.path;
      const outputPath = `backend/uploads/${Date.now()}-${file.originalname.split(".")[0]}.${format}`;

      if (format === "pdf") {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);
        doc.image(inputPath, { fit: [500, 700], align: "center", valign: "center" });
        doc.end();
        await new Promise(resolve => stream.on("finish", resolve));
      } else if (format === "svg") {
        await new Promise((resolve, reject) => {
          trace(inputPath, (err, svg) => {
            if (err) return reject(err);
            fs.writeFileSync(outputPath, svg);
            resolve();
          });
        });
      } else if (ext === ".svg" || file.mimetype === "image/svg+xml") {
        await new Promise((resolve, reject) => {
          const svgContent = fs.readFileSync(inputPath, "utf8");
          svg2img(svgContent, { format }, (err, buffer) => {
            if (err) return reject(err);
            fs.writeFileSync(outputPath, buffer);
            resolve();
          });
        });
      } else {
        await sharp(inputPath).toFormat(format).toFile(outputPath);
      }

      fs.unlinkSync(inputPath);

      outputFiles.push(outputPath);
    }

    if (downloadType === "zip") {
      const zipPath = `backend/uploads/${Date.now()}.zip`;
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      archive.pipe(output);
      outputFiles.forEach(f => archive.file(f, { name: path.basename(f) }));
      archive.finalize();

      output.on("close", () => {
        res.download(zipPath, "convertidos.zip", () => {
          if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
          outputFiles.forEach(f => fs.existsSync(f) && fs.unlinkSync(f));
        });
      });
    } else {
      // Retornar as imagens individualmente
      const publicUrls = outputFiles.map(f => `/${f.replace("backend/", "")}`);
      res.json({ files: publicUrls });
    }

  } catch (err) {
    console.error(err);
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send("Cada arquivo deve ter no máximo 5MB.");
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).send("Máximo de 10 arquivos permitido.");
    }
    res.status(500).send("Erro na conversão.");
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
