
<style>

.list-detail{
    padding-left: 60px;
}
.banner{
    position: relative;
    padding: 60px 0px 30px;
    color: white;
    z-index: 1900;
    background-color: var(--theme-color);  
    transition: 300ms;
}
.task-row{
    height: 70px;
    list-style: none;
    display: flex;
    align-items: center;
    transition: 200ms; 
}
.shadow-line{
    width: 100%;
    height: 0;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, .1);
    transition: 200ms;
}

.task-row:nth-child(odd){
    background-color: #f6f6f6;
}
.new-task .row-lead{
    background-color: transparent;
}

.new-task{
    background-color: white!important;
    color: var(--theme-color);
    justify-content: center;
    cursor: pointer;
    box-shadow: inset 0 2px 0 0 rgba(0, 0, 0, .1);
    margin-bottom: 2rem;
}

/* .task-row:hover{
    background-color: var(--primary-color-200);
} */
.new-task:hover{
    background-color: var(--primary-color)!important;
    color: white;
}
.new-task:active{
    color: white;
    background-color: var(--theme-color)!important;
}

.plus-icon{
    width: 30px;
    text-align: center;
    font-size: 1.2rem;
    padding-right: 1rem;
}

.list-group {
    position: relative;
} 

.task-list-enter, .task-list-leave-to {
    opacity: 0;
}

.task-list-leave-active {
    position: absolute;
}


.float-box{
    position: absolute ;
    right: 7px;
    bottom: 0;
}
.banner-icon{
    height: 48px;
    width: 60px;
    font-size: 1rem;
}

.complete-header{
    padding: 1rem 1.5rem;
    border-bottom: 4px solid var(--primary-color);
    color: var(--primary-color);
    font-size: 1.25rem;
    transition: 200ms;
}

</style>

<template>
    <div class="p-0">
        <div class="banner">
            <div class="list-detail">
                <h1 class="pb-3 ifix">
                    <span class="glyphicon mr-5" :class="iconClass(list.icon)"></span>
                    <div>{{ list.name }}</div>
                </h1>
                <h6 v-html="description"></h6>
            </div>
            <div class="float-box ifix">
                <div class="b-icon banner-icon"  @click="$emit('edit-list',list)">
                    <span class="glyphicon glyphicon-option-horizontal"></span>              
                </div>
                <div class="b-icon banner-icon">
                    <span class="glyphicon glyphicon-sort"></span>                
					<div class="modal-bar modal-bar-sm">
						<ul class="nav flex-column ">                          
							<li class="setting-section b-row" v-for="s in sorterClass"  @click="sortBy=s.name"
                                :active="sortBy===s.name" :key="s.id">
                                <span class="glyphicon mr-3" :class="s.class"></span>{{s.text}}
                            </li>
						</ul>
					</div>                   
                </div>
                <div class="b-icon banner-icon" v-show="!list.incompleteOnly">
                    <span class="glyphicon glyphicon-filter"></span>
 					<div class="modal-bar modal-bar-sm">
						<ul class="nav flex-column ">             
							<li class="setting-section b-row"  @click="config.hideComplete=!config.hideComplete"
                                :active="config.hideComplete">
                                <span class="glyphicon mr-3 glyphicon-ok-sign"></span>隐藏已完成任务
                            </li>             
							<li class="setting-section b-row"  @click="hideIncomplete=!hideIncomplete"
                                :active="hideIncomplete">
                                <span class="glyphicon mr-3 glyphicon-briefcase"></span>隐藏未完成任务
                            </li>
						</ul>
					</div>                     
                </div>
            </div>
        </div>       
        
        <transition-group  class="list-group" name="task-list" tag="ul" @before-leave="beforeLeave">
            <template v-if="!hideIncomplete">
                <li is="task-row" v-for="task in ongoing" :key="task.data.id" @edit-task="editTask(task)"
                                  :diff="config.dayDiff"  :task="task.data"   :from="task.from" :rep="list.rep"></li>
                <li class="shadow-line" :key="-1"></li>
                <li v-if="!list.fromSearch" :key="-2" class="task-row new-task" @click="editTask()">
                    <div class="plus-icon">
                        <span class="glyphicon glyphicon-plus"></span>
                    </div>
                    <div class="task-name">添加待办事项</div>
                </li>			
            </template>
            <template v-if="!config.hideComplete && completed.length>0 && !list.incompleteOnly">
                <li class="complete-header" :key="-3">已完成任务</li>
                <li is="task-row" v-for="task in completed" :key="task.data.id" @edit-task="editTask(task)"
                                  :diff="config.dayDiff"    :task="task.data"   :from="task.from" :rep="list.rep"></li>
                <li class="shadow-line" :key="-4"></li>
            </template>
        </transition-group>
    </div>
</template>

<script>
import taskRow from './task_row.vue'
import util from './util.js'
export default {
    components: {
        'task-row': taskRow
    },
    props: ['list', 'config'],  // 'diff','listAll'],
    watch:{
        list(n,o){
            if(n.tasks) this.refreshList(n)
            else{
                this.tasks_ongoing = []
                this.tasks_completed = []
            }
            this.hideIncomplete = false;
        },
        sortBy(){
            this.refreshList()
        }
    },
    methods: {
        iconClass: util.iconClass,
        beforeLeave(el) {
            el.style.display = 'none';
        },
        editTask(task){
            this.$emit('edit-task', task? task.data: false , this.list.uneditable ? (task ? task.from : false) : this.list)
        },
        refreshList(n){
            if(!n) n = this.list
            this.tasks_ongoing = n.tasks.filter(t=>(t.data.complete===false))//||(t.data.complete===1)) 
            this.tasks_completed =  n.tasks.filter(t=>(t.data.complete===true))// ||(t.data.complete===0)) 
        },
        sortList(tasks){
            let comp = this.sorterSet[this.sortBy];            
            tasks.forEach(t=>t.date = new Date(t.data.date))
            tasks.sort(comp)
            tasks.forEach(t=>delete t.date)
            return tasks
        }
    },
    computed:{
        description(){
            if(this.list.description) return this.list.description.replace(/\r?\n/g,"<br>")
            return ''
        },
        ongoing()  { return this.sortList(this.tasks_ongoing)   },
        completed(){ return this.sortList(this.tasks_completed) }
    },
    data(){ return {
        sorterClass: [
            {id: 0, name: 'date', class: 'glyphicon-calendar', text: '按日期排序'},
            {id: 1, name: 'name', class: 'glyphicon-text-background', text: '按名称排序'},
            {id: 2, name: 'level', class: 'glyphicon-flag', text: '按优先等级排序'},
            {id: 3, name: 'date_alt', class: 'glyphicon-calendar', text: '按日期倒序排序'},
            {id: 4, name: 'name_alt', class: 'glyphicon-text-background', text: '按名称倒序排序'},
            {id: 5, name: 'level_alt', class: 'glyphicon-flag', text: '按优先等级倒序排序'},
        ],
        hideIncomplete: false,
        tasks_ongoing:   [],
        tasks_completed: [],
        sortBy: 'date',
        sorterSet: {   
            date:  (a,b) => a.date - b.date  ||  (b.data.level||0) - (a.data.level||0)  ||
                            a.data.name.localeCompare(b.data.name) ||  a.data.id-b.data.id  ,

            level: (a,b) => (b.data.level||0) - (a.data.level||0)  ||  a.date - b.date  ||  
                            a.data.name.localeCompare(b.data.name) ||  a.data.id-b.data.id  ,

            name:  (a,b) => a.data.name.localeCompare(b.data.name) ||  a.date - b.date  || 
                            (b.data.level||0) - (a.data.level||0)  ||  a.data.id-b.data.id  ,

            date_alt:  (a,b) => b.date - a.date  ||  (b.data.level||0) - (a.data.level||0)  ||
                            a.data.name.localeCompare(b.data.name) ||  a.data.id-b.data.id  ,

            level_alt: (a,b) => (a.data.level||0) - (b.data.level||0)  ||  a.date - b.date  ||  
                            a.data.name.localeCompare(b.data.name) ||  a.data.id-b.data.id  ,

            name_alt:  (a,b) => b.data.name.localeCompare(a.data.name) ||  a.date - b.date  || 
                            (b.data.level||0) - (a.data.level||0)  ||  a.data.id-b.data.id  ,
        }
    }},
};
</script>
