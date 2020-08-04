import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useMutation, queryCache } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";

import "./App.css";
import useAllUsers from "./queries/useAllUsers";

function Users() {
  const usersInfo = useAllUsers();

  // [1]
  return usersInfo.isLoading ? (
    "Loading Users ..."
  ) : usersInfo.isError ? (
    usersInfo.error.message
  ) : (
    <div className='Users'>
      <h1>Users {usersInfo.isFetching && "..."}</h1>
      <ul>
        {usersInfo.data.map((user) => {
          return (
            <li key={user.id}>
              <h5>{user.name}</h5>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function UserForm() {
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

  return (
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
      {addUserInfo.isError ? <pre>{addUserInfo.error.message}</pre> : null}
    </div>
  );
}

function App() {
  return (
    <>
      <Users />
      <UserForm />
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
