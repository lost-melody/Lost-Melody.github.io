<script lang="ts">
    import { ActionType, Keyboard } from "./model/keyboardLayout";
    import type { ColorSchema } from "./model/colorSchema";

    export var schema: ColorSchema;
    export var layout: Keyboard;

    const bgBtnDisplay = (actionType: ActionType): boolean => {
        return ![ActionType.none, ActionType.characterMargin].includes(actionType);
    };
</script>

{#each layout.rows as row}
    <div class="flex w-full shrink grow">
        {#each row.keys as key}
            <div
                class="h-full p-px"
                style:width={`${key.autoWidth ? 10 : key.width}%`}
                class:grow={key.autoWidth}
                class:shrink={key.autoWidth}
                class:shrink-0={!key.autoWidth}
            >
                <div
                    style:border-color={bgBtnDisplay(key.action.type) ? schema.border_color.rgba() : ""}
                    style:background-color={bgBtnDisplay(key.action.type) ? schema.button_back_color.rgba() : ""}
                    class:border={bgBtnDisplay(key.action.type)}
                    class="h-full w-full rounded-sm"
                />
            </div>
        {/each}
    </div>
{/each}
