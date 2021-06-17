// https://kentcdodds.com/blog/implementing-a-simple-state-machine-library-in-javascript

import { t } from "@rbxts/t";

type Event = { type: string };

export type StateMachineDefinition<E extends Event> = {
	initialState: string;
	states: {
		[state: string]: {
			actions?: {
				onEnter?(event: E): void;
				onExit?(event: E): void;
			};
			transitions?: {
				[eventType: string]: {
					target: string;
					action?(event: E): void;
				};
			};
		};
	};
};

export class FSM<E extends Event> {
	private state: string;
	private stateMachineDefinition: StateMachineDefinition<E>;

	constructor(def: StateMachineDefinition<E>) {
		this.state = def.initialState;
		this.stateMachineDefinition = def;
	}

	getState(): string {
		return this.state;
	}

	dispatch(event: E): void {
		const transition = this.getTransition(this.state, event);
		if (t.nil(transition)) {
			return;
		}

		const state = this.state;
		const nextState = transition.target;

		const stateNode = this.getStateNode(state);
		const nextStateNode = this.getStateNode(nextState);

		transition.action?.(event);
		stateNode.actions?.onExit?.(event);
		nextStateNode.actions?.onEnter?.(event);

		this.state = nextState;
	}

	private getStateNode(state: string) {
		const stateNode = this.stateMachineDefinition.states[state];
		if (t.nil(stateNode)) {
			error(`'${state}' is not a valid state`);
		}
		return stateNode;
	}

	private getTransition(state: string, event: E) {
		const stateNode = this.getStateNode(state);
		if (t.nil(stateNode.transitions)) {
			return;
		}
		return stateNode.transitions[event.type];
	}
}
