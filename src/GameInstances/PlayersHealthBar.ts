import { AnchorComp, ColorComp, GameObj, OpacityComp, OutlineComp, PosComp, ZComp, KAPLAYCtxT, RectComp, TextComp, FixedComp, StayComp } from "kaplay";
import { IHealthPlayerComp } from "../Entities/CPlayer";


export class PlayersHealthBar {
  protected healthBar: GameObj<PosComp | AnchorComp | OpacityComp | ZComp | OutlineComp | RectComp>;
  protected healthBarFill: GameObj<RectComp |ColorComp | AnchorComp | PosComp | FixedComp | StayComp | ZComp>;
  protected text: GameObj<TextComp | ColorComp | AnchorComp | PosComp | FixedComp | StayComp | ZComp>;
  protected width: number = 32 * 11;
  protected padding: number = 32 * 2;

  constructor(
    protected k: KAPLAYCtxT,
    protected playerInstance: IHealthPlayerComp,
  ) {
    this.healthBar = k.add([
      k.rect(this.width, this.padding, {
        radius: 15,
        fill: false,
      }),
      k.fixed(),
      k.stay(),
      k.pos(k.width() - 32, 32),
      k.anchor('topright'),
      k.z(100),
      k.outline(3, k.WHITE),
      k.opacity(1),
    ]);

    this.healthBarFill = this.healthBar.add([
      k.rect(this.width, this.padding, {
        radius: 15,
      }),
      k.anchor('left'),
      k.color(k.RED),
      k.pos(k.vec2(-this.width, 32)),
      k.fixed(),
      k.stay(),
      k.z(99),
    ]);

    this.text = this.healthBar.add([
      k.text(`${this.playerInstance.player.hp} / ${this.playerInstance.player.maxHP}`, {
        size: 36,
      }),
      k.color(k.WHITE),
      k.anchor('center'),
      k.pos(k.vec2(-this.width / 2, 32)),
      k.fixed(),
      k.stay(),
      k.z(101),
    ]);

    this.playerInstance.player.onHurt(() => {
      this.healthBarFill.width = (this.playerInstance.player.hp / this.playerInstance.player.maxHP) * this.width;
      this.text.text = `${this.playerInstance.player.hp} / ${this.playerInstance.player.maxHP}`;
    });

    this.playerInstance.player.onHeal(() => {
      this.healthBarFill.width = (this.playerInstance.player.hp / this.playerInstance.player.maxHP) * this.width;
      this.text.text = `${this.playerInstance.player.hp} / ${this.playerInstance.player.maxHP}`;
    });

    this.playerInstance.player.onDeath(() => {
      this.text.text = 'Skill issued';
    });
  };
};