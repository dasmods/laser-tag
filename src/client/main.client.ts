import { GuiController } from "client/gui/GuiController";
import { LasersController } from "client/lasers/LasersController";
import { TimeController } from "client/time/TimeController";

// controllers
new GuiController().init();
new LasersController().init();
new TimeController().init();
