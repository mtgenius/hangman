var hangman = {
		answer: null,
		check: function(letter) {

			// Check if this is a new guess or not.
			if (
				this.answer &&
				this.elements.spans[letter].className != "guessed" &&
				!this.gameOver
			) {
				this.elements.spans[letter].className = "guessed";

				// Check Card Name for this letter.
				var found = false;
				for (var x = 0; x < this.answer.length; x++) {
					if (this.answer.toLowerCase().charAt(x) == letter) {
						found = true;

						// C _ T   =>   C A T
						this.elements.answer.innerText =
							this.elements.answer.innerText.substr(0, x) +
							this.answer.charAt(x) +
							this.elements.answer.innerText.substr(x + 1);
					}
				}

				// Incorrect guess.
				if (!found) {
					this.errors++;
					this.elements.hangman.style.setProperty("background-position", "-" + (this.errors * 256) + "px 0");
				}

				// Finished game.
				if (
					this.errors == 6 ||
					this.elements.answer.innerText.toLowerCase() == this.answer
				) {
					this.elements.end.style.setProperty("background-image", "url('//i.mtgeni.us/cards/" + this.id + ".jpg')");
					this.elements.end.style.setProperty("display", "block");
					this.gameOver = true;
				}
				return found;
			}
			return -1;
		},
		elements: {
			answer:  document.getElementById("hangman-answer"),
			clue:    document.getElementById("hangman-clue"),
			end:     document.getElementById("hangman-end"),
			hangman: document.getElementById("hangman-graphic"),
			letters: document.getElementById("hangman-letters"),
			spans:   []
		},
		errors: 0,
		gameOver: false,
		id: null,
		init: function(answer, clue, id) {

			// Can't make a new request for 2.5 seconds to prevent accidental double-pressing/spam requests.
			setTimeout("window.hangman.loading = false;", 2500);
			this.answer = answer;
			this.elements.answer.innerText  = answer.replace(/[a-z]/g, "_");
			this.elements.clue.innerText    = clue;
			this.elements.end.style.setProperty("display", "none");
			this.elements.hangman.style.setProperty("background-position", "0 0");
			this.errors = 0;
			this.gameOver = false;
			this.id = id;
			for (var x = 0; x < 26; x++)
				this.elements.spans["abcdefghijklmnopqrstuvwxyz".charAt(x)].className = "";
			return 0;
		},
		loading: false,
		newGame: function() {
			if (!this.loading) {
				this.loading = true;
				var script = document.createElement("script");
				script.setAttribute("src", "/hangman.js");
				script.setAttribute("type", "text/javascript");
				document.getElementsByTagName("head").item(0).appendChild(script);
				return true;
			}
			return false;
		}
	};



// Letter Selection
for (var x = 0; x < 26; x++) {
	var letter = "abcdefghijklmnopqrstuvwxyz".charAt(x);
	hangman.elements.spans[letter] = document.createElement("span");
	hangman.elements.spans[letter].setAttribute("id", "letter-" + letter);
	hangman.elements.spans[letter].appendChild(document.createTextNode(letter));
	hangman.elements.spans[letter].addEventListener(
		"click",
		function() {
			window.hangman.check(this.innerText.toLowerCase());
			return false;
		}
	);
	hangman.elements.letters.appendChild(hangman.elements.spans[letter]);
}



// Key Binding
window.addEventListener(
	"keydown",
	function(e) {

		// A-Z only
		if (
			e.keyCode >= 65 &&
			e.keyCode <= 90
		)
			return window.hangman.check("abcdefghijklmnopqrstuvwxyz".charAt(e.keyCode - 65));

		// space
		if (e.keyCode == 32)
			return hangman.newGame();
	}
);

document.forms.hangman.addEventListener(
	"submit",
	function(e) {
		e.preventDefault();
		return hangman.newGame();
	}
);

window.addEventListener("load", hangman.newGame);