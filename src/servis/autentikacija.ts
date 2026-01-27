import { Request, Response, NextFunction } from "express";

export function provjeriAutentikaciju(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.session && req.session.korisnik) {
        next();
    } else {
        res.status(401).json({ greska: "Niste prijavljeni" });
    }
}

export function provjeriUlogu(dozvoljeneUloge: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (
            req.session &&
            req.session.korisnik &&
            dozvoljeneUloge.includes(req.session.korisnik.uloga)
        ) {
            next();
        } else {
            res.status(403).json({ greska: "Nemate pravo pristupa" });
        }
    };
}
