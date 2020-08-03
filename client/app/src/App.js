import React from "react";
import "./App.css";
import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import axios from "axios";

function Users() {
  const usersInfo = useQuery("users", () =>
    axios.get("http://localhost:8000/api/users").then((res) => res.data)
  );
  return (
    <div className='Users'>
      <h1>Users {usersInfo.isFetching && "..."}</h1>
      {usersInfo.isError && <h4>error loading users</h4>}

      <div>
        {usersInfo.isLoading ? (
          "Loading users ... "
        ) : (
          <ul>
            {usersInfo?.data?.map((user) => {
              return (
                <li key={user.id} className='container'>
                  <h5>{user.name}</h5>
                  <p>bio: {user.bio}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Users />
      <ReactQueryDevtools />
    </>
  );
}

export default App;
