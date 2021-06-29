import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from 'express'
import UserModal from "../models/user.js";
import mongoose from 'mongoose';

const router = express.Router();
const secret = 'test';

export const getUsers = async (req, res) => { 
       
  try {
      const users = await UserModal.find();
        
      res.status(200).json(users);
  } catch (error) {
      console.log(error)
      res.status(404).json({ message: error.message });
  }
}

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
    
  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};

export const friendsReq = async (req, res) => {
  const { id_f } = req.params;

  if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }

  if (!mongoose.Types.ObjectId.isValid(id_f)) return res.status(404).send(`No user with id: ${id_f}`);
  
  const user = await UserModal.findById(id_f);

  const index = user.friends.findIndex((id) => id ===String(req.userId));

  if (index === -1) {
    user.friendsRequest.push(req.userId);
  } else {
    user.friendsRequest = user.friends.filter((id) => id !== String(req.userId));
  }
  const updatedUser = await UserModal.findByIdAndUpdate(id_f, user, { new: true });
  console.log("friend request from ",`${req.name}`, "to" ,`${user.name}`," succesfully sent")
  res.status(200).json(updatedUser);
}

export const friendsAcc = async (req, res) => {
  const { id_f } = req.params;
 
  if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }

  if (!mongoose.Types.ObjectId.isValid(id_f)) return res.status(404).send(`No user with id: ${id_f}`);
  
  const user = await UserModal.findById(id_f);
  const sender =await UserModal.findById(req.userId)
  const index = user.friends.findIndex((id) => id ===String(req.userId));
  const index2= sender.friendsRequest.findIndex((id)=>id==String(id_f))

  if (index === -1) {
    user.friends.push(req.userId);
  
    sender.friends.push(id_f)

    if(index2!==-1){
      sender.friendsRequest.splice(index2,1)
    }
  } else {
    res.json({message:"something wrong"})
  }
  const  updatedSender= await UserModal.findByIdAndUpdate(req.userId, sender, { new: true });

 const users = await UserModal.find();
        
 res.status(200).json({updatedSender,users});

}
export const friendsRef = async (req, res) => {
  const { id_f } = req.params;
 
  if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }

  if (!mongoose.Types.ObjectId.isValid(id_f)) return res.status(404).send(`No user with id: ${id_f}`);
  const user = await UserModal.findById(id_f);
  const sender =await UserModal.findById(req.userId)
  const index = sender.friendsRequest.findIndex((id) => id ===String(id_f));
 
  if (index !== -1) {
    sender.friendsRequest.splice(index,1)  
  } 
  else {
    res.json({message:"something wrong"})
  }
  const  updatedSender= await UserModal.findByIdAndUpdate(req.userId, sender, { new: true });
 res.status(200).json(updatedSender);

}
export default router;