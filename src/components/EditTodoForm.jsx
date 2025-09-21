import React, { useState, useEffect } from "react";
import { useTodoContext } from "../context/useTodoContext";
import { FiX, FiUpload, FiImage } from "react-icons/fi";

const EditTodoForm = ({ todo, onClose }) => {
  const { updateTodo } = useTodoContext();
  const [formData, setFormData] = useState({
    titre: todo.titre || "",
    description: todo.description || "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (todo.photo) {
      setCurrentPhotoUrl(`http://localhost:8888${todo.photo}`);
    }
  }, [todo]);

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

  const handleRemoveNewFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleRemoveCurrentPhoto = () => {
    setCurrentPhotoUrl(null);
    // On pourrait ajouter un flag pour indiquer la suppression de la photo existante
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
      };

      // Ajouter la photo seulement si une nouvelle photo est sélectionnée
      if (selectedFile) {
        todoData.photo = selectedFile;
      }

      const result = await updateTodo(todo.id, todoData);

      if (result.success) {
        onClose();
      } else {
        setError(result.error || "Erreur lors de la mise à jour de la tâche");
      }
    } catch (err) {
      setError("Erreur inattendue lors de la mise à jour");
      console.error("Erreur mise à jour todo:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Modifier la tâche
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
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Titre */}
          <div className="mb-4">
            <label
              htmlFor="titre"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="block text-sm font-medium text-gray-700 mb-2"
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

          {/* Photo actuelle */}
          {currentPhotoUrl && !selectedFile && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo actuelle
              </label>
              <div className="relative">
                <div className="border border-gray-300 rounded-lg p-2">
                  <img
                    src={currentPhotoUrl}
                    alt="Photo actuelle"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCurrentPhoto}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  disabled={isSubmitting}
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Upload de nouvelle photo */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentPhotoUrl ? "Changer la photo" : "Ajouter une photo"}
            </label>

            {!selectedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="photo" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
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
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF jusqu'à 5MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="border border-gray-300 rounded-lg p-2">
                  <img
                    src={previewUrl}
                    alt="Nouvelle photo"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveNewFile}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  disabled={isSubmitting}
                >
                  <FiX size={16} />
                </button>
                <div className="mt-2 flex items-center text-sm text-gray-600">
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
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
              disabled={isSubmitting || !formData.titre.trim()}
            >
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTodoForm;
