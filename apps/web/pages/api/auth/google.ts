import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '@common/session'
import {
  FAIL,
  SUCCESS,
  THIRD_PARTY_LOGIN_TAG,
  loginRedirect,
  webRedirect,
} from '@common/constants'
import { handleGoogleAuthCodeApi } from '@services/next.api'

export default withIronSessionApiRoute(async (req, res) => {
  const { code } = req.query
  try {
    const result = await handleGoogleAuthCodeApi(code as string)
    if (result.statusCode === SUCCESS) {
      req.session.loginStatus = SUCCESS
      const { avatar, email, username, token } = result.data
 