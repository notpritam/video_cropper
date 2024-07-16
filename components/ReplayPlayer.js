"use client";

import React, { useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player";

const ReplayPlayer = ({ recordedData }) => {
  const playerRef = useRef(null);
  const [xPosition, setXPosition] = useState(0);
  const [width, setWidth] = useState(0);
  const [playerState, setPlayerState] = useState({
    url: "./video4.mp4",
    pip: false,
    playing: false,
    controls: true,
    light: false,
    volume: 0,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
  });

  const [videoPlaying, setVideoPlaying] = useState(false);

  const playVideo = () => {
    setVideoPlaying(true);
    console.log("Recorded Data", recordedData);
    if (!recordedData || recordedData.length === 0) return;

    let previousTime = 0;

    recordedData.forEach((record, index) => {
      const {
        timeStamps,
        coordinates,
        volume,
        playBackRate,
        action,
        xChanges,
      } = record;
      if (index === 0 && action === "play") {
        console.log("Play the video start", record);
        playerRef.current.seekTo(timeStamps.startTime, "seconds");
        setXPosition(coordinates.x);
        setPlayerState((prevState) => ({
          ...prevState,
          playing: true,
          volume,
          playbackRate: playBackRate,
        }));
        return;
      }

      const startTime = timeStamps.startTime * 1000; // Convert to milliseconds
      const endTime = timeStamps.endTime ? timeStamps.endTime * 1000 : null;

      const nextAction = recordedData[index + 1]
        ? recordedData[index + 1].action
        : null;

      const waitTime = recordedData[index - 1]
        ? startTime - recordedData[index - 1].timeStamps.startTime * 1000
        : 0;

      let finalWaitTime = waitTime + previousTime;
      previousTime = action === "play" ? previousTime : finalWaitTime;

      // console.log("Wait Time", finalWaitTime);
      finalWaitTime = action === "play" ? previousTime : finalWaitTime;

      setTimeout(() => {
        playerRef.current.seekTo(timeStamps.startTime, "seconds");
        console.log(`Action: ${action}, Time: ${startTime}ms`);

        if (index === recordedData.length - 1) {
          setVideoPlaying(false);
        }

        switch (action) {
          case "play":
            console.log("Play the video", record);
            setPlayerState((prevState) => ({ ...prevState, playing: true }));
            setXPosition(coordinates.x);
            break;
          case "pause":
            if (nextAction === "play") {
              console.log("Next action is play", record);
              const nextStartTime =
                recordedData[index + 1].timeStamps.startTime * 1000;
              playerRef.current.seekTo(nextStartTime / 1000, "seconds");
              setPlayerState((prevState) => ({ ...prevState, playing: true }));
              setXPosition(recordedData[index + 1].coordinates.x);
            } else {
              console.log("Next action is not play, pause the video", record);
              setPlayerState((prevState) => ({ ...prevState, playing: false }));
              setXPosition(coordinates.x);
            }
            break;
          case "position":
            console.log("Position change", record);
            if (xChanges.length > 0 && endTime !== null) {
              const duration = endTime - startTime;
              const interval = duration / xChanges.length;

              xChanges.forEach((xChange, index) => {
                setTimeout(() => {
                  setXPosition(xChange);
                }, index * interval);
              });
            }
            break;
          default:
            break;
        }
        // Set video attributes
        setPlayerState((prevState) => ({
          ...prevState,
          volume,
          playbackRate: playBackRate,
        }));
        setWidth(coordinates.width);
      }, finalWaitTime);
    });
  };

  const handleProgess = (state) => {
    if (!playerState.seeking) {
      setPlayerState({ ...playerState, played: state.played });
    }
  };

  const handleDuration = (duration) => {
    console.log("onDuration", duration);

    setPlayerState({ ...playerState, duration });
  };

  return (
    <>
      <div
        style={{ width: `${width}px` }}
        className="h-[307px] w-[525px] overflow-hidden"
      >
        <ReactPlayer
          className="h-full rounded-[6px] overflow-clip"
          height={"100%"}
          style={{
            marginLeft: `-${xPosition}px`, // Adjusted for horizontal scroll percentage
          }}
          width={525}
          ref={playerRef}
          url={playerState.url}
          playing={playerState.playing}
          controls={false}
          played={playerState.played}
          playbackRate={playerState.playbackRate}
          volume={playerState.volume}
          muted={playerState.muted}
          // onPlay={handlePlay}
          // onPause={handlePause}
          onSeek={(e) => console.log("onSeek", e)}
          onDuration={handleDuration}
          onProgress={handleProgess}
        />
      </div>

      <div className="flex gap-8 items-center">
        <button
          disabled={videoPlaying}
          className="bg-[#7C36D6] text-white text-sm font-medium px-4 py-2 rounded-[10px] disabled:opacity-50"
          onClick={playVideo}
        >
          Play Video
        </button>
      </div>
    </>
  );
};

export default ReplayPlayer;
