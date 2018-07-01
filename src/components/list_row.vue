

<style>
.list-row{
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333;
    transition: 300ms;
}
.list-row:hover{
    color: initial;
    background-color: var(--primary-color-20t);
}

.list-row:active{
    color: white;
    background-color: var(--theme-color)!important;
}

li[active] .list-row{
    background-color: var(--primary-color);
    color: white;
}

.small-pill{
    padding-left: 0.35rem;
    padding-right: 0.35rem;
}

.list-pill {
    transition: ease-in-out 300ms;
    display: inline-block;
}
.list-badge-enter, .list-badge-leave-to {
    opacity: 0;
    transform: scale(0);
}

.list-badge-leave-active {
    position: absolute;
}


</style>


<template>
    <li class="nav-item">
        <div class="list-row" @click="$emit('click')">								
            <div><span class="glyphicon mr-3" :class="iconClass(list.icon)"></span>{{ list.name }}</div>                
            <transition-group tag="div" name="list-badge" style="position:relative;">
                <badge class="mr-1 badge-pill list-pill" v-for="level in levels" v-if="level.count > 0" :class="level.class" 
                       :level="level.name" :key="level.id" >{{ level.count }}</badge>
            </transition-group>
        </div>
    </li>	
</template>

<script>
import badge from './badge.vue'
import util from './util'
export default {
    components:{
        badge
    },
    props: ['list'],
    methods:{
        iconClass : util.iconClass
    },
    computed:{
        levels(){
            let normal = {name:'', count: 0, id: 0}
            let warning = {name:'warning', count: 0, id: 1}
            let danger = {name:'danger', count: 0, id: 2}
            this.list.tasks.forEach(task =>{
                if(task.data.complete) return
                if(!task.data.level) normal.count++;
                else if(task.data.level >= 10) danger.count++;
                else if(task.data.level >=5 ) warning.count++;
            })
            let isHead = true
            let t = [normal,warning,danger]
            t.forEach(level => {
                if(level.count===0) return           
                if(isHead){
                    isHead = false
                    level.class = ''
                }else level.class = "small-pill"
            })
            return t.reverse();
        }
    }
}
</script>
