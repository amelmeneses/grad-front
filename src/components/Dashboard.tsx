// src/components/Dashboard.tsx

import { useState } from 'react';
import CompanyForm     from '../components/CompanyForm';
import CompanyList     from '../components/companies/CompanyList';
import ManageCourts    from '../components/ManageCourts';    // ← Import corregido
// import ReservationForm from '../components/reservations/ReservationForm';
// import ReservationList from '../components/reservations/ReservationList';

const Dashboard = () => {
  const [refresh, setRefresh] = useState(false);
  const reload = () => setRefresh(!refresh);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>

      <h2>Users</h2>

      <h2>Companies</h2>
      <CompanyForm onCompanyAdded={reload} />
      <CompanyList key={`companies-${refresh}`} />

      <h2>Courts</h2>
      {/* <CourtForm onCourtAdded={reload} /> */}
      <ManageCourts key={`courts-${refresh}`} /> {/* ← Cambiado a ManageCourts */}

      <h2>Reservations</h2>
      {/* <ReservationForm onReservationAdded={reload} />
      <ReservationList key={`reservations-${refresh}`} /> */}
    </div>
  );
};

export default Dashboard;
