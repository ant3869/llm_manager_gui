import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SpeechControls({ onListeningChange, onSpeakingChange }) {
  const [isSupported, setIsSupported] = useState({
    stt: false,
    tts: false
  });

  useEffect(() => {
    // Check browser support
    setIsSupported({
      stt: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      tts: 'speechSynthesis' in window
    });
  }, []);

  return (
    <div className="flex items-center space-x-4">
      {!isSupported.stt && (
        <span className="text-sm text-yellow-500">
          Speech recognition not supported
        </span>
      )}
      {!isSupported.tts && (
        <span className="text-sm text-yellow-500">
          Text-to-speech not supported
        </span>
      )}
    </div>
  );
}
