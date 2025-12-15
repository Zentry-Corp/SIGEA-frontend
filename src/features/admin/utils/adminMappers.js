

export const toId = (v) => {
  if (v === null || v === undefined || v === "") return null;
  return String(v);
};

/**
 * Normaliza listas - Maneja arrays y objetos indexados
 */
export const normalizeList = (resData, candidateKeys = []) => {
  // 1. Si es array directo
  if (Array.isArray(resData)) return resData;

  // 2. Intentar en extraData
  if (Array.isArray(resData?.extraData)) return resData.extraData;

  // 3. Intentar en data
  if (Array.isArray(resData?.data)) return resData.data;

  // 4. Buscar en candidateKeys
  const locations = [resData?.extraData, resData?.data, resData];
  
  for (const loc of locations) {
    if (!loc || typeof loc !== "object") continue;
    
    for (const key of candidateKeys) {
      if (Array.isArray(loc[key])) {
        console.log(`✅ Array encontrado en .${key}`);
        return loc[key];
      }
    }
  }

  // 5. Objeto indexado
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
 * Normaliza estadísticas - ADAPTADO A TU BACKEND EXACTO
 */
export const normalizeStats = (resData) => {
  console.log("📊 normalizeStats recibió:", resData);
  
  // Tu backend devuelve: { status, message, extraData: {...} }
  const extraData = resData?.extraData;
  
  if (!extraData || typeof extraData !== "object") {
    console.error("❌ No se encontró extraData");
    return {
      total: "—",
      activos: "—",
      pendientes: "—",
      organizadores: "—"
    };
  }

  console.log("📊 extraData keys:", Object.keys(extraData));

  const total = extraData.totalRegisteredUsers ?? null;
  const organizadores = extraData.totalUsuariosOrganizador ?? null;
  const participantes = extraData.totalUsuariosParticipante ?? null;

  const activos = total; // Todos están verificados según tu JSON
  const pendientes = 0;  // No hay pendientes si todos están verificados

  console.log("✅ Stats mapeados:", {
    total,
    activos,
    pendientes,
    organizadores
  });

  return {
    total: total ?? "—",
    activos: activos ?? "—",
    pendientes: pendientes,
    organizadores: organizadores ?? "—"
  };
};

/* ===== ROLES ===== */
export const getRoleId = (r) => {
  if (!r) return null;
  
  const id = r?.id ?? r?._id ?? r?.rolId ?? r?.idRol ?? 
    r?.id_rol ?? r?.rol_id ?? r?.uuid;
  
  return toId(id);
};

export const getRoleName = (r) => {
  if (!r) return "";
  
  return (
    r?.nombreRol ?? r?.nombre_rol ?? r?.nombre ?? 
    r?.name ?? r?.roleName ?? ""
  );
};

export const getRoleDesc = (r) => {
  if (!r) return "";
  
  return (
    r?.descripcion ?? r?.description ?? r?.desc ?? ""
  );
};

/* ===== USERS ===== */
export const getUserId = (u) => {
  if (!u) return null;
  
  // Tu backend usa "id" directamente
  const id = u?.id ?? u?._id ?? u?.userId ?? 
    u?.idUsuario ?? u?.id_usuario ?? u?.usuarioId;
  
  return toId(id);
};

export const getUserEmail = (u) => 
  u?.correo ?? u?.email ?? u?.mail ?? "";

export const getUserDni = (u) => 
  u?.dni ?? u?.documento ?? u?.document ?? "";

export const getUserFirstName = (u) => 
  u?.nombres ?? u?.nombre ?? u?.firstName ?? "";

export const getUserLastName = (u) => 
  u?.apellidos ?? u?.apellido ?? u?.lastName ?? "";

export const getUserFullName = (u) => {
  const firstName = getUserFirstName(u);
  const lastName = getUserLastName(u);
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || "Sin nombre";
};

export const getUserCreatedAt = (u) =>
  u?.createdAt ?? u?.fechaRegistro ?? u?.fecha_registro ?? 
  u?.registro ?? u?.registeredAt ?? u?.created_at ?? null;

/**
 * Extrae roles del usuario
 * IMPORTANTE: Tu estructura tiene que incluir los roles en la respuesta de usuarios
 */
export const getUserRoles = (u) => {
  if (!u) return [];
  
  console.log("👤 getUserRoles - Usuario:", u);

  // Intentar diferentes estructuras
  if (Array.isArray(u?.roles)) {
    console.log("✅ Roles en .roles[]");
    return u.roles;
  }

  if (Array.isArray(u?.rol)) {
    console.log("✅ Roles en .rol[]");
    return u.rol;
  }

  if (u?.rol && typeof u.rol === "object" && !Array.isArray(u.rol)) {
    console.log("✅ Rol único en .rol{}");
    return [u.rol];
  }

  if (Array.isArray(u?.role)) {
    console.log("✅ Roles en .role[]");
    return u.role;
  }

  if (u?.role && typeof u.role === "object") {
    console.log("✅ Rol único en .role{}");
    return [u.role];
  }

  console.warn("⚠️ NO se encontraron roles en el usuario");
  console.warn("⚠️ Keys del usuario:", Object.keys(u));
  
  return [];
};

export const getUserRoleIds = (u) => {
  const roles = getUserRoles(u);
  return roles
    .map(r => getRoleId(r))
    .filter(id => id !== null && id !== undefined && id !== "");
};

export const getUserRoleNames = (u) => {
  if (!u) return [];

  // 1. ✅ SOPORTE NUEVO: Tu backend ahora envía "nombresRoles"
  if (Array.isArray(u?.nombresRoles)) {
    return u.nombresRoles;
  }

  // 2. Fallbacks anteriores
  if (Array.isArray(u?.roleNames)) return u.roleNames;
  if (Array.isArray(u?.roles)) return u.roles.map(r => r.nombreRol || r.nombre);

  return [];
};

/* ===== UI HELPERS ===== */
export const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(d);
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