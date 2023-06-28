import { useState } from "react";
import { NiconicoReactVjs, Comments } from "../dist";
import "../niconico-react-vjs/style.css";
import React from "react";

function App() {
  const defaultVideo = "sm42402256";
  const [videoId, setVideoId] = useState(defaultVideo);
  const [videoIdState, setVideoIdState] = useState("");

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setVideoIdState(e.target.value);
  };

  const handleClick = () => {
    setVideoId(videoIdState);
  };

  return (
    <div>
      <NiconicoReactVjs
        videoid={videoId}
        autoPlay
        controls
        width={1280}
        height={720}
      >
        <Comments />
      </NiconicoReactVjs>

      <input
        type="text"
        onChange={handleChange}
        placeholder={defaultVideo}
      ></input>
      <button type="submit" onClick={handleClick}>
        Submit
      </button>
    </div>
  );
}

export default App;
