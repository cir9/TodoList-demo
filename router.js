
const path = require('path')
const url = require('url')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const util = require('util')
const config = require('./config')
const auth = require('./auth')

const _dir = config.staticPath
const app = express()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = app

const accessExpire = config.accessExpire
const accessExpireMs = config.accessExpire * 1000

console.log(`[Router] config loaded, access_expire = ${accessExpire}s.`)

app.use(cookieParser())
app.use('/dist',express.static('dist'))


function verifiedAccess(req,res,next){
    let token = req.cookies.access_token
    if(!token) {        
        console.log(`[Router] non-token access, send LOGIN page.`)
        res.sendFile(path.join(_dir,'login.html'))
    }
    else{
        auth.verify(token,(err,data) => {
            if (err){
                console.log(`[Router] invalid-token access, send LOGIN page.`)
                res.sendFile(path.join(_dir,'login.html'))
            } else{
                console.log(`[Router] valid-token access, send MAIN page.`)               
                next()
            }
        })
    }
}

function saveData(req,res){
    let {name,data} = req.body
    if(name&&data){
        auth.save(name,data,err=>{
            if(!err) res.json({state: 'success'}).end()
            else res.json({state: 'error'}).end()
        })
    }else
        res.json({state: 'error'}).end()
}

app.get('/',  verifiedAccess, (req,res) => {
    res.sendFile(path.join(_dir,'index.html'))
})

app.post('/logout',urlencodedParser,(req,res,next)=>{
    console.log(`[Router] logout, clear cookie "access_token".`)       
    res.clearCookie('access_token')
    next()
},saveData)

app.post('/save',urlencodedParser,saveData)

app.post('/login',urlencodedParser,(req,res)=>{
    let {name,password} = req.body
    let message = auth.login(name,password)
    if(message === true){
        console.log(`[Router] good login`,{name,password},`, set cookie "access_token".`)        
        res.cookie('access_token',auth.token(name,accessExpire),{'maxAge':accessExpireMs,'httpOnly':true})
        auth.load(name,(err,data)=>{
            if(!err) res.json({state: 'success', data: JSON.parse(data)}) 
            else res.json({state: 'success'})
        })
    }else{        
        console.log(`[Router] bad login`,{name,password},`with mismatched "${message}"`) 
        res.json({state: 'error', mismatch: message})
    }
})

app.post('/register',urlencodedParser,(req,res)=>{
    let {name,password} = req.body
    if(auth.register(name,password)){
        console.log(`[ROUTER] good registration`,{name,password},`, set cookie "access_token".`)        
        res.cookie('access_token',auth.token(name,accessExpire),{'maxAge':accessExpireMs})
        res.json({state: 'success'})
    }else{
        console.log(`[ROUTER] bad registration`,{name,password},`with duplicated "name".`)      
        res.json({state: 'error'})
    }
})

