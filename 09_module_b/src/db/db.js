import pgPromise from "pg-promise"

const pgp = pgPromise()

export const db = pgp('postgres://postgres:SahilGarg123@localhost:5432/09_module_b')
