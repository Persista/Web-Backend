import prisma from "../config/db.config.js";
import { response_200, response_201, response_500, response_404 } from "../utils/responseCodes.js";
import {generateRandomAPIKey} from "../utils/generateApiKey.js";

// router.get("/keys", getAllKeys);
// router.post("/keys", createKey);
// router.delete("/keys/:id", deleteKey);
// router.get("/assign/:role", assignDev);
// router.get("/unassign", unassignDev);
// router.get("/analytics", getAnalytics);
// router.post("edit", editProject);

export const getAllKeys = async (req, res) => {
	try {
		const { id } = req.params;
		const keys = await prisma.apiKey.findMany({
			where: {
				projectId: id,
			},
			select: {
				id: true,
				apiKey: true,
				modelType: true,
				apiKeyDescription: true,
				chatEndpoint: true,
				sentimentEndpoint: true,
				analyticsEndpoint: true,
			},
		});
		response_200(res, keys);
	} catch (error) {
		console.log(error);
		response_500(res, error);
	}
};

export const createKey = async (req, res) => {
	try {
		const { id } = req.params;
		const { apiKey, modelType, apiKeyDescription, chatEndpoint, sentimentEndpoint, analyticsEndpoint } = req.body;
		const key = await prisma.apiKey.create({
			data: {
				apiKey,
				modelType,
				apiKeyDescription,
				projectId: id,
			},
		});
		response_201(res, key);
	} catch (error) {
		console.log(error);
		response_500(res, error);
	}
};

export const deleteKey = async (req, res) => {
	try {
		const { id } = req.params;
		const key = await prisma.apiKey.delete({
			where: {
				id,	
			},
		});
		response_200(res, "Key deleted successfully");
	} catch (error) {
		console.log(error);
		response_500(res, error);
	}
};

export const assignDev = async (req, res) => {
	try {
		const { id } = req.params;
		const role = req.query.role;
		const devId = req.query.devId;
		
		const userProjectRelation = await prisma.userProjectRelation.create({
			data: {
				projectId: id,
				userId: devId,
				isAdmin: (role === "admin") ? true : false,
			},
		});	

		response_200(res, "Developer assigned successfully");
	} catch (error) {
		console.log(error);
		response_500(res, error);
	}
};

export const unassignDev = async (req, res) => {
	try {
		const { id } = req.params;
		const devId = req.query.devId;
		const userProjectRelation = await prisma.userProjectRelation.delete({
			where: {
				projectId: id,
				userId: devId,
			},
		});
		response_200(res, "Developer unassigned successfully");
	} catch (error) {
		console.log(error);
		response_500(res, error);
	}
}

// export const getAnalytics = async (req, res) => {
// 	try {
// 		const { id } = req.params;
// 		const analytics = await prisma.analytics.findMany({
// 			where: {
// 				projectId: id,
// 			},
// 		});
// 		res.status(200).json(analytics);
// 	} catch (error) {
// 		console.log(error);
// 		response_500(res, error);
// 	}
// };

export const editProject = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description } = req.body;
		const project = await prisma.project.update({
			where: {
				id,
			},
			data: {
				title,
				description,
			},
			select: {
				title: true,
				description: true,
				userProjects: {
					select: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								picture: true,
							},
						},
						isAdmin: true,
					},
				},
				primaryApiKey: true,
				chatEndpoint: true,
				analyticsEndpoint: true,
				apiKeys: {
					select: {
						id: true,
						apiKey: true,
						modelType: true,
						apiKeyDescription: true,
					},
				},
				actions: {
					select: {
						id: true,
						title: true,
						description: true,
						pitch: true,
						projectId: true,
					},
				},
			},
		});
		response_200(res, project);
	} catch (error) {
		console.log(error);
		response_500(res, error);
	}
}

export const getProject = async (req, res) => {
	try {
		const { id } = req.params;
		const project = await prisma.project.findUnique({
			where: {
				id,
			},
			select: {
				title: true,
				description: true,
				userProjects: {
					select: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								picture: true,
							},
						},
						isAdmin: true,
					},
				},
				primaryApiKey: true,
				chatEndpoint: true,
				analyticsEndpoint: true,
				apiKeys: {
					select: {
						id: true,
						apiKey: true,
						modelType: true,
						apiKeyDescription: true,
					},
				},
				actions: {
					select: {
						id: true,
						title: true,
						description: true,
						pitch: true,
						projectId: true,
					},
				},
			},
		});
		response_200(res, project);
	} catch (error) {
		console.log(error);
		response_500(res, error);
	}
}

export const getAllProjects = async (req, res) => {
	console.log(req.user);
	try {
		const projects = await prisma.project.findMany({
			where: {
				userProjects : {
					some : {
						userId : req.user.id,
					}
				}
			},
			select: {
				title: true,
				description: true,
				userProjects: {
					select: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								picture: true,
							},
						},
						isAdmin: true,
					},
				},
				primaryApiKey: true,
				chatEndpoint: true,
				analyticsEndpoint: true,
				apiKeys: {
					select: {
						id: true,
						apiKey: true,
						modelType: true,
						apiKeyDescription: true,
					},
				},
				actions: {
					select: {
						id: true,
						title: true,
						description: true,
						pitch: true,
						projectId: true,
					},
				},
			},
		});
		response_200(res, projects);
	} catch (error) {
		console.log(error);
		response_500(res, error);
	}
}

export const createProject = async (req, res) => {
	try {
		const { title, description } = req.body;
		const primaryApiKey = generateRandomAPIKey();

		const project = await prisma.project.create({
			data: {
				title,
				description,
				primaryApiKey
			},
		});

		const userProjectRelation = await prisma.userProjectRelation.create({
			data: {
				projectId: project.id,
				userId: req.user.id,
				isAdmin: true,
			},
		});

		const resp = await prisma.project.findUnique({
			where: {
				id: project.id,
			},
			select: {
				userProjects: {
					select: {
						user: {
							select: {
								id: true,
								name: true,
								email: true,
								picture: true,
							},
						},
						isAdmin: true,
					},
				},
				primaryApiKey: true,
				chatEndpoint: true,
				analyticsEndpoint: true,
				apiKeys: {
					select: {
						id: true,
						apiKey: true,
						modelType: true,
						apiKeyDescription: true,
					},
				},
				actions: {
					select: {
						id: true,
						title: true,
						description: true,
						pitch: true,
						projectId: true,
					},
				},
			},
		});

		response_201(res, resp);
	} catch (error) {
		console.log(error);
		response_500(res, error);
	}
}

export const deleteProject = async (req, res) => {
	try {
		const { id } = req.params;
		const project = await prisma.project.delete({
			where: {
				id,
			},
		});
		response_200(res, "Project deleted successfully");
	} catch (error) {
		console.log(error);
		response_500(res, error);
	}
}