<script>
import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
const progress = tweened(0, {
		duration: 9000,
		easing: cubicOut
	});
let fileInput;
let imageBase64 = null;
let error = "";
let loading = false;
let executionTime = 0;
let cardsFound = 0;
let decklist = "";

function readImage(input) {
  let file = input.target.files[0];
  imageBase64 = null;
  if (file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        imageBase64 = e.target.result.split(',')[1];
    }
  }
}
async function uploadImage() {
    fileInput.value = "";
    loading = true;
    error = "";
    progress.set(1);
    try {
      const response = await fetch("/scan",
      {
        method: "POST",
        body: imageBase64,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      imageBase64 = null;
      if (response.status != 200) {
        error = "Something went unexpectedly wrong."
        loading = false;
        return error
      }
      const data = await response.text();
      executionTime = data.split("\n")[0].substring(0,4);
      cardsFound = data.split("\n")[1].split("\n")[0];
      if (cardsFound == 0) {
        error = "No cards could be found in this image."
        loading = false;
        return error
      }
      decklist = data.split("\n");
      decklist.splice(0,2);
      decklist = decklist.join("\n");
      loading = false;
      progress.set(0);
    } catch (error) {
      error = "Something went unexpectedly wrong."
      return error
    }
} 
async function copyToClipboard() {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText)
    return navigator.clipboard.writeText(decklist);
  return Promise.reject('The Clipboard API is not available.');
}
</script>


<h1 class="font-semibold text-4xl relative pb-6 text-center">Turn MTGO Deck Pictures Into Decklists</h1>

<div class="pb-6 text-center">
  <input type="file" accept=".jpg, .jpeg, .png" on:change={readImage} class="h-10 px-6 font-semibold rounded-md file:bg-gray-300 file:border-1" bind:this={fileInput}/>
  <button on:click={uploadImage} disabled={imageBase64 == null} class="h-10 px-6 font-semibold rounded-md border border-black text-slate-900 bg-gray-300 disabled:bg-white">Scan Image</button>
</div>

{#if loading}
<progress class="w-full bg-orange orange" value={$progress}></progress>
{/if}

{#if error}
  <div class="text-center">
    <p>{error}</p>
  </div>
{:else if !loading && cardsFound}
    <div class="text-center">
      <p>Found {cardsFound} cards in {executionTime} seconds</p>
    </div>
    <div class="group">
      <div class="w-2/5 ml-auto mr-auto relative border-black rounded-md border-2">
        <div contenteditable="true" spellcheck="false" bind:innerHTML="{decklist}" class="max-h-128 overflow-y-auto whitespace-pre-wrap outline-none">
        </div>
        <input type="image" src="/content_paste.png" alt="copyToClipboard" on:click={copyToClipboard} class="absolute top-0 right-6 hidden group-hover:block">
      </div>
    </div>
{/if}

<p class="text-center absolute inset-x-0 bottom-2 text-center">You can submit bug reports by <a href="https://github.com/HighlyTrainedNeuralNetwork/DecklistOCR-Frontend/issues/new" class="underline">opening an issue on GitHub</a>.
</p>