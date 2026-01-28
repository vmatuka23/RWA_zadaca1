# Testiranje Aplikacije - Korak po Korak

## Preduvjeti

- Node.js instaliaran
- npm paketi instalirani (`npm run pripremi`)
- SQLite baza postavljena

## 1. Pokretanje Aplikacije

```bash
# Kompilaija TypeScript koda
npm run compile

# Kopiranje HTML/CSS/JS datoteka u build folder
npm run copy-files

# Pokretanje servera
npm run server

# ILI sve zajedno:
npm run start-local
```

Server će biti dostupan na: **http://localhost:8080**

## 2. Testiranje Registracije

### Korak 1: Otvori Registracijsku Stranicu

- Idi na `http://localhost:8080/registracija`
- Trebao bi vidjeti formu s poljima za:
  - Email (obavezno)
  - Korisničko ime (obavezno)
  - Lozinka (obavezno, min 6 znakova)
  - Ime (opcionalno)
  - Prezime (opcionalno)

### Korak 2: Popuni Formu

- Email: `testkorisnik@example.com`
- Korisničko ime: `testkorisnik`
- Lozinka: `test123`
- Ime: `Test`
- Prezime: `Korisnik`

### Korak 3: Provjera Validacije

Pokušaj sljedeće greške:

- ❌ Registracija bez emaila → Trebala bi greška
- ❌ Registracija bez korisničkog imena → Trebala bi greška
- ❌ Registracija s lozinkom kraćom od 6 znakova → Trebala bi greška
- ❌ Email bez @ znaka → Trebala bi greška

### Korak 4: Uspješna Registracija

- Popuni sve ispravno
- Klikni "Registriraj se"
- Trebao bi vidjeti poruku: "Registracija uspješna! Sada se možete prijaviti."
- Trebao bi biti preusmjeren na `/prijava`

## 3. Testiranje Prijave

### Korak 1: Otvori Stranicu za Prijavu

- Idi na `http://localhost:8080/prijava`

### Korak 2: Provjera Validacije

- ❌ Pokušaj se prijaviti bez korisničkog imena → Trebala bi greška
- ❌ Pokušaj se prijaviti bez lozinke → Trebala bi greška

### Korak 3: Pokušaji s Pogrešnim Kredencijalima

- Korisničko ime: `testkorisnik`
- Lozinka: `pogresna`
- Trebala bi poruka: "Pogrešno korisničko ime ili lozinka"

### Korak 4: Uspješna Prijava

- Korisničko ime: `testkorisnik`
- Lozinka: `test123`
- Klikni "Prijavi se"
- Trebao bi biti preusmjeren na `/`

### Korak 5: Provjera Sesije

- Meni bi se trebao promijeniti:
  - ❌ Gumb "Prijava" trebao bi biti sakriven
  - ❌ Gumb "Registracija" trebao bi biti sakriven
  - ✅ Gumb "Odjava" trebao bi biti vidljiv
  - ✅ Stavke menija "Moje kolekcije" i "Multimedijski sadržaj" trebale bi biti vidljive

## 4. Testiranje Pristupa Zaštićenim Stranicama

### Korak 1: Zaštićene Stranice za Registrirane Korisnike

Kod - trebale bi biti dostupne kada je korisnik prijavljen:

- `/kolekcije` → Trebao bi vidjeti stranicu
- `/sadrzaj` → Trebao bi vidjeti stranicu

### Korak 2: Zaštićene Stranice za Moderatore

Trebale bi biti dostupne samo moderatorima:

- `/moderator` → Trebao bi vidjeti stranicu (ako je korisnik moderator)

### Korak 3: Zaštićene Stranice za Admina

Trebale bi biti dostupne samo administatorima:

- `/korisnici` → Trebao bi vidjeti stranicu (ako je korisnik admin)

### Korak 4: Pokušaj Direktnog Pristupa Bez Prijave

- Odjavi se (klikni "Odjava")
- Pokušaj pristupiti `/kolekcije` direktno
- Trebao bi biti preusmjeren na `/prijava` ili vidjeti grešku

## 5. Testiranje Odjave

### Korak 1: Klikni na "Odjava"

- Trebao bi vidjeti poruku: "Uspješno ste odjavljeni" (console log)
- Trebao bi biti preusmjeren na `/`

### Korak 2: Provjera Sesije Nakon Odjave

- Meni bi se trebao promijeniti:
  - ✅ Gumb "Prijava" trebao bi biti vidljiv
  - ✅ Gumb "Registracija" trebao bi biti vidljiv
  - ❌ Gumb "Odjava" trebao bi biti sakriven

## 6. Testiranje Blokade Korisnika

### Korak 1: Blokada Nakon 3 Neuspješna Pokušaja

- Pokušaj se prijaviti s pogrešnom lozinkom 3 puta
- Nakon trećeg pokušaja trebala bi poruka: "Račun je blokiran nakon 3 neuspješne prijave"

### Korak 2: Pokušaj Prijave s Blokiranihm Korisnikom

- Trebao bi vidjeti poruku: "Račun je blokiran"
- Trebao bi trebati admin intervenciju za deblokadu

## 7. Testiranje API Endpointa (za developere)

Koristi **REST klijent** (npr. Postman, Thunder Client, curl):

### Prijava

```bash
POST http://localhost:8080/login
Content-Type: application/json

{
  "korisnickoIme": "testkorisnik",
  "lozinka": "test123"
}
```

**Očekivani odgovor:**

```json
{
  "poruka": "Uspješno ste prijavljeni",
  "korisnik": {
    "id": 1,
    "korisnickoIme": "testkorisnik",
    "email": "testkorisnik@example.com",
    "uloga": "korisnik",
    "ime": "Test",
    "prezime": "Korisnik"
  }
}
```

### Registracija

```bash
POST http://localhost:8080/register
Content-Type: application/json

{
  "korisnickoIme": "novikorisnik",
  "lozinka": "nova123",
  "email": "novikorisnik@example.com",
  "ime": "Novi",
  "prezime": "Korisnik"
}
```

### Dohvat Trenutnog Korisnika

```bash
GET http://localhost:8080/korisnik
```

**Napomena:** Trebala bi biti postavljena sesija/cookie!

## 8. Ispravljanje Grešaka

### Problem: "Greška pri prijavi. Pokušajte ponovno."

- Otvori Browser Console (F12)
- Provjeri što piše u "Network" tabi
- Provjeri je li korisnik zaista kreiran u bazi podataka

### Problem: Korisnik se ne može prijaviti

- Provjeri je li korisničko ime ispravo napisano
- Provjeri je li lozinka ispravo napisana
- Provjeri je li korisnik blokiran (nakon 3 pokušaja)

### Problem: Meni se ne ažurira nakon prijave

- Otvori Console (F12) i provjeri greške
- Provjeri je li zajednicko.js ispravno učitan
- Refresh stranicu (Ctrl+R)

### Problem: Stranica je prazna

- Otvori Console (F12) i provjeri greške
- Provjeri je li server pokrenut (`npm run server`)
- Provjeri je li HTML datoteka na mjestu
- Provjeri putanju u aplikacijaRute.ts

## 9. Dodatni Testovi

### Testiranje Multiple Sesija

- Otvori dvije različite preglednike
- Prijavi se kao drugačiti korisnici u svakom
- Trebalo bi biti moguće imati dvije samostalne sesije

### Testiranje Logout/Login Ciklusa

- Prijavi se → Odjavi se → Prijavi se ponovno
- Trebalo bi raditi bez problema

### Testiranje Dinamičkog Menija

- Prijavi se kao obični korisnik
- Stavka "/moderator" trebala bi biti skrivena
- Prijavi se kao admin (ako je dostupno)
- Stavka "/moderator" trebala bi biti vidljiva

## 📋 Čeklistа za Testiranje

- [ ] Registracija radi
- [ ] Validacija registracijske forme radi
- [ ] Prijava radi
- [ ] Validacija prijave radi
- [ ] Sesija se postavi nakon prijave
- [ ] Meni se ažurira nakon prijave
- [ ] Zaštićene stranice su dostupne nakon prijave
- [ ] Zaštićene stranice nisu dostupne prije prijave
- [ ] Odjava radi
- [ ] Meni se ažurira nakon odjave
- [ ] Blokada nakon 3 pokušaja radi
- [ ] Role-based pristup radi (moderator/admin)

## 🔍 Dodatne Izmjene za CSS/UX Kasnije

Kada dodaš CSS, trebao bi:

- [ ] Prilagoditi izgled gumba za prijavu/odjavu
- [ ] Prilagoditi vidljivost zaštićenih stavki menija
- [ ] Dodati loader animacije za AJAX zahtjeve
- [ ] Prilagoditi izgled poruka greške/uspjeha
- [ ] Poboljšati responsive dizajn
