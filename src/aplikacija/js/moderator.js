/**
 * Moderator stranica - moderator.html
 */

/**
 * Pripremi formu za kreiranje kolekcije
 */
function pripremiFormaKreiranjaKolekcije() {
  const forma = document.getElementById("formaKreiranjaKolekcije");
  if (!forma) return;

  forma.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nazivKolekcije = document
      .getElementById("nazivKolekcije")
      .value.trim();
    const opisKolekcije = document.getElementById("opisKolekcije").value.trim();
    const vidljivostKolekcije = document.getElementById(
      "vidljivostKolekcije",
    ).value;

    if (!nazivKolekcije) {
      alert("Molimo unesite naziv kolekcije");
      return;
    }

    try {
      const odgovor = await fetch("/api/kolekcije", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naziv: nazivKolekcije,
          opis: opisKolekcije,
          javna: vidljivostKolekcije === "javna",
        }),
      });

      if (odgovor.ok) {
        alert("Kolekcija uspješno kreirana");
        forma.reset();
        ucitajKolekcijeModeratora();
      } else {
        alert("Greška pri kreiranju kolekcije");
      }
    } catch (err) {
      console.error("Greška pri kreiranju:", err);
      alert("Greška pri kreiranju kolekcije");
    }
  });
}

/**
 * Učitaj sve kolekcije za moderatora
 */
async function ucitajKolekcijeModeratora() {
  try {
    const odgovor = await fetch("/api/kolekcije/sve");

    if (!odgovor.ok) {
      console.error("Greška pri učitavanju kolekcija");
      return;
    }

    const kolekcije = await odgovor.json();
    prikaziKolekcijeModeratora(kolekcije);
  } catch (err) {
    console.error("Greška pri učitavanju kolekcija:", err);
  }
}

/**
 * Prikaži kolekcije u tablici
 */
function prikaziKolekcijeModeratora(kolekcije) {
  const tablica = document.getElementById("tijeloTabelaKolekcija");
  if (!tablica) return;

  tablica.innerHTML = "";

  if (kolekcije.length === 0) {
    tablica.innerHTML = '<tr><td colspan="3">Nema kolekcija</td></tr>';
    return;
  }

  kolekcije.forEach((kolekcija, index) => {
    const red = document.createElement("tr");
    red.id = `stavkaKolekcije${index + 1}`;

    const korisniciHTML = (kolekcija.korisnici || [])
      .map((k) => `<li>${k.korisnickoIme}</li>`)
      .join("");

    red.innerHTML = `
            <td class="naziv">${kolekcija.naziv}</td>
            <td class="korisnici" id="ćeliaKorisnici${index + 1}">
                <ul>${korisniciHTML || "<li>Nema dodijeljenih korisnika</li>"}</ul>
            </td>
            <td class="akcije">
                <button class="gumbUrediBrisanje" onclick="urediKolekciju(${kolekcija.id})">Uredi</button>
                <button class="gumbBrisanje" onclick="obrisiKolekciju(${kolekcija.id})">Obriši</button>
            </td>
        `;

    tablica.appendChild(red);
  });
}

/**
 * Obriši kolekciju
 */
async function obrisiKolekciju(kolekcijaId) {
  if (!confirm("Jeste li sigurni da želite obrisati ovu kolekciju?")) return;

  try {
    const odgovor = await fetch(`/api/kolekcije/${kolekcijaId}`, {
      method: "DELETE",
    });

    if (odgovor.ok) {
      ucitajKolekcijeModeratora();
    } else {
      alert("Greška pri brisanju");
    }
  } catch (err) {
    console.error("Greška pri brisanju:", err);
  }
}

/**
 * Uredi kolekciju
 */
async function urediKolekciju(kolekcijaId) {
  alert("Funkcionalnost za uređivanje će biti implementirana");
}

/**
 * Učitaj korisnike za dodjelu
 */
async function ucitajKorisnike() {
  try {
    const odgovor = await fetch("/api/korisnici");

    if (!odgovor.ok) {
      console.error("Greška pri učitavanju korisnika");
      return;
    }

    const korisnici = await odgovor.json();
    popuniOdabirKorisnika(korisnici);
  } catch (err) {
    console.error("Greška pri učitavanju korisnika:", err);
  }
}

/**
 * Popuni odabir korisnika
 */
function popuniOdabirKorisnika(korisnici) {
  const odabir = document.getElementById("odabirKorisnika");
  if (!odabir) return;

  korisnici.forEach((korisnik) => {
    const opcija = document.createElement("option");
    opcija.value = korisnik.id;
    opcija.textContent = korisnik.korisnickoIme;
    odabir.appendChild(opcija);
  });
}

/**
 * Učitaj kolekcije za dodjelu
 */
async function ucitajKolekcijezaDodjelu() {
  try {
    const odgovor = await fetch("/api/kolekcije/sve");

    if (!odgovor.ok) {
      return;
    }

    const kolekcije = await odgovor.json();
    popuniOdabirKolekcije(kolekcije);
  } catch (err) {
    console.error("Greška pri učitavanju kolekcija:", err);
  }
}

/**
 * Popuni odabir kolekcija
 */
function popuniOdabirKolekcije(kolekcije) {
  const odabir = document.getElementById("odabirKolekcije");
  if (!odabir) return;

  kolekcije.forEach((kolekcija) => {
    const opcija = document.createElement("option");
    opcija.value = kolekcija.id;
    opcija.textContent = kolekcija.naziv;
    odabir.appendChild(opcija);
  });
}

/**
 * Pripremi formu za dodjelu korisnika
 */
function pripremiFormaDodjeleKorisnika() {
  const forma = document.getElementById("formaDodjeleKorisnika");
  if (!forma) return;

  forma.addEventListener("submit", async (e) => {
    e.preventDefault();

    const korisnikId = document.getElementById("odabirKorisnika").value;
    const kolekcijaId = document.getElementById("odabirKolekcije").value;

    if (!korisnikId || !kolekcijaId) {
      alert("Molimo odaberite korisnika i kolekciju");
      return;
    }

    try {
      const odgovor = await fetch("/api/korisnici-kolekcije", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ korisnikId, kolekcijaId }),
      });

      if (odgovor.ok) {
        alert("Korisnik uspješno dodijeljen kolekciji");
        forma.reset();
        ucitajKolekcijeModeratora();
      } else {
        alert("Greška pri dodjeljivanju");
      }
    } catch (err) {
      console.error("Greška pri dodjeljivanju:", err);
      alert("Greška pri dodjeljivanju");
    }
  });
}

// Inicijalizacija pri učitavanju
document.addEventListener("DOMContentLoaded", () => {
  pripremiFormaKreiranjaKolekcije();
  pripremiFormaDodjeleKorisnika();
  ucitajKolekcijeModeratora();
  ucitajKorisnike();
  ucitajKolekcijezaDodjelu();
});
