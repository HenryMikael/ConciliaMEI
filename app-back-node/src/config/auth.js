const authConfig = {
    jwtSecret: process.env.JWT_SECRET,
    accessTokenExpiresIn: 
        process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshTokenExpiresDays:
        Number(process.env.JWT_REFRESH_EXPIRES_DAYS || 7),
    bcryptRounds:
        Number(process.env.BCRYPT_ROUNDS || 12),
};

if (!authConfig.jwtSecret || authConfig.jwtSecret.length < 64) {
    throw new Error("JWT_SECRET is missing or too short.");
}

if (
    !Number.isInteger(authConfig.bcryptRounds) ||
    authConfig.bcryptRounds < 10 ||
    authConfig.bcryptRounds > 15
) {
    throw new Error("BCRYPT_ROUNDS must be between 10 and 15.");
}

export default authConfig;