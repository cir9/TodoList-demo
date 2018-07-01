
const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const config = require('./config')

const _dir = config.dataPath
const secret = config.secret

let passwords =  { 'root': '123456' }

fs.readFile(path.join(_dir,'passwd.json'), (err,data)=>{
    if(!err) passwords = JSON.parse(data)
    console.log(`[ Auth ] Passwords loaded:`,passwords)
})

function save(){
    fs.writeFile(path.join(_dir,'passwd.json'),JSON.stringify(passwords),err=>{
        console.error(err)
    })
}

module.exports = {
    token(name,expire){
        return jwt.sign({name},secret,{expiresIn: expire})
    },
    verify(token,callback){
        jwt.verify(token,secret,callback)
    },
    register(name,password){
        if(!passwords.hasOwnProperty(name)){
            passwords[name] = password
            save()
            return true
        }
        return false
    },
    login(name,password){
        if(passwords.hasOwnProperty(name)){
            if(passwords[name] === password)
                return true;
            else
                return 'password'
        }
        return 'name'
    },
    save(name,data,callback){       
        console.log(`[ Auth ] Saving data of user "${name}" to "userdata/${name}.json"`)
        fs.writeFile(path.join(_dir,`userdata/${name}.json`),data, callback)
    },
    load(name,callback){
        console.log(`[ Auth ] Loading data of user "${name}" from "userdata/${name}.json"`)
        fs.readFile(path.join(_dir,`userdata/${name}.json`), callback)       
    }
}
