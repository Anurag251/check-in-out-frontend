import React, { useState, useEffect } from "react";

const App = () => {
  const [meals, setMeals] = useState([
    "Breakfast",
    "Lunch",
    "Dinner",
    "Drinks",
    "Drinks",
    "Drinks",
  ]);
  const [buttonToDisabled, setButtonToDisabled] = useState([
    "Drinks",
    "Breakfast",
  ]);

  const disableButtons = (buttonsToDisable) => {
    setMeals((prevMeals) => {
      return prevMeals.map((meal) => ({
        name: meal,
        disabled: buttonsToDisable.includes(meal),
      }));
    });
  };

  useEffect(() => {
    disableButtons(buttonToDisabled);
  }, [buttonToDisabled]);

  return (
    <div>
      <div>
        <h4>Available Meal</h4>
        <div className="button-list">
          {meals.map((meal, index) => (
            <button key={index} disabled={meal.disabled}>
              {meal.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4>Available Drinks</h4>
        <div className="button-list">
          {meals
            .filter((meal) => meal.name === "Drinks")
            .map((drink, index) => (
              <button key={index} disabled={drink.disabled}>
                {drink.name}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
