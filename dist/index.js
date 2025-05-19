"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const pgClient = new pg_1.Client({
    connectionString: "postgresql://neondb_owner:npg_ZE1K2xWvCrgN@ep-wandering-union-a4imxw3p-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require",
    ssl: {
        rejectUnauthorized: false
    },
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield pgClient.connect();
        const response = yield pgClient.query("SELECT * FROM users");
        console.log(response.rows);
    });
}
// app.post("/signup", async (req, res) => {
//   const { username, email, password, city, country, street, pincode } = req.body;
//   try {
//     const insertUserQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;`;
//     const insertAddressQuery = `INSERT INTO addresses (city, country, street, pincode, user_id) VALUES ($1, $2, $3, $4, $5);`;
//     // Start The Transaction
//     await pgClient.query("BEGIN;");
//     const userResponse = await pgClient.query(insertUserQuery, [username, email, password]);
//     const userId = userResponse.rows[0].id;
//     const AddressesResponse = await pgClient.query(insertAddressQuery, [city, country, street, pincode, userId]);
//     await pgClient.query("COMMIT;");
//     // Transaactions ends
//     console.log(AddressesResponse);
//     res.json({ message: "You have signed up successfully." });
//   } catch (e) {
//      await pgClient.query("ROLLBACK;");
//     console.error(e);
//     res.status(500).json({ message: "Error while signing up." });
//   }
// });
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("POST /signup called");
    const { username, email, password, city, country, street, pincode } = req.body;
    console.log("Received:", req.body);
    try {
        yield pgClient.query("BEGIN;");
        console.log("Started transaction");
        const insertUserQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;`;
        const userResponse = yield pgClient.query(insertUserQuery, [username, email, password]);
        console.log("Inserted user");
        const userId = userResponse.rows[0].id;
        const insertAddressQuery = `INSERT INTO addresses (city, country, street, pincode, user_id) VALUES ($1, $2, $3, $4, $5);`;
        yield pgClient.query(insertAddressQuery, [city, country, street, pincode, userId]);
        console.log("Inserted address");
        yield pgClient.query("COMMIT;");
        console.log("Committed transaction");
        res.json({ message: "You have signed up successfully." });
    }
    catch (e) {
        console.error("Error:", e);
        yield pgClient.query("ROLLBACK;");
        res.status(500).json({ message: "Error while signing up." });
    }
}));
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
main();
