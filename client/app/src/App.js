import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, queryCache, useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";

import "./App.css";
import useAllUsers from "./queries/useAllUsers";
import useThisUser from "./queries/useThisUser";


import useAllGolfers from "./queries/useAllGolfers";
function Golfers() {
  const [allGolfers, setAllGolfers] = React.useState([]);
  const golfers = useAllGolfers();
  // console.log(golfers);
  const desiredPlayers = new Set([
    "Brooks Koepka",
    "Bryson Dechambeau",
    "Justin Thomas",
    "Xander Schauffele",
    "Dustin Johnson",
    "Jon Rahm",
    "Rory Mcilroy",
    "Jordan Spieth",
    "Patrick Cantlay",
    "Tiger Woods",
    "Rickie Fowler",
    "Webb Simpson",
    "Jason Day",
    "Collin Morikawa",
    "Viktor Hovland",
    "Justin Rose",
    "Tony Finau",
    "Tommy Fleetwood",
    "Gary Woodland",
    "Patrick Reed",
    "Adam Scott",
    "Sergio Garcia",
    "Phil Mickelson",
    "Matthew Fitzpatrick",
    "Shane Lowry",
    "Louis Oosthuizen",
    "Daniel Berger",
    "Marc Leishman",
    "Abraham Ancer",
    "Cameron Champ",
    "Lucas Glover",
    "Hideki Matsuyama",
    "Sungjae Im",
    "Matthew Wolff",
    "Matt Kuchar",
    "Chez Reavie",
    "Tyrrell Hatton",
    "Brendon Todd",
    "Scottie Scheffler",
    "Paul Casey",
  ]);
  let results = [];

  results = golfers.data?.reduce((acc, cur) => {
    if (desiredPlayers.has(cur.name)) {
      if (!acc[cur.name]) {
        acc[cur.name] = { events: [], name: cur.name };
      }
      acc.push(cur);
    }
    return acc;
  }, []);
  console.log(results);

  return golfers.isLoading ? (
    "loading"
  ) : golfers.isError ? (
    "error"
  ) : results ? (
    <>
      <ul>
        {results.map((user) => {
          return (
            <li key={Date.now()}>
              <h5>{user.name}</h5>
              <p>total: {user.strokes}</p>
              <p>
                today: {user.today} thru: {user.hole}
              </p>
              <p>round 1: {user.rounds[0]}</p>
              <p>round 2: {user.rounds[1]}</p>
              <p>round 3: {user.rounds[2]}</p>
              <p>round 4: {user.rounds[3]}</p>
            </li>
          );
        })}
      </ul>
      {/* <pre>{JSON.stringify(results, null, 2)}</pre> */}
    </>
  ) : null;
}

function Users() {
  // [7]
  const [id, setID] = React.useState("");
  const usersInfo = useAllUsers();
  console.log("users render");

  // [8]
  const thisUser = useThisUser({ id });

  // [1]
  return usersInfo.isLoading ? (
    "Loading Users ..."
  ) : usersInfo.isError ? (
    usersInfo.error.message
  ) : (
    <div className='Users'>
      <>
        {/* [9a] */}
        <h1 onClick={() => setID("")}>
          Users {usersInfo.isFetching && "..."} {id}
        </h1>
        {/* [9b] */}
        <h2>{thisUser?.data?.bio}</h2>
      </>

      <ul>
        {usersInfo.data.map((user) => {
          return (
            <li key={user.id}>
              {/* [9a] */}
              <h5 onClick={() => setID(user.id)}>{user.name}</h5>
            </li>
          );
        })}
      </ul>
      <pre>{JSON.stringify(usersInfo.data, null, 2)}</pre>
    </div>
  );
}

function UserForm() {
  // [6]
  const usersInfoAGAIN = useAllUsers();
  console.log("Form render");
  // [2]
  const { register, handleSubmit, errors, reset } = useForm();

  // [3]
  const [attemptAddUser, addUserInfo] = useMutation(
    async (values) => {
      const newUser = { ...values };
      await axios.post("http://localhost:8000/api/users", newUser);
    },
    {
      // [4]
      onSuccess: async () => {
        queryCache.invalidateQueries("users");
        reset();
      },
      // [5]
      onError: (error) => {
        // window.alert(error.message)
      },
    }
  );

  // [6]
  return usersInfoAGAIN.isLoading ? (
    "Loading Users ..."
  ) : usersInfoAGAIN.isError ? (
    usersInfoAGAIN.error.message
  ) : (
    <div className='user-form-container'>
      <h3>Add a New User!</h3>
      <form onSubmit={handleSubmit(attemptAddUser)} className='user-form'>
        <input
          type='text'
          name='name'
          placeholder='name'
          ref={register({ required: true })}
        />
        <br />
        <input
          type='text'
          name='bio'
          placeholder='bio'
          ref={register({ required: true })}
        />
        <br />
        <button type='submit'>Add User</button>
        {/* [2] */}
        {errors.name && <p>How'd you forget your name?</p>}
        {errors.bio && <p>bio: something...anything</p>}
      </form>
      <pre>{JSON.stringify(usersInfoAGAIN.data, null, 2)}</pre>
      {addUserInfo.isError ? <pre>{addUserInfo.error.message}</pre> : null}
    </div>
  );
}

function App() {
  console.log("App render");
  return (
    <>
      <div className='App'>
        <Users />
        <UserForm />
      </div>
      <div>
        <Golfers />
      </div>
      <ReactQueryDevtools />
    </>
  );
}

export default App;

// [NOTES]
// [1] take care of loading and error states before trying to render userInfo
// --> no need for optional chaining below in usersInfo.data.map because we know its there

// [2] react-hook-form handles lots of things for us out of the bos
// --> register: allows us to keep track of 'uncontrolled' inputs
// --> errors: help us display error messages for required inputs and whatnot
// --> current setup prevents us from being able to submit without the required fields
// --> reset(): clear out form inputs as needed

// [3] useMutation from react-query
// --> takes care of C_UD

// [4] onSuccess
// --> can do anything in here (see reset())
// queryCache.invalidateQueries
// --> tell queries to invalidate & refetch
// --> this ex: ALL query keys that start with 'users'

// [5]
// can do lots of things in here
// console.log("UserForm -> error.message", error);
// window.alert(error.message)
// --> display TOASTS

// [6]
// showing different query using same string ⤵️
// --> only one network request
// --> see devtools (2 ['users'])

// [7] INTERACTING WITH "UI" STATE id
// --> need somewhere to hold id
// --> commonly used in ui
// --> id is the access key to the rest of the data

// [8]
// query for user info based on id
// --> stores data in cache even when its no longer on screen
// --> comes back right away next time ⚡️

// [9]
//  a. onClick toggle id that is being held in state
// --> remember: [8] is querying based on current id in state
//  b. show bio from data received in query from [8]
