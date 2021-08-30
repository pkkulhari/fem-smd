let darkMode = localStorage.getItem('dark-mode')
const toggleBtn = document.querySelector('.toggle .toggle__input')

if (
  darkMode === 'true' ||
  (darkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.body.classList.add('dark-mode')
  toggleBtn.checked = true
}

toggleBtn.addEventListener('click', () => {
  darkMode = localStorage.getItem('dark-mode')
  document.body.classList.toggle('dark-mode')
  if (darkMode !== 'true') localStorage.setItem('dark-mode', true)
  else localStorage.setItem('dark-mode', false)
})
