export function menuMobile() {
  const btnMobile = document.getElementById('btn-mobile')

  function toggleMenu() {
    const navbar = document.getElementById('navbar')
    navbar.classList.toggle('active')
    document.body.classList.toggle('active')
  }
  btnMobile.addEventListener('click', toggleMenu)
}