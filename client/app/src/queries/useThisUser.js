import React from "react";
import { useQuery } from "react-query";
import axios from "axios";

export default function useThisUser({ id }) {
  return useQuery(`users/${id}`, () =>
    axios.get(`http://localhost:8000/api/users/${id}`).then((res) => res.data)
  );
}
