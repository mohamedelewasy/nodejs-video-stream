import express from "express";
import path from "path";
import fs from "fs";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/video", (req, res) => {
  if (!req.headers.range)
    res.status(400).json({ message: "range headers not found" });

  const videoPath = path.join(__dirname, "../assets/video.mp4");
  const videoSize = fs.statSync(videoPath).size;
  const chunkSize = 10 ** 6;
  const start = Number(req.headers.range?.replace(/\D/g, ""));
  const end = Math.min(start + chunkSize, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": `bytes`,
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });

  videoStream.pipe(res);
});

app.listen(3030, () => console.log("server runs on port 3030"));
