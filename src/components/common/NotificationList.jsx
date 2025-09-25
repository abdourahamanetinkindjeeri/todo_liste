import React from "react";

const NotificationList = ({ notifications, onClose }) => {
  return (
    <div className="absolute top-16 left-0 z-50 w-80 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
        <span className="font-bold text-white">Notifications</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>
      <ul className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <li className="px-4 py-3 text-gray-400">Aucune notification</li>
        ) : (
          notifications.map((notif) => (
            <li
              key={notif.id}
              className={`px-4 py-3 border-b border-gray-800 ${
                notif.estLu ? "text-gray-400" : "text-green-300"
              }`}
            >
              <div className="font-semibold">{notif.action}</div>
              <div className="text-sm">{notif.description}</div>
              <div className="text-xs text-gray-500">
                {new Date(notif.createdAt).toLocaleString()}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationList;
