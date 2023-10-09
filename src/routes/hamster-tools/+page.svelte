<script lang="ts">
  import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import { Keyboard } from "$lib/Hamster/Hamster";
  import KbdEdit from "$lib/Hamster/Keyboard.svelte";

  /** 標簽組活動編號 */
  var selected: number = 0;
  /** 已添加的鍵盤列表 */
  var keyboards: Keyboard[] = [new Keyboard()];
  /** 當前正在編輯的鍵盤, 在標簽組焦點轉移或鍵盤增删時更新 */
  $: keyboard = keyboards[selected];

  /** 新增鍵盤 */
  function newKeyboard(): void {
    // 在列表末位追加
    keyboards = [...keyboards, new Keyboard()];
    // 聚焦到新增的鍵盤
    selected = keyboards.length > 0 ? keyboards.length - 1 : 0;
  }
  /** 删除正在編輯的鍵盤 */
  function delKeyboard(): void {
    // 從列表中移除當前聚焦的鍵盤
    keyboards = keyboards
      .slice(0, selected)
      .concat(keyboards.slice(selected + 1));
    // 聚焦到下一鍵盤, 若不存在則最末一個鍵盤
    if (selected > 0 && selected >= keyboards.length) {
      selected = keyboards.length - 1;
    }
  }
</script>

<TabGroup class="px-2 py-4" justify="justify-center" hover="">
  <!-- 標簽欄 -->
  {#each keyboards as keyboard, index (keyboard.id)}
    <Tab
      class="hover:variant-ghost"
      bind:group={selected}
      name={keyboard.name}
      value={index}
    >
      {keyboard.name}
    </Tab>
  {/each}

  <!-- 「新增」按鈕 -->
  <button
    class="btn rounded-t-md rounded-b-none hover:variant-ghost"
    on:click={newKeyboard}
  >
    <Icon icon="mdi:plus" />
  </button>

  <!-- 内容面板 -->
  <svelte:fragment slot="panel">
    {#if keyboard}
      <!-- 編輯當前鍵盤 -->
      <KbdEdit bind:keyboard on:delete={delKeyboard} />
    {/if}
  </svelte:fragment>
</TabGroup>
