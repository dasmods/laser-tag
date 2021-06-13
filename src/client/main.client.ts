import { GuiController } from "client/gui/GuiController";
import { LasersController } from "client/lasers/LasersController";
import { TimeController } from "client/time/TimeController";
import { AckRemoteFunction } from "shared/RemoteFunctions/Ack/Ack";

// controllers
new GuiController().init();
new LasersController().init();
new TimeController().init();

// remote functions
new AckRemoteFunction().init();
