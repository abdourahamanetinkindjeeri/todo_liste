import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, RotateCcw } from "lucide-react";

/**
 * Composant de lecteur vocal pour lire le contenu d'un todo
 * @param {Object} props
 * @param {string} props.text - Texte à lire
 * @param {string} props.title - Titre du todo (optionnel)
 * @param {string} props.description - Description du todo (optionnel)
 * @param {boolean} props.compact - Mode compact pour petites cartes
 * @param {boolean} props.darkMode - Mode sombre
 */
const VoicePlayer = ({
  text = "",
  title = "",
  description = "",
  compact = false,
  darkMode = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const utteranceRef = useRef(null);
  const isPlayingRef = useRef(false);

  // Vérifier le support de la synthèse vocale
  useEffect(() => {
    if ("speechSynthesis" in window) {
      setIsSupported(true);
    }
  }, []);

  // Nettoyer lors du démontage du composant
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Construire le texte complet à lire
  const getFullText = () => {
    let fullText = "";
    if (title) fullText += `Titre: ${title}. `;
    if (description) fullText += `Description: ${description}. `;
    if (text && text !== title && text !== description) fullText += text;

    return fullText.trim() || "Aucun contenu à lire";
  };

  const speak = () => {
    if (!isSupported) return;

    // Arrêter toute lecture en cours
    window.speechSynthesis.cancel();

    const textToSpeak = getFullText();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Configuration de la voix
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = isMuted ? 0 : volume;
    utterance.lang = "fr-FR";

    // Événements
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      isPlayingRef.current = true;
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      isPlayingRef.current = false;
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      isPlayingRef.current = false;
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    isPlayingRef.current = false;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current && isPlaying) {
      utteranceRef.current.volume = isMuted ? volume : 0;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (utteranceRef.current && isPlaying && !isMuted) {
      utteranceRef.current.volume = newVolume;
    }
  };

  if (!isSupported) {
    return null; // Ne pas afficher si non supporté
  }

  if (compact) {
    // Mode compact pour les petites cartes
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={isPlaying ? (isPaused ? resume : pause) : speak}
          className={`p-1 rounded transition-colors ${
            darkMode
              ? "text-gray-400 hover:text-blue-400 hover:bg-gray-700"
              : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
          }`}
          title={
            isPlaying
              ? isPaused
                ? "Reprendre la lecture"
                : "Mettre en pause"
              : "Écouter le contenu"
          }
        >
          {isPlaying ? (
            isPaused ? (
              <Play size={14} />
            ) : (
              <Pause size={14} />
            )
          ) : (
            <Volume2 size={14} />
          )}
        </button>

        {isPlaying && (
          <button
            onClick={stop}
            className={`p-1 rounded transition-colors ${
              darkMode
                ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                : "text-gray-500 hover:text-red-600 hover:bg-gray-100"
            }`}
            title="Arrêter la lecture"
          >
            <RotateCcw size={12} />
          </button>
        )}
      </div>
    );
  }

  // Mode normal
  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-lg ${
        darkMode ? "bg-gray-700/50" : "bg-gray-100/50"
      }`}
    >
      <button
        onClick={isPlaying ? (isPaused ? resume : pause) : speak}
        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
          isPlaying
            ? darkMode
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-500 text-white hover:bg-blue-600"
            : darkMode
            ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        disabled={!getFullText()}
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
        <span className="text-xs">
          {isPlaying ? (isPaused ? "Reprendre" : "Pause") : "Écouter"}
        </span>
      </button>

      {isPlaying && (
        <>
          <button
            onClick={stop}
            className={`p-1 rounded transition-colors ${
              darkMode
                ? "text-gray-400 hover:text-red-400 hover:bg-gray-600"
                : "text-gray-500 hover:text-red-600 hover:bg-gray-200"
            }`}
            title="Arrêter"
          >
            <RotateCcw size={14} />
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleMute}
              className={`p-1 rounded transition-colors ${
                darkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-12 h-1"
              disabled={isMuted}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VoicePlayer;
