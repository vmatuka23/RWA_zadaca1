/**
 * Multimedijski sadržaj stranica - sadrzaj.html
 */

/**
 * Pripremi formu za TMDB pretragu
 */
function pripremiFormaPretrageTMDB() {
  const forma = document.getElementById("formaPretrageTMDB");
  if (!forma) return;

  forma.addEventListener("submit", async (e) => {
    e.preventDefault();

    const unosPretrage = document.getElementById("unosPretrage").value.trim();

    if (!unosPretrage) {
      alert("Molimo unesite nešto za pretragu");
      return;
    }

    await pretragaTMDB(unosPretrage);
  });
}

/**
 * Provetraga TMDB-a
 */
async function pretragaTMDB(uzorak) {
  try {
    const odgovor = await fetch(
      `/api/tmdb/search?q=${encodeURIComponent(uzorak)}`,
    );

    if (!odgovor.ok) {
      alert("Greška pri pretrazi");
      return;
    }

    const rezultati = await odgovor.json();
    prikaziRezultatePretrage(rezultati);
  } catch (err) {
    console.error("Greška pri pretrazi TMDB-a:", err);
    alert("Greška pri pretrazi");
  }
}

/**
 * Prikaži rezultate pretrage
 */
function prikaziRezultatePretrage(rezultati) {
  const kontejner = document.getElementById("kontejnerRezultataPretrage");
  if (!kontejner) return;

  kontejner.innerHTML = "";

  if (!rezultati || rezultati.length === 0) {
    kontejner.innerHTML = "<p>Nema rezultata</p>";
    return;
  }

  rezultati.forEach((rezultat, index) => {
    const article = document.createElement("article");
    article.className = "stavkaRezultataPretrage";
    article.id = `rezultatPretrage${index + 1}`;

    article.innerHTML = `
            <img src="${rezultat.slika || "#"}" alt="Slika rezultata" class="slikaRezultata">
            <h3 class="nazivRezultata">${rezultat.naziv}</h3>
            ${rezultat.video ? `<a href="${rezultat.video}" class="linkVideoYoutube" target="_blank">Gledaj video</a>` : ""}
            <button class="gumbDodajUKolekciju" onclick="prikaziDialogKolekcija(${rezultat.id})">Dodaj u kolekciju</button>
        `;

    kontejner.appendChild(article);
  });
}

/**
 * Prikaži dialog za dodavanje u kolekciju
 */
async function prikaziDialogKolekcija(multimedijaId) {
  try {
    const odgovor = await fetch("/api/kolekcije");

    if (!odgovor.ok) {
      alert("Greška pri učitavanju kolekcija");
      return;
    }

    const kolekcije = await odgovor.json();

    const odabirKolekcije = prompt(
      "Odaberi kolekciju za dodavanje:\n" +
        kolekcije.map((k, i) => `${i + 1}. ${k.naziv}`).join("\n") +
        "\n\nUnesite broj:",
    );

    if (odabirKolekcije) {
      const index = parseInt(odabirKolekcije) - 1;
      if (index >= 0 && index < kolekcije.length) {
        await dodajUKolekciju(multimedijaId, kolekcije[index].id);
      }
    }
  } catch (err) {
    console.error("Greška pri preuzimanju kolekcija:", err);
  }
}

/**
 * Dodaj multimediju u kolekciju
 */
async function dodajUKolekciju(multimedijaId, kolekcijaId) {
  try {
    const odgovor = await fetch(`/api/kolekcije/${kolekcijaId}/multimedija`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ multimedijaId }),
    });

    if (odgovor.ok) {
      alert("Datoteka dodana u kolekciju");
    } else {
      alert("Greška pri dodavanju u kolekciju");
    }
  } catch (err) {
    console.error("Greška pri dodavanju:", err);
  }
}

/**
 * Pripremi formu za učitavanje multimedije
 */
function pripremiFormaUcitavanja() {
  const forma = document.getElementById("formaUcitavanja");
  if (!forma) return;

  forma.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datoteka = document.getElementById("ucitavanjeDatoteke").files[0];
    const naslov = document.getElementById("naslovMultimedije").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const opis = document.getElementById("opisMultimedije").value.trim();
    const godina = document.getElementById("godina").value;
    const kategorija = document.getElementById("kategorija").value.trim();

    if (!datoteka || !naslov) {
      alert("Odaberite datoteku i unesite naslov");
      return;
    }

    const formData = new FormData();
    formData.append("datoteka", datoteka);
    formData.append("naslov", naslov);
    formData.append("autor", autor);
    formData.append("opis", opis);
    formData.append("godina", godina);
    formData.append("kategorija", kategorija);

    try {
      const odgovor = await fetch("/api/multimedija/ucitaj", {
        method: "POST",
        body: formData,
      });

      if (odgovor.ok) {
        alert("Multimedija uspješno učitana");
        forma.reset();
      } else {
        alert("Greška pri učitavanju");
      }
    } catch (err) {
      console.error("Greška pri učitavanju:", err);
      alert("Greška pri učitavanju");
    }
  });
}

// Inicijalizacija pri učitavanju
document.addEventListener("DOMContentLoaded", () => {
  pripremiFormaPretrageTMDB();
  pripremiFormaUcitavanja();
});
