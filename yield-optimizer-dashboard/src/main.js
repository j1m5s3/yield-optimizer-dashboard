// Styles
import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Vue
import { createApp } from 'vue'
import App from './App.vue'

// Web3
import { WagmiPlugin } from '@wagmi/vue'

// Local
import { config } from './utils/configs/chainConfig'

createApp(App)
  .use(WagmiPlugin, { config })
  .mount('#app')
