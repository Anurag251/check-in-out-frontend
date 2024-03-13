import React, { useState, useEffect, useCallback, useRef } from "react";
import moment from "moment-timezone";

const MealComponent = ({ pageData }) => {
  const [visibleMeals, setVisibleMeals] = useState([]);
  const [visibleDrinks, setVisibleDrinks] = useState([]);
  const [buttonToDisabled, setButtonToDisabled] = useState(
    pageData?.user?.meals || []
  );

  useEffect(() => {
    setButtonToDisabled(pageData?.user?.meals);
  }, [pageData]);

  const URL = "http://localhost:3000";
  const userId = location.pathname.split("/").pop();

  const getCurrentDate = useCallback(() => {
    const day = moment.tz("asia/kathmandu").format("D");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[moment.tz("asia/kathmandu").month()];
    return `${day} ${month}`;
  }, []);

  const getCurrentDateMeals = useCallback(() => {
    const currentDate = getCurrentDate();
    const meals = [];
    const drinks = [];
    for (const key in pageData?.user) {
      if (key.startsWith(currentDate)) {
        const [quantity, meal] = pageData?.user[key].split(" ");
        if (meal === "Drinks") {
          for (let i = 0; i < parseInt(quantity); i++) {
            drinks.push(meal);
          }
        } else {
          for (let i = 0; i < parseInt(quantity); i++) {
            meals.push(meal);
          }
        }
      }
    }
    return { meals, drinks };
  }, [pageData, getCurrentDate]);

  const updateMeal = (meal) => {
    try {
      fetch(`${URL}/meal/${userId}/${meal}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setButtonToDisabled(data.meal || []);
        });
    } catch (error) {
      console.error("Error fetching buttonToDisabled:", error);
    }
  };

  const disableButtons = useCallback((buttonsToDisable, containerId) => {
    const buttons = Array.from(
      document.getElementById(containerId)?.getElementsByTagName("button") || []
    );

    // Count the occurrences of each button in buttonsToDisable
    const countMap = buttonsToDisable?.reduce((map, button) => {
      map.set(button, (map.get(button) || 0) + 1);
      return map;
    }, new Map());

    for (const button of buttons) {
      const buttonText = button.textContent;
      if (
        buttonsToDisable.includes(buttonText) &&
        countMap.get(buttonText) > 0
      ) {
        button.disabled = true;
        countMap.set(buttonText, countMap.get(buttonText) - 1);
        button.classList.add("disabled");
      }
    }
  }, []);

  useEffect(() => {
    disableButtons(buttonToDisabled, "mealButtons");
    disableButtons(buttonToDisabled, "drinkButtons");
  }, [buttonToDisabled, disableButtons]);

  useEffect(() => {
    const currentTime = moment().tz("asia/kathmandu");

    const mealTimeRanges = getCurrentDateMeals().meals.map((meal) => {
      switch (meal) {
        case "Breakfast":
          return {
            start: moment().set({ hours: 4, minutes: 0, seconds: 0 }),
            end: moment().set({ hours: 10, minutes: 0, seconds: 0 }),
          };
        case "Lunch":
          return {
            start: moment().set({ hours: 10, minutes: 0, seconds: 0 }),
            end: moment().set({ hours: 15, minutes: 0, seconds: 0 }),
          };
        case "Dinner":
          return {
            start: moment().set({ hours: 17, minutes: 0, seconds: 0 }),
            end: moment().set({ hours: 23, minutes: 0, seconds: 0 }),
          };
        default:
          return null;
      }
    });

    const visibleMeals = getCurrentDateMeals().meals.filter((meal, index) => {
      const { start, end } = mealTimeRanges[index];
      return currentTime.isBetween(start, end);
    });

    setVisibleMeals(visibleMeals);

    const drinksTimeRange = getCurrentDateMeals().drinks.map(() => {
      return {
        start: moment().set({ hours: 18, minutes: 0, seconds: 0 }),
        end: moment().set({ hours: 3, minutes: 0, seconds: 0 }).add(1, "days"),
      };
    });

    const visibleDrinks = getCurrentDateMeals().drinks.filter(() => {
      return currentTime.isBetween(
        drinksTimeRange[0].start,
        drinksTimeRange[0].end
      );
    });

    setVisibleDrinks(visibleDrinks);
  }, [getCurrentDateMeals]);

  const renderMealsButtons = (meals, title, containerId) => {
    return (
      <>
        {meals.length > 0 && (
          <>
            <h3>{title}</h3>
            <div className="button-list" id={containerId}>
              {meals.map((meal, index) => (
                <button key={index} onClick={() => updateMeal(meal)}>
                  {meal === "Dinner" ? (
                    <i className="fa-solid fa-utensils"></i>
                  ) : meal === "Drinks" ? (
                    <i className="fa-solid fa-wine-glass-empty"></i>
                  ) : meal === "Lunch" ? (
                    <i className="fa-solid fa-bowl-food"></i>
                  ) : meal === "Breakfast" ? (
                    <i className="fa-solid fa-cookie"></i>
                  ) : null}
                  {meal}
                </button>
              ))}
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="available-meal">
      {renderMealsButtons(visibleMeals, "Available Meals", "mealButtons")}
      {renderMealsButtons(visibleDrinks, "Available Drinks", "drinkButtons")}
    </div>
  );
};

export default MealComponent;
