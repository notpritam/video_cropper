const generateData = (actionList, videoWidth, height) => {
  return actionList.map((action, index) => {
    const startTime = action.timeStamps;
    let endTime = actionList[index + 1]
      ? actionList[index + 1].timeStamps
      : "end";

    // Ensure endTime is different from startTime
    if (endTime === startTime) {
      // If endTime is the same as startTime, increment it by a small value.
      endTime = new Date(startTime).getTime() + 1; // Add 1 millisecond or adjust as needed
    }

    return {
      time: startTime,
      x: Math.max(
        0,
        Math.min(action.coordinates.x, videoWidth - action.coordinates.width)
      ),
      y: 0,
      width: (action.coordinates.width / 525) * videoWidth,
      height,
      endTime,
    };
  });
};
const createFilterChain = (cropData) => {
  return cropData
    .map((crop) => {
      // Format the crop and select filter chains
      return `[0:v]crop=${crop.width}:${crop.height}:${crop.x}:${crop.y},select='between(t,${crop.time},${crop.endTime})'[v${crop.time}]`;
    })
    .join(";");
};

const applyCropping = async () => {
  if (typeof window !== "undefined") {
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();
    const inputFile = playerState.url;
    const videoElement = playerRef.current.getInternalPlayer();
    const videoWidth = videoElement.videoWidth;
    const videoHeight = videoElement.videoHeight;

    // Generate the crop data from actionList
    const positionData = generateData(actionList, videoWidth, videoHeight);
    const condensedData = filterAndCondense(positionData);
    console.log("Crop Data", positionData);
    console.log("Condensed Data", condensedData);
    const filters = createFilterChain(condensedData);

    // Create the filter_complex string
    const filterComplex = `[0:v]${filters}[v]`;

    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(inputFile));

    await ffmpeg.run(
      "-i",
      "input.mp4",
      "-filter_complex",
      filterComplex,
      "output.mp4"
    );

    const data = ffmpeg.FS("readFile", "output.mp4");
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
    setOutputUrl(url);
    setTab("generate");
  }
};

// const cropAndSaveVideoSegment = async (ffmpeg, inputFile, crop, index) => {
//   const { x, y, width, height, time, endTime } = crop;
//   const segmentFilename = `segment_${index}.mp4`;

//   await ffmpeg.run(
//     "-i",
//     inputFile,
//     "-vf",
//     `crop=${width}:${height}:${x}:${y},select='between(t,${time},${endTime})'`,
//     "-vsync",
//     "vfr",
//     segmentFilename
//   );

//   return segmentFilename;
// };

// const applyCropping = async () => {
//   if (typeof window !== "undefined") {
//     const ffmpeg = createFFmpeg({ log: true });
//     await ffmpeg.load();
//     const inputFile = playerState.url;
//     const videoElement = playerRef.current.getInternalPlayer();
//     const videoWidth = videoElement.videoWidth;
//     const videoHeight = videoElement.videoHeight;

//     ffmpeg.FS("writeFile", "input.mp4", await fetchFile(inputFile));
//     // Generate the crop data from actionList
//     const positionData = generateData(actionList, videoWidth, videoHeight);
//     const condensedData = filterAndCondense(positionData);
//     console.log("Crop Data", positionData);
//     console.log("Condensed Data", condensedData);

//     // Crop each segment and save them as separate files
//     const segmentFiles = [];
//     for (let i = 0; i < condensedData.length; i++) {
//       const crop = condensedData[i];
//       const segmentFilename = await cropAndSaveVideoSegment(
//         ffmpeg,
//         "input.mp4",
//         crop,
//         i
//       );
//       segmentFiles.push(segmentFilename);
//     }

//     // Step 2: Concatenate Segments
//     await concatenateSegments(ffmpeg, segmentFiles);
//   }
// };

// const concatenateSegments = async (ffmpeg, segmentFiles) => {
//   // Create a file list for ffmpeg concat demuxer
//   let fileListContent = segmentFiles
//     .map((file) => `file '${file}'`)
//     .join("\n");
//   ffmpeg.FS("writeFile", "filelist.txt", fileListContent);

//   // Concatenate files
//   await ffmpeg.run(
//     "-f",
//     "concat",
//     "-safe",
//     "0",
//     "-i",
//     "filelist.txt",
//     "-c",
//     "copy",
//     "final_output.mp4"
//   );

//   // Retrieve and set the final video URL
//   const data = ffmpeg.FS("readFile", "final_output.mp4");
//   const url = URL.createObjectURL(
//     new Blob([data.buffer], { type: "video/mp4" })
//   );
//   setOutputUrl(url);
//   setTab("generate");
// };

// const generateData = (actionList, videoWidth, height) => {
//   const videoDuration = playerState.duration; // Ensure this value is accessible

//   return actionList.map((action, index) => {
//     const startTime = action.timeStamps;
//     let endTime =
//       action.endTime ||
//       (actionList[index + 1]
//         ? actionList[index + 1].timeStamps
//         : videoDuration);

//     // Ensure endTime is different from startTime
//     if (endTime === startTime) {
//       endTime = new Date(startTime).getTime() + 1; // Add 1 millisecond or adjust as needed
//     }

//     return {
//       time: startTime,
//       x: Math.max(
//         0,
//         Math.min(action.coordinates.x, videoWidth - action.coordinates.width)
//       ),
//       y: 0,
//       width: (action.coordinates.width / 525) * videoWidth,
//       height,
//       endTime,
//     };
//   });
// };
