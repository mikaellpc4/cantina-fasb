const form = document.querySelector('form')
const formItems = document.querySelectorAll('[placeholder]')


if (form.id == 'register'){
  const [firstName, lastName, email, celular, password, passwordConfirm] = formItems
}else{
  const [email,password] = formItems
}


form.addEventListener('submit', event => {
  //event.preventDefault()
  //Criar uma forma de checkar se os dados estão sendo enviados corretamente antes de permitir o envio
  for (let item of formItems) {
    checkInputs(item)
  }
})

for (let item of formItems) {
  item.addEventListener('focusout', () => {
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

  if (form.id == 'register') {
    // Verifica se o nome tem menos de 3 caracteres
    if (firstName.value.length > 0 && firstName.value.length < 3) {
      setError(firstName, 'O nome precisa ter no mínimo 3 letras.')
    }
    // Verifica se o sobrenome tem menos de 3 caracteres
    if (lastName.value.length > 0 && lastName.value.length < 3) {
      setError(lastName, 'O sobrenome precisa ter no mínimo 3 letras.')
    }
    // Verifica se o número de celular é válido
    if (celular.value.length > 0 && celular.value.length < 11) {
      setError(celular, 'Insira um número de celular válido.')
    }

    // Verifica se as senhas são iguais
    if (
      passwordConfirm.value.length > 0 &&
      passwordConfirm.value !== password.value
    ) {
      setError(passwordConfirm, 'As senhas não conferem.')
    }
  }

  // Verifica se o email é válido
  if (!checkEmail(email.value) && email.value.length > 0) {
    setError(email, 'Insira um email válido.')
  }

  // Verifica se a senhha tem menos de 8 caracteres
  if (password.value.length > 0 && password.value.length < 8) {
    setError(password, 'A senha precisa ter no mínimo 8 caracteres.')
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

checkCelular = (cellNumber) => {
  return (/^[0-9]{10,11}$/.test(cellNumber))
}

// Retorna true se o email for válido e false se o email for inválido:
function checkEmail(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}


//Save the value function - save it to localStorage as (ID, VALUE)
function saveValue(e) {
  var id = e.id;  // get the sender's id to save it . 
  var val = e.value; // get the value. 
  sessionStorage.setItem(id, val);// Every time user writing something, the localStorage's value will override . 
}

for (let item of formItems) {
  document.getElementById(item.id).value = getSavedValue(item.id);    // set the value to this input
}

//get the saved value function - return the value of "v" from localStorage. 
function getSavedValue(v) {
  if (!sessionStorage.getItem(v)) {
    return "";// You can change this to your defualt value. 
  }
  return sessionStorage.getItem(v);
};