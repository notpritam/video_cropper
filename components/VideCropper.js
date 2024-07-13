"use client";
import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const VideoCropper = ({ url, onCrop }) => {
  const cropperRef = useRef(null);

  const handleCrop = () => {
    const cropper = cropperRef.current.cropper;
    const cropData = cropper.getData(true); // Get cropped area data
    onCrop(cropData);
  };

  return (
    <div>
      <Cropper
        src={url}
        style={{ height: 400, width: "100%" }}
        initialAspectRatio={16 / 9}
        guides={false}
        crop={handleCrop}
        ref={cropperRef}
        viewMode={1}
        aspectRatio={16 / 9}
      />
    </div>
  );
};

export default VideoCropper;
