import { useState } from "react";

const SpeechChunker = () => {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speechUtteranceChunker = (utt, settings, callback) => {
    settings = settings || {};
    let newUtt;
    let txt = settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text;
    let chunkLength = settings.chunkLength || 160;
    let pattRegex = new RegExp(`^[\s\S]{${Math.floor(chunkLength / 2)},${chunkLength}}[.!?,]{1}|^[\s\S]{1,${chunkLength}}$|^[\s\S]{1,${chunkLength}} `);
    let chunkArr = txt.match(pattRegex);

    if (!chunkArr || chunkArr[0].length <= 2) {
      if (callback) callback();
      return;
    }

    let chunk = chunkArr[0];
    newUtt = new SpeechSynthesisUtterance(chunk);
    Object.assign(newUtt, utt);
    newUtt.text = chunk;
    
    newUtt.addEventListener("end", () => {
      if (speechUtteranceChunker.cancel) {
        speechUtteranceChunker.cancel = false;
        return;
      }
      settings.offset = settings.offset || 0;
      settings.offset += chunk.length - 1;
      speechUtteranceChunker(utt, settings, callback);
    });

    setTimeout(() => {
      speechSynthesis.speak(newUtt);
    }, 0);
  };

  const handleSpeak = () => {
    if (!text.trim()) return;
    setIsSpeaking(true);
    let utterance = new SpeechSynthesisUtterance(text);
    let voices = speechSynthesis.getVoices();
    utterance.voice = voices[2] || voices[0];
    speechUtteranceChunker(utterance, { chunkLength: 120 }, () => {
      setIsSpeaking(false);
      console.log("Done speaking");
    });
  };

  return (
    <div className="p-4">
      <textarea
        className="w-full p-2 border rounded"
        rows="4"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak..."
      ></textarea>
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSpeak}
        disabled={isSpeaking}
      >
        {isSpeaking ? "Speaking..." : "Speak"}
      </button>
    </div>
  );
};

export default SpeechChunker;
