import { Router } from "express";
var router = Router();
import { getAllActions, createAction, deleteAction, getAction, editAction } from "../../controllers/actions.controller.js";

router.get('/', getAllActions);
router.post('/', createAction);
router.delete('/:id', deleteAction);
router.get('/:id', getAction);
router.patch('/:id', editAction);

export default router;
