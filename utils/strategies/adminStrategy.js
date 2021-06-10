const LocalStrategy = require('passport-local').Strategy;

const development = require('../../knexfile').development;
const knex = require('knex')(development);
const bcrypt = require('./bcrypt');

const Login = new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},
    async (req,email,password,done)=>{
        try{
            console.log('login strategy',email,password,done);
            let users = await knex('admin').where({email:email});
            if(users.length==0){
                return done(null,false,{message:'user does not exist!'})
            }
            let user = users[0];
            console.log('database users',users);
            let result = await bcrypt.checkPassword(password,user.hash);
            console.log('match',result);
            user.isAdmin = true;
            if(result){
                return done(null,user);
            }else{
                return done(null,false,{message:'password incorrect!'});
            }
        }catch(err){
            console.log('login',err);
            done(err);
        }
    }
)
const Signup = new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true
},
    async (req,username,password,done) =>{
        console.log('SIGNUP STRATEGY',req.body,username,password,done)
        try{
            let email = req.body.email;
            let users = await knex('admin').where({email:email});
            if(users.length>0){
                return done(null,false,{message:'Email already taken'});
            }
            let hashedPassword = await bcrypt.hashPassword(password);
            const newUser = {
                username:username,
                email:email,
                hash:hashedPassword
            }
            let userId = await knex('admin').insert(newUser).returning('id');
            newUser.id = userId[0];
            newUser.isAdmin = true;
            done(null,newUser);
        }catch(err){
            console.log(err);
        }
    }
)

module.exports = {
    Login,
    Signup
}