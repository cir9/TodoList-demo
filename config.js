const path = require('path')


module.exports =  {
    host: 'localhost',
    port: 3000,
    staticPath: __dirname,
    dataPath: path.join(__dirname,'data'),
    secret: '?~@!$3g&4**my_todo_list**3o2^j!@d9',
    accessExpire: 3600
}

