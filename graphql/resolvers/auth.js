const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../../models/user");

module.exports = {
    createUser: async (args) => {
        try {
          const existingUser = await User.findOne({ email: args.userInput.email });
          
          if (existingUser) {
            throw new Error("User Already exist");
          }
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(
            args.userInput.password,
            saltRounds
          );
    
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword,
          });
          const userSaved = await user.save();
    
          return { ...userSaved._doc, password: null };
        } catch (err) {
          throw err;
        }
      },
      login: async ({email,password}) => {
        const user = await User.findOne({email})
        if(!user){
            throw new Error('User Not Exist')
        }
       const isEqaul = await bcrypt.compare(password,user.password)
       if(!isEqaul){
        throw new Error('Password Is Not Correct')
       }
       const token = jwt.sign({userId:user.id,email:user.email},'somesupersecretkey',{
        expiresIn:'1h'
       })
       return {userId:user.id,token:token,tokenExpiration:1}
      }
}