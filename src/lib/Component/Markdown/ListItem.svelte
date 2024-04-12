<script lang="ts">
    // export var text: string;
    export var task: boolean;
    export var checked: boolean;
</script>

<li>
    {#if task}
        <span>
            <input type="checkbox" disabled {checked} class="checkbox" />
            <span>
                <slot />
            </span>
        </span>
    {:else}
        <slot />
    {/if}
</li>
