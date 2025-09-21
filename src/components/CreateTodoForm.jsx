import React, { useState } from "react";
import { useTodoContext } from "../context/useTodoContext";
import { FiX, FiUpload, FiImage } from "react-icons/fi";

const CreateTodoForm = ({ onClose }) => {
  const { createTodo } = useTodoContext();
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner une image valide");
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("La taille de l'image ne doit pas dépasser 5MB");
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Créer une preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titre.trim()) {
      setError("Le titre est obligatoire");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const todoData = {
        titre: formData.titre.trim(),
        description: formData.description.trim(),
        photo: selectedFile,
      };

      const result = await createTodo(todoData);

      if (result.success) {
        onClose();
      } else {
        setError(result.error || "Erreur lors de la création de la tâche");
      }
    } catch (err) {
      setError("Erreur inattendue lors de la création");
      console.error("Erreur création todo:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Créer une nouvelle tâche
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Message d'erreur */}
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 rounded-md bg-red-50">
              {error}
            </div>
          )}

          {/* Titre */}
          <div className="mb-4">
            <label
              htmlFor="titre"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Titre *
            </label>
            <input
              type="text"
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Titre de la tâche"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description de la tâche (optionnel)"
              disabled={isSubmitting}
            />
          </div>

          {/* Upload de photo */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Photo (optionnel)
            </label>

            {!selectedFile ? (
              <div className="p-6 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400">
                <FiUpload className="w-12 h-12 mx-auto text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="photo" className="cursor-pointer">
                    <span className="font-medium text-blue-600 hover:text-blue-700">
                      Cliquez pour télécharger
                    </span>
                    <span className="text-gray-500">
                      {" "}
                      ou glissez une image ici
                    </span>
                  </label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF jusqu'à 5MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="p-2 border border-gray-300 rounded-lg">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="object-cover w-full h-32 rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1 hover:bg-red-600"
                  disabled={isSubmitting}
                >
                  <FiX size={16} />
                </button>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <FiImage className="mr-1" />
                  <span>{selectedFile.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50"
              disabled={isSubmitting || !formData.titre.trim()}
            >
              {isSubmitting ? "Création..." : "Créer la tâche"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTodoForm;
