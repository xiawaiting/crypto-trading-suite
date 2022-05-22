import {
  Body,
  Controller,
  Post,
  Get,
  Inject,
  Param,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common'
import { UserService } from './user.service'
import { Request, Response } from 'express'
import { GoogleAuthType, ResultWithData } from '../types'
import axios from 'axios'
import { googleApiBaseUrl, googleRedirectUriDev2 } from 'src/common/auth-config'
import { AuthService } from './auth.service'
import { AuthGuard } from './auth.guard'
import { Public } from 'src/common/decorators/public.decorator'
import { fail, success } from 'src/common/constant'
import { User } from './user.entity'

@Controller('user')
