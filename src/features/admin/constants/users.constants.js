export const SORT_OPTIONS = {
  RECENTES: 'RECENTES',
  ANTIGUOS: 'ANTIGUOS',
  A_Z: 'A_Z',
  Z_A: 'Z_A'
};

export const SORT_LABELS = {
  [SORT_OPTIONS.RECENTES]: 'Ordenar: Recientes',
  [SORT_OPTIONS.ANTIGUOS]: 'Ordenar: Antiguos',
  [SORT_OPTIONS.A_Z]: 'Ordenar: A - Z',
  [SORT_OPTIONS.Z_A]: 'Ordenar: Z - A'
};

export const USER_FORM_FIELDS = {
  nombres: '',
  apellidos: '',
  correo: '',
  password: '',
  dni: '',
  telefono: '',
  extensionTelefonica: '',
  rolIds: []
};

export const USER_VALIDATION = {
  DNI_LENGTH: 8,
  PHONE_LENGTH: 9,
  PASSWORD_MIN_LENGTH: 8
};

// features/admin/constants/roles.constants.js

export const ROLE_FORM_FIELDS = {
  nombreRol: '',
  descripcion: ''
};

export const MODAL_MODES = {
  CREATE: 'create',
  EDIT: 'edit'
};

export const MODAL_TITLES = {
  [MODAL_MODES.CREATE]: 'Crear rol',
  [MODAL_MODES.EDIT]: 'Editar rol'
};

export const SUBMIT_BUTTON_TEXT = {
  [MODAL_MODES.CREATE]: {
    idle: 'Crear rol',
    saving: 'Guardando...'
  },
  [MODAL_MODES.EDIT]: {
    idle: 'Guardar cambios',
    saving: 'Guardando...'
  }
};