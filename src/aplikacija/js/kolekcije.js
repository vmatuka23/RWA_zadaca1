/**
 * Kolekcije stranica - kolekcije.html
 */

/**
 * Učitaj kolekcije korisnika
 */
async function ucitajKolekcije() {
  try {
    const odgovor = await fetch("/api/kolekcije");

    if (!odgovor.ok) {
      console.error("Greška pri učitavanju kolekcija");
      return;
    }

    const kolekcije = await odgovor.json();
    prikaziKolekcije(kolekcije);
  } catch (err) {
    console.error("Greška pri učitavanju kolekcija:", err);
  }
}

/**
 * Prikaži kolekcije u DOM-u
 */
function prikaziKolekcije(kolekcije) {
  const kontejner = document.getElementById("kontejnerMojihKolekcija");
  if (!kontejner) return;

  // Očisti postojeće stavke
  kontejner.innerHTML = "";

  if (kolekcije.length === 0) {
    kontejner.innerHTML =
      '<p>Nemate kolekcija. <a href="#" onclick="prikaziFormuKreiranja()">Kreirajte prvu</a></p>';
    return;
  }

  kolekcije.forEach((kolekcija) => {
    const article = document.createElement("article");
    article.className = "stavkaKorisnickeKolekcije";
    article.id = `kolekcija${kolekcija.id}`;

    article.innerHTML = `
            <img src="${kolekcija.slike?.featured || "#"}" alt="Slika kolekcije" class="slikaKolekcije">
            <h2 class="nazivKolekcije">${kolekcija.naziv}</h2>
            <p class="statusKolekcije">${kolekcija.javna ? "Javna" : "Privatna"}</p>
            <button class="gumbOtvoriKolekciju" onclick="prikaziDetaljeKolekcije(${kolekcija.id})">Otvori kolekciju</button>
        `;

    kontejner.appendChild(article);
  });
}

/**
 * Prikaži detalje odabrane kolekcije
 */
async function prikaziDetaljeKolekcije(kolekcijaId) {
  try {
    const odgovor = await fetch(`/api/kolekcije/${kolekcijaId}`);

    if (!odgovor.ok) {
      alert("Greška pri učitavanju detalja kolekcije");
      return;
    }

    const kolekcija = await odgovor.json();
    ucitajMultimedijeKolekcije(kolekcijaId);
  } catch (err) {
    console.error("Greška pri učitavanju detalja:", err);
  }
}

/**
 * Učitaj multimediju kolekcije
 */
async function ucitajMultimedijeKolekcije(kolekcijaId) {
  try {
    const odgovor = await fetch(`/api/kolekcije/${kolekcijaId}/multimedija`);

    if (!odgovor.ok) {
      console.error("Greška pri učitavanju multimedije");
      return;
    }

    const multimedije = await odgovor.json();
    prikaziMultimediju(multimedije);
  } catch (err) {
    console.error("Greška pri učitavanju multimedije:", err);
  }
}

/**
 * Prikaži multimediju u tablici
 */
function prikaziMultimediju(multimedije) {
  const tablica = document.getElementById("tijeloTabeleMulimedija");
  if (!tablica) return;

  tablica.innerHTML = "";

  multimedije.forEach((stavka, index) => {
    const red = document.createElement("tr");
    red.id = `stavkaMultimedija${index + 1}`;

    red.innerHTML = `
            <td>${stavka.naslov}</td>
            <td>${stavka.autor || "N/A"}</td>
            <td>${stavka.datum || "N/A"}</td>
            <td>${stavka.velicina || "N/A"}</td>
            <td>${stavka.tip || "N/A"}</td>
            <td>
                <button class="gumbUrediBrisanje" onclick="obrisiMultimediju(${stavka.id})">Obriši</button>
            </td>
        `;

    tablica.appendChild(red);
  });
}

/**
 * Obriši multimediju
 */
async function obrisiMultimediju(multimedijaId) {
  if (!confirm("Jeste li sigurni da želite obrisati ovu datoteku?")) return;

  try {
    const odgovor = await fetch(`/api/multimedija/${multimedijaId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (odgovor.ok) {
      document.getElementById(`stavkaMultimedija${multimedijaId}`)?.remove();
    } else {
      alert("Greška pri brisanju");
    }
  } catch (err) {
    console.error("Greška pri brisanju:", err);
  }
}

/**
 * Promijeni vidljivost kolekcije
 */
async function promijeniVidljivostKolekcije(kolekcijaId) {
  try {
    const odgovor = await fetch(`/api/kolekcije/${kolekcijaId}/vidljivost`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    if (odgovor.ok) {
      ucitajKolekcije();
      alert("Vidljivost kolekcije je promijenjena");
    } else {
      alert("Greška pri promjeni vidljivosti");
    }
  } catch (err) {
    console.error("Greška pri promjeni vidljivosti:", err);
  }
}

// Inicijalizacija pri učitavanju
document.addEventListener("DOMContentLoaded", () => {
  ucitajKolekcije();

  const gumbPromijeniVidljivost = document.getElementById(
    "gumbPromijeniVidljivost",
  );
  if (gumbPromijeniVidljivost) {
    gumbPromijeniVidljivost.addEventListener("click", () => {
      const kolekcijaId = prompt("Unesite ID kolekcije:");
      if (kolekcijaId) promijeniVidljivostKolekcije(kolekcijaId);
    });
  }

  const gumbDodajMultimediju = document.getElementById("gumbDodajMultimediju");
  if (gumbDodajMultimediju) {
    gumbDodajMultimediju.addEventListener("click", () => {
      alert("Funkcionalnost za dodavanje multimedije će biti implementirana");
    });
  }
});
