import { useState } from "react";
import { inputDataType } from "../../App";

const Input: React.FC<{
  setInputData: React.Dispatch<React.SetStateAction<inputDataType>>;
}> = ({ setInputData }) => {
  const [address, setaddress] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function onSearch() {
    setInputData({
      address: address,
      startDate: startDate,
      endDate: endDate,
    });
    setaddress("");
    setEndDate("");
    setStartDate("");
  }

  return (
    <div>
      <input
        type="text"
        value={address}
        onChange={(e) => setaddress(e.target.value)}
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button onClick={onSearch}>search</button>
    </div>
  );
};

export default Input;
