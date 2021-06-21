import { CameraController } from "client/camera/CameraController";
import { GuiController } from "client/gui/GuiController";
import { LasersController } from "client/lasers/LasersController";
import { PingController } from "client/ping/PingController";
import { TimeController } from "client/time/TimeController";

// controllers
new PingController().init();
new CameraController().init();
new GuiController().init();
new LasersController().init();
new TimeController().init();
