import Papa from "papaparse";
import { useEffect, useState } from "react";
import "./App.css";

const URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2aYIhdBH95KsM-3ohuHeGiPIgd2KzlBtT2CXoqJwVXj3SDiA3-xVu-VDhWxtjETiPWejkXa3lEtpB/pub?output=csv";

function App() {
  const [table, setTable] = useState([]);
  const [tableHeadRow, setTableHeadRow] = useState([]);

  useEffect(() => {
    Papa.parse(URL, {
      download: true,
      header: true,
      complete: (results) => {

        setTable(results.data);

        for (let j in results.data[0]) {
          setTableHeadRow((prev) => [...prev, j]);
        }
      },
    });
  }, []);

  return (
    <>
      {tableHeadRow && table ? (
        <table>
          <thead>
            <tr>
              {tableHeadRow.map((value, index) => {
                return <th key={index}>{value}</th>;
              })}
            </tr>
          </thead>

          <tbody>
            {table.map((value, index) => (
              <tr key={index}>
                {tableHeadRow.map((subValue) => (
                  <td>{value[subValue]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h1> Loading ... </h1>
      )}
    </>
  );
}

export default App;
