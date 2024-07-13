"use client";
import React, { useRef } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ url }) => {
  const playerRef = useRef(null);

  return (
    <div>
      <ReactPlayer
        ref={playerRef}
        url={url}
        controls
        width="100%"
        height="auto"
      />
    </div>
  );
};

export default VideoPlayer;
