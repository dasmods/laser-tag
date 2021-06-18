import { t } from "@rbxts/t";

export type Event = { type: string };

export type SyncAction<E extends Event> = (event: E) => void;

export type AsyncAction<E extends Event> = (event: E) => Promise<void>;

export type ComputedState<S extends string, E extends Event> = (event: E) => S;

export type Transition<S extends string, E extends Event> = {
	to: S | ComputedState<S, E>;
	effect?: SyncAction<E>;
};

export type SyncActionStateNode<S extends string, E extends Event> = {
	type: "sync";
	enter?: SyncAction<E>;
	exit?: SyncAction<E>;
	transitions: Partial<Record<E["type"], Transition<S, E>>>;
};

export type AsyncActionStateNode<S extends string, E extends Event> = {
	type: "async";
	enter: AsyncAction<E>;
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
	private isProcessing = false;

	constructor(def: StateMachineDefinition<S, E>) {
		this.state = def.initialState;
		this.def = def;
	}

	getState(): string {
		return this.state;
	}

	dispatch(event: E): void {
		if (this.isProcessing) {
			return;
		}
		this.startProcessing();

		const stateNode = this.getStateNode(this.state);
		if (stateNode.type !== "sync") {
			this.stopProcessing();
			warn(`exepected state node, wanted 'sync', got '${stateNode.type}'`);
			return;
		}

		const transition = this.getTransition(event, stateNode);
		if (t.nil(transition)) {
			this.stopProcessing();
			return;
		}

		const nextState = this.getNextState(event, transition);
		const nextStateNode = this.getStateNode(nextState);

		// exit current state
		this.doExitSync(event, stateNode);

		// transition
		this.doTransition(event, transition);

		// enter next state
		switch (nextStateNode.type) {
			case "sync":
				this.doEnterSync(event, nextStateNode);
				break;
			case "async":
				this.doEnterAsyncAndTransition(event, nextStateNode);
				break;
			default:
				error(`could not determine state node type: ${stateNode}`);
		}
	}

	private startProcessing() {
		this.isProcessing = true;
	}

	private stopProcessing() {
		this.isProcessing = false;
	}

	private getStateNode(state: S): StateNode<S, E> {
		return this.def.states[state];
	}

	private getTransition(event: E, stateNode: SyncActionStateNode<S, E>): Transition<S, E> | undefined {
		const eventType: E["type"] = event.type;
		return stateNode.transitions[eventType];
	}

	private getNextState(event: E, transition: Transition<S, E>): S {
		const target = transition.to;
		return this.isConditionalState(target) ? target(event) : target;
	}

	private isConditionalState(value: S | ComputedState<S, E>): value is ComputedState<S, E> {
		return t.callback(value);
	}

	private doTransition(event: E, transition: Transition<S, E>): StateNode<S, E> {
		transition.effect?.(event);
		const nextState = this.getNextState(event, transition);
		this.state = nextState;
		return this.getStateNode(nextState);
	}

	private doEnterSync(event: E, stateNode: SyncActionStateNode<S, E>): void {
		stateNode.enter?.(event);
		this.stopProcessing();
	}

	private async doEnterAsyncAndTransition(event: E, stateNode: AsyncActionStateNode<S, E>): Promise<void> {
		let transition: Transition<S, E> | undefined;
		try {
			await stateNode.enter(event);
			transition = stateNode.transitions.resolve;
		} catch (e) {
			transition = stateNode.transitions.reject;
		}

		if (t.nil(transition)) {
			return;
		}

		const nextState = this.getNextState(event, transition);
		const nextStateNode = this.getStateNode(nextState);

		this.state = nextState;

		switch (nextStateNode.type) {
			case "sync":
				this.doEnterSync(event, nextStateNode);
				break;
			case "async":
				await this.doEnterAsyncAndTransition(event, nextStateNode);
				break;
			default:
				error(`could not determine state node type: ${stateNode}`);
		}
	}

	private doExitSync(event: E, stateNode: SyncActionStateNode<S, E>): Transition<S, E> | undefined {
		const eventType: E["type"] = event.type;
		const transition = stateNode.transitions[eventType];
		if (t.nil(transition)) {
			return;
		}
		stateNode.exit?.(event);
	}
}
