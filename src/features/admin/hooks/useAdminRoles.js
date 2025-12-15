// features/admin/hooks/useAdminRoles.js

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../api/adminAPI";
import { 
  normalizeList, 
  getRoleId, 
  getRoleName, 
  getRoleDesc, 
  getApiErrorMessage 
} from "../utils/adminMappers";

export const useAdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      console.log("🎭 [useAdminRoles] Cargando roles...");
      const res = await adminApi.listarRoles();
      console.log("📥 [useAdminRoles] Respuesta API:", res?.data);
      
      const list = normalizeList(res?.data, ["roles", "lista", "result", "data"]);
      console.log("📋 [useAdminRoles] Lista normalizada:", list);

      // Crear ViewModels
      const viewModels = list
        .map((r, index) => {
          const id = getRoleId(r);
          const nombreRol = (getRoleName(r) || "").trim();
          const descripcion = (getRoleDesc(r) || "").trim();
          
          console.log(`  🔨 [${index}]`, { id, nombreRol, descripcion });
          
          return {
            id,
            nombreRol,
            descripcion,
            raw: r
          };
        })
        // Filtrar roles sin ID o sin nombre
        .filter(vm => {
          const isValid = vm.id && vm.nombreRol;
          if (!isValid) {
            console.warn("  ⚠️ Rol inválido (sin ID o nombre):", vm);
          }
          return isValid;
        });

      console.log("✅ [useAdminRoles] ViewModels válidos:", viewModels.length);

      // ⭐ ELIMINAR DUPLICADOS por ID
      const uniqueMap = new Map();
      
      viewModels.forEach(vm => {
        // Si ya existe este ID, verificar cuál mantener
        if (uniqueMap.has(vm.id)) {
          const existing = uniqueMap.get(vm.id);
          
          // Mantener el que tenga descripción si uno no la tiene
          if (!existing.descripcion && vm.descripcion) {
            console.log(`  🔄 Reemplazando ${vm.id}: "${existing.nombreRol}" por "${vm.nombreRol}" (tiene descripción)`);
            uniqueMap.set(vm.id, vm);
          }
        } else {
          uniqueMap.set(vm.id, vm);
        }
      });

      // Convertir Map a array y ordenar
      const uniqueRoles = Array.from(uniqueMap.values())
        .sort((a, b) => a.nombreRol.localeCompare(b.nombreRol));

      console.log("✅ [useAdminRoles] Roles únicos:", uniqueRoles.length);
      console.log("📊 [useAdminRoles] Duplicados eliminados:", viewModels.length - uniqueRoles.length);
      
      setRoles(uniqueRoles);
    } catch (e) {
      console.error("❌ [useAdminRoles] Error:", e);
      setRoles([]);
      setError(getApiErrorMessage(e, "Error al listar roles"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const crearRol = useCallback(
    async ({ nombreRol, descripcion }) => {
      console.log("📤 [useAdminRoles] Creando rol:", { nombreRol, descripcion });
      const res = await adminApi.crearRol({ nombreRol, descripcion });
      console.log("✅ [useAdminRoles] Rol creado:", res?.data);
      await refresh();
      return res?.data;
    },
    [refresh]
  );

  const actualizarRol = useCallback(
    async (id, { nombreRol, descripcion }) => {
      console.log("📤 [useAdminRoles] Actualizando rol:", { id, nombreRol, descripcion });
      const res = await adminApi.actualizarRol(id, { nombreRol, descripcion });
      console.log("✅ [useAdminRoles] Rol actualizado:", res?.data);
      await refresh();
      return res?.data;
    },
    [refresh]
  );

  const eliminarRol = useCallback(
    async (id) => {
      console.log("🗑️ [useAdminRoles] Eliminando rol:", id);
      const res = await adminApi.eliminarRol(id);
      console.log("✅ [useAdminRoles] Rol eliminado:", res?.data);
      await refresh();
      return res?.data;
    },
    [refresh]
  );

  return { 
    roles, 
    loading, 
    error, 
    refresh, 
    crearRol, 
    actualizarRol, 
    eliminarRol 
  };
};