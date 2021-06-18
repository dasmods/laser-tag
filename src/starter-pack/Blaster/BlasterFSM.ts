import { FSM } from "shared/fsm/fsm";

type BlasterStates = "full" | "firing" | "partial" | "empty" | "reloading";

type BlasterEvents = { type: "fire" } | { type: "reload" };

export type BlasterFSM = FSM<BlasterStates, BlasterEvents>;

export type BlasterFSMParams = {
	fire: () => Promise<void>;
	reload: () => Promise<void>;
	onEmpty: () => void;
	hasAmmo: () => boolean;
};

export const createBlasterFSM = (params: BlasterFSMParams): BlasterFSM => {
	return new FSM<BlasterStates, BlasterEvents>({
		initialState: "full",
		states: {
			full: {
				type: "sync",
				transitions: {
					fire: {
						to: "firing",
					},
				},
			},
			partial: {
				type: "sync",
				transitions: {
					fire: {
						to: "firing",
					},
					reload: {
						to: "reloading",
					},
				},
			},
			empty: {
				type: "sync",
				enter: params.onEmpty,
				transitions: {
					reload: {
						to: "reloading",
					},
				},
			},
			firing: {
				type: "async",
				enter: params.fire,
				transitions: {
					resolve: {
						to: () => (params.hasAmmo() ? "partial" : "empty"),
					},
				},
			},
			reloading: {
				type: "async",
				enter: params.reload,
				transitions: {
					resolve: {
						to: "full",
					},
				},
			},
		},
	});
};
