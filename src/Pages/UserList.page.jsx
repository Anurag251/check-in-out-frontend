import React, { useContext, useRef, useState } from "react";
import ExcelJS from "exceljs";
import { AllDataContext } from "../context/AllData.context";

export const UserList = () => {
  const { message, setMessage } = useContext(AllDataContext);
  const [checkin, setCheckin] = useState(null);
  const [loadingTable, setLoadingTable] = useState(false);
  const tableRef = useRef(null);

  const URL = "https://event.katakinne.com";
  // const URL = "http://localhost:3000";

  const getUsers = (e) => {
    setLoadingTable(true);
    if (e.target.value !== "") {
      try {
        fetch(`${URL}/getUser/${e.target.value}`, {
          method: "POST",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.users?.length === 0) {
              setMessage({
                ...message,
                message: true,
                title: "No data found",
                type: "error",
                desc: "",
              });
            }
            setLoadingTable(false);
            setCheckin(data);
          });
      } catch (error) {
        setLoadingTable(false);
      }
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

  const exportToExcel = async () => {
    if (!checkin || !checkin.users) {
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.addRow(["Name", "Email", "Checkin", "Checkout", "Date", "Meal"]);

    checkin.users.forEach((data) => {
      worksheet.addRow([
        data.name,
        data.email,
        data.checkedInTime,
        data.checkedOutTime,
        data.checkedInDate,
        data.meals,
      ]);
    });

    const blob = await workbook.xlsx.writeBuffer();

    const url = window.URL.createObjectURL(new Blob([blob]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_data.xlsx";

    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="checkin-users-table">
      <div className="action-section">
        <select className="select-date" name="" id="" onChange={getUsers}>
          <option value="">Choose Date</option>
          <option value="2024-03-08">2024-03-08</option>
          <option value="2024-03-09">2024-03-09</option>
          <option value="2024-03-10">2024-03-10</option>
          <option value="2024-03-11">2024-03-11</option>
          <option value="2024-03-12">2024-03-12</option>
          <option value="2024-03-13">2024-03-13</option>
          <option value="2024-03-14">2024-03-14</option>
          <option value="2024-03-15">2024-03-15</option>
          <option value="2024-03-16">2024-03-16</option>
          <option value="2024-03-17">2024-03-17</option>
          <option value="2024-03-18">2024-03-18</option>
          <option value="2024-03-19">2024-03-19</option>
          <option value="2024-03-20">2024-03-20</option>
        </select>

        <button className="export-to-excel" onClick={exportToExcel}>
          <i className="fa-regular fa-file-excel"></i>
          Export excel
        </button>
      </div>

      {checkin !== null ? (
        <div id="table-to-export">
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Checkin</th>
                <th>Checkout</th>
                <th>Date</th>
                <th>Meal</th>
              </tr>
            </thead>

            {loadingTable ? (
              <tbody>
                <tr className="loading">
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                </tr>

                <tr className="loading">
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                </tr>

                <tr className="loading">
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                </tr>

                <tr className="loading">
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                </tr>

                <tr className="loading">
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                  <td>Loading...</td>
                </tr>
              </tbody>
            ) : (
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
            )}
          </table>
        </div>
      ) : null}
    </div>
  );
};
