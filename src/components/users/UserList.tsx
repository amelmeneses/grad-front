import React, { useEffect, useState } from "react";
import api from "../../api";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email} - {user.age}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
