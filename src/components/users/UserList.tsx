import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../api/users";
import { User } from "../../interfaces/User";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  
  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.first_name} {user.last_name} - {user.email}
            <button onClick={() => handleDelete(user.id!)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
