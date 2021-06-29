// import  mongoose  from "mongoose";

// const userSchema =mongoose.Schema({
    
//     name:{ type: String, required:  true },
//     email: { type: String, required: true },
//     password:{ type: String, required:  true },
//     friends:[String],
//     friendsRequest:[String],
//     messages:[String],
    
// })
// const  user= mongoose.model('user',userSchema);

// export default user ;

import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required:  true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  friends:[String],
  friendsRequest:[String],
  messages:[String],
  id: { type: String },
});

export default mongoose.model("User", userSchema);