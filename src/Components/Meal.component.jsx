import React, { useState, useEffect, useCallback, useRef } from "react";
import moment from "moment-timezone";

const MealComponent = ({ pageData }) => {
  const mealButtonsRef = useRef(null);
  const drinkButtonsRef = useRef(null);

  const [visibleMeals, setVisibleMeals] = useState([]);
  const [visibleDrinks, setVisibleDrinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonToDisabled, setButtonToDisabled] = useState(
    pageData?.user?.meals || []
  );

  useEffect(() => {
    setButtonToDisabled(pageData?.user?.meals);
  }, [pageData]);

  const URL = "http://localhost:3000";
  // const URL = "https://event.katakinne.com";
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
          // let drinkCount = buttonToDisabled.reduce((a, c) => {
          //   if (c.toLowerCase() === "drinks") {
          //     return (a = a + 1);
          //   }
          //   return a;
          // }, 0);

          drinks.push({ quantity: quantity, meal });
          // for (let i = 0; i < parseInt(quantity); i++) {
          //   drinks.push(meal);
          // }
        } else {
          // let mealCount = buttonToDisabled.reduce((a, c) => {
          //   if (c.toLowerCase() === meal.toLowerCase()) {
          //     return (a = a + 1);
          //   }
          //   return a;
          // }, 0);

          meals.push({ quantity: quantity, meal });
          // for (let i = 0; i < parseInt(quantity); i++) {
          //   meals.push(meal);
          // }
        }
      }
    }
    return { meals, drinks };
  }, [pageData, getCurrentDate, buttonToDisabled]);

  const updateMeal = (meal) => {
    setLoading(true);
    try {
      fetch(`${URL}/meal/${userId}/${meal}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          setButtonToDisabled(data.meal || []);
        });
    } catch (error) {
      setLoading(false);
      console.error("Error fetching buttonToDisabled:", error);
    }
  };

  const disableButtons = useCallback((buttonsToDisable, containerRef) => {
    const buttons = Array.from(
      containerRef.current?.querySelectorAll(".meal-button") || []
    );

    const countMap = buttonsToDisable?.reduce((map, button) => {
      map.set(button, (map.get(button) || 0) + 1);
      return map;
    }, new Map());

    for (const button of buttons) {
      const buttonText = button.textContent;
      if (
        buttonsToDisable?.includes(buttonText) &&
        countMap.get(buttonText) > 0
      ) {
        button.disabled = true;
        countMap.set(buttonText, countMap.get(buttonText) - 1);
        button.classList.add("disabled");
      } else {
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);

    disableButtons(buttonToDisabled, mealButtonsRef);
    disableButtons(buttonToDisabled, drinkButtonsRef);

    if (mealButtonsRef.current || drinkButtonsRef.current) {
      setLoading(false);
    }
  }, [
    buttonToDisabled,
    disableButtons,
    mealButtonsRef.current,
    drinkButtonsRef.current,
  ]);

  useEffect(() => {
    const currentTime = moment().tz("asia/kathmandu");

    const mealTimeRanges = getCurrentDateMeals().meals.map(({ meal }) => {
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
            end: moment().set({ hours: 1, minutes: 0, seconds: 0 }),
          };
        default:
          return null;
      }
    });

    const visibleMeals = getCurrentDateMeals().meals.filter((meal, index) => {
      // return true;
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
      // return true;
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
            <div className="button-list" ref={containerId}>
              {meals.map(({ meal, quantity }, index) => (
                <div key={index}>
                  {quantity === 0 ? null : (
                    <button
                      className={`meal-button ${loading ? "active" : ""}`}
                      onClick={() => updateMeal(meal)}
                    >
                      {meal === "Dinner" ? (
                        <i className="fa-solid fa-utensils"></i>
                      ) : meal === "Drinks" ? (
                        <i className="fa-solid fa-wine-glass-empty"></i>
                      ) : meal === "Lunch" ? (
                        <i className="fa-solid fa-bowl-food"></i>
                      ) : meal === "Breakfast" ? (
                        <i className="fa-solid fa-cookie"></i>
                      ) : null}
                      {meal}{" "}
                      {quantity -
                        buttonToDisabled.reduce((a, c) => {
                          if (c.toLowerCase() === meal.toLowerCase()) {
                            return (a = a + 1);
                          }
                          return a;
                        }, 0)}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="available-meal">
      {renderMealsButtons(visibleMeals, "Available Meals", mealButtonsRef)}
      {renderMealsButtons(visibleDrinks, "Available Drinks", drinkButtonsRef)}
    </div>
  );
};

export default MealComponent;
