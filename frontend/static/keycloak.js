// frontend/static/keycloak.js
// import Keycloak from 'keycloak-js';


(function () {
  const keycloak = new Keycloak({
    url: 'http://localhost:8090/', // Adres do Keycloak (zmień jeśli potrzebujesz)
    realm: 'myrealm',                   // Nazwa Twojego Keycloak realm
    clientId: 'frontend-client'        // Nazwa klienta (stworzona w Keycloak)
  });

  keycloak.init({
    onLoad: 'login-required', // Wymaga logowania przy wejściu na stronę
    pkceMethod: 'S256'        // Zalecane dla bezpieczeństwa
  }).then(authenticated => {
    if (authenticated) {
      console.log('Zalogowano jako:', keycloak.tokenParsed.preferred_username);
      sessionStorage.setItem('token', keycloak.token);
 // Globalny dostęp do tokena itp.
    } else {
      console.log('Niezalogowany — przekierowanie...');
      keycloak.login();
    }
  }).catch(() => {
    console.error('Błąd inicjalizacji Keycloak');
  });
})();
