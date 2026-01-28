# Implementacija Logike Aplikacije - Sažetak

## ✅ Što je implementirano

### 1. **Upravljanje rutama i prikazom stranica** (aplikacijaRute.ts)

- ✅ **GET /** - Početna stranica (javna)
- ✅ **GET /prijava** - Stranica za prijavu (javna)
- ✅ **GET /registracija** - Stranica za registraciju (javna)
- ✅ **GET /kolekcije** - Upravljanje kolekcijama (zaštićeno - registrirani korisnici)
- ✅ **GET /sadrzaj** - Multimedijski sadržaj (zaštićeno - registrirani korisnici)
- ✅ **GET /moderator** - Upravljanje kolekcijama (zaštićeno - moderatori i admini)
- ✅ **GET /korisnici** - Upravljanje korisnicima (zaštićeno - samo admini)

### 2. **Autentifikacija** (aplikacijaRute.ts)

- ✅ **POST /login** - Prijava korisnika s validacijom
  - Provjera postoji li korisnik
  - Validacija lozinke (hash + sol)
  - Brojanje neuspješnih pokušaja (blokira nakon 3 pokušaja)
  - Postavljanje sesije
- ✅ **POST /register** - Registracija novog korisnika
  - Validacija obaveznih polja (korisničko ime, lozinka, email)
  - Provjera je li korisničko ime dostupno
  - Generiranje soli i heširanje lozinke
  - Automatska dodjela uloge "korisnik"
- ✅ **POST /logout** - Odjava korisnika
  - Uništavanje sesije
  - Brisanje kolačića

- ✅ **GET /korisnik** - Dohvat podataka trenutno prijavljenog korisnika (zaštićeno)

### 3. **Kontrola pristupa po ulogama** (autentikacija.ts)

- ✅ `provjeriAutentikaciju()` - Middleware koji provjeri je li korisnik prijavljen
- ✅ `provjeriUlogu(["moderator", "admin"])` - Middleware za role-based access control
- Uloge: `korisnik`, `moderator`, `admin`

### 4. **Client-side JavaScript files**

#### zajednicko.js (svi HTML dokumenti)

- ✅ `ažurirajAutentifikaciju()` - Provjeri sesiju pri učitavanju stranice
- ✅ `ažurirajVidljivostMenija()` - Prikaži/sakrij stavke menija ovisno o ulozi
- ✅ `odjava()` - Odjavi korisnika putem API-ja
- ✅ `prikaziGresku()` / `sakrijGresku()` - Upravljanje porukama greške
- ✅ Automatski se poziva pri `DOMContentLoaded`

#### autentifikacija.js (prijava.html, registracija.html)

- ✅ `pripremiFormaPrijave()` - Validacija i slanje forme za prijavu
- ✅ `pripremiFormaRegistracije()` - Validacija i slanje forme za registraciju
- ✅ Svi obavezni i opcionalni polji su validirana
- ✅ Preusmjeravanje nakon uspješne prijave/registracije

#### kolekcije.js (kolekcije.html)

- ✅ `ucitajKolekcije()` - Učitaj sve kolekcije korisnika
- ✅ `prikaziKolekcije()` - Prikaži kolekcije u DOM-u
- ✅ `prikaziDetaljeKolekcije()` - Prikaži detalje odabrane kolekcije
- ✅ `ucitajMultimedijeKolekcije()` - Učitaj multimediju iz kolekcije
- ✅ `obrisiMultimediju()` - Obriši datoteku iz kolekcije
- ✅ `promijeniVidljivostKolekcije()` - Promijeni javnost/privatnost

#### sadrzaj.js (sadrzaj.html)

- ✅ `pretragaTMDB()` - Pretraži vanjske sadržaje
- ✅ `prikaziRezultatePretrage()` - Prikaži rezultate pretrage
- ✅ `dodajUKolekciju()` - Dodaj multimediju u kolekciju
- ✅ `pripremiFormaUcitavanja()` - Upravljanje učitavanjem datoteka

#### moderator.js (moderator.html)

- ✅ `pripremiFormaKreiranjaKolekcije()` - Kreiraj novu kolekciju
- ✅ `ucitajKolekcijeModeratora()` - Učitaj sve kolekcije za upravljanje
- ✅ `prikaziKolekcijeModeratora()` - Prikaži kolekcije u tablici
- ✅ `obrisiKolekciju()` - Obriši kolekciju
- ✅ `pripremiFormaDodjeleKorisnika()` - Dodijeli korisnika kolekciji

#### administrator.js (korisnici.html)

- ✅ `ucitajSveKorisnike()` - Učitaj sve korisnike (samo za admina)
- ✅ `prikaziKorisnike()` - Prikaži korisnike u tablici
- ✅ `promijeniBlokadu()` - Blokiraj/odblokiraj korisnika
- ✅ `promijeniUlogu()` - Promijeni ulogu korisnika

### 5. **API Endpoints (već postoje u servis/)** ✅

- **Korisnici**: GET/POST /api/korisnici, GET/PUT/DELETE /api/korisnici/:id
- **Kolekcije**: GET/POST /api/kolekcije, GET/PUT/DELETE /api/kolekcije/:id
- **Multimedija**: GET/POST /api/multimedija, GET/PUT/DELETE /api/multimedija/:id
- **Korisnik-Kolekcija**: GET/POST /api/korisnici-kolekcije, DELETE
- **TMDB**: GET /api/tmdb/search, GET /api/tmdb/filmovi

## 🔒 Sigurnost i Kontrola Pristupa

| Stranica                | Tip      | Pristup   | Uloga                  |
| ----------------------- | -------- | --------- | ---------------------- |
| Početna (/)             | GET      | Javna     | Svi                    |
| Prijava                 | GET/POST | Javna     | Svi                    |
| Registracija            | GET/POST | Javna     | Svi                    |
| Moje kolekcije          | GET      | Zaštićena | Registrirani korisnici |
| Multimedijski sadržaj   | GET      | Zaštićena | Registrirani korisnici |
| Upravljanje kolekcijama | GET      | Zaštićena | Moderator, Admin       |
| Upravljanje korisnicima | GET      | Zaštićena | Admin samo             |

## 📝 Tok Prijave (Flow)

1. **Korisnik** unese kredencijale na `/prijava`
2. **JavaScript** pošalje POST zahtjev na `/login`
3. **Server** validira korisnika, provjeri lozinku, postavi sesiju
4. **Uspješna prijava** → Preusmjeravanje na `/`
5. **JavaScript** automatski ažurira meni ovisno o ulozi

## 📝 Tok Registracije (Flow)

1. **Korisnik** popuni formu na `/registracija`
2. **JavaScript** validira sve polje
3. **JavaScript** pošalje POST zahtjev na `/register`
4. **Server** kreiira novog korisnika s ulogom "korisnik"
5. **Uspješna registracija** → Preusmjeravanje na `/prijava`

## 📝 Tok Odjave (Flow)

1. **Korisnik** klikne na "Odjava" gumb
2. **JavaScript** pošalje POST zahtjev na `/logout`
3. **Server** uništi sesiju
4. **Uspješna odjava** → Preusmjeravanje na `/`
5. **JavaScript** ažurira meni (prikaži Login/Register, sakrij zaštićene stranice)

## 🔧 Kako Pokrenuti

```bash
# Kompajliranje
npm run compile

# Kopiranje datoteka
npm run copy-files

# Pokretanje servera
npm run server

# Ili sve zajedno (development)
npm run start-local
```

## 📂 Struktura Datoteka

```
src/
├── aplikacija/
│   ├── aplikacijaRute.ts ← NOVE RUTE ZA STRANICE
│   ├── html/
│   │   ├── index.html (+ zajednicko.js)
│   │   ├── prijava.html (+ zajednicko.js + autentifikacija.js)
│   │   ├── registracija.html (+ zajednicko.js + autentifikacija.js)
│   │   ├── kolekcije.html (+ zajednicko.js + kolekcije.js)
│   │   ├── sadrzaj.html (+ zajednicko.js + sadrzaj.js)
│   │   ├── moderator.html (+ zajednicko.js + moderator.js)
│   │   └── korisnici.html (+ zajednicko.js + administrator.js)
│   └── js/ ← NOVI JAVASCRIPT FAJLOVI
│       ├── zajednicko.js ← Shared authentication logic
│       ├── autentifikacija.js
│       ├── kolekcije.js
│       ├── sadrzaj.js
│       ├── moderator.js
│       └── administrator.js
└── servis/
    ├── autentikacija.ts (middleware)
    ├── restKorisnik.ts
    ├── restKolekcija.ts
    ├── restMultimedija.ts
    └── servis.ts (sve API rute)
```

## ✨ Ključne Karakteristike

1. **Server-side Rendering** - HTML stranice se učitavaju s servera
2. **Client-side Interaktivnost** - JavaScript za forme i dinamički sadržaj
3. **Sesija-bazirano autentifikaciju** - Koristi express-session
4. **Role-based Access Control** - Različite dozvole po ulogama
5. **Zaštita od neovlaštenog pristupa** - Middleware za autentifikaciju
6. **Dinamički meni** - Prikaži/sakrij stavke ovisno o autentifikaciji i ulozi

## 🚀 Što Dalje?

1. Dodati CSS stilizaciju
2. Optimizirati JavaScript (npr. korištenje modulnog bundlera)
3. Dodati validaciju na server-side za sve forme
4. Implementirati dodatne sigurnosne mjere (CSRF token, etc.)
5. Dodati error handling i logging
