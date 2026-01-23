import { KorisnikI } from "../servisI/korisniciI.js";
import Baza from "../zajednicko/sqliteBaza.js";

export class KorisnikDAO {
  private baza:Baza;

	constructor() {
		this.baza = new Baza("podaci/RWA2024matnovak.sqlite");
		this.baza.spoji();
	}

	async dajSve():Promise<Array<KorisnikI>> {
		let sql = "SELECT * FROM korisnik;"
		var podaci = await this.baza.dajPodatke(sql,[]) as Array<KorisnikI>;
    let rezultat = new Array<KorisnikI>();
    for(let p of podaci){
      let k:KorisnikI = {ime: p["ime"], prezime:p["prezime"], korime:p["korime"],lozinka:p["lozinka"],email:p["email"]};
      rezultat.push(k);
    }
		return rezultat;
	}

	async daj (korime:string):Promise<KorisnikI|null> {
		let sql = "SELECT * FROM korisnik WHERE korime=?;"
		var podaci = await this.baza.dajPodatke(sql, [korime]) as Array<KorisnikI>;

		if(podaci.length == 1 && podaci[0]!=undefined){
      let p = podaci[0];
      let k:KorisnikI = {ime: p["ime"], prezime:p["prezime"], korime:p["korime"],lozinka:p["lozinka"],email:p["email"]};
			return k;
    }

    return null;
	}

	dodaj(korisnik:KorisnikI) {
		console.log(korisnik)
		let sql = `INSERT INTO korisnik (ime,prezime,lozinka,email,korime,tip_korisnika_id) VALUES (?,?,?,?,?,?)`;
        let podaci = [korisnik.ime,korisnik.prezime,
                      korisnik.lozinka,korisnik.email,korisnik.korime,1];
	  this.baza.ubaciAzurirajPodatke(sql,podaci);
		return true;
	}

	obrisi(korime:string) {
		let sql = "DELETE FROM korisnik WHERE korime=?";
		this.baza.ubaciAzurirajPodatke(sql,[korime]);
		return true;
	}

	azuriraj(korime:string, korisnik:KorisnikI) {
		let sql = `UPDATE korisnik SET ime=?, prezime=?, lozinka=?, email=? WHERE korime=?`;
        let podaci = [korisnik.ime,korisnik.prezime,
                      korisnik.lozinka,korisnik.email,korime];
		this.baza.ubaciAzurirajPodatke(sql,podaci);
		return true;
	}
}
