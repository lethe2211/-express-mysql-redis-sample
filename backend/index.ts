import express, { Request, Response } from "express";
import mysql, { PoolOptions, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Redis } from "ioredis";
import bodyParser from "body-parser";
import util from "util";
import path from "path";
import child from "child_process";

const app = express();
const port = 8080;
app.use(express.json());
app.use(bodyParser.json()); // For parsing application/json

const exec = util.promisify(child.exec);

const dbInfo: PoolOptions = {
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port:
    process.env.MYSQL_PORT === undefined
      ? 3306
      : parseInt(process.env.MYSQL_PORT),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "root",
  database: process.env.MYSQL_DBNAME || "isuconp",
  charset: "utf8mb4_unicode_ci", // Client side's charset conf is also need to avoid garbled characters
  waitForConnections: true,
  connectionLimit: 50,
  maxIdle: 50,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};
const dbPool = mysql.createPool(dbInfo);

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT === undefined ? 6379 : parseInt(process.env.REDIS_PORT),
  db: process.env.REDIS_DBNAME === undefined ? 0 : parseInt(process.env.REDIS_DBNAME)
});

app.get("/", async (req: Request, res: Response) => {
  return res.send("OK");
});

app.post("/initialize", async (req, res, next) => {
  try {
    const dbdir = path.resolve('.')
    const dbfiles = [
      "0_schema.sql",
      "1_data.sql"
    ]

    // Restore from dump files
    const execfiles = dbfiles.map((file) => path.join(dbdir, file))
    for (const execfile of execfiles) {
      await exec(
        `mysql -h ${dbInfo.host} -u ${dbInfo.user} -p${dbInfo.password} -P ${dbInfo.port} ${dbInfo.database} < ${execfile}`
      )
    }

    return res.json({
      language: "nodejs"
    })
  } catch (error) {
    next(error)
  }
})

app.get("/users/:id", async (req, res, next) => {
  // Extend RowDataPacket to identify the type of each column
  interface UserRow extends RowDataPacket {
    id: number;
    name: string;
  }

  try {
    const id = req.params.id;
    const [result] = await dbPool.query<UserRow[]>(
      "SELECT * FROM `user` WHERE id = ?",
      [id]
    );
    return res.json({
      result: result[0] ?? null
    });
  } catch (error) {
    next(error);
  }
});

app.post("/users", async (req, res, next) => {
  // req.body is type of any
  const name = req.body.name;

  let connection = undefined;
  try {
    connection = await dbPool.getConnection()

    await connection.beginTransaction();
    await connection.query<ResultSetHeader>("INSERT INTO user (name) VALUES (?)", [name]);
    await connection.commit();

    return res.status(201)
      .json({ ok: true })
  } catch (error) {
    await connection?.rollback();
    next(error);
  } finally {
    connection?.release();
  }
});

app.get("/orders/:id", async (req, res, next) => {
  interface OrderRow extends RowDataPacket {
    id: number;
    user_id: number;
    to_address_id: number;
    status: string;
  }

  interface OrderDetailRow extends RowDataPacket {
    id: number;
    order_id: number;
    item_id: number;
    from_address_id: number;
  }

  try {
    const id = req.params.id;

    const [orders] = await dbPool.query<OrderRow[]>(
      "SELECT * FROM `order` WHERE id = ?",
      [id]
    );
    const order = orders[0] ?? null;

    const [orderDetails] = await dbPool.query<OrderDetailRow[]>(
      "SELECT * FROM `order_detail` WHERE order_id = ?",
      [id]
    );

    return res.json({
      result: {
        order: order,
        order_details: orderDetails
      }
    });
  } catch (error) {
    next(error);
  }
});

app.post("/orders", async (req, res, next) => {
  const userId = req.body.user_id;
  const toAddressId = req.body.to_address_id;
  const status = req.body.status;
  const orderDetails = req.body.order_details;

  let connection = undefined;
  try {
    connection = await dbPool.getConnection()

    await connection.beginTransaction();

    // Insert order and order_detail
    const [result] = await connection.query<ResultSetHeader>("INSERT INTO `order` (user_id, to_address_id, status) VALUES (?, ?, ?)", [userId, toAddressId, status]);
    const insertedOrderId = result.insertId; // The inserted order_id in the ResultSetHeader
    for (const order_detail of orderDetails) {
      await connection.query<ResultSetHeader>("INSERT INTO order_detail (order_id, item_id, from_address_id) VALUES (?, ?, ?)", [insertedOrderId, order_detail.item_id, order_detail.from_address_id]);
    }

    await connection.commit();

    return res.status(201)
      .json({ ok: true });
  } catch (error) {
    await connection?.rollback();
    next(error);
  } finally {
    connection?.release();
  }
});

app.get("/items/:id", async (req, res, next) => {
  interface ItemRow extends RowDataPacket {
    id: number;
    name: string;
    price: number;
  }

  try {
    const id = req.params.id;
    const [result] = await dbPool.query<ItemRow[]>(
      "SELECT * FROM `item` WHERE id = ?",
      [id]
    );

    return res.json({
      result: result[0] ?? null
    });
  } catch (error) {
    next(error);
  }
});

app.post("/items", async (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;

  let connection = undefined;
  try {
    connection = await dbPool.getConnection();

    await connection.beginTransaction();
    await connection.query<ResultSetHeader>("INSERT INTO item (name, price) VALUES (?, ?)", [name, price]);
    await connection.commit();

    return res.status(201)
      .json({ ok: true });
  } catch (error) {
    await connection?.rollback();
    next(error);
  } finally {
    connection?.release();
  }
});

app.get("/orders-by-user/:user_id", async (req, res, next) => {
  interface UserRow extends RowDataPacket {
    id: number;
    name: string;
  }

  interface OrderRow extends RowDataPacket {
    id: number;
    user_id: number;
    to_address_id: number;
    status: string;
  }

  interface OrderDetailRow extends RowDataPacket {
    id: number;
    order_id: number;
    item_id: number;
    from_address_id: number;
  }

  interface OrderWithDetailRow extends RowDataPacket {
    order_id: number;
    user_id: number
    to_address_id: number;
    status: string;
    order_detail_id: number;
    item_id: number;
    from_address_id: number;
  }

  try {
    const userId = req.params.user_id;

    const [users] = await dbPool.query<UserRow[]>(
      "SELECT * FROM `user` WHERE id = ?",
      [userId]
    );
    const user = users[0] ?? null;

    // Naive
    // FIXME: N+1
    // const [orders] = await dbPool.query<OrderRow[]>(
    //   "SELECT * FROM `order` WHERE user_id = ?",
    //   [userId]
    // );
    // const orderIds = orders.map((order) => order.id);

    // const orderDetails = [];
    // for (const orderId of orderIds) {
    //   const [orderDetail] = await dbPool.query<OrderDetailRow[]>(
    //     "SELECT * FROM `order_detail` WHERE order_id = ?",
    //     [orderId]
    //   );
    //   for (const orderDetailRow of orderDetail) {
    //     orderDetails.push(orderDetailRow);
    //   }
    // }
    
    // Solution 1: Use a JOIN statement
    // const [orders] = await dbPool.query<OrderWithDetailRow[]>(
    //   "SELECT DISTINCT `order`.id AS order_id, `order`.user_id, `order`.to_address_id, `order`.status FROM `order` INNER JOIN `order_detail` ON `order`.id = `order_detail`.order_id WHERE `order`.user_id = ?",
    //   [userId]
    // );
    // const [orderDetails] = await dbPool.query<OrderWithDetailRow[]>(
    //   "SELECT DISTINCT `order_detail`.id AS order_detail_id, `order_detail`.item_id, `order_detail`.from_address_id FROM `order` INNER JOIN `order_detail` ON `order`.id = `order_detail`.order_id WHERE `order`.user_id = ?",
    //   [userId]
    // );

    // Solution 2: Eager loading
    const [orders] = await dbPool.query<OrderRow[]>(
      "SELECT * FROM `order` WHERE user_id = ?",
      [userId]
    );
    const orderIds = orders.map((order) => order.id);

    const [orderDetails] = await dbPool.query<OrderDetailRow[]>(
      "SELECT * FROM `order_detail` WHERE order_id IN (?)",
      [orderIds]
    );

    return res.json({
      result: {
        user: user,
        orders: orders,
        order_details: orderDetails
      }
    });
  } catch (error) {
    next(error);
  }
  
});

app.get("/addresses/:id", async (req, res, next) => {
  const id = req.params.id;
  const key = "addresses-key";
  const address = await redis.get(`${key}-${id}`);

  return res.json({
    result: {
      address
    }
  });
});

app.post("/addresses", async (req, res, next) => {
  const address = req.body.address;

  const key = "addresses-key";
  const id = await redis.incr(key);
  try {
    // Transaction
    const multi = redis.multi();
    multi
    .set(`${key}-${id.toString()}`, address);
    await multi.exec();

    res.status(201)
      .json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
