import { createApp } from 'vue'
import App from './App.vue'

import ListItemVue from './components/ListItem.vue'

import './styles.css'

const app = createApp(App)

app.component('list-item', ListItemVue)

app.mount('#app')
