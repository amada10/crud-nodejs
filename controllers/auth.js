const User = require("../modeles/User");
const bcrypt = require("bcrypt");
const Thing = require("../modeles/User");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user.save()
                .then(() =>
                    res.status(201).json({ message: "Utilisateur créé!" })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res
                    .status(401)
                    .json({ erreur: "Utilisateur non trouvé" });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valide) => {
                    if (!valide) {
                        return res
                            .status(401)
                            .json({ erreur: "Mot de passe incorrecte" });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            "RANDOM_TOKEN_SECRET_KEY",
                            { expiresIn: "24h" }
                        ),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
