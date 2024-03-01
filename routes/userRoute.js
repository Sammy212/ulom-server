import express from "express";
import { bookVisit, cancelBooking, createUser, getAllBookings } from "../controllers/userControllers.js";
const router = express.Router();

router.post("/register", createUser);
router.post("/book-visit/:id", bookVisit);
router.post("/all-bookings/", getAllBookings);
router.post("/remove-booking/:id", cancelBooking);


export {router as userRoute}

