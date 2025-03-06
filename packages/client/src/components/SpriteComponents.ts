import { defineComponent, Types } from 'bitecs';

export const Sprite = defineComponent({
    texture: Types.i32,
    animation: Types.i32
});

export const Anim = defineComponent({
    index: Types.i32
});

export const Server = defineComponent({
    id: Types.i32
});

export const NPC = defineComponent({
    id: Types.i32
});

export const BadGuy = defineComponent({
    id: Types.i32
});

export const Position = defineComponent({
    x: Types.f32,
    y: Types.f32
});

export const Velocity = defineComponent({
    x: Types.f32,
    y: Types.f32
});

export const Dialog = defineComponent({
    id: Types.i32
})

export const Player = defineComponent({
    id: Types.i32
});

export const Input = defineComponent();