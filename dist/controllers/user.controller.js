import {} from "express";
import { User } from "../entities/user.js";
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching users" });
    }
};
//# sourceMappingURL=user.controller.js.map