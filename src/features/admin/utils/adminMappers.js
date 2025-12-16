/* src/features/admin/utils/adminMappers.js */

export const toId = (v) => {
  if (v === null || v === undefined || v === "") return null;
  return String(v);
};

/**
 * ✅ CORREGIDO: normalizeList más inteligente.
 * Mantiene tu lógica original pero busca más profundo si extraData es un objeto.
 */
export const normalizeList = (resData, candidateKeys = []) => {
  // 1. Si es array directo
  if (Array.isArray(resData)) return resData;

  // 2. Intentar en extraData (Array directo)
  if (Array.isArray(resData?.extraData)) return resData.extraData;

  // 3. Intentar en data (Array directo)
  if (Array.isArray(resData?.data)) return resData.data;

  // 4. NUEVO: Buscar arrays dentro de objetos (para paginación o wrappers)
  // Añadimos 'content', 'items', 'lista' a las llaves candidatas por defecto
  const searchKeys = [...candidateKeys, "content", "items", "lista", "users", "usuarios", "result"];
  
  const locations = [resData?.extraData, resData?.data, resData, resData?.result];
  
  for (const loc of locations) {
    if (!loc || typeof loc !== "object") continue;
    
    // Buscamos si alguna de las llaves contiene el array
    for (const key of searchKeys) {
      if (Array.isArray(loc[key])) {
        console.log(`✅ Array encontrado en .${key}`);
        return loc[key];
      }
    }
  }

  // 5. Tu lógica original de Objeto Indexado (Se mantiene igual)
  const checkIndexed = (obj) => {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
    const keys = Object.keys(obj);
    if (keys.length === 0) return null;
    const numericKeys = keys.filter(k => /^\d+$/.test(k));
    if (numericKeys.length === keys.length && numericKeys.length > 0) {
      return numericKeys
        .sort((a, b) => Number(a) - Number(b))
        .map(k => obj[k])
        .filter(v => v && typeof v === "object");
    }
    return null;
  };

  for (const loc of locations) {
    const indexed = checkIndexed(loc);
    if (indexed) return indexed;
  }

  return [];
};

/**
 * Normaliza estadísticas - (TU CÓDIGO ORIGINAL - INTACTO)
 */
export const normalizeStats = (resData) => {
  console.log("📊 normalizeStats recibió:", resData);
  const extraData = resData?.extraData;
  
  if (!extraData || typeof extraData !== "object") {
    // Si falla, intentamos usar resData directo por si acaso
    if (resData && typeof resData === 'object' && resData.totalRegisteredUsers) {
        return normalizeStats({ extraData: resData });
    }
    return { total: "—", activos: "—", pendientes: "—", organizadores: "—" };
  }

  const total = extraData.totalRegisteredUsers ?? null;
  const organizadores = extraData.totalUsuariosOrganizador ?? null;
  
  // Mapeo simple
  return {
    total: total ?? "—",
    activos: total ?? "—", 
    pendientes: 0,
    organizadores: organizadores ?? "—"
  };
};

/* ===== ROLES (TU CÓDIGO ORIGINAL - INTACTO) ===== */
export const getRoleId = (r) => {
  if (!r) return null;
  const id = r?.id ?? r?._id ?? r?.rolId ?? r?.idRol ?? r?.id_rol ?? r?.rol_id ?? r?.uuid;
  return toId(id);
};

export const getRoleName = (r) => {
  if (!r) return "";
  return (r?.nombreRol ?? r?.nombre_rol ?? r?.nombre ?? r?.name ?? r?.roleName ?? "");
};

export const getRoleDesc = (r) => r?.descripcion ?? r?.description ?? r?.desc ?? "";

/* ===== USERS (TU CÓDIGO ORIGINAL - INTACTO) ===== */
export const getUserId = (u) => {
  if (!u) return null;
  const id = u?.id ?? u?._id ?? u?.userId ?? u?.idUsuario ?? u?.id_usuario ?? u?.usuarioId;
  return toId(id);
};

export const getUserEmail = (u) => u?.correo ?? u?.email ?? u?.mail ?? "";
export const getUserDni = (u) => u?.dni ?? u?.documento ?? u?.document ?? "";
export const getUserFirstName = (u) => u?.nombres ?? u?.nombre ?? u?.firstName ?? "";
export const getUserLastName = (u) => u?.apellidos ?? u?.apellido ?? u?.lastName ?? "";

export const getUserFullName = (u) => {
  const fullName = `${getUserFirstName(u)} ${getUserLastName(u)}`.trim();
  return fullName || "Sin nombre";
};

export const getUserCreatedAt = (u) =>
  u?.createdAt ?? u?.fechaRegistro ?? u?.fecha_registro ?? u?.registro ?? null;

/* ===== ROLES EN USUARIO (TU CÓDIGO ORIGINAL - INTACTO) ===== */
export const getUserRoles = (u) => {
  if (!u) return [];
  if (Array.isArray(u?.roles)) return u.roles;
  if (Array.isArray(u?.rol)) return u.rol;
  if (u?.rol && typeof u.rol === "object") return [u.rol];
  if (Array.isArray(u?.role)) return u.role;
  if (u?.role && typeof u.role === "object") return [u.role];
  return [];
};

export const getUserRoleIds = (u) => {
  return getUserRoles(u)
    .map(r => getRoleId(r))
    .filter(id => id);
};

export const getUserRoleNames = (u) => {
  if (!u) return [];
  // MANTENEMOS ESTO PORQUE DIJISTE QUE ASÍ VIENE DE TU BACKEND AHORA
  if (Array.isArray(u?.nombresRoles)) return u.nombresRoles; 
  if (Array.isArray(u?.roleNames)) return u.roleNames;
  
  const rawRoles = getUserRoles(u);
  if (rawRoles.length > 0) {
    return rawRoles.map(r => getRoleName(r)).filter(Boolean);
  }
  return [];
};

/* ===== UI HELPERS (TU CÓDIGO ORIGINAL - INTACTO) ===== */
export const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric" }).format(d);
};

export const initialsFromName = (fullName, email) => {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  const i1 = parts[0]?.[0] || email?.[0] || "U";
  const i2 = parts[1]?.[0] || parts[0]?.[1] || "";
  return (i1 + i2).toUpperCase() || "UA";
};

export const getApiErrorMessage = (err, fallback = "Error") => {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.response?.data?.extraData?.message ||
    err?.message ||
    fallback
  );
};