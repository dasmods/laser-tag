abstract class Controller {
	abstract init<T>(...args: T[]): void;
}

export abstract class ClientController extends Controller {}

export abstract class ServerController extends Controller {}
