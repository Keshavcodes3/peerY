import { Router } from 'express';
import { verifyAuth } from '../../../Middlewares/auth.middleware.js';
import * as matchController from '../Controllers/match.controller.js';

const matchRouter = Router();

// Like a user (send match request / auto-match if mutual)
matchRouter.post('/like/:userId', verifyAuth, matchController.sendMatchRequest);

// Explicitly accept a pending match request
matchRouter.put('/:matchId/accept', verifyAuth, matchController.acceptMatchRequest);

// Reject a pending match request
matchRouter.delete('/:matchId/reject', verifyAuth, matchController.rejectMatchRequest);

// Unmatch from an accepted match
matchRouter.delete('/:matchId/unmatch', verifyAuth, matchController.unmatch);

// Get all accepted matches
matchRouter.get('/', verifyAuth, matchController.getMatches);

// Get all pending incoming requests
matchRouter.get('/pending', verifyAuth, matchController.getPendingRequests);

export default matchRouter;
