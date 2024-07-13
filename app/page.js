"use client";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { DndContext, useDraggable } from "@dnd-kit/core";
import Draggable from "react-draggable";
import PlayImage from "@/public/play.svg";
import VolumeImage from "@/public/volume.svg";
import PreviewImage from "@/public/preview.svg";
import Image from "next/image";

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
      <main className="flex max-h-screen min-h-screen min-w-screen bg-black  justify-center gap-8 items-center">
        <div className="bg-[#37393F] h-[668px] max-w-[75%]  w-full rounded-lg gap-4 flex flex-col">
          <div className="flex justify-between items-center px-4 pt-4">
            <span className="font-bold text-white">Cropper</span>

            <div className="flex bg-[#45474E] rounded-md p-1 ">
              <div className="flex cursor-pointer justify-center items-center  px-3">
                <span>Preview Session</span>
              </div>
              <div className="flex cursor-pointer justify-center rounded-md items-center p-2 bg-[#37393F] px-3">
                <span>Generate Session</span>
              </div>
            </div>
            <div></div>
          </div>
          <div className="grid grid-cols-2 w-full px-4 h-full">
            <div className="w-full flex flex-col gap-4">
              <div className="h-[307px]">
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
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center w-full ">
                  <Image src={PlayImage} alt="Pause Play Control" />
                  <div className="w-full">
                    <input
                      type="range"
                      min={0}
                      max={0.999999}
                      className="w-full"
                      step="any"
                      value={playerState.played}
                      onMouseDown={handleSeekMouseDown}
                      onChange={handleSeekChange}
                      onMouseUp={handleSeekMouseUp}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex font-medium text-sm gap-[5px]">
                    <span>00:00:19</span> <span className="opacity-50">|</span>
                    <span className="opacity-50">00:00:19</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src={VolumeImage} alt="Volume Control" />
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
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div>
                  <select
                    className="border-1 border-[#45474E] text-[white] px-[10px] py-[7px] bg-transparent"
                    value={playerState.playbackRate}
                    onChange={(e) =>
                      setPlayerState({
                        ...playerState,
                        playbackRate: parseFloat(e.target.value),
                      })
                    }
                  >
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((value) => (
                      <option
                        className="bg-transparent "
                        key={value}
                        value={value}
                      >
                        {value}x
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    className="border-1 border-[#45474E] text-[white] px-[10px] py-[7px] bg-transparent"
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
              </div>
            </div>
            <div className="flex flex-col justify-between items-center w-full">
              <span>Preview</span>
              <div className="h-full flex items-center justify-center w-full">
                <Image src={PreviewImage} alt="Preview Image" />
              </div>
            </div>
          </div>
          <div className="border-[#494C55] w-full border-t-[1px] p-4 flex justify-between items-end">
            <div className="flex gap-2">
              <button className="bg-[#7C36D6] text-white text-sm font-medium px-4 py-2 rounded-[10px]">
                Start Cropper
              </button>
              <button className="bg-[#7C36D6] text-white text-sm font-medium px-4 py-2 rounded-[10px]">
                Remove Cropper
              </button>
              <button className="bg-[#7C36D6] text-white text-sm font-medium px-4 py-2 rounded-[10px]">
                Generate Preview
              </button>
            </div>
            <button className="bg-[#45474E] text-white text-sm font-medium px-4 py-2 rounded-[10px]">
              Cancel
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
