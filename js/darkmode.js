const btnDark = document.getElementById('darkmode')

function togglebody() {
  document.body.classList.toggle('dark')
}

btnDark.addEventListener('click', togglebody)