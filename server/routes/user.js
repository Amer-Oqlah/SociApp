import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import { signin, signup ,friendsReq,getUsers,friendsAcc,friendsRef} from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.patch('/:id_f/friendsReq', auth,friendsReq);
router.patch('/:id_f/friendsAcc', auth,friendsAcc);
router.patch('/:id_f/friendsRef', auth,friendsRef);
router.get('/',auth,getUsers)
export default router;