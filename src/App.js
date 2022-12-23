import Papa from "papaparse";
import {useEffect, useState} from "react";
import "./App.css";

const URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2aYIhdBH95KsM-3ohuHeGiPIgd2KzlBtT2CXoqJwVXj3SDiA3-xVu-VDhWxtjETiPWejkXa3lEtpB/pub?output=csv";

function App() {
    const [table, setTable] = useState([]);
    const [tableHeadRow, setTableHeadRow] = useState([]);
    const [searchValue, setSearchValue] = useState("")
    const [reset, setReset] = useState(false);
    const [filterOn, setFilterOn] = useState("Favourite Color")

    const handleDropdown = (event) => {
        handleReset();
        setFilterOn(event.target.value);
    }

    const handleSearch = (event) => {
        console.log("search:  ", event.target.value);
        setSearchValue(event.target.value)
    }

    useEffect(() => {
        console.log("in filter effect")
        if (searchValue) {
            setTable(prev => prev.filter(value =>
                (filterOn === "Budget" && value["Budget"].toLowerCase().includes(searchValue)) ||
                (filterOn === "Favourite Color" && value["Favourite Color"].toLowerCase().includes(searchValue)) ||
                (filterOn === "Favourite car" && value["Favourite car"].toLowerCase().includes(searchValue)) ||
                (filterOn === "Purpose" && value["Purpose"].toLowerCase().includes(searchValue))
            ));
        } else {
            handleReset();
        }
    }, [searchValue])

    const handleReset = () => {
        setReset(!reset);
        setSearchValue("");
    }

    useEffect(() => {
        Papa.parse(URL, {
            download: true,
            header: true,
            complete: (results) => {

                setTable(results.data);
                console.log(results.data);

                let headers = [];
                for (let j in results.data[0]) {
                    headers.push(j);
                }
                setTableHeadRow(headers);
            },
        });
    }, [reset]);

    return (
        <>
            <div>
                <label>
                    Choose columns:
                    <select value={filterOn} onChange={handleDropdown}>
                        {tableHeadRow.map((subValue) => (
                            <option value={subValue}>{subValue}</option>
                        ))}
                    </select>
                </label>
            </div>

            <input placeholder={"search"} type="text" name="search" value={searchValue}
                   onChange={handleSearch}/>
            {searchValue && <button type={"button"} onClick={handleReset}>Remove Filter</button>}

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
