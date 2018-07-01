
import Swatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'
import ToggleButton from 'vue-js-toggle-button'
//import Badge from './components/badge.vue'
import ListRow from './components/list_row.vue'
//import TaskRow from './components/task_row.vue'
import TaskList from './components/task_list.vue'
Vue.use(ToggleButton)
Vue.component('swatches',Swatches)
//window.badge = Badge
//window.taskRow = TaskRow
Vue.component('list-row',ListRow)
Vue.component('task-list',TaskList)

//window.listRow = ListRow
//Vue.component('badge',Badge)
import './util.js'