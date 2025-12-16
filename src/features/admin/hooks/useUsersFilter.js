import { useState, useMemo } from 'react';
import { SORT_OPTIONS } from '../constants/users.constants';
import { processUserFilters } from '../services/userService'; // [cite: 473]

export const useUsersFilter = (users) => {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.RECENTES);

  // Usamos tu servicio para filtrar y ordenar
  const filteredUsers = useMemo(() => {
    return processUserFilters(users, { query, roleFilter, sortBy });
  }, [users, query, roleFilter, sortBy]);

  return {
    query, setQuery,
    roleFilter, setRoleFilter,
    sortBy, setSortBy,
    filteredUsers
  };
};