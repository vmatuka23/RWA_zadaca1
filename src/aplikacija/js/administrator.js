/**
 * Admin stranica za upravljanje korisnicima - korisnici.html
 */

/**
 * Učitaj sve korisnike
 */
async function ucitajSveKorisnike() {
  try {
    const odgovor = await fetch("/api/korisnici");

    if (!odgovor.ok) {
      console.error("Greška pri učitavanju korisnika");
      return;
    }

    const korisnici = await odgovor.json();
    prikaziKorisnike(korisnici);
  } catch (err) {
    console.error("Greška pri učitavanju korisnika:", err);
  }
}

/**
 * Prikaži korisnike u tablici
 */
function prikaziKorisnike(korisnici) {
  const tablica = document.getElementById("tijeloTabelaKorisnika");
  if (!tablica) return;

  tablica.innerHTML = "";

  if (korisnici.length === 0) {
    tablica.innerHTML = '<tr><td colspan="5">Nema korisnika</td></tr>';
    return;
  }

  korisnici.forEach((korisnik, index) => {
    const red = document.createElement("tr");
    red.id = `stavkaKorisnika${index + 1}`;
    red.className = "stavkaKorisnika";
    if (korisnik.blokiran) red.classList.add("blokiran");

    const statusTekst = korisnik.blokiran ? "Blokiran" : "Aktivan";

    red.innerHTML = `
            <td class="korisnickoIme">${korisnik.korisnickoIme}</td>
            <td class="email">${korisnik.email}</td>
            <td class="uloga">${korisnik.uloga}</td>
            <td class="status">${statusTekst}</td>
            <td class="akcije">
                <button class="gumbBlokada" onclick="promijeniBlokadu(${korisnik.id}, ${korisnik.blokiran})">
                    ${korisnik.blokiran ? "Odblokiraj" : "Blokiraj"}
                </button>
                <button class="gumbPromijeniUlogu" onclick="prikaziOpcjeUloge(${korisnik.id}, '${korisnik.uloga}')">
                    Promijeni ulogu
                </button>
            </td>
        `;

    tablica.appendChild(red);
  });
}

/**
 * Promijeni blokadu korisnika
 */
async function promijeniBlokadu(korisnikId, trenutnaBlokada) {
  const novaBlokada = !trenutnaBlokada;

  try {
    const odgovor = await fetch(`/api/korisnici/${korisnikId}/blokada`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blokiran: novaBlokada }),
    });

    if (odgovor.ok) {
      ucitajSveKorisnike();
    } else {
      alert("Greška pri promjeni statusa");
    }
  } catch (err) {
    console.error("Greška pri promjeni statusa:", err);
    alert("Greška pri promjeni statusa");
  }
}

/**
 * Prikaži opcije za promjenu uloge
 */
function prikaziOpcjeUloge(korisnikId, trenutnaUloga) {
  const uloge = ["korisnik", "moderator", "admin"];
  const dostupneUloge = uloge.filter((u) => u !== trenutnaUloga);

  const odabir = prompt(
    `Trenutna uloga: ${trenutnaUloga}\n\nOdaberi novu ulogu:\n` +
      dostupneUloge.map((u, i) => `${i + 1}. ${u}`).join("\n") +
      "\n\nUnesite broj:",
  );

  if (odabir) {
    const index = parseInt(odabir) - 1;
    if (index >= 0 && index < dostupneUloge.length) {
      promijeniUlogu(korisnikId, dostupneUloge[index]);
    }
  }
}

/**
 * Promijeni ulogu korisnika
 */
async function promijeniUlogu(korisnikId, novaUloga) {
  try {
    const odgovor = await fetch(`/api/korisnici/${korisnikId}/uloga`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uloga: novaUloga }),
    });

    if (odgovor.ok) {
      ucitajSveKorisnike();
      alert("Uloga uspješno promijenjena");
    } else {
      alert("Greška pri promjeni uloge");
    }
  } catch (err) {
    console.error("Greška pri promjeni uloge:", err);
    alert("Greška pri promjeni uloge");
  }
}

// Inicijalizacija pri učitavanju
document.addEventListener("DOMContentLoaded", () => {
  ucitajSveKorisnike();
});
