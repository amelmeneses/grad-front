import { useEffect, useState } from "react";
import { getCompanies, deleteCompany } from "../../api/companies";
import { Company } from "../../interfaces/Company";

const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  const fetchCompanies = async () => {
    const data = await getCompanies();
    setCompanies(data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteCompany(id);
    fetchCompanies();
  };

  return (
    <div>
      <h2>Lista de Empresas</h2>
      <ul>
        {companies.map((company) => (
          <li key={company.id}>
            {company.name} - {company.location}
            <button onClick={() => handleDelete(company.id!)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyList;
