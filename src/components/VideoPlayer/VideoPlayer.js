import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import "../styles/VideoPlayer.css";
import { useOverlays, OverlayProvider } from "./OverlayContext";

function getPositionCoordinates(position, x, y, overlayWidth, overlayHeight) {
  switch (position) {
    case "Top Left":
      return { top: y + "px", left: x + "px" };
    case "Top Right":
      return { top: y + "px", right: x + "px" };
    case "Bottom Left":
      return { bottom: y + "px", left: x + "px" };
    case "Bottom Right":
      return { bottom: y + "px", right: x + "px" };
    default:
      return { top: y + "px", left: x + "px" };
  }
}

function VideoPlayer() {
  const { overlays } = useOverlays();
  const [videoUrl, setVideoUrl] = useState(
    "https://youtu.be/LvvIcZWtuoY?si=pCnhdayobaTEwGuH"
  );
  const [inputValue, setInputValue] = useState(videoUrl);

  useEffect(() => {
    axios
      .get("https://backend-gyz3.onrender.com/overlay")
      .then((response) => {
        if (
          Array.isArray(response.data) &&
          response.data[0].position &&
          response.data[0].x !== undefined &&
          response.data[0].y !== undefined
        ) {
          setOverlays(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching overlays:", error);
      });
  }, []);

  return (
    <div className="video-player-container">
      

      <div
        className="video-wrapper"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <ReactPlayer
          url={videoUrl}
          controls={true}
          playing={true}
          width="640px"
          height="360px"
        />

        {overlays.map((overlay) => {
          const coordinates = getPositionCoordinates(
            overlay.position,
            overlay.x,
            overlay.y
          );

          return (
            <div
              key={overlay._id}
              style={{
                position: "absolute",
                ...coordinates,
                width: `${overlay.width}px`,
                height: `${overlay.height}px`,
                background: "rgba(255,255,255,0.6)",
                border: "1px solid black",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              {overlay.content}
            </div>
          );
        })}
        <div className="video-input-container">
        <input
          type="text"
          placeholder="Enter video link..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={() => setVideoUrl(inputValue)}>Put new link</button>
      </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
