import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BaseModal from './components/BaseModal';
import BaseButton from './components/BaseButton';
import DetailPage from './components/DetailPage';
import TheAlert from './components/TheAlert';
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./resources/main.css"
const app = createApp(App)
app.component('DetailPage', DetailPage)
app.component('BaseModal', BaseModal);
app.component('BaseButton', BaseButton)
app.component('TheAlert', TheAlert)
app.use(store).use(router).mount('#app')
