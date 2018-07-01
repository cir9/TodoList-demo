<style>

.row-lead{
    height: 100%;
    width: 8px;
    margin-right: 1.75rem;
    background-color: var(--muted-color);
    transition: 200ms;
}

.row-lead-success{
    width: 0;
    background-image: none!important;
    animation: none!important;
    background-color: var(--muted-color);
}

@-webkit-keyframes progress-stripes {
  from {
    background-position: 14px 0;
  }
  to {
    background-position: 0 0;
  }
}

@keyframes progress-stripes {
  from {
    background-position: 14px 0;
  }
  to {
    background-position: 0 0;
  }
}

.row-lead-danger{
    background-color: var(--danger)!important;    
    background-image: linear-gradient(45deg,rgba(235,255,0,.3) 25%,transparent 25%,transparent 50%,
                                            rgba(235,255,0,.3) 50%,
                                            rgba(235,255,0,.3) 75%,transparent 75%,transparent);
    background-size: 14px 14px;
    animation: progress-stripes 1s linear infinite;
}
.row-lead-warning{
    background-color: var(--warning)!important;    
    background-image: linear-gradient(45deg,rgba(255,128,128,.25) 25%,transparent 25%,transparent 50%,
                                            rgba(255,128,128,.25) 50%,
                                            rgba(255,128,128,.25) 75%,transparent 75%,transparent);
    background-size: 14px 14px;
}

.check-box{
    width: 30px;
    height: 30px;
    border-radius: 100%;
    border: 1px solid #7a7a7a;
    margin-right: 2rem;
    color: transparent;
    transition: 200ms;
    background: color #f4f4f4;
}
.check-box-wrapper:hover > .check-box{
    border-width: 1.75px ;
    border-color: var(--success);
    background-color: #f8f8f8;
}
.check-box-success{
    color:white;
    background-color:var(--success)!important;
    border-color: var(--success);
}
@keyframes cut-in-left {
    from{transform: translateX(-4px); opacity: 0; }
}
.check-box-success > .glyphicon{
    animation: cut-in-left 300ms;
}
.check-box-wrapper:active > .check-box{
    border-width: 3.5px ;
    background-color: #ffffff;
}
.task-name{
    font-size: 1.2rem;
}
.task-detail{
    font-size: 0.8rem;
    color: #6c757d;
}
.check-box-wrapper{
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.complete-text{
    color: var(--secondary)!important;
    text-decoration: line-through;
}
.complete-row{
    color: var(--secondary)!important;
}


.task-row-left{
    height: 70px;
    list-style: none;
    display: flex;
    align-items: center;
}

.task-icon{
    width: 60px;
    height: 60px;
}

.task-meta{
    min-width: 5rem;
}
</style>

<template> 
    <li class="task-row hor" :class="textClass">
        <div class="task-row-left">
            <div class="check-box-wrapper"  @click.prevent="task.complete = !task.complete">
                <div class="row-lead" :class="rowLeadClass"></div>
                <div class="check-box icen" :class="checkBoxClass">
                    <span class="glyphicon glyphicon-ok"></span>
                </div>
            </div>
            <div>
                <div class="task-name">
                    <span :class="levelTextClass" v-html="format(task.name)" class="pr-2"></span>
                    <badge :level="levelString" :locked="task.complete"></badge>
                </div>
                <div class="task-detail ifix">
                    <span :class="dateClass" class="mr-3 task-meta" >
                        <span class="glyphicon glyphicon-calendar mr-2"></span>
                        {{ dateText }}
                    </span>
                    <span v-if="from" class="mr-3 task-meta">
                        <span class="glyphicon mr-2" :class="iconClass(from.icon)"></span>
                        <span v-html="format(from.name)"></span>
                    </span>
                </div>
            </div>
        </div>
        <div class="pr-2 ifix">
            <div class="b-icon task-icon" @click="$emit('edit-task')"><span class="glyphicon glyphicon-option-horizontal"></span></div>
        </div>
    </li>	
</template>

<script>
import badge from './badge.vue'
import util from './util'
export default {
    props: ['task','from','rep','diff'],
    components:{
        badge
    },
    beforeMount() {
        this.today = util.parseDate();
    },
    beforeUpdate(){
        this.today = util.parseDate();
    },
    methods:{
        iconClass: util.iconClass,
        // flip(complete){
        //     if(complete===true) return 0
        //     if(complete===false) return 1
        //     if(complete===0) return true
        //     return false
        // }
    },
    computed:{
        levelString(){
            if(this.task.level>=10) return 'danger'
            if(this.task.level>=5) return 'warning' 
        },
        date(){
            return util.parseDate(this.task.date);
        },
        rowLeadClass() {
            if(this.task.complete) return 'row-lead-success'
            if(this.task.level) return 'row-lead-' + this.levelString;
            return '';
        },
        checkBoxClass() {
            if(this.task.complete) return 'check-box-success'
            return '';
        },
        textClass(){
            if(this.task.complete) return 'complete-row'
            return ''
        },
        levelTextClass(){
            if(this.task.complete) return 'complete-text'
            if(this.task.level) return 'text-'+ this.levelString
            return ''
        },
        format(){
            if(this.rep) return this.rep;
            return x=>x;
        },
        dayDiff(){
            return util.daysBetween(this.date,this.today)
        },
        dateClass(){
            if(this.task.complete) return 'complete-row'
            if(this.dayDiff===0) return 't-secondary'
        },
        dateText(){
            let diff = this.dayDiff;
            if(diff>=-1 && diff<=1) return util.dayMap[diff];
            if(this.diff){
                if(diff>0) return diff  + ' 天后'
                return -diff + ' 天前'
            } else {
                if(this.date.year===this.today.year)
                    return this.date.month + '月' + this.date.date + '日'
                return this.date.year + '年' + this.date.month + '月' + this.date.date + '日'
            }
        }
    }
}
</script>
