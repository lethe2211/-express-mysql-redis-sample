"use strict";

const express = require("express");
const app = express();
const port = 8080;
app.use(express.json());

// const util = require("util");

// const mysql = require('mysql');
// const path = require('path');
// const exec = util.promisify(require("child_process").exec);
// const exp = require('constants');

// const redis = require("redis");
// const client = redis.createClient();

// const dbinfo = {
//   host: process.env.MYSQL_HOST || "127.0.0.1",
//   port: process.env.MYSQL_PORT || 3306,
//   user: process.env.MYSQL_USER || "root",
//   password: process.env.MYSQL_PASS || "root",
//   database: process.env.MYSQL_DBNAME || "test_db",
//   connectionLimit: 50
// };

// const db = mysql.createPool(dbinfo)
// app.set('db', db)

app.get("/", async (req, res) => {
  res.send("Hello world");
});

// app.post('/initialize', async(req, res, next) => {
//   try {
//     const dbdir = path.resolve('.')
//     const dbfiles = [
//       '0_schema.sql',
//       '1_data.sql'
//     ]
//     const execfiles = dbfiles.map((file) => path.join(dbdir, file))
//     for (const execfile of execfiles) {
//       // console.log(`mysql -h ${dbinfo.host} -u ${dbinfo.user} -p${dbinfo.password} -P ${dbinfo.port} ${dbinfo.database} < ${execfile}`)
//       await exec(
//         `mysql -h ${dbinfo.host} -u ${dbinfo.user} -p${dbinfo.password} -P ${dbinfo.port} ${dbinfo.database} < ${execfile}`
//       )
//     }
//     res.json({
//       language: "nodejs"
//     })
//   } catch (error) {
//     next(error)
//   }
// })

// app.get('/select/:id', async (req, res, next) => {
//   const getConnection = util.promisify(db.getConnection.bind(db))
//   const connection = await getConnection()
//   const query = util.promisify(connection.query.bind(connection))

//   try {
//     const id = req.params.id;
//     const result = await query('SELECT * FROM `test1` WHERE id = ?', [id])
//     console.log(result)
//     res.json({
//       result: result
//     })
//   } catch (error) {
//     console.log(error)
//     next(error)
//   } finally {
//     await connection.release()
//   }
// })

// app.post('/insert', async (req, res, next) => {
//   const getConnection = util.promisify(db.getConnection.bind(db))
//   const connection = await getConnection()
//   const beginTransaction = util.promisify(connection.beginTransaction.bind(connection));
//   const query = util.promisify(connection.query.bind(connection))
//   const commit = util.promisify(connection.commit.bind(connection));
//   const rollback = util.promisify(connection.rollback.bind(connection));

//   try {
//     await beginTransaction();
//     await query("INSERT INTO test2 (id, description, foreign_id) VALUES (?, ?, ?)", [5, "ほげほげ", 1])
//     await query("INSERT INTO test2 (id, description, foreign_id) VALUES (?, ?, ?)", [6, "ほげほげ", 2])
//     await commit();
//     res.status(201)
//     res.json({ok: true})
//   } catch (error) {
//     await rollback();
//     next(error);
//   } finally {
//     await connection.release();
//   }
// })

// app.get("/redisselect/:key", async(req, res, next) => {
//   const getAsync = util.promisify(client.get).bind(client);

//   try {
//     const id = req.params.key;
//     const val = await getAsync(id);
//     console.log(val);
//     res.json({value: val});
//   } catch (error) {
//     next(error);
//   }
// })

// app.post("/redisinsert", async(req, res, next) => {
//   const setAsync = util.promisify(client.set).bind(client);

//   try {
//     await setAsync("key1", "b");
//     res.status(201);
//     res.json({ok: true});
//   } catch (error) {
//     next(error)
//   }
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
