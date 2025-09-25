import React, { useState } from "react";
import { useTodoContext } from "../../context/useTodoContext.jsx";
import { useTheme } from "../../context/useTheme.jsx";
import { Button, Input, Modal, VoicePlayer } from "../ui/index.js";
import { FiUpload, FiX } from "react-icons/fi";

/**
 * Formulaire d'édition de tâche simplifié
 * @param {Object} props
 * @param {Object} props.todo - Tâche à éditer
 * @param {Function} props.onClose - Fonction pour fermer le formulaire
 * @param {Function} props.onSuccess - Fonction appelée après édition réussie
 */
const SimpleEditTodoForm = ({ todo, onClose, onSuccess }) => {
  const { updateTodo } = useTodoContext();
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    titre: todo.titre || todo.libelle || "",
    description: todo.description || "",
    photo: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(todo.photo || null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titre.trim()) {
      newErrors.titre = "Le titre est requis";
    }
    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Nettoyer l'erreur correspondante
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));

      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
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
      const result = await updateTodo(todo.id, formData);
      if (result.success) {
        onSuccess();
      } else {
        setErrors({
          general: result.error || "Erreur lors de la modification",
        });
      }
    } catch (error) {
      setErrors({
        general: "Erreur lors de la modification de la tâche" + error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Modifier la tâche" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div
            className="p-3 text-red-700 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-400"
            role="alert"
          >
            <p className="text-sm">{errors.general}</p>
          </div>
        )}

        <Input
          label="Titre"
          name="titre"
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
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              errors.description
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600"
            } dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            required
          />
          {errors.description && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.description}
            </p>
          )}
        </div>

        <div className="space-y-2">
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
                className="absolute p-1 text-white transition-colors bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
                aria-label="Supprimer la photo"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
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
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SimpleEditTodoForm;
