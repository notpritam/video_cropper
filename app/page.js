"use client";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { DndContext, useDraggable } from "@dnd-kit/core";
import Draggable from "react-draggable";
import PlayImage from "@/public/play.svg";
import VolumeImage from "@/public/volume.svg";
import PreviewImage from "@/public/preview.svg";
import Image from "next/image";

// player , cropper , generate

export default function Home() {
  const [tab, setTab] = useState("preview");

  const [cropper, setCropper] = useState(false);

  const tabs = [
    {
      value: "preview",
      label: "Preview Session",
    },
    {
      value: "generate",
      label: "Generate Session",
    },
  ];

  const [playerState, setPlayerState] = useState({
    url: "./video2.mp4",
    pip: false,
    playing: false,
    controls: false,
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
    recordAction("position");
  };

  const handlePlay = () => {
    console.log("onPlay", playerState.played);

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
    playerRef.current.seekTo(parseFloat(e.target.value));
    secondPlayer.current.seekTo(parseFloat(e.target.value));
  };

  const handleSeekChange = (e) => {
    recordAction("seek");
    setPlayerState({ ...playerState, played: parseFloat(e.target.value) });
    playerRef.current.seekTo(parseFloat(e.target.value));
    secondPlayer.current.seekTo(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    playerRef.current.seekTo(parseFloat(e.target.value));
    secondPlayer.current.seekTo(parseFloat(e.target.value));

    setPlayerState({ ...playerState, seeking: false });
  };

  const handleProgess = (state) => {
    if (!playerState.seeking) {
      setPlayerState({ ...playerState, played: state.played });
    }
  };

  const [actionList, setActionList] = useState([]);

  const recordAction = (action) => {
    console.log("Action Recorded", action);

    const currentAction = {
      timeStamps: playerState.played,
      cooridinates: position,
      volume: playerState.volume,
      playBackRate: playerState.playbackRate,
      action,
    };

    switch (action) {
      case "play":
        setActionList([...actionList, currentAction]);
        break;
      case "pause":
        setActionList([...actionList, currentAction]);
        break;
      case "volume":
        setActionList([...actionList, currentAction]);
        break;
      case "speed":
        setActionList([...actionList, currentAction]);
        break;
      case "seek":
        setActionList([...actionList, currentAction]);
        break;
      case "aspectRatio":
        setActionList([...actionList, currentAction]);
        break;
      case "position":
        setActionList([...actionList, currentAction]);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <main className="flex max-h-screen min-h-screen min-w-screen bg-black  justify-center gap-8 items-center">
        <div className="bg-[#37393F] h-[668px] max-w-[1082px]  w-full rounded-lg gap-4 flex flex-col">
          <div className="flex justify-between items-center px-4 pt-4">
            <span className="font-bold text-white">Cropper</span>

            <div className="flex bg-[#45474E] rounded-md p-1 ">
              {tabs.map((item, index) => (
                <>
                  <div
                    key={index}
                    onClick={() => setTab(item.value)}
                    className={`${
                      tab == item.value ? "bg-[#37393F]" : ""
                    } flex cursor-pointer justify-center rounded-md items-center p-2 px-3`}
                  >
                    <span>{item.label}</span>
                  </div>
                </>
              ))}
            </div>
            <div></div>
          </div>
          {tab == "preview" && (
            <div className="grid grid-cols-2 w-full px-4 h-full">
              <div className="w-full flex flex-col gap-4">
                <div className="h-[307px] relative overflow-hidden">
                  {cropper && (
                    <Draggable axis="x" bounds="parent" onDrag={handleDrag}>
                      <div
                        style={{
                          width: cropSize.width,
                        }}
                        className={`absolute z-10 crop-div min-h-full grid grid-cols-3 grid-rows-3 border-[1px] border-white`}
                      >
                        {Array.from({ length: 9 }).map((_, index) => (
                          <div
                            key={index}
                            className="border-[0.5px] opacity-40 border-dashed border-white flex justify-center items-center"
                          >
                            {/* {index} */}
                          </div>
                        ))}
                      </div>
                    </Draggable>
                  )}
                  {cropper && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none"></div>
                  )}
                  <ReactPlayer
                    className="h-full rounded-[6px] overflow-clip"
                    height={"100%"}
                    width={"100%"}
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
                    onProgress={handleProgess}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center w-full ">
                    <Image
                      className="cursor-pointer"
                      onClick={() => {
                        recordAction(playerState.playing ? "pause" : "play");
                        setPlayerState({
                          ...playerState,
                          playing: !playerState.playing,
                        });
                      }}
                      src={PlayImage}
                      alt="Pause Play Control"
                    />
                    <div className="w-full">
                      <input
                        type="range"
                        className="w-full"
                        min={0}
                        max={0.999999}
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
                      <span>
                        <Duration
                          seconds={playerState.duration * playerState.played}
                        />
                      </span>
                      <span className="opacity-50">|</span>
                      <span className="opacity-50">
                        <Duration
                          className="opacity-50"
                          seconds={playerState.duration}
                        />
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Image src={VolumeImage} alt="Volume Control" />
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={playerState.volume}
                        onChange={(e) => {
                          setPlayerState({
                            ...playerState,
                            volume: parseFloat(e.target.value),
                          });
                          recordAction("volume");
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div>
                    <select
                      className="border-1 border-[#45474E] text-[white] px-[10px] py-[7px] bg-transparent"
                      value={playerState.playbackRate}
                      onChange={(e) => {
                        setPlayerState({
                          ...playerState,
                          playbackRate: parseFloat(e.target.value),
                        });
                        recordAction("speed");
                      }}
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
                        recordAction("aspectRatio");
                      }}
                    >
                      <option value={(16 / 9).toFixed(2)}>16:9</option>
                      <option value={(4 / 3).toFixed(2)}>4:3</option>
                      <option value="1.00">1:1</option>
                    </select>
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-col ${
                  cropper ? "" : "justify-between"
                }  items-center w-full`}
              >
                <span>Preview</span>

                <div
                  style={{
                    width: cropSize.width,
                    visibility: cropper ? "visible" : "hidden",
                  }}
                  className="overflow-hidden h-[307px]"
                >
                  <ReactPlayer
                    style={{
                      marginLeft: `-${position.x}px`,
                    }}
                    // width={position.x}
                    ref={secondPlayer}
                    height={"307px"}
                    muted={true}
                    url={playerState.url}
                    played={playerState.played}
                    playbackRate={playerState.playbackRate}
                    playing={playerState.playing}
                    controls={false}
                  />
                </div>

                {!cropper && (
                  <div className="h-full flex items-center justify-center w-full">
                    <Image src={PreviewImage} alt="Preview Image" />
                  </div>
                )}
              </div>
            </div>
          )}

          {tab == "generate" && <div className="h-full px-4">Generate</div>}
          <div className="border-[#494C55] w-full border-t-[1px] p-4 flex justify-between items-end">
            {tab == "preview" ? (
              <>
                <div className="flex gap-2">
                  <button
                    disabled={cropper}
                    onClick={() => {
                      setCropper(true);
                      setPlayerState({ ...playerState, playing: false });
                    }}
                    className="bg-[#7C36D6] text-white text-sm font-medium px-4 py-2 rounded-[10px] disabled:opacity-50"
                  >
                    Start Cropper
                  </button>
                  <button
                    disabled={!cropper}
                    onClick={() => setCropper(false)}
                    className="bg-[#7C36D6] text-white text-sm font-medium px-4 py-2 rounded-[10px] disabled:opacity-50"
                  >
                    Remove Cropper
                  </button>
                  <button
                    onClick={() => {
                      console.log(actionList);
                    }}
                    disabled={actionList.length == 0}
                    className="bg-[#7C36D6] text-white text-sm font-medium px-4 py-2 rounded-[10px] disabled:opacity-50"
                  >
                    Generate Preview
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  {/* <button className="bg-[#7C36D6] text-white text-sm font-medium px-4 py-2 rounded-[10px]">
                    Start Cropper
                  </button>
                  <button className="bg-[#7C36D6] text-white text-sm font-medium px-4 py-2 rounded-[10px]">
                    Remove Cropper
                  </button> */}
                  <button className="bg-[#7C36D6] text-white text-sm font-medium px-4 py-2 rounded-[10px]">
                    Download Preview
                  </button>
                </div>
              </>
            )}
            <button className="bg-[#45474E] text-white text-sm font-medium px-4 py-2 rounded-[10px]">
              Cancel
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

function format(seconds) {
  const date = new Date(seconds * 1000);
  const hh = pad(date.getUTCHours());
  const mm = pad(date.getUTCMinutes());
  const ss = pad(date.getUTCSeconds());
  return `${hh}:${mm}:${ss}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function Duration({ className, seconds }) {
  const timeInSeconds = seconds !== undefined ? seconds : 0;

  return (
    <time dateTime={`P${Math.round(timeInSeconds)}S`} className={className}>
      {format(timeInSeconds)}
    </time>
  );
}
