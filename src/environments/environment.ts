// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  emulator: false,
  firebase: {
    apiKey: 'AIzaSyDmo6bDQa2ip-B8fblN4dHGMH9X5exQb5E',
    authDomain: 'hypothesis-24.firebaseapp.com',
    projectId: 'hypothesis-24',
    storageBucket: 'hypothesis-24.appspot.com',
    messagingSenderId: '276772889884',
    appId: '1:276772889884:web:ad29b459f186e2680d86d9',
    measurementId: 'G-5C4YE9J9YY'
  },

  /**
   * Astrononmy Picture of the day variables
   */
  apod: {
    api_key: '3dGKOkqR360LLtiQfOcSorQQjuMA7xB7ztVdJ6pq',
    root_url: 'https://api.nasa.gov/planetary/apod',
    url: 'https://api.nasa.gov/planetary/apod?api_key=3dGKOkqR360LLtiQfOcSorQQjuMA7xB7ztVdJ6pq',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
