import React from "react";

const TodoGrid = ({ todos, gridConfig }) => {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))`,
      }}
    >
      {todos.map((todo) => (
        <div key={todo.id} className="p-4 bg-white/20 rounded-lg text-white">
          <h3 className="font-bold">{todo.titre || todo.title}</h3>
          <p className="text-sm">{todo.description}</p>
        </div>
      ))}
    </div>
  );
};

export default TodoGrid;
