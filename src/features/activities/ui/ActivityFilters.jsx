// src/features/activities/ui/ActivityFilters.jsx

import React from 'react';
import styled from 'styled-components';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const ActivityFilters = ({
  filters,
  tipos,
  estados,
  onFilterChange,
  onClearFilters,
  resultCount,
}) => {
  const hasActiveFilters =
    filters.tipo !== 'todos' ||
    filters.estado !== 'todos' ||
    filters.busqueda.trim() !== '';

  return (
    <FiltersContainer>
      {/* Barra de búsqueda */}
      <SearchWrapper>
        <SearchIcon>
          <FiSearch />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Buscar por nombre o código..."
          value={filters.busqueda}
          onChange={(e) => onFilterChange('busqueda', e.target.value)}
        />
      </SearchWrapper>

      {/* Filtros */}
      <FiltersRow>
        <FilterGroup>
          <FilterLabel>
            <FiFilter />
            Filtros
          </FilterLabel>

          {/* Filtro por Tipo */}
          <Select
            value={filters.tipo}
            onChange={(e) => onFilterChange('tipo', e.target.value)}
          >
            <option value="todos">Todos los tipos</option>
            {tipos.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombreActividad}
              </option>
            ))}
          </Select>

          {/* Filtro por Estado */}
          <Select
            value={filters.estado}
            onChange={(e) => onFilterChange('estado', e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            {estados.map((estado) => (
              <option key={estado.codigo} value={estado.codigo}>
                {estado.etiqueta}
              </option>
            ))}
          </Select>

          {/* Botón limpiar filtros */}
          {hasActiveFilters && (
            <ClearButton onClick={onClearFilters}>
              <FiX />
              Limpiar filtros
            </ClearButton>
          )}
        </FilterGroup>

        {/* Contador de resultados */}
        <ResultCount>
          Mostrando <strong>{resultCount}</strong>{' '}
          {resultCount === 1 ? 'actividad' : 'actividades'}
        </ResultCount>
      </FiltersRow>
    </FiltersContainer>
  );
};

// Styled Components
const FiltersContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 32px;
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1.125rem;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9375rem;
  color: #1a1a2e;
  background: #f8fafc;
  transition: all 0.2s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    outline: none;
    border-color: #4F7CFF;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(79, 124, 255, 0.1);
  }
`;

const FiltersRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 968px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  flex: 1;
`;

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  padding-right: 8px;
  border-right: 1px solid #e2e8f0;

  svg {
    color: #4F7CFF;
  }

  @media (max-width: 968px) {
    border-right: none;
    padding-right: 0;
  }
`;

const Select = styled.select`
  padding: 10px 36px 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9375rem;
  color: #334155;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  min-width: 180px;

  &:hover {
    border-color: #4F7CFF;
  }

  &:focus {
    outline: none;
    border-color: #4F7CFF;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(79, 124, 255, 0.1);
  }

  @media (max-width: 968px) {
    width: 100%;
    min-width: unset;
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #ef4444;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    font-size: 1rem;
  }

  &:hover {
    background: #fef2f2;
    border-color: #ef4444;
  }

  @media (max-width: 968px) {
    width: 100%;
    justify-content: center;
  }
`;

const ResultCount = styled.div`
  font-size: 0.9375rem;
  color: #64748b;
  white-space: nowrap;

  strong {
    color: #4F7CFF;
    font-weight: 700;
  }

  @media (max-width: 968px) {
    text-align: center;
  }
`;

export default ActivityFilters;