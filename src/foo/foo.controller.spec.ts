import { Test, TestingModule } from '@nestjs/testing';
import { FooController } from './foo.controller';

import { Logger } from '@nestjs/common/services/logger.service';
jest.mock('@nestjs/common/services/logger.service');

// const c: any = jest.genMockFromModule("@nestjs/common")
// const c: any = jest.genMockFromModule("@nestjs/common/services/logger.service")

// jest.spyOn(Common)

// import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// @Controller('api/foo')
// export class FooController {
//   private readonly logger: Logger;

describe('Foo Controller', () => {
  let controller: FooController;

  beforeEach(async () => {
    // @ts-ignore
    Logger.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FooController],
    }).compile();

    controller = module.get<FooController>(FooController);
  });

  it('logs a lot of stuff', async () => {
    // @ts-ignore
    // Logger.mockReset();
    expect(Logger).toHaveBeenCalledWith("FooController");
    const result = await controller.getFoo();
    expect(result).toBe("Foo!");
    // expect(Logger).not.toHaveBeenCalled();
    // instances[2] is the FooController instance
    // @ts-ignore
    const fooLoggerInstance = Logger.mock.instances[2];
    expect(fooLoggerInstance.error.mock.calls[0][0]).toEqual("Error: GET to /api/foo");
    expect(fooLoggerInstance.warn.mock.calls[0][0]).toEqual("Warning: GET to /api/foo");
    // expect(c.Logger.constructor.name).toBe("a");
    // const mockLoggerInstance = c.Logger.mock
    //   .instances[0];
    //   // https://jestjs.io/docs/en/jest-object#jestcreatemockfrommodulemodulename
    // expect(mockLoggerInstance.error).toHaveBeenCalledWith(''); // TODO hmm...
    // expect(result).toBe('Foo!');
  });
});
