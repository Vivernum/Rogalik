import kaplay from "kaplay";
import { createPlayer } from "./Entities/Player";
import { createAk } from "./Weapons/ak";

const k = kaplay({
  width: 800,
  height: 400,
  letterbox: true,
});

k.loadRoot("./"); // A good idea for Itch.io publishing later

k.add([
    k.pos(0, 0),
    k.rect(k.width(), 20),
    k.area(),
    k.body({ isStatic: true }),
    k.color(k.rgb(128, 128, 128)),
    "wall",
]);

k.add([
    k.pos(0, k.height() - 20),
    k.rect(k.width(), 20),
    k.area(),
    k.body({ isStatic: true }),
    k.color(k.rgb(128, 128, 128)),
    "wall",
]);

k.add([
    k.pos(0, 0),
    k.rect(20, k.height()),
    k.area(),
    k.body({ isStatic: true }),
    k.color(k.rgb(128, 128, 128)),
    "wall",
]);

k.add([
    k.pos(k.width() - 20, 0),
    k.rect(20, k.height()),
    k.area(),
    k.body({ isStatic: true }),
    k.color(k.rgb(128, 128, 128)),
    "wall",
]);

const player = createPlayer(k);
const ak = createAk(k, player);