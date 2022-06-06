const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const User = require('../user/controller')

var Passport = {
    configuration: async () => {

        /*
        Função que determina quais dados do objeto do usuário devem ser armazenados na sessão, no caso o id
        */
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });


        /*
        Função que auxilia na recuperação de um objeto, procurando dentro do banco de dados 
        */
        passport.deserializeUser(async (id, done) => {
            try {
                const user = await User.findById(id);
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        });

        /*
        Função usada para conferir se os dados do campo de login foram inseridos de forma correta
        */
        passport.use(new LocalStrategy(
            async function (username, password, done) {

                var user = await User.findUser(username);

                if (!user || user == null) {
                    return done(null, false, { message: 'Incorrect username.' });
                }

                //Compara a senha inserida com a que está armazenda no banco
                const isValid = User.validPassword(password, user);
                if (!isValid) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                return done(null, user);

            }
        ));

    },

    passport: passport

}

module.exports = Passport;
