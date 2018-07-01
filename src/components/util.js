
function twoDigit(num){
    if(num<10) return '0'+num
    return num
}


export default{
    iconClass(icon){
        if(icon)
            return 'glyphicon-' + icon
        else
            return 'glyphicon-list'
    },
    parseDate(date){
        if(date) 
            date = new Date(date); 
        else{ 
            date = new Date();
        }
        date.setHours(0,0,0,0);
        date.year = date.getFullYear();
        date.month = date.getMonth()+1;
        date.date = date.getDate();
        date.time = date.getTime();
        return date
    },
    dateString(date){
        if(!date) date = new Date();
        return `${date.getFullYear()}-${twoDigit(date.getMonth()+1)}-${twoDigit(date.getDate())}`
    },
    daysBetween(a,b){
        return Math.floor((a.time - b.time) / 86400000);
    },   
	dayMap: {
        [-1]: '昨天',
        [0]: '今天',
        [1]: '明天'
	}
} 