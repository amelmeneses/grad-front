import React from "react";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";

const App: React.FC = () => {
  return (
    <div>
      <h1>CRUD App</h1>
      <UserForm />
      <UserList />
    </div>
  );
};

export default App;
