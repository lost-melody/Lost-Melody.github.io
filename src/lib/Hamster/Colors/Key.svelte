<script lang="ts">
    import type { ColorSchema } from "$lib/Hamster/Colors/HamsterColors";

    export var key: string;
    export var swipe: string = " ";
    export var width: number = 10;
    export var schema: ColorSchema;

    var pressed = false;
    const onClick = () => {
        pressed = !pressed;
    };
</script>

<div style={`width: ${width}%;`} class="p-1 h-12">
    <button
        on:click={onClick}
        style={`
            background-color: ${
                pressed
                    ? schema.button_pressed_back_color.rgba()
                    : schema.button_back_color.rgba()
            };
            border-radius: ${schema.corner_radius}px;
            border-color: ${schema.border_color.rgba()};
        `}
        class="w-full h-full border relative"
    >
        <div
            style={`
                color: ${schema.button_swipe_front_color.rgba()};
            `}
            class="w-full h-[20%] absolute top-0 align-center text-center text-xs"
        >
            {swipe}
        </div>
        <div
            style={`
                color: ${
                    pressed
                        ? schema.button_pressed_front_color.rgba()
                        : schema.button_front_color.rgba()
                };
            `}
            class="w-full h-[80%] absolute top-[20%] text-center text-2xl"
        >
            {key.toUpperCase()}
        </div>
    </button>
</div>
