import { useState } from "react";
import { NiconicoReactVjs } from "../niconico-react-vjs";
import Comments from "../niconico-react-vjs/comments";
import "../niconico-react-vjs/style.css";

function App() {
  const defaultVideo = "sm34484275";
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
        <Comments></Comments>
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
