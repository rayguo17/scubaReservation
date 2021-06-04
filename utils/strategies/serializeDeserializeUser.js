const development = require('../../knexfile').development;
const knex = require('knex')(development);

function serializeUser(user,done){
    console.log('Serialize: Passport generate token, puts it in cookie and sends to browser: ',user);
    done(null,{id:user.id,username:user.username});
}

async function deserializeUser(user,done){
    try{
        let users = await knex('passport_users').where({id:user.id});
        if(users.length==0){
            return done(null,false);
        }
        return done(null,user);
    }catch(err){
        return done(err,false);
    }
}
module.exports = {
    serializeUser,
    deserializeUser
}