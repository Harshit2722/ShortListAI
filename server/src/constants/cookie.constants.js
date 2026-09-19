const isProduction = process.env.NODE_ENV === "production";

const BASE_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/"
};

const ACCESS_COOKIE_OPTIONS = {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000
}


const REFRESH_COOKIE_OPTIONS = {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000
}

module.exports = {
    ACCESS_COOKIE_OPTIONS,
    REFRESH_COOKIE_OPTIONS,
    BASE_COOKIE_OPTIONS
}