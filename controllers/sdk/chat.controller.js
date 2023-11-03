import prisma from "../../config/db.config.js";
import {
	response_200,
	response_401,
	response_500,
    response_404
} from "../../utils/responseCodes.js";
import axios from "axios";

const getQuery = (query, project, action, isFirst, context) => {
    if(isFirst) return `I want to ${action.title}. ${query}. Here is a little information about ${project.title}. ${project.description}.`;
    return `Here is the previous conversation, where messages beginning with AI: are messages given by you, and the ones beginning with User: are written by me and \n indicates the begining of a new line : ${context}. \n User: ${query}`;
}

export const getLLMResponse = async (req, res) => {
    try {
        const {projectId, actionId, userId, isFirst, context, query, model} = req.params;

        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            },
        });

        const action = await prisma.action.findUnique({
            where: {
                id: actionId
            },
        });

        if(!project || !action) return response_404(res, "Project or Action not found");

        if(model==="llamma")
        {
            const response = await axios.post(
							action.chatEndpoint,
							{
								"query": getQuery(
									query,
									projectId,
									actionId,
									isFirst,
									context,
								),
								"chatId": userId,
                                "pitch" : action.pitch
							},
							{
								headers: {
									Authorization: project.apiKey,
								},
							}
						);
            response_200(res, response.data);
        }




    } catch (error) {
        console.log(error);
        response_500(res, error);
    }
}