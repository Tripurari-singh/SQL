
import express from "express";
import { Client } from "pg";

const app = express();
app.use(express.json());

const pgClient = new Client({
     connectionString : "",
     ssl : {
          rejectUnauthorized : false
     },
});

async function main() {
  await pgClient.connect();
  const response = await pgClient.query("SELECT * FROM users");
  console.log(response.rows);
}

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

app.post("/signup", async (req, res) => {
  console.log("POST /signup called");

  const { username, email, password, city, country, street, pincode } = req.body;
  console.log("Received:", req.body);

  try {
    await pgClient.query("BEGIN;");
    console.log("Started transaction");

    const insertUserQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;`;
    const userResponse = await pgClient.query(insertUserQuery, [username, email, password]);
    console.log("Inserted user");

    const userId = userResponse.rows[0].id;

    const insertAddressQuery = `INSERT INTO addresses (city, country, street, pincode, user_id) VALUES ($1, $2, $3, $4, $5);`;
    await pgClient.query(insertAddressQuery, [city, country, street, pincode, userId]);
    console.log("Inserted address");

    await pgClient.query("COMMIT;");
    console.log("Committed transaction");

    res.json({ message: "You have signed up successfully." });
  } catch (e) {
    console.error("Error:", e);
    await pgClient.query("ROLLBACK;");
    res.status(500).json({ message: "Error while signing up." });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
main();