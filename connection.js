/**
 * Created by DELL on 4/26/2016.
 */
//exports.connectionString= "mongodb://localhost:27017/test";

var env = 'prd';
var con='';
if(env==='dev') {
    con ='mongodb://localhost:27017/testM'
}
else
{
    con='mongodb://ustDWrite:ust123@ds049598.mlab.com:49598/ustartifacts';
}
//console.log(con);
exports.connectionString= con;