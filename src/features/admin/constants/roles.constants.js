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
