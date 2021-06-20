import { FSM, Transition } from "shared/fsm/fsm";

type CameraStates = "default" | "thirdPerson" | "freeMouse";

type CameraEvents = { type: "changeState"; to: Exclude<CameraStates, "default"> };

export type CameraFSM = FSM<CameraStates, CameraEvents>;

export type CameraFSMParams = {
	onThirdPersonEnter: () => void;
	onThirdPersonExit: () => void;
	onFreeMouseEnter: () => void;
	onFreeMouseExit: () => void;
};

const changeState: Transition<CameraStates, CameraEvents> = { to: (event: CameraEvents): CameraStates => event.to };

export const createCameraFSM = (params: CameraFSMParams) => {
	return new FSM<CameraStates, CameraEvents>({
		initialState: "thirdPerson",
		states: {
			default: {
				type: "sync",
				transitions: { changeState },
			},
			thirdPerson: {
				type: "sync",
				enter: params.onThirdPersonEnter,
				exit: params.onThirdPersonExit,
				transitions: { changeState },
			},
			freeMouse: {
				type: "sync",
				enter: params.onFreeMouseEnter,
				exit: params.onFreeMouseExit,
				transitions: { changeState },
			},
		},
	});
};
