import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "../../context/useTheme.jsx";
import { useUserContext } from "../../context/useUserContext.jsx";
import { Search, Users, Mail, Calendar, MoreVertical } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import { API_BASE_URL, API_ENDPOINTS } from "../../constants/api.js";

/**
 * Composant de liste des membres de l'équipe
 * Affiche une liste paginée avec recherche des utilisateurs
 */
const TeamMembersList = ({ showNotification }) => {
  const { darkMode } = useTheme();
  const { token } = useUserContext();

  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [showList, setShowList] = useState(false);

  // Charger les membres de l'équipe
  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const authToken = token || localStorage.getItem("token");
        const response = await fetch(API_BASE_URL + API_ENDPOINTS.USERS.BASE, {
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.data)) {
            setMembers(data.data);
          } else {
            setMembers([]);
            showNotification?.("error", "Format de données invalide");
          }
        } else {
          throw new Error("Erreur lors du chargement");
        }
      } catch (error) {
        console.error("Erreur:", error);
        setMembers([]);
        showNotification?.("error", "Erreur lors du chargement des membres");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [token, showNotification]);

  // Filtrage et pagination
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        member.name?.toLowerCase().includes(searchLower) ||
        member.prenom?.toLowerCase().includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower)
      );
    });
  }, [members, searchTerm]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Réinitialiser la page quand le terme de recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
            darkMode ? "border-blue-400" : "border-blue-600"
          }`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec recherche et bouton toggle */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Users
            className={`w-6 h-6 ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`}
          />
          <h2
            className={`text-xl font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Équipe
          </h2>
          <span
            className={`text-sm px-2 py-1 rounded-full ${
              darkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {filteredMembers.length} membre
            {filteredMembers.length !== 1 ? "s" : ""}
          </span>
          <button
            className={`ml-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              showList
                ? darkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : darkMode
                ? "bg-gray-800 text-gray-300 hover:bg-blue-900"
                : "bg-gray-100 text-gray-700 hover:bg-blue-100"
            }`}
            onClick={() => setShowList((v) => !v)}
          >
            {showList ? "Masquer" : "Afficher"}
          </button>
        </div>
        {/* Barre de recherche visible seulement si la liste est affichée */}
        {showList && (
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="Rechercher un membre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
        )}
      </div>

      {/* Liste des membres visible seulement si showList */}
      {showList &&
        (paginatedMembers.length === 0 ? (
          <div
            className={`text-center py-12 rounded-xl border ${
              darkMode
                ? "bg-gray-800/30 border-gray-700/50 text-gray-400"
                : "bg-white/50 border-gray-200 text-gray-600"
            }`}
          >
            <Users className="mx-auto mb-4" size={48} />
            <h3
              className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {searchTerm ? "Aucun membre trouvé" : "Aucun membre"}
            </h3>
            <p>
              {searchTerm
                ? "Essayez avec d'autres termes de recherche"
                : "L'équipe sera bientôt constituée"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedMembers.map((member) => (
              <div
                key={member.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${
                        darkMode
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {(member.prenom || member.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    {/* Informations */}
                    <div className="space-y-1">
                      <h3
                        className={`font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {member.prenom || member.name || "Utilisateur"}
                      </h3>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Mail
                            className={`w-3 h-3 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {member.email}
                          </span>
                        </div>

                        {member.createdAt && (
                          <div className="flex items-center gap-1">
                            <Calendar
                              className={`w-3 h-3 ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            />
                            <span
                              className={
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }
                            >
                              Depuis{" "}
                              {new Date(member.createdAt).toLocaleDateString(
                                "fr-FR",
                                {
                                  year: "numeric",
                                  month: "short",
                                }
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

      {/* Pagination visible seulement si showList */}
      {showList && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
            color="primary"
            size="medium"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                color: darkMode ? "#e5e7eb" : "#374151",
                "&.Mui-selected": {
                  backgroundColor: darkMode ? "#3b82f6" : "#3b82f6",
                  color: "white",
                },
                "&:hover": {
                  backgroundColor: darkMode ? "#374151" : "#f3f4f6",
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TeamMembersList;
