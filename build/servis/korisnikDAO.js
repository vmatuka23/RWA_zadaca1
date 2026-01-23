import Baza from "../zajednicko/sqliteBaza.js";
export class KorisnikDAO {
    baza;
    constructor() {
        this.baza = new Baza("podaci/RWA2024matnovak.sqlite");
        this.baza.spoji();
    }
    async dajSve() {
        let sql = "SELECT * FROM korisnik;";
        var podaci = await this.baza.dajPodatke(sql, []);
        let rezultat = new Array();
        for (let p of podaci) {
            let k = { ime: p["ime"], prezime: p["prezime"], korime: p["korime"], lozinka: p["lozinka"], email: p["email"] };
            rezultat.push(k);
        }
        return rezultat;
    }
    async daj(korime) {
        let sql = "SELECT * FROM korisnik WHERE korime=?;";
        var podaci = await this.baza.dajPodatke(sql, [korime]);
        if (podaci.length == 1 && podaci[0] != undefined) {
            let p = podaci[0];
            let k = { ime: p["ime"], prezime: p["prezime"], korime: p["korime"], lozinka: p["lozinka"], email: p["email"] };
            return k;
        }
        return null;
    }
    dodaj(korisnik) {
        console.log(korisnik);
        let sql = `INSERT INTO korisnik (ime,prezime,lozinka,email,korime,tip_korisnika_id) VALUES (?,?,?,?,?,?)`;
        let podaci = [korisnik.ime, korisnik.prezime,
            korisnik.lozinka, korisnik.email, korisnik.korime, 1];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    obrisi(korime) {
        let sql = "DELETE FROM korisnik WHERE korime=?";
        this.baza.ubaciAzurirajPodatke(sql, [korime]);
        return true;
    }
    azuriraj(korime, korisnik) {
        let sql = `UPDATE korisnik SET ime=?, prezime=?, lozinka=?, email=? WHERE korime=?`;
        let podaci = [korisnik.ime, korisnik.prezime,
            korisnik.lozinka, korisnik.email, korime];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
}
//# sourceMappingURL=korisnikDAO.js.map