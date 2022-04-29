import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Input, Table } from "./components";
import useFetch from "./hooks/searchDuplicates";

export interface inputDataType {
  startDate: string;
  endDate: string;
  address: string;
}

const App: React.FC<any> = () => {
  const [inputData, setInputData] = useState<inputDataType>({
    startDate: "",
    endDate: "",
    address: "",
  });
  const [data, loading] = useFetch(
    inputData.startDate,
    inputData.endDate,
    inputData.address
  );

  const [selectedVali, setSelectedvai] = useState();

  const setTable = useCallback(
    function setTable() {
      if (loading && inputData.startDate && inputData.endDate) {
        return <h1>Loading..</h1>;
      } else if (!loading && data) {
        return (
          <div>
            <Table apiData={data} setSelectedValidators={setSelectedvai} />
            <button
              onClick={() => {
                setInputData({
                  address: inputData?.address,
                  startDate: data[data.length - 1].date,
                  endDate: inputData?.endDate,
                });
              }}
            >
              Get more
            </button>
          </div>
        );
      }
    },
    [data, inputData, loading]
  );

  useEffect(() => {
    if (selectedVali) {
      console.log(selectedVali);
      axios.post("/api/deleteValidators", selectedVali);
      setSelectedvai(undefined);
      setInputData({
        address: inputData?.address,
        startDate: data[data.length - 1].date,
        endDate: inputData?.endDate,
      });
    }
  }, [data, inputData?.address, inputData?.endDate, selectedVali]);

  return (
    <div className="tableContainer">
      <Input setInputData={setInputData} />
      {setTable()}
    </div>
  );
};

export default App;
