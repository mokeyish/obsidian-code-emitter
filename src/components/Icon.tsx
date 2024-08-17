

const icons = {
  clear: () => <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" width="0.75em" height="1em" viewBox="0 0 384 512">
    <path fill="currentColor" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7L86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256L41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256z"/>
  </svg>,
  play: () => <svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" width="0.75em" height="1em" viewBox="0 0 384 512">
    <path fill="currentColor" d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80v352c0 17.4 9.4 33.4 24.5 41.9S58.2 482 73 473l288-176c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41z"/>
  </svg>
}

export default (props: { name: keyof typeof icons }) => {
  return icons[props.name]()
}