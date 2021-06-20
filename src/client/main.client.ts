import { CameraController } from "client/camera/CameraController";
import { GuiController } from "client/gui/GuiController";
import { LasersController } from "client/lasers/LasersController";
import { TimeController } from "client/time/TimeController";

// controllers
new CameraController().init();
new GuiController().init();
new LasersController().init();
new TimeController().init();
