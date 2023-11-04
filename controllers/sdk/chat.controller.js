import { query } from "express";
import prisma from "../../config/db.config.js";
import {
	response_200,
	response_401,
	response_500,
    response_404
} from "../../utils/responseCodes.js";
import axios from "axios";

const getQuery = (query, project, action, isFirst) => {
    if(isFirst) return `I want to ${action.firstQuery}. ${query}. Here is a little information about ${project.title}. ${project.description}.`;
    return `${query}`;
}

export const getLLMResponse = async (req, res) => {
    try {
        const {actionId, context, query} = req.body;

        model = "llamma";
        
        isFirst = false;
        if(context[User].lenght>0) isFalse = true;

        const action = await prisma.action.findUnique({
            where: {
                id: actionId
            },
        });

        
        const project = await prisma.project.findUnique({
					where: {
						id: action.projectId,
					},
				});

        if(!project || !action) return response_404(res, "Project or Action not found");

        if(model==="llamma")
        {
            const response = await axios.post(project.chatEndpoint, {
							query: getQuery(query, project, action, isFirst),
							context: action.pitch,
							history: parseContext(context),
						});
            response_200(res, response.data);
        }

    } catch (error) {
        console.log(error);
        response_500(res, error);
    }
}

export const createChat = async (req, res) => {
    try {
        const {actionId} = req.body;

        const action = await prisma.action.findUnique({
            where: {
                id: actionId
            },
        });

        const project = await prisma.project.findUnique({
                    where: {
                        id: action.projectId,
                    },
                });
        
        var query = action.firstQuery;
        isFirst = true;

        if(!project || !action) return response_404(res, "Project or Action not found");

            response_200(res, {
                result : action.firstQuery,
            });
            
    } catch (error) {
        console.log(error);
        response_500(res, error);
    }
}