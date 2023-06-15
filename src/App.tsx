import { useState } from "react";
import "./App.css";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

function App() {
  const [message, setMessage] = useState("");
  const ffmpeg = createFFmpeg({
    log: true,
  });
  const doTranscode = async (file: any) => {
    setMessage("Loading ffmpeg-core.js");
    await ffmpeg.load();
    setMessage("transcoding...");
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(file));
    await ffmpeg.run("-i", "test.mp4", "-q:a", "0", "-map", "a", "sample.mp3");
    setMessage("Transcoding completed!");
    const data = ffmpeg.FS("readFile", "sample.mp3");
    const url = URL.createObjectURL(new Blob([data.buffer]));
    let el = document.createElement("a");
    el.href = url;
    el.download = "audio.mp3";
    el.click();
  };

  return (
    <>
      <div className="App">
        <p />
        <button
          id="download-button"
          onClick={() => document.getElementById("file-input")?.click()}
        >
          Extract Audio
        </button>
        <input
          type="file"
          name="file"
          id="file-input"
          hidden
          onChange={(e) => {
            if (e.target.files != null) {
              doTranscode(e.target.files[0]);
            }
          }}
        />
        <p>{message}</p>
      </div>
    </>
  );
}

export default App;
