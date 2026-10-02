import { registerSW } from 'virtual:pwa-register';

export function registerPWA(): void {
  registerSW({
    immediate: true,
    onRegisteredSW() {
      void navigator.serviceWorker.ready.then(() => {
        window.dispatchEvent(new Event('pwa-ready'));
      });
    },
    onOfflineReady() {
      window.dispatchEvent(new Event('pwa-ready'));
    },
  });
}
