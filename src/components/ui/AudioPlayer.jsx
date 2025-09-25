import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";

/**
 * Composant de lecteur audio pour lire les enregistrements vocaux des todos
 * @param {Object} props
 * @param {string} props.audioUrl - URL du fichier audio à lire
 * @param {boolean} props.compact - Mode compact pour petites cartes
 * @param {boolean} props.darkMode - Mode sombre
 */
const AudioPlayer = ({ audioUrl, compact = false, darkMode = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleCanPlayThrough = () => {
      setIsLoading(false);
      setHasError(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e) => {
      console.error("Erreur lors du chargement de l'audio:", e);
      setIsPlaying(false);
      setIsLoading(false);
      setHasError(true);
    };

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [audioUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Erreur lors de la lecture audio:", error);
        setIsPlaying(false);
        // Ne pas afficher d'erreur si l'élément n'a pas de sources supportées
        if (error.name !== "NotSupportedError") {
          // Vous pouvez ajouter une notification ici si nécessaire
        }
      }
    }
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audio.muted = newMuted;
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audio.volume = newVolume;

    if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
      audio.muted = true;
    } else if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      audio.muted = false;
    }
  };

  const reset = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
    audio.pause();
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Vérifier si l'URL audio est valide
  const isValidAudioUrl = (url) => {
    if (!url) return false;

    // Vérifier le format de l'URL
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (!audioUrl || !isValidAudioUrl(audioUrl)) {
    return null; // Ne pas afficher si pas d'URL audio valide
  }

  // Affichage d'erreur si le fichier audio n'est pas accessible
  if (hasError) {
    return (
      <div className={`text-xs ${darkMode ? "text-red-400" : "text-red-600"}`}>
        Audio indisponible
      </div>
    );
  }

  if (compact) {
    // Mode compact pour les petites cartes
    return (
      <div className="flex items-center gap-1">
        <audio ref={audioRef} src={audioUrl} />

        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`p-1 rounded transition-colors ${
            isLoading
              ? darkMode
                ? "text-gray-600 cursor-not-allowed"
                : "text-gray-400 cursor-not-allowed"
              : darkMode
              ? "text-gray-400 hover:text-green-400 hover:bg-gray-700"
              : "text-gray-500 hover:text-green-600 hover:bg-gray-100"
          }`}
          title={
            isLoading
              ? "Chargement..."
              : isPlaying
              ? "Mettre en pause"
              : "Lire l'enregistrement vocal"
          }
        >
          {isLoading ? (
            <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={14} />
          ) : (
            <Play size={14} />
          )}
        </button>

        {duration > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className={`w-8 h-1 rounded cursor-pointer ${
                darkMode ? "bg-gray-600" : "bg-gray-300"
              }`}
            >
              <div
                className="h-full bg-green-500 rounded transition-all duration-100"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <button
              onClick={reset}
              className={`p-0.5 rounded transition-colors ${
                darkMode
                  ? "text-gray-500 hover:text-gray-400"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Recommencer"
            >
              <RotateCcw size={10} />
            </button>
          </div>
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
      <audio ref={audioRef} src={audioUrl} />

      <button
        onClick={togglePlay}
        disabled={isLoading}
        className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
          isLoading
            ? darkMode
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            : isPlaying
            ? darkMode
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-green-500 text-white hover:bg-green-600"
            : darkMode
            ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause size={16} />
        ) : (
          <Play size={16} />
        )}
        <span className="text-xs">
          {isLoading ? "Chargement..." : isPlaying ? "Pause" : "Écouter"}
        </span>
      </button>

      {duration > 0 && (
        <>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className={`flex-1 h-2 rounded cursor-pointer ${
                darkMode ? "bg-gray-600" : "bg-gray-300"
              }`}
            >
              <div
                className="h-full bg-green-500 rounded transition-all duration-100"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div
              className={`text-xs whitespace-nowrap ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={reset}
              className={`p-1 rounded transition-colors ${
                darkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Recommencer"
            >
              <RotateCcw size={14} />
            </button>

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

export default AudioPlayer;
