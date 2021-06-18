import { t } from "@rbxts/t";

export type States = string;

export type Events = { type: string };

export type SyncAction<E extends Events> = (event: E) => void;

export type AsyncAction<E extends Events> = (event: E) => Promise<void>;

export type ComputedState<S extends States, E extends Events> = (event: E) => S;

export type Transition<S extends States, E extends Events> = {
	to: S | ComputedState<S, E>;
	effect?: SyncAction<E>;
};

export type SyncActionStateNode<S extends States, E extends Events> = {
	type: "sync";
	enter?: SyncAction<E>;
	exit?: SyncAction<E>;
	transitions: Partial<Record<E["type"], Transition<S, E>>>;
};

export type AsyncActionStateNode<S extends States, E extends Events> = {
	type: "async";
	enter: AsyncAction<E>;
	transitions: Record<"resolve", Transition<S, E>> & Partial<Record<"reject", Transition<S, E>>>;
};

export type StateNode<S extends States, E extends Events> = SyncActionStateNode<S, E> | AsyncActionStateNode<S, E>;

type TransitionElements<S extends States, E extends Events> = {
	stateNode: SyncActionStateNode<S, E>;
	transition: Transition<S, E>;
	nextStateNode: StateNode<S, E>;
};

export type StateMachineDefinition<S extends States, E extends Events> = {
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
export class FSM<S extends States, E extends Events> {
	private def: StateMachineDefinition<S, E>;
	private state: S;
	private isProcessing = false;

	constructor(def: StateMachineDefinition<S, E>) {
		this.def = def;
		this.state = def.initialState;
	}

	getState(): S {
		return this.state;
	}

	dispatch(event: E): void {
		if (this.isProcessing) {
			// We ignore events if we're already processing instead of enqueuing them
			// because we don't want an event to be processed on the wrong state.
			// We also avoid the race condition of firing multiple events on the same
			// state - we don't have to discern which event caused a transition. We
			// just know it was the first one that was dispatched.
			return;
		}

		this.startProcessing();

		if (this.willCauseTransition(event)) {
			this.process(event);
		} else {
			// **Only** stop processing if no transition will be caused. We defer
			// the responsibility of stopping processing to processEvent.
			// This is necessary because processEvent may kick off background tasks
			// from asynchronous states, and we only want to signal that processing
			// stopped when those asynchronous states finish transitioning.
			this.stopProcessing();
		}
	}

	private startProcessing() {
		this.isProcessing = true;
	}

	private stopProcessing() {
		this.isProcessing = false;
	}

	private process(event: E) {
		const { stateNode, transition, nextStateNode } = this.getTransitionElements(event);

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

	private getTransitionElements(event: E): TransitionElements<S, E> {
		const stateNode = this.getStateNode(this.state);
		if (stateNode.type !== "sync") {
			error(`expected sync state node for state '${this.state}', got state node type: ${stateNode.type}`);
		}

		const transition = this.getTransition(event, stateNode);
		if (t.nil(transition)) {
			error(`event '${event.type}' will not cause a transition from state: '${this.state}'`);
		}

		const nextState = this.getNextState(event, transition);
		const nextStateNode = this.getStateNode(nextState);

		return { stateNode, transition, nextStateNode };
	}

	private willCauseTransition(event: E): boolean {
		try {
			this.getTransitionElements(event);
		} catch (e) {
			return false;
		}
		return true;
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
		return this.isComputedState(target) ? target(event) : target;
	}

	private isComputedState(value: S | ComputedState<S, E>): value is ComputedState<S, E> {
		return t.callback(value);
	}

	private doTransition(event: E, transition: Transition<S, E>) {
		transition.effect?.(event);
		const nextState = this.getNextState(event, transition);
		this.state = nextState;
	}

	private doEnterSync(event: E, stateNode: SyncActionStateNode<S, E>): void {
		stateNode.enter?.(event);
		this.stopProcessing();
	}

	private async doEnterAsyncAndTransition(event: E, stateNode: AsyncActionStateNode<S, E>): Promise<void> {
		let transition: Transition<S, E>;
		try {
			await stateNode.enter(event);
			transition = stateNode.transitions.resolve;
		} catch (e) {
			if (t.nil(stateNode.transitions.reject)) {
				// It's in limbo because it never transitions out of the async node state.
				const message = `To fix this, define a 'reject' transition for state '${this.state}' and/or fix the error that rejected the promise. FSM is in limbo, it will not process anymore events indefinitely, caused by:\n\n${e}`;
				error(message);
			}
			transition = stateNode.transitions.reject;
		}

		this.doTransition(event, transition);

		const nextState = this.getNextState(event, transition);
		const nextStateNode = this.getStateNode(nextState);
		switch (nextStateNode.type) {
			case "sync":
				this.doEnterSync(event, nextStateNode);
				break;
			case "async":
				// TODO(jared) I'm not sure if this yields a proper tail call.
				// https://www.lua.org/pil/6.3.html
				// If there's a endless loop of async actions, this may cause
				// a stack overflow.
				return await this.doEnterAsyncAndTransition(event, nextStateNode);
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
