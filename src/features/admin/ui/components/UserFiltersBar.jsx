import React from "react";
import { FiSearch } from "react-icons/fi";
import { Controls, SearchBar, SearchInput, FiltersRow, Select, Muted } from "../styles/AdminUsersStyles";
import { SORT_OPTIONS, SORT_LABELS } from "../../constants/users.constants";

// Helper para convertir texto
const toTitleCase = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const UserFiltersBar = ({ 
  query, onQueryChange, 
  roleFilter, onRoleFilterChange, 
  sortBy, onSortChange, 
  rolesList, 
  resultsCount, 
  loading 
}) => {
  return (
    <Controls>
      <SearchBar>
        <FiSearch />
        <SearchInput
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar por nombre, email o DNI..."
        />
      </SearchBar>

      <FiltersRow>
        <Select value={roleFilter} onChange={(e) => onRoleFilterChange(e.target.value)}>
          <option value="ALL">Rol: Todos</option>
          {rolesList.map((r) => (
            // Usamos nombreRol como valor para que el filtro funcione con lo que devuelve el backend
            <option key={r.id} value={r.nombreRol}>
              Rol: {toTitleCase(r.nombreRol)}
            </option>
          ))}
        </Select>

        <Select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          {Object.values(SORT_OPTIONS).map((opt) => (
             <option key={opt} value={opt}>{SORT_LABELS[opt]}</option>
          ))}
        </Select>

        <Muted style={{ marginLeft: "auto" }}>
          {loading ? "Cargando..." : `${resultsCount} resultados`}
        </Muted>
      </FiltersRow>
    </Controls>
  );
};