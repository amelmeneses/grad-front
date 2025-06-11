// src/components/Dashboard.tsx

import { useState } from 'react';
import UserForm        from '../components/users/UserForm';
import UserList        from '../components/users/UserList';
import CompanyForm     from '../components/CompanyForm';
import CompanyList     from '../components/companies/CompanyList';
import ManageCourts    from '../components/ManageCourts';    // ← Import corregido
import CourtForm       from '../components/courts/CourtForm';
import ServiceForm     from '../components/services/ServiceForm';
import ServiceList     from '../components/services/ServiceList';
import ReservationForm from '../components/reservations/ReservationForm';
import ReservationList from '../components/reservations/ReservationList';

const Dashboard = () => {
  const [refresh, setRefresh] = useState(false);
  const reload = () => setRefresh(!refresh);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      <h2>Users</h2>
      <UserForm onUserAdded={reload} />
      <UserList key={`users-${refresh}`} />

      <h2>Companies</h2>
      <CompanyForm onCompanyAdded={reload} />
      <CompanyList key={`companies-${refresh}`} />

      <h2>Courts</h2>
      <CourtForm onCourtAdded={reload} />
      <ManageCourts key={`courts-${refresh}`} /> {/* ← Cambiado a ManageCourts */}

      <h2>Services</h2>
      <ServiceForm onServiceAdded={reload} />
      <ServiceList key={`services-${refresh}`} />

      <h2>Reservations</h2>
      <ReservationForm onReservationAdded={reload} />
      <ReservationList key={`reservations-${refresh}`} />
    </div>
  );
};

export default Dashboard;
