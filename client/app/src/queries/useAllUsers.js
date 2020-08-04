import React from "react";
import { useQuery } from "react-query";
import axios from "axios";

export default function useAllUsers() {
  return useQuery("users", () =>
    axios.get("http://localhost:8000/api/users").then((res) => res.data)
  );
}
