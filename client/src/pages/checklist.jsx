import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import "../styles/checklist.css";

import { Search, Dropdown, Pagination } from "../components";

function Checklist() {
  const [checklists, setChecklists] = useState([]);
  const [checklistTotal, setChecklistTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [foundTotal, setFoundTotal] = useState(0);
  const [birderName, setBirderName] = useState("");
  const [birdingSite, setBirdingSite] = useState("");
  const [selectedDzongkhag, setSelectedDzongkhag] = useState("");
  const [selectedGewog, setSelectedGewog] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [dzongkhagOptions, setDzongkhagOptions] = useState([]);
  const [gewogOptions, setGewogOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  console.log(selectedDate);

  useEffect(() => {
    fetchData();
  }, [
    page,
    limit,
    birderName,
    selectedDate,
    birdingSite,
    selectedDzongkhag,
    selectedGewog,
    selectedVillage,
  ]);

  const fetchData = async () => {
    try {
      const formattedDate = selectedDate
        ? moment(selectedDate).format("YYYY-MM-DD")
        : "";

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/checklists?page=${page}&limit=${limit}&birder=${birderName}&birding_site=${birdingSite}&dzongkhag=${selectedDzongkhag}&gewog=${selectedGewog}&village=${selectedVillage}&date=${formattedDate}`
      );
      console.log("response: ", response.data);
      setLimit(response.data.limit);
      setFoundTotal(response.data.foundTotal);
      setChecklistTotal(response.data.totalChecklists);
      setDzongkhagOptions(response.data.distinctDzongkhags);
      setGewogOptions(response.data.distinctGewogs);
      setVillageOptions(response.data.distinctVillages);
      setChecklists(Object.values(response.data.checklists));
    } catch (error) {
      console.log(error);
    }
  };

  console.log("selectedDzongkhag: ", selectedDzongkhag);

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="checklists-page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "20px",
          paddingBottom: "26px",
        }}
      >
        <h2 className="total-header">
          Total Checklist
          <span className="checklist-count">({checklistTotal})</span>
        </h2>
        <div className="checklist-button-container">
          <button className="checklist-export-button">Export Data</button>
        </div>
      </div>
      <div className="checklist-page-container">
        <div className="checklist-filter-container">
          <div className="checklist-name-search">
            <Search
              placeholder="Birder"
              setSearch={(birderName) => setBirderName(birderName)}
              className="darker-placeholder"
            />
          </div>
          <div className="checklist-name-search">
            <Search
              placeholder="Birding sites"
              setSearch={(birdingSite) => setBirdingSite(birdingSite)}
            />
          </div>
          <div className="date-filter-select">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="Selected date"
              className="species-filter-dropdown"
              style={{ width: "100px", maxWidth: "100%" }}
            />
          </div>
          <div className="checklist-filter-select">
            <Dropdown
              option={selectedDzongkhag}
              options={dzongkhagOptions ? dzongkhagOptions : []}
              setOption={(dzongkhag) => setSelectedDzongkhag(dzongkhag)}
              title="Dzongkhags"
            />
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="checklist-filter-select">
            <Dropdown
              option={selectedGewog}
              options={gewogOptions ? gewogOptions : []}
              setOption={(gewog) => setSelectedGewog(gewog)}
              title="Gewogs"
            />
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
          <div className="checklist-filter-select">
            <Dropdown
              option={selectedVillage}
              options={villageOptions ? villageOptions : []}
              setOption={(village) => setSelectedVillage(village)}
              title="Villages"
            />
            <span className="material-icons google-font-icon">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>

      <div className="checklist-table-container">
        {checklists.map((item, index) => {
          const serialNumber = (page - 1) * limit + index + 1;
          return (
            <div key={index}>
              <Link
                to={`/checklists/${item._id.checklistName}`}
                className="checklist-link"
                state={{ ChecklistDetail: item }}
              >
                <div className="retrived-table">
                  <table className="checklist-table">
                    <tbody>
                      <tr>
                        <td data-label="Birder" className="custom-data">
                          #{serialNumber} {item._id.observer}
                        </td>
                        <td data-label="Birding site" className="custom-data">
                          {item._id.village && (
                            <>
                              {item._id.village}
                              {", "}
                            </>
                          )}

                          {item._id.gewog && (
                            <>
                              {item._id.gewog}
                              {", "}
                            </>
                          )}
                          {item._id.dzongkhag && (
                            <>
                              {item._id.dzongkhag}
                              {", "}
                            </>
                          )}
                        </td>
                        <td data-label="Date/Time" className="custom-data">
                          {convertDate(item._id.selectedDate) || "none"}
                        </td>
                        <td data-label="District" className="custom-data">
                          {item._id.dzongkhag || "none"}
                        </td>
                        <td data-label="Gewog" className="custom-data">
                          {item._id.gewog || "none"}
                        </td>
                        <td data-label="Chiwog" className="custom-data">
                          {item._id.village || "none"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "20px",
          paddingBottom: "26px",
        }}
      >
        <Link to="/checklists/add">
          <button className="add-button">Add Checklist</button>
        </Link>

        <Link to="/checklists/analyze">
          <button className="add-button">Analyze Checklist</button>
        </Link>
      </div> */}

      <Pagination
        page={page}
        limit={limit ? limit : 0}
        total={checklistTotal ? checklistTotal : 0}
        setPage={(page) => setPage(page)}
      />
    </div>
  );
}

export default Checklist;
