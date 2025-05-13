import React from "react";

const PlantEquipments = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Plant Equipments</h2>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          List of all the equipment used in the plant.
        </p>
        <div className="flex flex-col gap-2">
          {/* Add your equipment list here */}
        </div>
      </div>
    </div>
  );
}
export default PlantEquipments;