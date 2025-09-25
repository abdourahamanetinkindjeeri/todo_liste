import { useEffect, useRef, useState } from "react";
import { useTodoContext } from "../../context/useTodoContext";
import { useTheme } from "../../context/useTheme";
import { Input, Modal, Button, VoicePlayer } from "../ui/index.js";
import { FiUpload, FiX } from "react-icons/fi";

const VocalRecorder = ({ onChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onChange(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // arrêt auto après 30s
      setTimeout(() => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === "recording"
        ) {
          stopRecording();
          console.log("Enregistrement terminé (30 secondes max).");
        }
      }, 30000);
    } catch (err) {
      console.error("Erreur d'accès au micro :", err);
      alert("Impossible d'accéder au micro");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Enregistrement vocal (optionnel)
      </label>
      <div className="flex gap-2">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="px-4 py-2 text-white bg-green-500 rounded-lg"
          >
            🎤 Démarrer
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="px-4 py-2 text-white bg-red-500 rounded-lg"
          >
            ⏹️ Arrêter
          </button>
        )}
      </div>
      {audioUrl && (
        <audio controls src={audioUrl} className="w-full mt-2"></audio>
      )}
    </div>
  );
};

const SimpleCreateTodoForm = ({ onClose, onSuccess }) => {
  const { createTodo } = useTodoContext();
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    titre: "Apprendre les principes solid",
    description: "Comprendre les principes solides design pattern",
    photo: null, 
    vocal: null, 
    dateFin: "",
    tempsExecution: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  const titreRef = useRef(null);

  useEffect(() => {
    if (titreRef.current) titreRef.current.focus();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titre.trim()) newErrors.titre = "Le titre est requis";
    if (!formData.description.trim())
      newErrors.description = "La description est requise";
    if (formData.dateFin && isNaN(Date.parse(formData.dateFin)))
      newErrors.dateFin = "Date fin invalide";
    if (
      formData.tempsExecution &&
      (isNaN(formData.tempsExecution) || Number(formData.tempsExecution) <= 0)
    )
      newErrors.tempsExecution = "Durée invalide";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setPhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await createTodo(formData);
      if (result.success) onSuccess();
      else setErrors({ general: result.error || "Erreur lors de la création" });
    } catch (error) {
      setErrors({
        general: "Erreur lors de la création de la tâche : " + error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Nouvelle tâche" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div
            className="p-3 text-red-700 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400"
            role="alert"
          >
            {errors.general}
          </div>
        )}

        <Input
          label="Titre"
          name="titre"
          ref={titreRef}
          value={formData.titre}
          onChange={handleChange}
          placeholder="Entrez le titre de la tâche"
          error={errors.titre}
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez la tâche en détail..."
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              errors.description
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600"
            } dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            required
          />
          {errors.description && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.description}
            </p>
          )}
        </div>

        {/* Aperçu vocal */}
        {formData.vocal && (
          <div className="p-3 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
            <label className="block mb-2 text-sm font-medium text-blue-700 dark:text-blue-300">
              📢 Prévisualisation vocale
            </label>
            <VoicePlayer
              title={formData.titre}
              description={formData.description}
              darkMode={darkMode}
              compact={false}
            />
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
              Vous pouvez écouter votre tâche avant de la créer
            </p>
          </div>
        )}

        {/* Photo */}
        <div className="relative space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Photo (optionnel)
          </label>
          {photoPreview ? (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Aperçu"
                className="object-cover w-full h-32 rounded-lg"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                darkMode
                  ? "border-gray-600 hover:border-gray-500"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <FiUpload className="mx-auto mb-2" size={24} />
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Cliquez pour ajouter une photo
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Vocal */}
        <VocalRecorder
          onChange={(blob) => setFormData((prev) => ({ ...prev, vocal: blob }))}
        />

        {/* Date fin */}
        {/* <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date fin tâche (optionnel)
          </label>
          <input
            type="date"
            name="dateFin"
            value={formData.dateFin}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              errors.dateFin
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600"
            } dark:text-white`}
          />
          {errors.dateFin && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.dateFin}
            </p>
          )}
        </div> */}

        {/* Durée */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Durée tâche (minutes, optionnel)
          </label>
          <input
            type="number"
            name="tempsExecution"
            value={formData.tempsExecution}
            onChange={handleChange}
            min="1"
            placeholder="Durée en minutes"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              errors.tempsExecution
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600"
            } dark:text-white`}
          />
          {errors.tempsExecution && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.tempsExecution}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button type="submit" loading={isLoading} className="flex-1">
            Créer la tâche
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SimpleCreateTodoForm;
