import React, { useEffect, useRef, useState } from "react";

export default function AIConsult({ sessionId, patientId }) {
  const wsRef = useRef(null);
  const [messages, setMessages] = useState([]); // {from:'user'|'assistant'|'status', text}
  const [listening, setListening] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    // open websocket to backend AI channel
    const WS_URL = (process.env.REACT_APP_BACKEND || "http://localhost:8000").replace(/^http/, "ws");
    const ws = new WebSocket(`${WS_URL}/ws/ai/${sessionId}`);
    ws.onopen = () => {
      console.log("AI WS connected");
      setMessages((m)=>[...m,{from:'status', text:'AI connected'}]);
    };
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (data.type === "assistant") {
        setMessages((m)=>[...m, {from:'assistant', text:data.text}]);
        // TTS speak
        speakText(data.text);
      } else if (data.type === "status") {
        setMessages((m)=>[...m, {from:'status', text:data.msg}]);
      } else if (data.type === "error") {
        setMessages((m)=>[...m, {from:'status', text:'Error: ' + data.msg}]);
      }
    };
    ws.onclose = ()=> setMessages((m)=>[...m,{from:'status', text:'AI socket closed'}]);
    wsRef.current = ws;
    return ()=> { ws.close(); };
  }, [sessionId]);

  // simple text sending (for quick manual test)
  const sendTranscriptText = (txt) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({type:"transcript", text: txt}));
    setMessages((m)=>[...m, {from:'user', text:txt}]);
  };

  // MediaRecorder flow: record small chunks, send as base64 audio_chunk
  const startRecording = async () => {
    if (!navigator.mediaDevices) {
      alert("Media devices not supported");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const options = { mimeType: "audio/webm" };
    const mr = new MediaRecorder(stream, options);
    mediaRecorderRef.current = mr;
    audioChunksRef.current = [];

    mr.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        audioChunksRef.current.push(e.data);
        // send chunk immediately as base64
        const reader = new FileReader();
        reader.onload = () => {
          const base64data = reader.result.split(",")[1];
          wsRef.current.send(JSON.stringify({type:"audio_chunk", data: base64data, seq: Date.now()}));
        };
        reader.readAsDataURL(e.data);
      }
    };
    mr.onstop = async () => {
      // mark chunk end so server runs ASR
      wsRef.current.send(JSON.stringify({type:"audio_chunk", end:true}));
    };

    mr.start(1000); // timeslice -> deliver chunks every 1s
    setListening(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setListening(false);
  };

  // simple TTS
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    // choose voice and language heuristics here; for bilingual support pick 'hi-IN' if needed
    // u.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold text-blue-700 mb-3">AI Assistant</h3>
      <div className="mb-3">
        <button onClick={()=> sendTranscriptText("Patient: I have fever and watery diarrhea for 2 days")} className="mr-2 px-3 py-2 rounded bg-gray-200">Quick test</button>
        {!listening ? (
          <button onClick={startRecording} className="px-3 py-2 rounded bg-green-500 text-white">Start Live Mic</button>
        ) : (
          <button onClick={stopRecording} className="px-3 py-2 rounded bg-red-500 text-white">Stop</button>
        )}
      </div>

      <div className="space-y-2 h-64 overflow-auto p-2 border rounded">
        {messages.map((m, idx) => (
          <div key={idx} className={`p-2 rounded ${m.from==='assistant' ? 'bg-blue-50 text-blue-800' : (m.from==='user' ? 'bg-gray-100':'bg-yellow-50')}`}>
            <div className="text-sm">{m.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
