import cors from "cors";
import express from "express";
import { dajPort } from "../zajednicko/esmPomocnik.js";
import { Konfiguracija } from "../zajednicko/konfiguracija.js";
import { pripremiPutanjeResursTMDB, pripremiPutanjeResursKorisnika } from "./servis.js";
const server = express();
function pokreniServer(server, port) {
    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });
    // Keep the process alive
    setInterval(() => { }, 1000);
}
function inicijalizirajPostavkeServera(server) {
    server.use(express.urlencoded({ extended: true }));
    server.use(cors({
        origin: (origin, povratniPoziv) => {
            console.log(origin);
            if (!origin || origin.startsWith('http://spider.foi.hr:') ||
                origin.startsWith('http://localhost:')) {
                povratniPoziv(null, true); // Dozvoljeno
            }
            else {
                povratniPoziv(new Error('Nije dozvoljeno zbog CORS'));
            }
        },
        optionsSuccessStatus: 200
    }));
}
async function inicijalizirajKonfiguraciju() {
    let konf = new Konfiguracija();
    await konf.ucitajKonfiguraciju();
    return konf;
}
function pripremiPutanjeServera(server, konf) {
    pripremiPutanjeResursTMDB(server, konf);
    pripremiPutanjeResursKorisnika(server, konf);
    server.use((zahtjev, odgovor) => {
        odgovor.status(404);
        var poruka = { greska: "nepostojeći resurs" };
        odgovor.send(JSON.stringify(poruka));
    });
}
async function main(argv) {
    let port = dajPort("vmatuka");
    if (argv[3] != undefined) {
        port = parseInt(argv[3]);
    }
    let konf = null;
    try {
        konf = await inicijalizirajKonfiguraciju();
    }
    catch (greska) {
        if (process.argv.length == 2)
            console.error("Potrebno je dati naziv datoteke");
        else if (greska.path != undefined)
            console.error("Nije moguće otvoriti datoteku: " + greska.path);
        else
            console.log(greska.message);
        process.exit();
    }
    inicijalizirajPostavkeServera(server);
    if (konf !== null) {
        pripremiPutanjeServera(server, konf);
    }
    pokreniServer(server, port);
}
main(process.argv).catch(err => {
    console.error("Fatal error in main:", err);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
//# sourceMappingURL=server.js.map