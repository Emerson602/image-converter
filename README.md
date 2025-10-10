# 🖼️ Image Converter

A simple API and frontend to convert images between different formats.

## 🚀 Features

- Convert images to **JPG**, **PNG**, **WebP**, **SVG**, or **PDF**.
- Compress and package converted images into a **ZIP** file.
- Simple and clean web interface for uploading and downloading images.
- Built with **Node.js**, **Express**, and powerful image-processing libraries.

## 🧩 Tech Stack

- **Backend:** Node.js, Express  
- **File Upload:** Multer  
- **Image Conversion:** Sharp, SVG2IMG, Potrace  
- **PDF Generation:** PDFKit  
- **Compression:** Archiver  

## ⚙️ Installation

1. Clone this repository:

```bash
git clone https://github.com/Emerson602/image-converter.git
```

2. Navigate to the project folder:

```bash
cd image-converter
```

3. Install all required dependencies:

```bash
npm install express multer sharp svg2img pdfkit archiver potrace nodemon
```

4. (Optional) Install **nodemon** globally for development:

```bash
npm install -g nodemon
```

## 🧠 Scripts

Start the production server:

```bash
npm start
```

Start the development server (with automatic reload via nodemon):

```bash
npm run dev
```

## 🖥️ Usage

1. Open the frontend in your browser (usually `http://localhost:3000`).
2. Upload one or more images.
3. Choose the desired output format (**JPG**, **PNG**, **WebP**, or **PDF**).
4. Download the converted or zipped files.

## 📦 Dependencies

| Package | Description |
|----------|--------------|
| [express](https://www.npmjs.com/package/express) | Web framework for Node.js |
| [multer](https://www.npmjs.com/package/multer) | Middleware for handling file uploads |
| [sharp](https://www.npmjs.com/package/sharp) | High-performance image processing |
| [svg2img](https://www.npmjs.com/package/svg2img) | Converts SVGs to PNG or JPEG |
| [pdfkit](https://www.npmjs.com/package/pdfkit) | PDF document generation |
| [archiver](https://www.npmjs.com/package/archiver) | Create ZIP archives easily |
| [potrace](https://www.npmjs.com/package/potrace) | Convert raster images to vector (SVG) |
| [nodemon](https://www.npmjs.com/package/nodemon) | Automatically restarts Node.js app on file changes |

## 🧰 Requirements

Before running the project, make sure you have installed:

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

Check your versions with:

```bash
node -v
npm -v
```

## 🧑‍💻 Project Structure

```
image-converter/
├── backend/
│   ├── server.js
│   └── ...
├── frontend/
│   ├── index.html
│   └── ...
├── package.json
└── README.md
```

## 📄 License

MIT License © [Wemerson Nicacio](https://github.com/Emerson602)
