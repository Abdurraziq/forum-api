/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const AuthenticationsTableTestHelper = require('./AuthenticationsTableTestHelper');

const AuthHelper = {
    async generateAccessToken({ username, id: userId }) {
        const accessToken = Jwt.token.generate(
            { username, userId },
            process.env.ACCESS_TOKEN_KEY
        );
        return accessToken;
    },
}

module.exports = AuthHelper;