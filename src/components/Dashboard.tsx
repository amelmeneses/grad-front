// src/components/Dashboard.tsx
import { useState } from 'react';
//mport axios from 'axios';
import UserForm from "../components/users/UserForm";
import UserList from "../components/users/UserList";
import CompanyForm from "../components/companies/CompanyForm";
import CompanyList from "../components/companies/CompanyList";
import CourtForm from "../components/courts/ CourtForm";
import CourtList from "../components/courts/CourtList";
import ServiceForm from "../components/services/ServiceForm";
import ServiceList from "../components/services/ServiceList";
import ReservationForm from "../components/reservations/ReservationForm";
import ReservationList from "../components/reservations/ReservationList";

const Dashboard = () => {
  const [refresh, setRefresh] = useState(false);
  const reload = () => setRefresh(!refresh);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      <h2>Usuarios</h2>
      <UserForm onUserAdded={reload} />
      <UserList key={`users-${refresh}`} />

      <h2>Empresas</h2>
      <CompanyForm onCompanyAdded={reload} />
      <CompanyList key={`companies-${refresh}`} />

      <h2>Canchas</h2>
      <CourtForm onCourtAdded={reload} />
      <CourtList key={`courts-${refresh}`} />

      <h2>Servicios</h2>
      <ServiceForm onServiceAdded={reload} />
      <ServiceList key={`services-${refresh}`} />

      <h2>Reservas</h2>
      <ReservationForm onReservationAdded={reload} />
      <ReservationList key={`reservations-${refresh}`} />
    </div>
  );
};

export default Dashboard;
