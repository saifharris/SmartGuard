import React from "react";
import ReactPlayer from "react-player";

const VideoPage = () => {
  return (
    <div>
      <h2>Videos</h2>
      <ReactPlayer url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" controls={true} />
    </div>
  );
};

export default VideoPage;
