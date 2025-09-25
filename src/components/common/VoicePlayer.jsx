import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, RotateCcw } from "lucide-react";

const VoicePlayer = ({
  text,
  compact = false,
  showNotification = () => {},
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef(null);

  useEffect(() => {
    // Vérifier si la synthèse vocale est supportée
    if (!("speechSynthesis" in window)) {
      setIsSupported(false);
      console.warn("La synthèse vocale n'est pas supportée par ce navigateur");
      return;
    }

    // Nettoyer lors du démontage du composant
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const createUtterance = (textToSpeak) => {
    if (!textToSpeak || !isSupported) return null;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Configuration de la voix
    utterance.lang = "fr-FR";
    utterance.volume = isMuted ? 0 : volume;
    utterance.rate = rate;
    utterance.pitch = 1;

    // Essayer de trouver une voix française
    const voices = window.speechSynthesis.getVoices();
    const frenchVoice = voices.find(
      (voice) => voice.lang.startsWith("fr") || voice.lang.startsWith("FR")
    );

    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    // Événements
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      console.log("Début de la synthèse vocale");
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      console.log("Fin de la synthèse vocale");
    };

    utterance.onpause = () => {
      setIsPaused(true);
      console.log("Synthèse vocale en pause");
    };

    utterance.onresume = () => {
      setIsPaused(false);
      console.log("Reprise de la synthèse vocale");
    };

    utterance.onerror = (event) => {
      console.error("Erreur de synthèse vocale:", event.error);
      setIsPlaying(false);
      setIsPaused(false);
      showNotification("Erreur lors de la lecture vocale", "error");
    };

    return utterance;
  };

  const handlePlay = () => {
    if (!text || !isSupported) {
      showNotification(
        "Aucun texte à lire ou synthèse vocale non supportée",
        "warning"
      );
      return;
    }

    try {
      // Si déjà en cours, pause/resume
      if (isPlaying) {
        if (isPaused) {
          window.speechSynthesis.resume();
          setIsPaused(false);
        } else {
          window.speechSynthesis.pause();
          setIsPaused(true);
        }
        return;
      }

      // Arrêter toute synthèse en cours
      window.speechSynthesis.cancel();

      // Créer et démarrer une nouvelle synthèse
      const utterance = createUtterance(text);
      if (utterance) {
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("Erreur lors du démarrage de la synthèse:", error);
      showNotification("Erreur lors de la lecture vocale", "error");
    }
  };

  const handleStop = () => {
    try {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    } catch (error) {
      console.error("Erreur lors de l'arrêt de la synthèse:", error);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);

    // Mettre à jour le volume de l'utterance en cours si elle existe
    if (utteranceRef.current && isPlaying) {
      utteranceRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current && isPlaying) {
      utteranceRef.current.volume = isMuted ? volume : 0;
    }
  };

  const handleRateChange = (e) => {
    const newRate = parseFloat(e.target.value);
    setRate(newRate);

    // Pour appliquer le nouveau débit, il faut redémarrer la synthèse
    if (isPlaying) {
      const wasPlaying = !isPaused;
      handleStop();
      if (wasPlaying) {
        setTimeout(() => handlePlay(), 100);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="text-sm text-red-400">Synthèse vocale non supportée</div>
    );
  }

  if (!text) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handlePlay}
          className={`p-1 rounded-full transition-colors ${
            isPlaying
              ? isPaused
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          title={
            isPlaying
              ? isPaused
                ? "Reprendre la lecture"
                : "Mettre en pause"
              : "Lire le texte"
          }
        >
          {isPlaying ? (
            isPaused ? (
              <Play size={16} />
            ) : (
              <Pause size={16} />
            )
          ) : (
            <Volume2 size={16} />
          )}
        </button>

        {isPlaying && (
          <button
            onClick={handleStop}
            className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white"
            title="Arrêter la lecture"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlay}
            className={`p-2 rounded-full transition-colors ${
              isPlaying
                ? isPaused
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isPlaying ? (
              isPaused ? (
                <Play size={20} />
              ) : (
                <Pause size={20} />
              )
            ) : (
              <Volume2 size={20} />
            )}
          </button>

          <button
            onClick={handleStop}
            disabled={!isPlaying}
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white transition-colors"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1 text-gray-300 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            title="Volume"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-300">Vitesse:</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={handleRateChange}
          className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm text-gray-300 min-w-[30px]">
          {rate.toFixed(1)}x
        </span>
      </div>

      <div className="text-sm text-gray-400 bg-gray-900 rounded p-2 max-h-20 overflow-y-auto">
        {text}
      </div>
    </div>
  );
};

export default VoicePlayer;
