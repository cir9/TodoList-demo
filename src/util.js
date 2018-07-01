import util from  './components/util.js'

window.parseColor = function(color){
    let res = [];
    for(let i=1;i<=5;i+=2){
        let dem = parseInt('0x'+ color.slice(i,i+2));
        if(!dem) dem = 0;
        res.push(dem);
    }
    return {r: res[0]/255, g: res[1]/255,b: res[2]/255};
}
window.rgbToHsl = function({r,g,b}){
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min){ 
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return {h, s, l};
}
window.hslString = function({h,s,l},opacity){
    if(opacity === undefined)
        return `hsl(${h*360},${s*100}%,${l*100}%)`
    else
        return `hsla(${h*360},${s*100}%,${l*100}%,${opacity})`
}
window.rgbString = function({r,g,b},opacity){
    if(opacity === undefined)
        return `rgb(${r*255},${g*255},${b*255})`
    else
        return `rgba(${r*255},${g*255},${b*255},${opacity})`
}
window.loadObject = function(map){
    let length = 0;
    for(let item of map){
        let js = window.localStorage[item.name];
        if(!js) break;

        length += js.length;

        let obj = JSON.parse(js);

        if(item.strict){
            for(let p in obj){
                if(item.object.hasOwnProperty(p)) item.object[p] = obj[p];
            }     
        } else {
            Object.assign(item.object,obj);
        }
    }
    return length * 2;
}
window.saveObject = function(map){
    let length = 0;
    for(let item of map){
        let js = JSON.stringify(item.object)
        length += js.length;
        window.localStorage[item.name] = js;
    }
    return length * 2;
}
window.removeObject = function(map){
    for(let item of map){
        console.log('remove ',item.name)
        window.localStorage.removeItem(item.name)
    }
    return 0;
}
window.getSizeText = function(size){
    let str = ''
    if(size < 1024){
        str = size + ' B'
    }else if(size < 1048576){
        size /= 1024
        str = size.toPrecision(3) + ' K'
    }else{
        size /= 1048576
        str = size.toPrecision(3) +' M'
    }
    return str;
}

window.Timer = class {
    constructor(interval,callback){
        this.interval = interval
        this.callback = callback
        this.more = false
        this.ticking = false
    }
    tickWarpper(){
        let e = this;
        return () => {e.tick();};
    }
    tick(){
        if(this.more) {
            this.ticking = true;
            this.more = false;
            window.setTimeout(this.tickWarpper(), this.interval);
        } else 
            this.ticking = false;
        this.callback()
    }
    raise(){
        if(this.ticking) this.more = true;
        else{           
            this.callback();
            this.ticking = true;
            window.setTimeout(this.tickWarpper(), this.interval);
        }
    }
}

window.getTimespanText = (time)=>{
    if(time<=0) return '从未'
    let diff = (time - new Date().getTime())
    let suffix = diff > 0? '后' : '前'
    diff = Math.abs(diff/1000)
    if(diff<60) return `${Math.floor(diff)} 秒${suffix}`
    diff /= 60			
    if(diff<60) return `${Math.floor(diff)} 分钟${suffix}`
    diff /= 60			
    if(diff<24) return `${Math.floor(diff)} 小时${suffix}`
    diff /= 24			
    return `${Math.floor(diff)} 天${suffix}`
}

window.iconClass = util.iconClass;
window.parseDate = util.parseDate;
window.dateString = util.dateString;
window.daysBetween = util.daysBetween;