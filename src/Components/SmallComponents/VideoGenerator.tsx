import { useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = new FFmpeg(); // Persistent instance

interface VideoGeneratorProps {
  instrumentalFile: string;
  lyrics: Array<{ start: number; end: number; text: string }> | null;
  duration: number;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({
  instrumentalFile,
  lyrics,
  duration,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isFFmpegReady, setIsFFmpegReady] = useState(false);

  // Load FFmpeg once
  useEffect(() => {
    const loadFFmpeg = async () => {
      if (!ffmpeg.loaded) {
        await ffmpeg.load();
        setIsFFmpegReady(true);
        console.log("FFmpeg is loaded");
      }
    };
    loadFFmpeg();
  }, []);

  const generateVideo = async () => {
    if (!isFFmpegReady || !instrumentalFile || !lyrics || !canvasRef.current || !duration) {
      console.error("Missing required data for video generation.");
      return;
    }

    console.log("Generating video...");
    setLoading(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fps = 30;
    const totalFrames = Math.floor(duration * fps);

    // Prepare frames
    console.log("Generating frames...");
    for (let frame = 0; frame < totalFrames; frame++) {
      const time = frame / fps;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";

      const lyric = lyrics.find((lyric) => time >= lyric.start && time <= lyric.end);
      if (lyric) ctx.fillText(lyric.text, canvas.width / 2, canvas.height / 2);

      const frameBlob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), "image/png")
      );

      await ffmpeg.writeFile(`frame${frame.toString().padStart(4, "0")}.png`, await fetchFile(frameBlob));
    }

    console.log("Writing audio file...");
    await ffmpeg.writeFile("audio.mp3", await fetchFile(instrumentalFile));

    console.log("Encoding video...");
    await ffmpeg.exec([
      "-framerate",
      `${fps}`,
      "-i",
      "frame%04d.png", // Correct frame numbering format
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "output.mp4",
    ]);

    console.log("Merging audio...");
    await ffmpeg.exec([
      "-i",
      "output.mp4",
      "-i",
      "audio.mp3",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "final.mp4",
    ]);

    console.log("Retrieving video...");
    const data = await ffmpeg.readFile("final.mp4");
    const url = URL.createObjectURL(new Blob([data], { type: "video/mp4" }));
    setVideoUrl(url);
    setLoading(false);
  };

  return (
    <div>
      <canvas ref={canvasRef} width={1280} height={720} hidden />
      <button onClick={generateVideo} disabled={loading || !isFFmpegReady}>
        {loading ? "Generating..." : isFFmpegReady ? "Generate MP4" : "Loading FFmpeg..."}
      </button>
      {videoUrl && (
        <a href={videoUrl} download="lyrics_video.mp4">
          <button>Download MP4</button>
        </a>
      )}
    </div>
  );
};
