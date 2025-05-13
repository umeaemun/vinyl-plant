import React from "react";

const PlantReviews = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Plant Reviews</h2>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          List of all the reviews for the plant.
        </p>
        <div className="flex flex-col gap-2">
          {/* Add your review list here */}
        </div>
      </div>
    </div>
  );
}   

export default PlantReviews;
