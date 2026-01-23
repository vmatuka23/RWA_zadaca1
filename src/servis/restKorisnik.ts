import { KorisnikI } from "../servisI/korisniciI.js";
import { KorisnikDAO } from "./korisnikDAO.js";
import { Request, Response } from "express";

export class RestKorisnik {
  private kdao;

  constructor() {
    this.kdao = new KorisnikDAO();
  }

  getKorisnici(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    this.kdao.dajSve().then((korisnici: Array<KorisnikI>) => {
      console.log(korisnici);
      odgovor.send(JSON.stringify(korisnici));
    });
  }

  postKorisnici(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    let podaci = zahtjev.body;
    let poruka = this.kdao.dodaj(podaci);
    odgovor.send(JSON.stringify(poruka));
  };

  deleteKorisnici(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" };
    odgovor.send(JSON.stringify(poruka));
  };

  putKorisnici(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" };
    odgovor.send(JSON.stringify(poruka));
  };

  async getKorisnik(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    let korime = zahtjev.params["korime"] as string;
    if (korime == undefined) {
      odgovor.send({ greska: "Nepostojeće korime" });
      return;
    }
    let korisnik = await this.kdao.daj(korime); 
    console.log(korisnik);
    odgovor.send(JSON.stringify(korisnik));
  };

  getKorisnikPrijava(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    let korime = zahtjev.params["korime"] as string;
    if (korime == undefined) {
      odgovor.status(401);
      odgovor.send(JSON.stringify({ greska: "Krivi podaci!" }));
      return;
    }

    this.kdao.daj(korime).then((korisnik:KorisnikI|null) => {
      console.log(korisnik);
      console.log(zahtjev.body);
      if (korisnik != null && korisnik.lozinka == zahtjev.body.lozinka){
        korisnik.lozinka = null
        odgovor.send(JSON.stringify(korisnik));
      } else {
        odgovor.status(401);
        odgovor.send(JSON.stringify({ greska: "Krivi podaci!" }));
      }
    });
  };
  postKorisnik(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    odgovor.status(405);
    let poruka = { greska: "metoda nije dopuštena" };
    odgovor.send(JSON.stringify(poruka));
  };

  deleteKorisnik(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    let korime = zahtjev.params["korime"] as string;
    if(zahtjev.params["korime"]!=undefined) {
      this.kdao.obrisi(korime);
      let poruka = { ok: "obrisan" };
      odgovor.send(JSON.stringify(poruka));
      return;
    }

    odgovor.status(407);
    let poruka = { greska: "Nedostaje podatak" };
    odgovor.send(JSON.stringify(poruka));
  };

  putKorisnik(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    let korime = zahtjev.params["korime"] as string;
    if (korime == undefined) {
      odgovor.status(401);
      odgovor.send(JSON.stringify({ greska: "Krivi podaci!" }));
      return;
    }
    let podaci = zahtjev.body;
    let poruka = this.kdao.azuriraj(korime, podaci)
    odgovor.send(JSON.stringify(poruka));
  };

}
