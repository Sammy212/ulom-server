import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";


// Add Listings to dataBase
export const createResidency = asyncHandler(async (req, res) => {
    const { 
        title, 
        description, 
        price, 
        address, 
        city, 
        country, 
        facilities, 
        image, 
        userEmail 
    } = req.body.data

    console.log(req.body.data);
    try {

        const residency = await prisma.residency.create({
            data: {
                title, 
                description, 
                price, 
                address, 
                city, 
                country, 
                facilities, 
                image, 
                owner : {connect : {email: userEmail}},
            },
        });

        res.send({ message: "Listing Created Successfully", residency });
    } catch (err) {
        if (err.code === "P2002") {
            throw new Error("A listing with the same address already exits")
        }
        throw new Error(err.message)
    }
});

// Get all the listings in dataBase
export const getAllResidencies = asyncHandler(async(req, res) => {
    const residencies = await prisma.residency.findMany({
        orderBy: {
            createdAt: "asc"
        },
    });
    res.send(residencies);
});

// Get Specific Listing

export const getResidency = asyncHandler(async (req, res) => {
    const {id} = req.params;

    try{
        const residency = await prisma.residency.findUnique({
            where: {id: id},
        })
        res.send(residency);
    }catch(err) {
        throw new Error(err.message);
    }
});