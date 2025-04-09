import { useEffect, useState } from "react";
import { getServices, deleteService } from "../../api/services";
import { Service } from "../../interfaces/Service";

const ServiceList = () => {
  const [services, setServices] = useState<Service[]>([]);

  const fetchServices = async () => {
    const data = await getServices();
    setServices(data);
  };

  const handleDelete = async (id: number) => {
    await deleteService(id);
    fetchServices();
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div>
      <h2>Lista de Servicios</h2>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            {service.name} - {service.description} (Cancha ID: {service.court_id})
            <button onClick={() => handleDelete(service.id!)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceList;
