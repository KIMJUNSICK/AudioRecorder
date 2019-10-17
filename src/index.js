const recordBtn = document.getElementById("recordBtn");
const indicator = document.getElementById("indicator");

let mediaRecorder;
let second = 0;
let timer;

const stopRecording = () => {
  mediaRecorder.stop();
  recordBtn.removeEventListener("click", stopRecording);
  recordBtn.addEventListener("click", getAudio);
  recordBtn.innerHTML = "Start Recording";

  second = 0;
  indicator.innerText = "";
  clearInterval(timer);
};

const getAudio = () => {
  navigator.mediaDevices
    .getUserMedia({
      audio: true
    })
    .then(stream => {
      const options = {
        mimeType: "audio/webm;codecs=opus"
      };
      mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorder.start();
      recordBtn.innerHTML = "Stop Recording";
      recordBtn.addEventListener("click", stopRecording);

      // indicator
      timer = setInterval(() => {
        second++;
        indicator.innerText = `Recording for ${second}`;
      }, 1000);

      mediaRecorder.addEventListener("dataavailable", event => {
        const { data: audioFile } = event;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(audioFile);
        link.download = "recorded.webm";
        document.body.appendChild(link);
        link.click();
      });
    })
    .then(recordBtn.removeEventListener("click", getAudio))
    .catch(error => {
      console.log(error);
      recordBtn.innerHTML = "😢 Can't Recording";
    });
};

const init = () => {
  recordBtn.addEventListener("click", getAudio);
};

init();
