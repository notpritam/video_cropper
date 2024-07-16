"use client";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import Draggable from "react-draggable";
import PlayImage from "@/public/play.svg";
import VolumeImage from "@/public/volume.svg";
import PreviewImage from "@/public/preview.svg";
import PauseImage from "@/public/pause.png";
import Image from "next/image";
import ReplayPlayer from "@/components/ReplayPlayer";

import DownImage from "@/public/down.svg";

export default function Home() {
  const [tab, setTab] = useState("preview");
  const containerRef = useRef(null);

  const [cropper, setCropper] = useState(false);
  const [currentX, setCurrentX] = useState([]);
  const [startTime, setStartTime] = useState(null);

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
    url: "./video4.mp4",
    pip: false,
    playing: false,
    controls: false,
    light: false,
    volume: 0,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
  });
  const [cropSize, setCropSize] = useState({ width: 200, height: 307 });

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    width: cropSize.width,
  });
  const playerRef = useRef(null);
  const secondPlayer = useRef(null);

  const handleDrag = (e, data) => {
    const newPosition = {
      x: data.x,
      y: data.y,
      width: cropSize.width,
    };

    setPosition(newPosition);

    if (playerState.playing) {
      setCurrentX((prev) => [...prev, data.x]);
    }
  };

  const handlePlay = () => {
    setPlayerState({ ...playerState, playing: true });
  };

  const handlePause = () => {
    setPlayerState({ ...playerState, playing: false });
  };

  const handleDuration = (duration) => {
    setPlayerState({ ...playerState, duration });
  };

  const handleSeekMouseDown = (e) => {
    setPlayerState({ ...playerState, seeking: true });
    playerRef.current.seekTo(parseFloat(e.target.value));
    secondPlayer.current.seekTo(parseFloat(e.target.value));
  };

  const handleSeekChange = (e) => {
    setPlayerState({ ...playerState, played: parseFloat(e.target.value) });
    playerRef.current.seekTo(parseFloat(e.target.value));
    secondPlayer.current.seekTo(parseFloat(e.target.value));

    e.target.style.background = `linear-gradient(to right, white ${
      e.target.value * 100
    }%, #65676b ${e.target.value * 100}%)`;
  };

  const handleSeekMouseUp = (e) => {
    playerRef.current.seekTo(parseFloat(e.target.value));
    secondPlayer.current.seekTo(parseFloat(e.target.value));

    setPlayerState({ ...playerState, seeking: false });

    recordAction("seek");
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
      timeStamps: {
        startTime:
          action === "position"
            ? startTime
            : playerState.played * playerState.duration,
        endTime:
          action === "position"
            ? playerState.played * playerState.duration
            : null,
      },
      coordinates: position,
      volume: playerState.volume,
      playBackRate: playerState.playbackRate,
      action,
      xChanges: [...currentX],
    };

    switch (action) {
      case "play":
        if (cropper) {
          setActionList([...actionList, currentAction]);
        } else {
          console.log("Not Recording this Action as Cropper is not enabled.");
        }
        break;
      case "pause":
        if (cropper) {
          setActionList([...actionList, currentAction]);
        } else {
          console.log("Not Recording this Action as Cropper is not enabled.");
        }
        break;
      case "volume":
        if (cropper) {
          setActionList([...actionList, currentAction]);
        } else {
          console.log("Not Recording this Action as Cropper is not enabled.");
        }
        break;
      case "speed":
        if (cropper) {
          setActionList([...actionList, currentAction]);
        } else {
          console.log("Not Recording this Action as Cropper is not enabled.");
        }
        break;
      case "aspectRatio":
        setActionList([...actionList, currentAction]);
        break;
      case "position":
        if (cropper && playerState.playing) {
          setActionList([...actionList, currentAction]);
          setCurrentX([]);
          setStartTime(null);
        } else {
          console.log;
        }
      default:
        break;
    }
  };

  const applyCropping = async () => {
    console.log(actionList);
    setTab("generate");
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [aspectPopupVisible, setAspectPopupVisible] = useState(false);

  const [aspectRatio, setAspectRatio] = useState("16:9");

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };
  const toogleAspectPopup = () => {
    setAspectPopupVisible(!aspectPopupVisible);
  };

  const handlePlaybackRateChange = (value) => {
    setPlayerState({ ...playerState, playbackRate: value });
    setIsPopupVisible(false);
  };

  const handleAspectRatioChange = (value) => {
    const values = value.split(":");
    const aspectRatio = parseFloat(values[0]) / parseFloat(values[1]);
    setCropSize({
      width: cropSize.height * aspectRatio,
      height: cropSize.height,
    });
    setAspectPopupVisible(false);
    setAspectRatio(value);
  };

  const playrateModalRef = useRef(null);
  const aspectModalRef = useRef(null);

  useEffect(() => {
    function handler(event) {
      console.log(
        "click",
        event.target,
        aspectModalRef.current,
        aspectModalRef.current?.contains(event.target)
      );

      if (!aspectModalRef.current?.contains(event.target)) {
        setAspectPopupVisible(false);
      }
      if (!playrateModalRef.current?.contains(event.target)) {
        setIsPopupVisible(false);
      }
    }
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const downloadJSON = () => {
    const json = JSON.stringify(actionList, null, 2); // Convert list to JSON string
    const blob = new Blob([json], { type: "application/json" }); // Create a Blob from the JSON string
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
    const link = document.createElement("a"); // Create a link element
    link.href = url;
    link.download = "data.json"; // Name of the file to be downloaded
    document.body.appendChild(link); // Append the link to the body
    link.click(); // Trigger a click on the link
    document.body.removeChild(link); // Remove the link from the body
    URL.revokeObjectURL(url); // Clean up the URL object
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
                    onClick={() => {
                      if (item.value == "generate" && actionList.length == 0) {
                        alert("Please generate preview first.");
                        return;
                      } else {
                        setTab(item.value);
                      }
                    }}
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
                <div className="relative">
                  <Draggable
                    axis="x"
                    bounds="parent"
                    onStart={() => {
                      setStartTime(playerState.played * playerState.duration);
                    }}
                    onDrag={handleDrag}
                    onStop={() => {
                      cropper && recordAction("position");
                    }}
                  >
                    <div
                      ref={containerRef}
                      style={{
                        width: cropSize.width,
                        visibility: cropper ? "visible" : "hidden",
                      }}
                      className={`absolute bg-black/45 z-10 crop-div min-h-full grid grid-cols-3 grid-rows-3 border-[1px] border-white`}
                    >
                      {Array.from({ length: 9 }).map((_, index) => (
                        <div
                          key={index}
                          className="border-[0.5px] opacity-40 border-dashed border-white flex justify-center items-center"
                        ></div>
                      ))}
                    </div>
                  </Draggable>

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
                      className="cursor-pointer h-[18px] w-[18px]"
                      onClick={() => {
                        if (cropper) {
                          recordAction(playerState.playing ? "pause" : "play");
                        }
                        setPlayerState({
                          ...playerState,
                          playing: !playerState.playing,
                        });
                      }}
                      src={playerState.playing ? PauseImage : PlayImage}
                      alt="Pause Play Control"
                    />
                    <div className="w-full">
                      <input
                        type="range"
                        className="w-full slider transition-all duration-200 ease-linear"
                        style={{
                          background: `linear-gradient(to right, white ${
                            playerState.played * 100
                          }%, #65676b ${playerState.played * 100}%)`,
                        }}
                        min={0}
                        disabled={cropper && playerState.playing}
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
                      <Image
                        src={VolumeImage}
                        style={{
                          opacity: playerState.volume > 0 ? 1 : 0.5,
                        }}
                        alt="Volume Control"
                      />
                      <input
                        type="range"
                        style={{
                          background: `linear-gradient(to right, white ${
                            playerState.volume * 100
                          }%, #65676b ${playerState.volume * 100}%)`,
                        }}
                        min={0}
                        className="slider"
                        max={1}
                        step="any"
                        value={playerState.volume}
                        onChange={(e) => {
                          e.target.style.background = `linear-gradient(to right, white ${
                            e.target.value * 100
                          }%, #65676b ${e.target.value * 100}%)`;
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
                  <div className="flex gap-4 relative">
                    <div
                      className="flex px-[10px] max-h-[44px] py-2 gap-2 items-center border-[2px] rounded-[6px] border-[#45474E] cursor-pointer relative"
                      onClick={togglePopup}
                      ref={playrateModalRef}
                    >
                      <span>Playback speed</span>
                      <span className="opacity-50">
                        {playerState.playbackRate}x
                      </span>
                      <Image src={DownImage} alt="Dropdown Image" />
                      {isPopupVisible && (
                        <div className="absolute custom-scrollbar top-[44px] left-0 right-0 max-h-[150px] overflow-y-scroll bg-[#45474E] w-full mt-2 rounded-[6px] border-[2px] border-[#45474E] z-10">
                          {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(
                            (value) => (
                              <div
                                key={value}
                                className="py-[7px] px-[10px] hover:bg-gray-700 cursor-pointer"
                                onClick={() => handlePlaybackRateChange(value)}
                              >
                                {value}x
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 relative">
                    <div
                      className="flex px-[10px] max-h-[44px] py-2 gap-2 items-center border-[2px] rounded-[6px] border-[#45474E] cursor-pointer relative"
                      onClick={toogleAspectPopup}
                      ref={aspectModalRef}
                    >
                      <span>Cropper Aspect Ratio</span>
                      <span className="opacity-50">{aspectRatio}</span>
                      <Image src={DownImage} alt="Dropdown Image" />
                      {aspectPopupVisible && (
                        <div className="absolute custom-scrollbar top-[44px] left-0 right-0 max-h-[150px] overflow-y-scroll bg-[#45474E] w-full mt-2 rounded-[6px] border-[2px] border-[#45474E] z-10">
                          {["16:9", "1:1", "4:3", "9:16"].map((value) => (
                            <div
                              key={value}
                              className="py-[7px] px-[10px] hover:bg-gray-700 cursor-pointer"
                              onClick={() => handleAspectRatioChange(value)}
                            >
                              {value}x
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-col ${
                  cropper ? "justify-start" : "justify-between"
                }  items-center h-full w-full`}
              >
                <span>Preview</span>

                <div
                  style={{
                    width: cropSize.width,
                    visibility: cropper ? "visible" : "hidden",
                    display: cropper ? "block" : "none",
                  }}
                  className="overflow-hidden"
                >
                  <ReactPlayer
                    style={{
                      marginLeft: `-${position.x}px`,
                    }}
                    width={525}
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
                  <div className=" flex h-full items-center justify-center w-full">
                    <Image src={PreviewImage} alt="Preview Image" />
                  </div>
                )}
              </div>
            </div>
          )}

          {tab == "generate" && (
            <div className="h-full w-full flex flex-col gap-12 items-center justify-center px-4">
              {/* <ReactPlayer url={outputUrl} controls={true} /> */}

              <ReplayPlayer
                recordedData={actionList}
                videoDuration={playerState.duration}
              />
            </div>
          )}
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
                      applyCropping();
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
                  <button
                    onClick={downloadJSON}
                    className="bg-[#7C36D6] text-white text-sm font-medium px-4 py-2 rounded-[10px]"
                  >
                    Download Data
                  </button>
                  <button
                    onClick={() => {
                      setTab("preview");
                      setActionList([]);
                    }}
                    className="bg-[#7C36D6] text-white text-sm font-medium px-4 py-2 rounded-[10px]"
                  >
                    Remove Preview
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
