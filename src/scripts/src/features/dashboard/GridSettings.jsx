import React from "react";
import { GRID_PRESETS } from "../../constants/gridPresets.js";
import { Button } from "../../components/ui";

const GridSettings = ({ gridConfig, onChange }) => {
  return (
    <div className="flex gap-2 mb-6">
      {GRID_PRESETS.map((preset) => (
        <Button
          key={preset.name}
          onClick={() => onChange(preset.cols, preset.rows)}
        >
          {preset.name}
        </Button>
      ))}
    </div>
  );
};

export default GridSettings;
