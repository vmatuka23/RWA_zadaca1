/**
 * Zajedničke funkcije za sve HTML stranice
 */

/**
 * Prikaži/sakrij gumbe za autentifikaciju ovisno o sesiji
 */
async function ažurirajAutentifikaciju() {
  try {
    const odgovor = await fetch("/korisnik");

    if (odgovor.ok) {
      // Korisnik je prijavljen
      const korisnik = await odgovor.json();
      const gumbPrijava = document.getElementById("gumbPrijava");
      const gumbRegistracija = document.getElementById("gumbRegistracija");
      const gumbOdjava = document.getElementById("gumbOdjava");

      if (gumbPrijava) gumbPrijava.style.display = "none";
      if (gumbRegistracija) gumbRegistracija.style.display = "none";
      if (gumbOdjava) {
        gumbOdjava.style.display = "inline-block";
        gumbOdjava.addEventListener("click", (e) => {
          e.preventDefault();
          odjava();
        });
      }

      // Prikaži/sakrij stranice ovisno o ulozi
      ažurirajVidljivostMenija(korisnik.uloga);
    } else {
      // Korisnik nije prijavljen
      const gumbPrijava = document.getElementById("gumbPrijava");
      const gumbRegistracija = document.getElementById("gumbRegistracija");
      const gumbOdjava = document.getElementById("gumbOdjava");

      if (gumbPrijava) gumbPrijava.style.display = "inline-block";
      if (gumbRegistracija) gumbRegistracija.style.display = "inline-block";
      if (gumbOdjava) gumbOdjava.style.display = "none";

      // Sakri zaštićene stranice
      sakrijZastiteneStranice();
    }
  } catch (err) {
    console.error("Greška pri provjeri autentifikacije:", err);
    sakrijZastiteneStranice();
  }
}

/**
 * Ažuriraj vidljivost stavki menija ovisno o ulozi
 */
function ažurirajVidljivostMenija(uloga) {
  const stavkaModerator = document.querySelector(
    'a[href="moderator.html"]',
  )?.parentElement;
  const stavkaKorisnici = document.querySelector(
    'a[href="korisnici.html"]',
  )?.parentElement;

  if (stavkaModerator) {
    stavkaModerator.style.display =
      uloga === "moderator" || uloga === "admin" ? "list-item" : "none";
  }

  if (stavkaKorisnici) {
    stavkaKorisnici.style.display = uloga === "admin" ? "list-item" : "none";
  }
}

/**
 * Sakrij zaštićene stranice koje zahtijevaju prijavu
 */
function sakrijZastiteneStranice() {
  const zastiteneMeni = document.querySelectorAll(
    'a[href="kolekcije.html"], a[href="sadrzaj.html"], a[href="moderator.html"], a[href="korisnici.html"]',
  );
  zastiteneMeni.forEach((meni) => {
    meni.parentElement.style.display = "none";
  });
}

/**
 * Odjava korisnika
 */
async function odjava() {
  try {
    const odgovor = await fetch("/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (odgovor.ok) {
      window.location.href = "/";
    } else {
      alert("Greška pri odjavi");
    }
  } catch (err) {
    console.error("Greška pri odjavi:", err);
    alert("Greška pri odjavi");
  }
}

/**
 * Prikaži poruku greške
 */
function prikaziGresku(poruka, elementId = null) {
  if (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = poruka;
      element.style.display = "block";
    }
  } else {
    alert(poruka);
  }
}

/**
 * Sakrij poruku greške
 */
function sakrijGresku(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = "";
    element.style.display = "none";
  }
}

/**
 * Preusmjeri na stranicu ako nije prijavljen
 */
function preusmjeriAkoNijeUlogiran(stranica = "/prijava") {
  const meniKolekcije = document.querySelector('a[href="kolekcije.html"]');

  if (
    meniKolekcije &&
    !document.body.innerHTML.includes('data-prijavljen="true"')
  ) {
    // Ako je stranica zaštićena i korisnik nije prijavljen
    if (
      window.location.pathname !== "/" &&
      window.location.pathname !== "/prijava" &&
      window.location.pathname !== "/registracija"
    ) {
      // Provjeri je li korisnik prijavljen putem API-ja
      fetch("/korisnik").catch(() => {
        window.location.href = stranica;
      });
    }
  }
}

// Pozovi funkciju pri učitavanju stranice
document.addEventListener("DOMContentLoaded", ažurirajAutentifikaciju);
