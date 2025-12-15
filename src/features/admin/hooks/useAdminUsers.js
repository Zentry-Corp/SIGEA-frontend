// features/admin/hooks/useAdminUsers.js

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../api/adminAPI";
import {
  normalizeList,
  getUserId,
  getUserFullName,
  getUserEmail,
  getUserDni,
  getUserCreatedAt,
  getUserRoleIds,
  getUserRoleNames,
  getApiErrorMessage,
} from "../utils/adminMappers";

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      console.log("👥 [useAdminUsers] Cargando usuarios...");
      const res = await adminApi.listarUsuarios();
      console.log("📥 [useAdminUsers] Respuesta completa:", res?.data);
      
      const list = normalizeList(res?.data, [
        "usuarios", "users", "lista", "result", "data", "content", "items"
      ]);
      console.log("📋 [useAdminUsers] Lista normalizada:", list);
      
      if (list.length > 0) {
        console.log("👤 [useAdminUsers] Primer usuario como ejemplo:", list[0]);
        console.log("👤 [useAdminUsers] Keys del primer usuario:", Object.keys(list[0]));
      }

      const viewModels = list.map((u, index) => {
        const vm = {
          id: getUserId(u),
          fullName: getUserFullName(u),
          email: getUserEmail(u),
          dni: getUserDni(u),
          createdAt: getUserCreatedAt(u),
          roleIds: getUserRoleIds(u),
          roleNames: getUserRoleNames(u),
          raw: u
        };
        
        console.log(`  👤 [${index}] ${vm.fullName}:`, {
          roleIds: vm.roleIds,
          roleNames: vm.roleNames
        });
        
        return vm;
      });

      console.log("✅ [useAdminUsers] Total usuarios procesados:", viewModels.length);
      setUsers(viewModels);
    } catch (e) {
      console.error("❌ [useAdminUsers] Error:", e);
      setUsers([]);
      setError(getApiErrorMessage(e, "Error al listar usuarios"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const crearUsuario = useCallback(
    async (payload) => {
      console.log("📤 [useAdminUsers] Creando usuario:", payload);
      const res = await adminApi.crearUsuario(payload);
      console.log("✅ [useAdminUsers] Usuario creado:", res?.data);
      await refresh();
      return res?.data;
    },
    [refresh]
  );

  return { users, loading, error, refresh, crearUsuario };
};