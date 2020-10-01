import { Controller, Logger, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import got from "got";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// TODO ConfigService instead of settings.json https://docs.nestjs.com/techniques/configuration#using-the-configservice
// "domoticzuri": "http://192.168.0.8:8080",
const settings = {
    "domoticzuri": "http://192.168.0.8:8080",
}

export enum DomoticzType {
    Group = "Group",
    LightSwitch = "Light/Switch",
    Dimmer = "Dimmer",
    Selector = 'Selector'
}

type DomoticzStatus = string;

export interface DomoticzSwitch {
    idx: string;
    Type: DomoticzType;
    Name: string;
    Status: DomoticzStatus;
    SwitchType: DomoticzType;
    Level: number;
    Protected: boolean;
}

interface HomeRemoteSwitch {
    idx: string;
    type: DomoticzType;
    status: DomoticzStatus;
    name: string;
    dimLevel: number | null;
    readOnly: boolean;
    children?: HomeRemoteSwitch[] | false;
}

interface SwitchesResponse {
    status: "received" | "error";
    switches?: HomeRemoteSwitch[]
}

type GetIsOnDimmer = (SwitchType: DomoticzType, Status: string) => boolean;
const getIsOnDimmer: GetIsOnDimmer = (SwitchType, Status) =>
    SwitchType === 'Dimmer' && Status === 'On';

type GetDimLevel = (isOnDimmer: boolean, isSelector: boolean, Level: number) => number | null;
const getDimLevel: GetDimLevel = (isOnDimmer, isSelector, Level) =>
    isOnDimmer || isSelector ? Level : null;

// For switches included in a scene
type MapIncludedSwitch = (SceneStatus: DomoticzStatus) => ({ DevID, Type, Name }: { DevID: string, Type: DomoticzType, Name: string }) => HomeRemoteSwitch;
const mapIncludedSwitch: MapIncludedSwitch = SceneStatus => ({ DevID, Type, Name }) => ({
    idx: DevID,
    type: Type,
    name: Name,
    status: SceneStatus,
    dimLevel: null, // NYI, to implement this get each switch detail by DevID on /json.htm?type=command&param=getlightswitches
    readOnly: false // NYI, to implement this get each switch detail by DevID on /json.htm?type=command&param=getlightswitches
});

type GetChildren = (SceneIdx: string, SceneType: DomoticzType, SceneStatus: DomoticzStatus) => Promise<HomeRemoteSwitch[] | false>;
const getChildren: GetChildren = async (SceneIdx, SceneType, SceneStatus) => {
    if (SceneType === 'Group') {
        const targetUri = `${settings.domoticzuri}/json.htm?type=command&param=getscenedevices&idx=${SceneIdx}&isscene=true`;
        const remoteResponse = await got(targetUri);
        const remoteResponseJson = JSON.parse(remoteResponse.body);
        if (remoteResponseJson.status === 'OK') {
            return remoteResponseJson.result.map(
                mapIncludedSwitch(SceneStatus)
            );
        }
        return false;
    }
    return false;
};

const mapSwitch = async ({
    idx,
    Type,
    Name,
    Status,
    SwitchType,
    Level,
    Protected
}: DomoticzSwitch): Promise<HomeRemoteSwitch> => {
    const isSelector = SwitchType === 'Selector';
    const isOnDimmer = getIsOnDimmer(SwitchType, Status);
    const children = await getChildren(idx, Type, Status);
    const switchResult: HomeRemoteSwitch = {
        idx,
        type: isSelector ? SwitchType : Type,
        name: Name,
        status: Status,
        dimLevel: getDimLevel(isOnDimmer, isSelector, Level),
        readOnly: Protected,
        children
    };
    return switchResult;
};


interface UpdateSwitchMessage {
    state: string;
    type: string;
}

@Controller('api/switches')
export class SwitchesController {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(SwitchesController.name);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getSwitches(): Promise<SwitchesResponse> {
        //   console.log('GET to /api/switches');
        //   this.logger.error('GET to /api/switches');
        //   this.logger.warn('GET to /api/switches');
        //   this.logger.log('GET to /api/switches');
        //   this.logger.debug('GET to /api/switches');
        // this.logger.verbose('GET to /api/switches');
        // return [];

        this.logger.verbose(
            `GET to /api/switches domoticzuri: ${
            settings.domoticzuri
            }]`
        );
        if (settings.domoticzuri && settings.domoticzuri.length > 0) {
            const targetUri = `${settings.domoticzuri}/json.htm?type=devices&used=true&filter=all&favorite=1`;
            try {
                const remoteResponse = await got(targetUri);
                const remoteResponseJson = JSON.parse(remoteResponse.body);
                if (remoteResponseJson.status === 'OK') {
                    const switches = await Promise.all(
                        (remoteResponseJson.result as DomoticzSwitch[]).map(mapSwitch)
                    );
                    // this.logger.verbose(`SWITCHES ${switches} x= ${typeof switches[0]}, z=${JSON.stringify(switches[0])} json=${JSON.stringify(remoteResponseJson)}`);
                    return {
                        status: 'received',
                        switches
                    };
                } else {
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error('remoteResponse failed');
                }
            } catch (err) {
                this.logger.error(`Can't parse response ${err}`);
                return { status: 'error' };
            }
        } else {
            this.logger.error('domoticzuri not configured');
            return { status: 'error' };
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post(":switchId")
    async updateSwitch(@Param("switchId") switchId: string, @Body() message: UpdateSwitchMessage): Promise<any> {
        const { state, type: switchType } = message;
        const newState = state === 'on' ? 'On' : 'Off';

        this.logger.verbose(
            `Call to /switch/${switchId} [state: ${newState} domoticzuri: ${
            settings.domoticzuri
            }]`
        );
        if (settings.domoticzuri && settings.domoticzuri.length > 0) {
            const targetUri = `${settings.domoticzuri}/json.htm?type=command&param=${switchType}&idx=${switchId}&switchcmd=${newState}`;
            try {
                const remoteResponse = await got(targetUri);
                const remoteResponseJson = JSON.parse(remoteResponse.body);
                if (remoteResponseJson.status === 'OK') {
                    return { status: 'received' };
                } else {
                    throw new Error('remoteResponse failed');
                }

            } catch (err) {
                this.logger.error(err);
                return { status: 'error' };
            }
        } else {
            this.logger.error('domoticzuri not configured');
            return { status: 'error' };
        }

    }
}
