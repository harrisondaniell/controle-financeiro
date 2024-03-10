export default function initSideBar() {
  const showMenu = (toggleId, navbarId, bodyId) => {
    const toggle = document.getElementById(toggleId)
    const navbar = document.getElementById(navbarId)
    const bodypadding = document.getElementById(bodyId)

    if (toggle && navbar) {
      toggle.addEventListener('click', () => {
        navbar.classList.toggle('expander')

        bodypadding.classList.toggle('body-pd')
      })
    }
  }
  showMenu('nav-toggle', 'navbar', 'body-pd')

  const linkColor = document.querySelectorAll('.nav__link')
  function colorLink() {
    linkColor.forEach(l => l.classList.remove('activeSide'))
    this.classList.add('activeSide')
  }
  linkColor.forEach(l => l.addEventListener('click', colorLink))


  const linkCollapse = document.getElementsByClassName('collapse__link')
  var i

  for (i = 0; i < linkCollapse.length; i++) {
    linkCollapse[i].addEventListener('click', function () {
      const collapseMenu = this.nextElementSibling
      collapseMenu.classList.toggle('showCollapse')

      const rotate = collapseMenu.previousElementSibling
      rotate.classList.toggle('rotate')
    })
  }



}