const form = document.querySelector('form')
const formItems = document.querySelectorAll('[placeholder]')

const [username, lastName, email, phone, password, passwordConfirmation] =
  formItems

form.addEventListener('submit', event => {
  for (let item of formItems) {
    checkInputs(item)
  }
})

for (let item of formItems) {
  item.addEventListener('focusout', () => {
    checkInputs(item)
  })
  item.addEventListener('blur', () => {
    checkInputs(item)
  })
}

function checkInputs(item) {
  // Verifica se o imput está vazio. (Funciona para todos os inputs)
  if (item.value === '') {
    setError(item, 'O campo é obrigatório.')
  } else {
    setSuccess(item)
  }

  // Verifica se o nome tem menos de 3 caracteres
  if (username.value.length > 0 && username.value.length < 3) {
    setError(username, 'O nome precisa ter no mínimo 3 letras.')
  }

  // Verifica se o sobrenome tem menos de 3 caracteres
  if (lastName.value.length > 0 && lastName.value.length < 3) {
    setError(lastName, 'O sobrenome precisa ter no mínimo 3 letras.')
  }

  // Verifica se o email é válido
  if (!checkEmail(email.value) && email.value.length > 0) {
    setError(email, 'Insira um email válido.')
  }

  // Verifica se a senhha tem menos de 8 caracteres
  if (password.value.length > 0 && password.value.length < 8) {
    setError(password, 'A senha precisa ter no mínimo 8 caracteres.')
  }

  // Verifica se o número de celular é válido
  if (phone.value.length > 0 && phone.value.length < 11) {
    setError(phone, 'Insira um número de celular válido.')
  }

  // Verifica se as senhas são iguais
  if (
    passwordConfirmation.value.length > 0 &&
    passwordConfirmation.value !== password.value
  ) {
    setError(passwordConfirmation, 'As senhas não conferem.')
  }
}

function setError(input, message) {
  const formItem = input.parentElement
  const small = formItem.querySelector('small')

  small.innerHTML = message
  formItem.classList.add('error')
}

function setSuccess(input) {
  const formItem = input.parentElement
  const small = formItem.querySelector('small')

  small.innerHTML = ''
  formItem.classList.remove('error')
}

// Retorna true se o email for válido e false se o email for inválido:
function checkEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  )
}
