import { Test, TestingModule } from '@nestjs/testing';
import { mocked } from 'ts-jest/utils'
import { Logger } from '@nestjs/common';
import { FooController } from './foo.controller';

// Note: jest.mock fails with "@nestjs/common", but "@nestjs/common/services" and deeper is fine ¯\_(ツ)_/¯
jest.mock('@nestjs/common/services');

const MockLogger = mocked(Logger, true); // not to have: Logger as unknown as jest.Mock<Logger>;

describe('Foo Controller', () => {
  let controller: FooController;

  beforeEach(async () => {
    MockLogger.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FooController],
    }).compile();

    controller = module.get<FooController>(FooController);
  });

  it('logs a lot of stuff', async () => {
    expect(MockLogger).toHaveBeenCalledWith("FooController");
    const result = await controller.getFoo();
    expect(result).toBe("Foo!");
    const fooLoggerInstance = MockLogger.mock.instances[2];
    expect((mocked(fooLoggerInstance.error)).mock.calls[0][0]).toEqual("Error: GET to /api/foo");
    expect((mocked(fooLoggerInstance.warn)).mock.calls[0][0]).toEqual("Warning: GET to /api/foo");
    expect((mocked(fooLoggerInstance.log)).mock.calls[0][0]).toEqual("Log: GET to /api/foo");
    expect((mocked(fooLoggerInstance.debug)).mock.calls[0][0]).toEqual("Debug: GET to /api/foo");
    expect((mocked(fooLoggerInstance.verbose)).mock.calls[0][0]).toEqual("Verbose: GET to /api/foo");
  });
});
