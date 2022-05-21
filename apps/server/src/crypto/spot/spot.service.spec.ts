import { Test, TestingModule } from '@nestjs/testing'
import { SpotService } from './spot.service'

describe('SpotService', () => {
  let service: SpotService

  beforeEach(async () => {
    const module: TestingModule = await Test.