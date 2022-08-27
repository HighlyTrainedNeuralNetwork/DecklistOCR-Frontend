<script>
let imageBase64 = null;
let loaded = false;
// let loaded = true;
let executionTime = 0;
// let executionTime = 7.55;
let cardsFound = 0;
// let cardsFound = 74;
let decklist = "";
// let decklist = "2 Hall of Storm Giants \n4 Consider \n4 Ledger Shredder \n4 Pieces of the Puzzle \n4 Arclight Phoenix \n4 Treasure Cruise \n4 Spirebluff Canal \n3 Fiery Impulse \n4 Lightning Axe \n";
function readImage(input) {
    let file = input.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        imageBase64 = e.target.result.split(',')[1];
    }
}
async function uploadImage() {
    console.log("trigger uploadImage");
    loaded = false;
    try {
      const response = await fetch("/scan",
      {
        method: "POST",
        body: imageBase64,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.text();
      executionTime = data.split("\n")[0].substring(0,4);
      cardsFound = data.split("\n")[1].split("\n")[0];
      decklist = data.split("\n");
      decklist.splice(0,2);
      decklist = decklist.join("\n");
      loaded = true;
    } catch (error) {
        console.log(error);
    }
}
</script>


<h1 class="font-semibold text-4xl relative pb-6 text-center">Turn MTGO Deck Pictures Into Decklists</h1>

<div class="pb-6 text-center">
  <input type="file" accept=".jpg, .jpeg, .png" on:change={readImage} class="h-10 px-6 font-semibold rounded-md file:bg-gray-300 file:border-1"/>
  <button on:click={uploadImage} disabled={imageBase64 == null} class="h-10 px-6 font-semibold rounded-md border border-black text-slate-900 bg-gray-300 disabled:bg-white">Scan Image</button>
</div>

{#if loaded}
    <div class="text-center">
      <h2>Found {cardsFound} cards in {executionTime} seconds</h2>
    </div>
    <div contenteditable="true" spellcheck="false" bind:innerHTML="{decklist}" class="whitespace-pre-wrap pb-6 w-2/5	ml-auto mr-auto">
    </div>
{/if}

<p class="text-center absolute inset-x-0 bottom-2 text-center">You can bug reports by <a href="https://github.com/HighlyTrainedNeuralNetwork/DecklistOCR-Frontend/issues/new">opening an issue on GitHub</a>.
</p>