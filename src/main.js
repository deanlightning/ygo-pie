import Vue from 'vue'
import App from './App.vue'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { SVGRenderer } from 'echarts/renderers'
import { Dialog, Form, Button, Input, Select, FormItem, Option, Col } from 'element-ui'
import './assets/style/reset.css'

Vue.config.productionTip = false

use(
  [PieChart, SVGRenderer]
)
Vue.component('v-chart', ECharts)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(Button)
Vue.use(Input)
Vue.use(Select)
Vue.use(FormItem)
Vue.use(Option)
Vue.use(Col)

new Vue({
  render: h => h(App)
}).$mount('#app')
