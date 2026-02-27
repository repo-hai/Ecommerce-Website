const {Get, InsertWithNewID} = require("./db/Connect.cjs");


table = "order";
query = "INSERT INTO [order] (id, datetime, cost, userid) values (2, '2025/05/05 08:00:00', 500, 2)";
check = "SELECT * from [order] where userid = 2";

const result = InsertWithNewID(table, query, check);

console.log(result);