import { useEffect, useState } from "react";
import { getCourts, deleteCourt } from "../../api/courts";
import { Court } from "../../interfaces/Court";

const CourtList = () => {
  const [courts, setCourts] = useState<Court[]>([]);

  const fetchCourts = async () => {
    const data = await getCourts();
    setCourts(data);
  };

  const handleDelete = async (id: number) => {
    await deleteCourt(id);
    fetchCourts();
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  return (
    <div>
      <h2>Lista de Canchas</h2>
      <ul>
        {courts.map((court) => (
          <li key={court.id}>
            {court.name} ({court.sport_type}) - {court.location}
            <button onClick={() => handleDelete(court.id!)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourtList;
