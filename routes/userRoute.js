import express from "express";
import { bookVisit, cancelBooking, createUser, getAllBookings, toFavorites } from "../controllers/userControllers.js";
const router = express.Router();

router.post("/register", createUser);
router.post("/book-visit/:id", bookVisit);
router.post("/all-bookings/", getAllBookings);
router.post("/remove-booking/:id", cancelBooking);
router.post("/to-favourites/:rid", toFavorites);


export {router as userRoute}

