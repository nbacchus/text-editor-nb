import { Workbox } from 'workbox-window';
import Editor from './editor';
import './database';
import '../css/style.css';

const main = document.querySelector('#main');
main.innerHTML = '';

const loadSpinner = () => {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.innerHTML = `
  <div class="loading-container">
  <div class="loading-spinner" />
  </div>
  `;
  main.appendChild(spinner);
};

const editor = new Editor();

if (typeof editor === 'undefined') {
  loadSpinner();
}

// Check if service workers are supported
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-worker.js")
    .then(function (reg) {
      console.log("Successfully registered!", reg);
    })
    .catch(function (err) {
      console.warn("Error registering service worker", err);
    });
}

// Logic for installing the PWA
const butInstall = document.getElementById("buttonInstall");

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  deferredPrompt = e;
  butInstall.style.visibility = "visible";
});

butInstall.addEventListener("click", async () => {
  if (deferredPrompt !== null) {
    deferredPrompt?.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      butInstall.setAttribute("disabled", true);
      butInstall.textContent = "Installed!";
      deferredPrompt = null;
    }
  }
});

window.addEventListener("appinstalled", (event) => {
  console.log("appinstalled", event);
});