import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";


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

export const getAllResidencies = asyncHandler(async(req, res) => {
    const residencies = await prisma.residency.findMany({
        orderBy: {
            createdAt: "asc"
        },
    });
    res.send(residencies);
});