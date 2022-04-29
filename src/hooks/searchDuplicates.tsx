import { useEffect, useState } from "react";
import axios from "axios";

export default function useFetch(
  startDate: string,
  endDate: string,
  address: string
) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("called");
    setLoading(true);
    if (startDate && endDate) {
      axios
        .post("/api/getValidators", { startDate, endDate, address })
        .then((result) => {
          setData(result.data);
          setLoading(false);
        });
    }
  }, [address, endDate, startDate]);

  return [data, loading];
}
