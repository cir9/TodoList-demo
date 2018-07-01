

//const http = require('http')
const config = require('./config')
const router = require('./router')





router.listen(config.port, config.host, ()=>{
    console.log(`[Server] server is listening at port ${config.port}`)
    console.log(`[Server] please visit http://${config.host}:${config.port}`)
})

