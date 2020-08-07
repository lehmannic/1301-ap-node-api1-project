import React from "react";
import { useQuery } from "react-query";
import axios from "axios";

export default function useAllGolfers() {
  return useQuery(
    "golfers",
    () =>
      axios
        .get("http://localhost:8000/golfers")
        .then((res) => res.data.events[0].players),
    {}
  );
}
