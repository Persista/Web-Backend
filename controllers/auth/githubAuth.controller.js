import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../../config/db.config.js";
import {
	response_200,
	response_401,
	response_500,
} from "../../utils/responseCodes.js";

dotenv.config();

axios.defaults.proxy = false;

const gitHubAuthURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=read:user`;

const gitHubRedirect = (req, res) => {
	res.redirect(gitHubAuthURL);
};

const tokenTransfer = async (req, res) => {
	const AUTH_CODE = req.query.code;
	const STATE = req.query.state;

	if (STATE !== process.env.STATE) {
		return response_401(res, "Unable to authorize you");
	}

	const params = {
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
		code: AUTH_CODE,
	};

	const opts = { headers: { accept: "application/json" } };

	try {
		const response = await axios.post(
			"https://github.com/login/oauth/access_token",
			params,
			opts
		);
		const accessToken = response.data.access_token;

		opts.headers.Authorization = `Bearer ${accessToken}`;
		const userGitHub = await axios.get("https://api.github.com/user", opts);
		const userGitHubData = userGitHub.data;

		let userDBData = {};
		try {
			const userData = await prisma.user.findUnique({
				where: {
					githubId: userGitHubData.id.toString(),
				},
			});

			if (userData) {
				userDBData = userData;
			}

			const token = jwt.sign(
				{
					id: userGitHubData.id.toString(),
					avatar_url: userGitHubData.avatar_url,
					accessToken: accessToken,
					roles: {
						isManager: userDBData ? userDBData.isManager : false,
						isAdmin: userDBData ? userDBData.isAdmin : false,
					},
				},
				process.env.JWT_SECRET
			);

			res.redirect(`${process.env.SUCCESS_LOGIN_URL}?token=${token}`);
		} catch (error) {
			console.error(error);
			response_500(res, "Error while fetching user from db", error);
		}
	} catch (error) {
		console.error(error);
		response_500(res, "Error while fetching token", error);
	}
};

export { gitHubRedirect, tokenTransfer };
