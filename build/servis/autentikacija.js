export function provjeriAutentikaciju(req, res, next) {
    if (req.session && req.session.korisnik) {
        next();
    }
    else {
        res.status(401).json({ greska: "Niste prijavljeni" });
    }
}
export function provjeriUlogu(dozvoljeneUloge) {
    return (req, res, next) => {
        if (req.session &&
            req.session.korisnik &&
            dozvoljeneUloge.includes(req.session.korisnik.uloga)) {
            next();
        }
        else {
            res.status(403).json({ greska: "Nemate pravo pristupa" });
        }
    };
}
//# sourceMappingURL=autentikacija.js.map