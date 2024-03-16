export function menuMobile() {
  const btnMobile = document.getElementById('btn-mobile')

  function toggleMenu() {
    const navbar = document.getElementById('navbar')
    navbar.classList.toggle('active')
    document.body.classList.toggle('active')
  }
  btnMobile.addEventListener('click', toggleMenu)

  function clickOutsideMenu(event) {
    const newheader = document.getElementById('newheader')
    if (event.target == newheader) {
      btnMobile.click()
    }
  }
  let events = ['click', 'touchstart']
  events.forEach(item => document.body.addEventListener(item, clickOutsideMenu))

}