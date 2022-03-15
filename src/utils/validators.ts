import moment from 'moment';

const ERROR_CODES = {
  'SK001': 'Asegurate que el nombre sea correcto.',
  'SK002': 'El nombre solo puede contener letras.',
  'SK003': 'Asegurate que el apellido sea correcto.',
  'SK004': 'El apellido solo puede contener letras.',
  'SK005': 'Ingresá el DNI sin puntos ni espacios.',
  'SK010': 'El DNI solo puede contener números.',
  'SK006': 'Asegurate de que el e-mail sea correcto.',
  'SK007': 'Asegurate de que el código de área sea correcto.',
  'SK011': 'El código de área solo puede contener números.',
  'SK008': 'Asegurate de que el celular sea correcto.',
  'SK009': 'El celular solo puede contener números.',
  'MP316': 'Ingresa un nombre válido.',
}

export type ValidationType = { isValid: boolean; errorMessage?: string };

const checkIfNotEmpty = (value = '') => (value !== '');
const checkIfHaveOnlyNumbers = (value = '') => /^[0-9]*$/.test(value);
const checkIfHaveNumber = (value: string):boolean => /\d/.test(value);
const checkMinLength = (value: string, minLength: number): boolean => (value.length < minLength);

export const validateNotEmptyField = (value: string): ValidationType => {
  if(checkMinLength(value, 2)) {
    return {
      isValid: false,
      errorMessage: 'Asegurate de que el campo no esté vacío',
    };
  }

  return {
    isValid: true,
    errorMessage: '',
  };
};

export const validateField = (value: string): ValidationType => {
  return {
    isValid: (value !== '' && !/^[A-Za-z]+$/i.test(value)) && true,
    errorMessage: '',
  };
};

export const validateAmount = (monto = '', otherAmount = ''): boolean => {
  return !(monto === '' || (monto === 'otherAmount' && otherAmount === '')) ;
}

export const validateFirstName = (value = '', minLength = 2): ValidationType => {
  if(checkMinLength(value, 2)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK001'],
    };
  } else if (checkIfHaveNumber(value)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK002'],
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validateLastName = (value = '', minLength = 2): ValidationType => {
  if(checkMinLength(value, minLength)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK003'],
    };
  } else if (checkIfHaveNumber(value)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK004'],
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validateAreaCode = (value = '', minLength = 2): ValidationType => {
  if(checkMinLength(value, minLength)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK007'],
    };
  } else if (!checkIfHaveOnlyNumbers(value)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK011'],
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validatePhoneNumber = (value = '', minLength = 8): ValidationType => {
  if(checkMinLength(value, minLength)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK008'],
    };
  } else if (!checkIfHaveOnlyNumbers(value)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK009'],
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validateCitizenId = (value: string, minLength = 8): ValidationType => {
  if(checkMinLength(value, minLength)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK005'],
    };
  } else if (!checkIfHaveOnlyNumbers(value)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK010'],
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validateCreditCard = (value: string): ValidationType => {
  return {
    isValid: validateField(value) ? (/^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/.test(value)) : false,
    errorMessage: 'Revisa el número de tarjeta', 
  };
}

export const validateCvv = (value: string): ValidationType => {
  return {
    isValid: validateField(value) ? (/^[0-9]{3,4}$/.test(value)) : false,
    errorMessage: 'Revisa el código de seguridad', 
  };
}

export const validateCardHolderName = (value = '', minLength = 2): ValidationType => {
  if(checkMinLength(value, 2)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['MP316'],
    };
  } else if (checkIfHaveNumber(value)) {
    return {
      isValid: false,
      errorMessage: ERROR_CODES['SK002'],
    }
  }

  return {
    isValid: true,
    errorMessage: '',
  };
}

export const validateEmail = (value: string): ValidationType => {
  return {
    isValid: validateField(value) ? /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) : false,
    errorMessage: 'Error en el Email', 
  };
}

export const validateBirthDate = (value = ''): ValidationType => {
  return {
    isValid: moment(value, 'DD/MM/YYYY', true).isValid(),
    errorMessage: 'Error la fecha', 
  };
}

export const validateEmptyField = (value: string): ValidationType => {
  return {
    isValid: (value !== '') ? true : false,
    errorMessage: 'El campo no puede estar vacío', 
  };
}

export const validateMonth = (value: string): ValidationType => {
  if(parseInt(value) <= 0 || parseInt(value) >= 13) {
    return {
      isValid: false,
      errorMessage: 'El mes es inválido.'
    }
  }
  return {
    isValid: true,
    errorMessage: '', 
  };
}

export const validateYear = (value: string): ValidationType => {
  if(parseInt(value) < new Date().getFullYear()) {
    return {
      isValid: false,
      errorMessage: 'El año es inválido.'
    }
  }
  return {
    isValid: true,
    errorMessage: '', 
  };
}


/* Custom validators */
export const validateNewAmount = (value: string): ValidationType => {
  if (!checkIfNotEmpty(value)) {
    return {
      isValid: false,
      errorMessage: '',
    };
  } else if (!checkIfHaveOnlyNumbers(value)) {
    return {
      isValid: false,
      errorMessage: 'El monto debe ser un valor númerico',
    }
  } else if(parseInt(value) < 300){
    return {
      isValid: false,
      errorMessage: 'El monto debe ser un mayor a 300',
    }
  } else {
    return {
      isValid: true,
      errorMessage: '',
    };
  }
}
