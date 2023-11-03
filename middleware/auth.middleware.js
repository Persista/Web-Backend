import jwt from "jsonwebtoken";
import { response_401, response_500 } from "../utils/responseCodes.js";
import prisma from "../config/db.config.js";

export async function verifyUser(req, res, next) {
	const token = req.header("Authorization");
	if (!token) return response_401(res, "Unauthorized");
	try {
		const decoded = jwt.verify(token, process.env.SECRET);
		const user = await prisma.user.findUnique({
			where: {
				email: decoded.payload.email,
			},
		});
		if (!user) return response_401(res, "User not found in Database");
		req.user = user;
		next();
	} catch (err) {
		return response_500(res, err);
	}
}

export async function verifyAdmin(req, res, next) {
	const token = req.header("Authorization");
	if (!token) return response_401(res, "Unauthorized");
	try {
		const decoded = jwt.verify(token, process.env.SECRET);
		const user = await prisma.user.findUnique({
			where: {
				email: decoded.payload.email,
			},
			include: {
				projects: {
					where: {
						projectId: decoded.payload.projectId,
						isAdmin: true,
					},
				},
			},
		});

		if (!user || !user.projects.length)
			return response_401(res, "Unauthorized");

		req.user = user;
		next();
	} catch (err) {
		return response_500(res, err);
	}
}
