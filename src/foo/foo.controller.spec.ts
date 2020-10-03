import { Test, TestingModule } from '@nestjs/testing';
import { FooController } from './foo.controller';
import { Logger } from '@nestjs/common';

// Note: jest.mock fails with "@nestjs/common", but "@nestjs/common/services" and deeper is fine ¯\_(ツ)_/¯
jest.mock('@nestjs/common/services');

const MockLogger = Logger;

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
    expect(MockLogger).toHaveBeenCalledWith("FooController");
    const result = await controller.getFoo();
    expect(result).toBe("Foo!");
    // expect(Logger).not.toHaveBeenCalled();
    // instances[2] is the FooController instance
    // @ts-ignore
    const fooLoggerInstance = MockLogger.mock.instances[2];
    expect(fooLoggerInstance.error.mock.calls[0][0]).toEqual("Error: GET to /api/foo");
    expect(fooLoggerInstance.warn.mock.calls[0][0]).toEqual("Warning: GET to /api/foo");
  });
});
