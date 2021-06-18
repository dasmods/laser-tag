import { t } from "@rbxts/t";

export type Event = { type: string };

export type SyncAction<E extends Event> = (event: E) => void;

export type AsyncAction<E extends Event> = (event: E) => Promise<void>;

export type Transition<S extends string, E extends Event> = {
	to: S;
	actions: SyncAction<E>[];
};

export type SyncActionStateNode<S extends string, E extends Event> = {
	type: "sync";
	enter?: SyncAction<E>[];
	exit?: SyncAction<E>[];
	transitions: Partial<Record<E["type"], Transition<S, E>>>;
};

export type AsyncActionStateNode<S extends string, E extends Event> = {
	type: "async";
	enter: AsyncAction<E>[];
	transitions: Record<"resolve", Transition<S, E>> & Partial<Record<"reject", Transition<S, E>>>;
};

export type StateNode<S extends string, E extends Event> = SyncActionStateNode<S, E> | AsyncActionStateNode<S, E>;

export type StateMachineDefinition<S extends string, E extends Event> = {
	initialState: S;
	states: Record<S, StateNode<S, E>>;
};

/**
 * The Finite State Machine (FSM) class is a watered down version of the xstate
 * JavaScript library. The reason why it was made is because xstate is not compatible
 * with roblox-ts.
 *
 * It was partly adapted from https://kentcdodds.com/blog/implementing-a-simple-state-machine-library-in-javascript.
 */
export class FSM<S extends string, E extends Event> {
	private state: S;
	private def: StateMachineDefinition<S, E>;

	constructor(def: StateMachineDefinition<S, E>) {
		this.state = def.initialState;
		this.def = def;
	}

	getState(): string {
		return this.state;
	}

	dispatch(event: E): void {
		const stateNode = this.getStateNode(this.state);
		if (this.isSyncStateNode(stateNode)) {
			this.handleSyncStateNode(event, stateNode);
		} else if (this.isAsyncStateNode(stateNode)) {
			this.handleAsyncStateNode(event, stateNode);
		} else {
			error(`could not determine state node type: ${stateNode}`);
		}
	}

	private handleSyncStateNode(event: E, stateNode: SyncActionStateNode<S, E>): void {
		const eventType: E["type"] = event.type;
		const transition = stateNode.transitions[eventType];
		if (t.nil(transition)) {
			return;
		}

		const nextState = transition.to;
		const nextStateNode = this.getStateNode(nextState);

		for (const action of stateNode.exit || []) {
			action(event);
		}
		for (const action of transition.actions) {
			action(event);
		}

		this.state = nextState;

		if (this.isSyncStateNode(nextStateNode)) {
			for (const action of nextStateNode.enter || []) {
				action(event);
			}
		} else if (this.isAsyncStateNode(nextStateNode)) {
			this.handleAsyncStateNode(event, nextStateNode);
		} else {
			error(`could not determine state node type: ${nextStateNode}`);
		}
	}

	private async handleAsyncStateNode(event: E, stateNode: AsyncActionStateNode<S, E>): Promise<void> {
		let transition: Transition<S, E> | undefined;
		try {
			await Promise.all(stateNode.enter.map((action) => action(event)));
			transition = stateNode.transitions.resolve;
		} catch (e) {
			transition = stateNode.transitions.reject;
		}

		if (t.nil(transition)) {
			return;
		}

		const nextState = transition.to;
		const nextStateNode = this.getStateNode(nextState);

		for (const action of transition.actions) {
			action(event);
		}

		this.state = nextState;

		for (const action of nextStateNode.enter || []) {
			action(event);
		}
	}

	private getStateNode(state: S): StateNode<S, E> {
		return this.def.states[state];
	}

	private isSyncStateNode(stateNode: StateNode<S, E>): stateNode is SyncActionStateNode<S, E> {
		return stateNode.type === "sync";
	}

	private isAsyncStateNode(stateNode: StateNode<S, E>): stateNode is AsyncActionStateNode<S, E> {
		return stateNode.type === "async";
	}
}

// FSM EXAMPLE:
// an on-off switch
//
// type ToggleStates = "off" | "on";
//
// type ToggleEvents = { type: "toggle" };
//
// const toggle = new FSM<ToggleStates, ToggleEvents>({
// 	initialState: "off",
// 	states: {
// 		on: {
// 			type: "sync",
// 			enter: [
// 				() => {
// 					print("I am on!");
// 				},
// 			],
// 			exit: [],
// 			transitions: {
// 				toggle: {
// 					to: "off",
// 					actions: [],
// 				},
// 			},
// 		},
// 		off: {
// 			type: "async",
// 			enter: [
// 				async () => {
// 					print("I am off!");
// 					await Promise.delay(1);
// 					print("ready to turn on again");
// 				},
// 			],
// 			transitions: {
// 				resolve: {
// 					to: "on",
// 					actions: [],
// 				},
// 			},
// 		},
// 	},
// });
