import express from 'express'
import { verifyAuth } from '../../../Middlewares/auth.middleware.js'
import { discoverProfiles } from '../Controllers/DiscoverProfile.controller.js'

const profileDiscoverRouter = express.Router()


profileDiscoverRouter.get('/', verifyAuth, discoverProfiles)


export default profileDiscoverRouter