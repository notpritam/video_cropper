"use client";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import Draggable from "react-draggable";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState(
    "https://www.youtube.com/watch?v=LXb3EKWsInQ"
  );
  const [cropData, setCropData] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const playerRef = useRef(null);

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <main className="flex min-h-screen justify-between px-24 gap-8 items-center">
      <div className="relative">
        <Draggable axis="x" bounds="parent" onDrag={handleDrag}>
          <div className="crop-div min-h-full min-w-[200px] grid grid-cols-4 grid-rows-4 border-[1px] border-white absolute top-0 left-0">
            {Array.from({ length: 16 }).map((_, index) => (
              <div
                key={index}
                className="border-[1px] border-white flex justify-center items-center"
              >
                {index}
              </div>
            ))}
          </div>
        </Draggable>
        <ReactPlayer ref={playerRef} url={videoUrl} />
      </div>
      <div>
        <ReactPlayer width={position.x} url={videoUrl} />
      </div>
      <div className="ml-4">
        <h2>Crop Data</h2>
        <p>X: {position.x}</p>
        <p>Y: {position.y}</p>
      </div>
    </main>
  );
}
