"use client";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { DndContext, useDraggable } from "@dnd-kit/core";
import Draggable from "react-draggable";

export default function Home() {
  const [playerState, setPlayerState] = useState({
    url: "./video2.mp4",
    pip: false,
    playing: false,
    controls: true,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
  });
  const [cropSize, setCropSize] = useState({ width: 200, height: 200 }); // Default crop size

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const playerRef = useRef(null);
  const secondPlayer = useRef(null);

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handlePlay = () => {
    console.log("onPlay");

    setPlayerState({ ...playerState, playing: true });
  };

  const handlePause = () => {
    console.log("onPause");

    setPlayerState({ ...playerState, playing: false });
  };

  const handleDuration = (duration) => {
    console.log("onDuration", duration);

    setPlayerState({ ...playerState, duration });
  };

  const handleSeekMouseDown = (e) => {
    setPlayerState({ ...playerState, seeking: true });
  };

  const handleSeekChange = (e) => {
    setPlayerState({ ...playerState, played: parseFloat(e.target.value) });
  };

  const handleSeekMouseUp = (e) => {
    playerRef.current.seekTo(parseFloat(e.target.value));
    secondPlayer.current.seekTo(parseFloat(e.target.value));

    setPlayerState({ ...playerState, seeking: false });
  };

  return (
    <>
      <main className="flex min-h-[50vh] mb-8 justify-between px-24 gap-8 items-center">
        <div className="relative">
          <Draggable axis="x" bounds="parent" onDrag={handleDrag}>
            <div
              style={{
                width: cropSize.width,
              }}
              className={`absolute z-10 crop-div min-h-full grid grid-cols-4 grid-rows-4 border-[1px] border-white`}
            >
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
          <ReactPlayer
            ref={playerRef}
            url={playerState.url}
            playing={playerState.playing}
            controls={false}
            played={playerState.played}
            playbackRate={playerState.playbackRate}
            volume={playerState.volume}
            muted={playerState.muted}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={(e) => console.log("onSeek", e)}
            onDuration={handleDuration}
          />
        </div>
        <div
          style={{
            width: cropSize.width,
          }}
          className="overflow-hidden"
        >
          <ReactPlayer
            style={{
              marginLeft: `-${position.x}px`,
            }}
            // width={position.x}
            ref={secondPlayer}
            muted={true}
            url={playerState.url}
            played={playerState.played}
            playbackRate={playerState.playbackRate}
            playing={playerState.playing}
            controls={false}
          />
        </div>
        <div className="ml-4">
          <h2>Crop Data</h2>
          <p>X: {position.x}</p>
          <p>Y: {position.y}</p>
        </div>
      </main>
      <div className="flex gap-8">
        <button
          onClick={() =>
            setPlayerState({ ...playerState, playing: !playerState.playing })
          }
        >
          play/pause
        </button>
        <div>
          <span>Seekbar</span>
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={playerState.played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
          />
        </div>

        <div>
          <h2>Playback Rate</h2>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={playerState.playbackRate}
            onChange={(e) =>
              setPlayerState({
                ...playerState,
                playbackRate: parseFloat(e.target.value),
              })
            }
          />
          <p>Current Playback Rate: {playerState.playbackRate}</p>
        </div>

        <div className="text-black">
          <span className="text-white">Change Aspect Ratio</span>

          <select
            value={(cropSize.width / cropSize.height).toFixed(2)}
            onChange={(e) => {
              const aspectRatio = parseFloat(e.target.value);
              setCropSize({
                width: cropSize.height * aspectRatio,
                height: cropSize.height,
              });
            }}
          >
            <option value={(16 / 9).toFixed(2)}>16:9</option>
            <option value={(4 / 3).toFixed(2)}>4:3</option>
            <option value="1.00">1:1</option>
          </select>
        </div>

        <div>
          <h2>Volume Control</h2>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={playerState.volume}
            onChange={(e) =>
              setPlayerState({
                ...playerState,
                volume: parseFloat(e.target.value),
              })
            }
          />
          <p>Current Volume: {playerState.volume}</p>
        </div>
      </div>
    </>
  );
}
