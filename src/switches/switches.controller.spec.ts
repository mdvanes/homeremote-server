import { Test, TestingModule } from '@nestjs/testing';
import * as Got from 'got';
import {
  DomoticzSwitch,
  DomoticzType,
  SwitchesController,
} from './switches.controller';

jest.mock('got');
const gotSpy = jest.spyOn(Got, 'default');

describe('Switches Controller', () => {
  let controller: SwitchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwitchesController],
    }).compile();

    controller = module.get<SwitchesController>(SwitchesController);
  });

  it('returns the switches states on /GET ', async () => {
    const mockSwitch: DomoticzSwitch = {
      idx: '1',
      Type: DomoticzType.LightSwitch,
      Name: 'My Switch',
      Status: 'on',
      SwitchType: DomoticzType.LightSwitch,
      Level: 0,
      Protected: false,
    };
    gotSpy.mockResolvedValue({
      body: JSON.stringify({ status: 'OK', result: [mockSwitch] }),
    });
    expect(await controller.getSwitches()).toEqual({
      status: 'received',
      switches: [
        {
          idx: '1',
          type: 'Light/Switch',
          name: 'My Switch',
          status: 'on',
          dimLevel: null,
          readOnly: false,
          children: false,
        },
      ],
    });
  });

  it('returns error status on failed /GET ', async () => {
    gotSpy.mockRejectedValue('Mock Server Down');
    expect(await controller.getSwitches()).toEqual({
      status: 'error',
    });
  });

  it('returns error status on non-OK /GET ', async () => {
    gotSpy.mockResolvedValue({
      body: JSON.stringify({ status: 'error' }),
    });
    expect(await controller.getSwitches()).toEqual({
      status: 'error',
    });
  });

  it('returns error status on unparsable /GET ', async () => {
    gotSpy.mockResolvedValue({
      body: 'not json',
    });
    expect(await controller.getSwitches()).toEqual({
      status: 'error',
    });
  });
});
