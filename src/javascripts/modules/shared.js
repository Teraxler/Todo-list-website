function showOverlay() {
  document.getElementById("overlay").classList.add("h-full");
}

function hideOverlay() {
  document.getElementById("overlay").classList.remove("h-full");
}

function showTransparentOverlay() {
  document.getElementById("transparent-overlay").classList.add("h-full");
}

function hideTransparentOverlay() {
  document.getElementById("transparent-overlay").classList.remove("h-full");
}

export {
  showOverlay,
  hideOverlay,
  showTransparentOverlay,
  hideTransparentOverlay,
};
