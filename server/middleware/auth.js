import jwt from "jsonwebtoken";

const secret = 'test';

const auth = async (req, res, next) => {
  try {
     let token ;  
     if(req.headers.authorization)
   token = req.headers.authorization.split(" ")[1];

    let decodedData;

    if (token ) {      
      decodedData = jwt.verify(token, secret);
        if(decodedData)
      req.userId = decodedData.id;
    } 

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;