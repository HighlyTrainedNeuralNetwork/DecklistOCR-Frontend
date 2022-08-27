<script>
let imageBase64 = null;
let loaded = false;
let executionTime = 0;
let cardsFound = 0;
let decklist = "";
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

<h1>Turn MTGO Deck Pictures Into Decklists</h1>
<input type="file" accept=".jpg, .jpeg, .png" on:change={readImage} />
<button on:click={uploadImage} disabled={imageBase64 == null}>Scan Image</button>


{#if loaded}
  <div class="executationStatus">
    <h2>Found {cardsFound} cards in {executionTime} seconds</h2>
  </div>
  <div contenteditable="true" spellcheck="false" bind:innerHTML="{decklist}" class="decklistOutput">
  </div>
{/if}

<p>You can submit feedback and bug reports by 
  <a href="https://twitter.com/AndreiKlepatch">sending me a direct message on Twitter</a> or <a href="https://github.com/HighlyTrainedNeuralNetwork/DecklistOCR-Frontend/issues/new">opening an issue on GitHub</a>.
  </p>

<style>
  .decklistOutput {
    white-space: pre-wrap;
  }
</style>

