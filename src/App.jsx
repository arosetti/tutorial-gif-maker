import React, { useEffect, useState } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({
  //corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
  //corePath: 'ffmpeg-core.js',
  //corePath: './node_modules/@ffmpeg/core/dist',
  log: true,
});

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    try {
      await ffmpeg.load();
      setReady(true);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGIF = async () => {
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    await ffmpeg.run(
      '-i',
      'test.mp4',
      '-t',
      '2.5',
      '-ss',
      '2.0',
      '-f',
      'gif',
      'out.gif',
    );

    const data = ffmpeg.FS('readFile', 'out.gif');
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' }),
    );
    setGif(url);
  };

  return (
    <div className="App">
      {ready ? (
        <>
          {video && (
            <video
              controls
              width="250"
              src={URL.createObjectURL(video)}
            ></video>
          )}
          <input type="file" onChange={(e) => setVideo(e.target.files?.[0])} />

          <h3>Results</h3>

          <button onClick={convertToGIF} disabled={!video}>
            Convert
          </button>
          {gif && <img src={gif} width="250" />}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
