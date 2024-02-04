import React, { useState, useEffect } from "react";
import axios from "axios";
import { useOverlays, OverlayProvider } from "./OverlayContext";
import "../styles/OverlayManager.css";

function OverlayManager() {
  const [overlayText, setOverlayText] = useState("write your title here");
  const [position, setPosition] = useState("Top Right");
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [overlayWidth, setOverlayWidth] = useState(98);
  const [overlayHeight, setOverlayHeight] = useState(98);
  const { overlays, setOverlays } = useOverlays();
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchOverlays = async () => {
      const response = await axios.get("https://backend-gyz3.onrender.com/overlay");
      setOverlays(response.data);
    };
    fetchOverlays();
  }, []);

  const normalizePosition = (pos) => {
    return pos
      .replace("-", " ")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const validateInput = () => {
    if (!overlayText.trim()) {
      alert("Overlay text cannot be empty!");
      return false;
    }

    const validPositions = [
      "Top Left",
      "Top Right",
      "Bottom Left",
      "Bottom Right",
    ];

    if (!validPositions.includes(normalizePosition(position))) {
      alert("Invalid position selected!");
      return false;
    }

    if (
      isNaN(posX) ||
      isNaN(posY) ||
      isNaN(overlayWidth) ||
      isNaN(overlayHeight) ||
      posX < 0 ||
      posY < 0 ||
      overlayWidth <= 0 ||
      overlayHeight <= 0
    ) {
      alert(
        "Position X, Position Y, Width, and Height must be positive values!"
      );
      return false;
    }

    return true;
  };

  const editOverlay = (overlay) => {
    setOverlayText(overlay.content);
    setPosition(overlay.position);
    setPosX(overlay.x);
    setPosY(overlay.y);
    setOverlayWidth(overlay.width);
    setOverlayHeight(overlay.height);
    setEditingId(overlay._id);
  };

  const deleteOverlay = async (id) => {
    try {
      await axios.delete(`https://backend-gyz3.onrender.com/overlay/${id}`);
      setOverlays((prevOverlays) =>
        prevOverlays.filter((overlay) => overlay._id !== id)
      );
    } catch (error) {
      console.error("Error deleting overlay:", error.response.data);
    }
  };

  const addOrUpdateOverlay = async () => {
    if (!validateInput()) return;

    const endpoint = editingId
      ? `https://backend-gyz3.onrender.com/overlay/${editingId}`
      : "https://backend-gyz3.onrender.com/overlay";

    try {
      let response;

      if (editingId) {
        response = await axios.put(endpoint, {
          content: overlayText,
          position: position,
          x: posX,
          y: posY,
          width: overlayWidth,
          height: overlayHeight,
        });
      } else {
        response = await axios.post(endpoint, {
          content: overlayText,
          position: position,
          x: posX,
          y: posY,
          width: overlayWidth,
          height: overlayHeight,
        });
      }

      if (response.data.success) {
        const refreshOverlays = async () => {
          const response = await axios.get("https://backend-gyz3.onrender.com/overlay");
          setOverlays(response.data);
        };
        refreshOverlays();
        setEditingId(null);
      }
    } catch (error) {
      console.log("Sending position:", position);
      console.error("Error adding or updating overlay:", error.response.data);
    }
  };

  return (
    <div className="overlay-manager">
      <h2>Overlay CURD</h2>
      <div>
        <label>Overlay titile:</label>
        <input
          type="text"
          value={overlayText}
          onChange={(e) => setOverlayText(e.target.value)}
        />
      </div>
      <div>
        <label>Alignment:</label>
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          <option value="Top Left">Top Left</option>
          <option value="Top Right">Top Right</option>
          <option value="Bottom Left">Bottom Left</option>
          <option value="Bottom Right">Bottom Right</option>
        </select>
      </div>
      <div>
        <label>Height:</label>
        <input
          type="number"
          value={overlayHeight}
          onChange={(e) => setOverlayHeight(e.target.value)}
        />
      </div>
      <div>
        <label>Width:</label>
        <input
          type="number"
          value={overlayWidth}
          onChange={(e) => setOverlayWidth(e.target.value)}
        />
      </div>
      <div>
        <label>Left:</label>
        <input
          type="number"
          value={posX}
          onChange={(e) => setPosX(e.target.value)}
        />
      </div>
      <div>
        <label>Top :</label>
        <input
          type="number"
          value={posY}
          onChange={(e) => setPosY(e.target.value)}
        />
      </div>
      
      <button onClick={addOrUpdateOverlay}>CURD Overlay</button>
      <div className="saved-overlays">
        {overlays.map((overlay) => (
          <div
            key={overlay._id}
            className="overlay-item"
          >
            <p>Content: {overlay.content}</p>
            <p>Position: {overlay.position}</p>
            <p>
              Position X: {overlay.x}, Position Y: {overlay.y}
            </p>
            <p>
              Width: {overlay.width}, Height: {overlay.height}
            </p>
            <button onClick={() => editOverlay(overlay)}>Edit</button>
            <button onClick={() => deleteOverlay(overlay._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OverlayManager;
