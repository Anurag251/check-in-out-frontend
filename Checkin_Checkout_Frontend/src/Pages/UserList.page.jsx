import React, { useContext, useEffect, useState } from "react";
import { AllDataContext } from "../context/AllData.context";

export const UserList = () => {
  const { message, setMessage } = useContext(AllDataContext);
  const [checkin, setCheckin] = useState(null);
  const [status, setStatus] = useState(null);

  console.log(checkin);

  // const URL = "https://event.katakinne.com";
  const URL = "http://localhost:3000";

  const getUsers = (e) => {
    if (e.target.value !== "") {
      fetch(`${URL}/getUser/${e.target.value}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setCheckin(data);
        });
    }
  };

  const mealList = (meals) => {
    const mealCounts = meals.reduce((counts, meal) => {
      counts[meal] = (counts[meal] || 0) + 1;
      return counts;
    }, {});

    const mealElements = Object.entries(mealCounts).map(([meal, count]) => (
      <span key={meal}>{count > 1 ? `${count} ${meal}s` : meal}</span>
    ));

    return <div className="meal-list">{mealElements}</div>;
  };

  return (
    <div>
      <select name="" id="" onChange={getUsers}>
        <option value="">Choose Data</option>
        <option value="2024-03-08">2024-03-08</option>
        <option value="2024-03-10">2024-03-10</option>
      </select>

      <table width="100%">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Name</th>
            <th style={{ textAlign: "left" }}>Email</th>
            <th style={{ textAlign: "left" }}>Checkin</th>
            <th style={{ textAlign: "left" }}>Checkout</th>
            <th style={{ textAlign: "left" }}>Date</th>
            <th style={{ textAlign: "left" }}>Meal</th>
          </tr>
        </thead>

        <tbody>
          {checkin?.users?.map((data) => (
            <tr key={data._id}>
              <td>{data.name}</td>
              <td>{data.email}</td>
              <td>{data.checkedInTime}</td>
              <td>{data.checkedOutTime}</td>
              <td>{data.checkedInDate}</td>
              <td>{data.meals.length ? mealList(data.meals) : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
