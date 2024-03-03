import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";
// import { update } from "tar";


export const createUser = asyncHandler(async(req, res) => {
    console.log("Creating a User");

    let {email} = req.body;

    const userExists = await prisma.user.findUnique({where: {email: email}})
    if (!userExists) {
        
        const user = await prisma.user.create({data: req.body})
        res.send({
            message: "User registered successfully",
            user: user
        });
    }
    else res.status(201).send({message: "User already registered"});
    
});

// function to book listing visit
export const bookVisit = asyncHandler(async(req, res) => {
    const {email, date} = req.body;
    const {id} = req.params;

    try {
        const alreadyBooked = await prisma.user.findUnique({
            where: {email},
            select: {bookedVisits: true},
        });

        if(alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
            res.status(400).json({message: "This Listing is already booked by you"});
        } else {
            await prisma.user.update({
                where: {email: email},
                data: {
                    bookedVisits: {push: {id, date}}
                },
            });
            res.send("Your Visit is Booked Successfully");
        }

    }catch(err) {
        throw new Error(err.message);
    }
});

// Function to get all bookings of user
export const getAllBookings = asyncHandler(async(req, res) => {
    const {email} = req.body;
    try {
        const bookings = await prisma.user.findUnique({
            where: {email},
            select: {bookedVisits: true}
        });
        res.status(200).send(bookings);
    } catch (err) {
        throw new Error(error.message);
    }
});

// Function to cancel a Booking
export const cancelBooking = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
        select: { bookedVisits: true },
      });
      
      // search through bookedVisits object
      const index = user.bookedVisits.findIndex((visit) => visit.id === id);
  
      if (index === -1) {
        // if booking not found in object
        res.status(404).json({ message: "Booking not found" });
      } else {
        // delete booking found in the array
        user.bookedVisits.splice(index, 1);
        // update new bookedVisits object
        await prisma.user.update({
          where: { email },
          data: {
            bookedVisits: user.bookedVisits,
          },
        });
  
        res.send("Booking cancelled successfully");
      }
    } catch (err) {
      throw new Error(err.message);
    }
});


// function to add property to favorities lists
export const toFavorites = asyncHandler (async (req, res) => {
    const { email } = req.body;
    const { rid } = req.params;

    try {
        
        const user = await prisma.user.findUnique({
            where: {email},
        })

        if (user.favResidenciesID.includes(rid)) {
            const updatedUser = await prisma.user.update({
                where: {email},
                data: {
                    favResidenciesID: {
                        set: user.favResidenciesID.filter((id) => id !== rid)
                    },
                },
            });

            res.send({message: "Removed from favorites", user: updatedUser})
        } else {
            const updatedUser = await prisma.user.update({

                where: {email},
                data: {
                    favResidenciesID: {
                        push: rid,
                    }
                }
            });

            res.send({message: "Updated Favorites", user: updatedUser});
        }
    } catch (err) {
        throw new Error(err.message);
    }
});


// get all favourite listings
export const allFavorites = asyncHandler (async (req, res) => {
    const {email} = req.body;
    try {
        const favoritesResidencies = await prisma.user.findUnique({
            where: {email},
            select: {favResidenciesID: true},
        });

        res.status(200).send(favoritesResidencies);
    } catch (err) {
        throw new Error(err.message);
    }
})
