


<template>
    <span class="badge" :class="badgeClass"><slot>{{ text }}</slot></span>
</template>

<script>
export default {
    props: ['level','locked'],
    computed: {
        badgeClass(){
            if(this.locked) return 'badge-secondary'
            if(this.level) return 'badge-' + this.level;
            return 'badge-dark';
        },
        text(){
            if(this.message) return this.message;
            if(this.level === 'danger') return '紧急';
            if(this.level === 'warning') return '重要';
        }
    }
}
</script>
