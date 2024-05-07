import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  "appId": "com.example.app",
  "appName": "bloodConnect",
  "webDir": "www",
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "Geolocation": {
      "permissions": [
        {
          "name": "android.permission.ACCESS_FINE_LOCATION",
          "description": "Allows the app to access precise location information."
        },
        {
          "name": "android.permission.ACCESS_COARSE_LOCATION",
          "description": "Allows the app to access approximate location information."
        }
      ]
    }
  }
}


// {
//   appId: 'com.example.app',
//   appName: 'bloodConnect',
//   webDir: 'www',
//   server: {
//     androidScheme: 'https'
//   }
// };

export default config;
