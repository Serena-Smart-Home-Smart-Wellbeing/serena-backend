import { parseToken } from '@/middlewares/auth';
import {
    handleAddSerenBox,
    handleChangeSerenBoxSlotStatus,
    handleCreateSerenBoxSession,
    handleDeleteSerenBox,
    handleFinishSerenBoxSession,
    handleGetSerenBox,
    handleGetSerenBoxSession,
    handleGetSerenBoxSlotStatusByCredentials,
    handleGetSerenBoxes,
    handlePatchSerenBoxIpAddress,
    validateSerenBoxById,
} from '@/middlewares/serenbox';
import { SerenBox } from '@prisma/client';
import express from 'express';

const serenBoxRouter = express.Router({ mergeParams: true });

serenBoxRouter
    .route('/')
    .post(parseToken, handleAddSerenBox)
    .get(parseToken, handleGetSerenBoxes)
    .patch(handlePatchSerenBoxIpAddress);

export interface SerenBoxRouterParams {
    serenboxId: string;
}

serenBoxRouter
    .route('/:serenboxId')
    .get(parseToken, handleGetSerenBox)
    .delete(parseToken, handleDeleteSerenBox);

serenBoxRouter.route('/:serenboxId/status');
// .get(parseToken, validateSerenBoxById, handleVerifySerenBoxConnection);

export interface SerenBoxSlotRouterParams extends SerenBoxRouterParams {
    slotOption: string;
}

export interface SerenBoxSlotCredentialsRouterParams {
    credentials: SerenBox['credentials'];
}

serenBoxRouter
    .route('/:credentials/slots')
    .get(handleGetSerenBoxSlotStatusByCredentials);

serenBoxRouter
    .route('/:serenboxId/slots/:slotOption')
    .patch(parseToken, handleChangeSerenBoxSlotStatus);

export interface SerenBoxSessionRouterParams extends SerenBoxRouterParams {
    sessionId: string;
}

serenBoxRouter
    .route('/:serenboxId/sessions')
    .post(parseToken, validateSerenBoxById, handleCreateSerenBoxSession);

serenBoxRouter
    .route('/:serenboxId/sessions/:sessionId')
    .get(parseToken, validateSerenBoxById, handleGetSerenBoxSession);

serenBoxRouter
    .route('/:serenboxId/sessions/:sessionId/finish')
    .get(parseToken, validateSerenBoxById, handleFinishSerenBoxSession);

export default serenBoxRouter;
