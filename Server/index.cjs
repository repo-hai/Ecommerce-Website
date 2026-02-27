const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const {Get, InsertWithNewID, Insert} = require("./db/Connect.cjs");
const fs = require("node:fs/promises");

const config = {
    user: 'sa',
    password: '1234567',
    server: 'localhost\\CSDLPTNHOM1',
    database: 'TTCS',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },        
    pool: {
      max: 20,
      min: 0,
      idleTimeoutMillis: 60000
    },
    connectionTimeout: 30000
}

app.use(cors());
app.use(express.json());
var sql = require("mssql");
var conn = new sql.ConnectionPool(config);



const jsonParser = bodyParser.json();

app.listen(8000, () => {
  console.log("server listening on port 8000");
});

app.post("/login", jsonParser, async (request, response) => {
  const body = request.body;
  console.log(body);
  const username = body.username;
  const password = body.password;
  console.log(`SELECT id, name, role From [User] u Where u.username = '${username}' and u.password='${password}'`);
  try{
    var result = await Get(`SELECT id, name, role From [User] u Where u.username = '${username}' and u.password='${password}'`);
    console.log(result);
    if(result.rowsAffected[0]){
      response.send(result.recordset[0]);
    } else {
      response.status(400).send("Sai tài khoản/mật khẩu");
    }
  } catch(error) {
    console.log("Error in login: ", error);
    response.status(400).send("Đăng nhập thất bại");
  }
});

app.post("/register", jsonParser, async (request, response) => {
    const body = request.body;
    const username = body.username;
    const password = body.password;
    const name = body.name;
    const telephone = body.telephone;
    const address = body.address;
    const role = "KH"; 
    console.log(body);
    fs.readFile("./.idea/id.json").then(async (data) => {
      var file = JSON.parse(data);
      file.user = file.user + 1;
      console.log(file);

      fs.writeFile("./.idea/id.json", JSON.stringify(file), {
        encoding: "utf-8",
        flag: "w",
      }).catch((error) => {
        console.error('Error writing the JSON file:', error);
      });
      console.log("Ghi file thành công");

      const check = `Select * From [User] Where username = '${username}'`;
      const query = `Insert Into [User] (id, name, telephone, address, username, password, role) 
                      Values ('${file.user}', N'${name}', '${telephone}', N'${address}', '${username}', '${password}', 'KH')`;
      const result = await InsertWithNewID("user", query, check);
      if(await result == 1){
        response.status(200).send("Tạo tài khoản thành công!");      
      } else {
        response.status(400).send("Tạo tài khoản thất bại!");
      }
    })
    .catch((error) => {
      console.error('Error reading the JSON file:', error);
      response.status(400).send("create new account failed!");
    });
});

app.get("/book/:id", async (request, response) => {
  const bookID = request.params.id;
  let pool = await sql.connect(config);
  try{
    const result = await pool.request()
                            .input('ID', sql.NVarChar, bookID)
                            .execute('GetBookDetail');
    pool.close();
    response.send(result.recordset[0]);
  } catch(error) {
    console.log("Lỗi ở pha lấy thông tin chi tiết sách: ", error);
    response.status(400).send("Lấy thông tin chi tiết sách thất bại");
  } finally {
    pool.close();
  }
});

app.get("/getbook/:id", async (request, response) => {
  const bookID = request.params.id;
  let pool = await sql.connect(config);
  try{
    const result = await pool.request()
                            .input('ID', sql.NVarChar, bookID)
                            .execute('GetBook');
    pool.close();
    response.send(result.recordset[0]);
  } catch(error) {
    console.log("Lỗi ở pha lấy thông tin chi tiết sách: ", error);
    response.status(400).send("Lấy thông tin chi tiết sách thất bại");
  } finally {
    pool.close();
  }
});

app.post("/rate_Of_User", jsonParser,  async (request, response) => {
  const body = request.body;
  const userID = body.userID;
  const bookID = body.bookID;;
  let pool = await sql.connect(config);
  try{
    const result = await pool.request()
                            .input('userID', sql.NVarChar, userID)
                            .input('BookID', sql.NVarChar, bookID)
                            .execute('GetRateOfThisUser');
    pool.close();
    response.send(result);
  } catch(error) {
    console.log("Lỗi ở pha lấy thông tin đánh giá: ", error);
    response.status(400).send("Lấy thông tin đánh giá thất bại");
  } finally {
    pool.close();
  }
});


app.get("/comment/:id", async (request, response) => {
  const bookID = request.params.id;
  let pool = await sql.connect(config);
  try{
    const result = await pool.request()
                            .input('bookID', sql.NVarChar, bookID)
                            .execute('GetCommentOfBook');
    pool.close();
    response.send(result.recordset);
  } catch(error) {
    console.log("Lỗi ở pha lấy thông tin: ", error);
    response.status(400).send("Lấy thông tin thất bại");
  } finally {
    pool.close();
  }
});

app.post("/add_comment", jsonParser, async (request, response) => {
    const body = request.body;
    console.log(body);
    const userID = body.userID;
    const bookID = body.bookID;
    const text = body.text;
    const d = new Date(Date.now());
    const date = d.getFullYear()+"-"+(parseInt(d.getMonth())+1)+"-"+d.getDate();
    const time = d.getHours()+ ":" + d.getMinutes() + ":" + d.getSeconds();

    const query = `Select * From [UserCommentBook] Where UserID = '${userID}' and BookID = '${bookID}'`;
    const check = await Get(query);
    // console.log(await check);
    // console.log(d);
    // console.log(date);
    // console.log(time);
    // const insert_comment = `Insert into [Comment] ([ID], [Text], [Date], [Time], [BookID], [UserID]) Values ('${1}', N'${text}', '${date}', '${time}', '${bookID}', '${userID}')`;
    // console.log(insert_comment);
    
    if(!check.rowsAffected[0]){
      const insert_to_UCB = `Insert into [UserCommentBook] ([UserID], [BookID]) Values ('${userID}', '${bookID}')`;
      console.log("Đange thêm vào usercommentbook");
      Get(insert_to_UCB);
      console.log("Thêm bản ghi vào usercommentbook");
    }


    fs.readFile("./.idea/id.json").then(async (data) => {
      var file = JSON.parse(data);
      file.comment = file.comment + 1;
      console.log(file);

      fs.writeFile("./.idea/id.json", JSON.stringify(file), {
        encoding: "utf-8",
        flag: "w",
      }).catch((error) => {
        console.error('Error writing the JSON file:', error);
      });
      console.log("Ghi file thành công");
      
      const insert_comment = `Insert into [Comment] ([ID], [Text], [Date], [Time], [BookID], [UserID]) Values ('${file.comment}', N'${text}', '${date}', '${time}', '${bookID}', '${userID}')`;
      Get(insert_comment);
      console.log("Insert to database thành công");
      response.send("Thêm comment thành công");
      
    })
    .catch((error) => {
      console.error('Error reading the JSON file:', error);
      response.status(400).send("Lỗi server ở bước thêm comment!");
    });
});

app.post("/add_rate", jsonParser, async (request, response) => {
    const body = request.body;
    console.log("requset tu front end ",body);
    const userID = body.userID;
    const bookID = body.bookID;
    var rate;
    if(!body.rate){
      console.log("Lỗi nhận chỉ số đánh giá");
      response.status(400).send("Không nhận được chỉ số đánh giá");
    } else {
      rate = parseFloat(body.rate);

      const query = `Select * From [Rating] Where UserID = '${userID}' and BookID = '${bookID}'`;
      const check = await Get(query);
      console.log(await check);

      console.log(check);
      try{
        if(!check.rowsAffected[0]){
          const insert_to_table_Rating = `Insert into [Rating] ([UserID], [BookID], [Rate]) Values ('${userID}', '${bookID}', ${rate})`;
          Get(insert_to_table_Rating);
          console.log("Thêm bản rating mới thành công");
          response.send("Thêm đánh giá thành công");
        } else {
            try{  
              const update_rating = `update [Rating] set [UserID] = '${userID}', [BookID] = '${bookID}' ,[Rate] = '${rate}' where [UserID] = '${userID}' and [BookID] = '${bookID}'`;
              console.log(update_rating);
              Get(update_rating);
              console.log("Update rating thành công");
              response.send("Thêm rating thành công");
              
            } catch(error) {
              console.log("Lỗi bước update rating");
              response.status(400).send("Lỗi server ở bước thêm rating!");
            };
        }
      } catch(error) {
        console.log(error);
      }
  }
});


app.post("/addToCart", jsonParser, async (request, response) => {
    const body = request.body;
    console.log(body);
    const userID = body.userID;
    const bookID = body.bookID;
    const quantity = body.quantity;
    const cost = body.cost;
    // const d = new Date(Date.now());
    // const date = d.getFullYear()+"-"+(parseInt(d.getMonth())+1)+"-"+d.getDate();
    // const time = d.getHours()+ ":" + d.getMinutes() + ":" + d.getSeconds();
    const date = body.date;
    const time = body.time;
    console.log(date);
    console.log(time);

    fs.readFile("./.idea/id.json").then(async (data) => {
      var file = JSON.parse(data);
      file.order = file.order + 1;
      console.log(file);

      fs.writeFile("./.idea/id.json", JSON.stringify(file), {
        encoding: "utf-8",
        flag: "w",
      }).catch((error) => {
        console.error('Error writing the JSON file:', error);
      });
      console.log("Ghi file thành công");

      let pool = await sql.connect(config);
      try{
        const result = await pool.request()
                                .input('Date', date)
                                .input('Time', time)
                                .input('Quantity', quantity)
                                .input('Cost', cost)
                                .input('UserID', userID)
                                .input('BookID', bookID)
                                .input('BillID', '0')
                                .execute('AddToCart');
        console.log("Thêm đơn hàng thành công");
        pool.close();
        response.send("Thêm thành công");
      } catch(error) {
        console.log("Lỗi ở pha lấy thông tin đánh giá: ", error);
        response.status(400).send("Lấy thông tin đánh giá thất bại");
      } finally {
        pool.close();
      }
    })
    .catch((error) => {
      console.error('Error reading the JSON file:', error);
      response.status(400).send();
    });
});

app.get("/cart_not_paid/:userID", async (request, response) => {
  const userID = request.params.userID;
  let pool = await sql.connect(config);
  try{
    const result = await pool.request()
                            .input('ID', userID)
                            .execute('GetNotPaidOrderOfCustomer');
    pool.close();
    response.send(result.recordset);
  } catch(error) {
    console.log("Lỗi ở pha lấy thông tin đơn hàng chưa thanh toán: ", error);
    response.status(400).send("Lỗi quá trình lấy đơn hàng chưa thành toán");
  } finally {
    pool.close();
  }
});

app.get("/cart_paid/:userID", async (request, response) => {
  const userID = request.params.userID;
  let pool = await sql.connect(config);
  try{
    const result = await pool.request()
                            .input('ID', userID)
                            .execute('GetPaidOrderOfCustomer');
    console.log(result.recordset);
    pool.close();
    response.send(result.recordset);
  } catch(error) {
    console.log("Lỗi ở pha lấy thông tin đơn hàng chưa thanh toán: ", error);
    response.status(400).send("Lỗi quá trình lấy đơn hàng chưa thành toán");
  } finally {
    pool.close();
  }
});


app.post("/delete_order", jsonParser, async (request, response) => {
    const body = request.body;
    console.log(body);
    const userID = body.UserID;
    const bookID = body.ID;
    const d = body.Date;
    const t = body.Time;
    const date = d.slice(0,10);
    const time = t.slice(11,19);

    console.log(date);
    console.log(time);
    let pool = await sql.connect(config);
    try{
      const result = await pool.request()
                              .input('userID', userID)
                              .input('bookID', bookID)
                              .input('date', date)
                              .input('time', time)
                              .execute('Delete_Order');
      console.log("Xóa thành công order ", bookID, "  của ", userID);
      pool.close();
      response.send("Xóa thành công order");
    } catch(error) {
      console.log("Lỗi ở pha xóa order: ", error);
      response.status(400).send("Lỗi ở pha xóa order");
    } finally {
      pool.close();
    }
});



app.post("/add_bill", jsonParser, async (request, response) => {
    const ListOrder = request.body;
    const d = new Date(Date.now());
    const date = d.getFullYear()+"-"+(parseInt(d.getMonth())+1)+"-"+d.getDate();
    const time = d.getHours()+ ":" + d.getMinutes() + ":" + d.getSeconds();
    //const Address = body.address;

    fs.readFile("./.idea/id.json").then(async (data) => {
      var file = JSON.parse(data);
      file.bill = file.bill + 1;
      console.log(file);

      fs.writeFile("./.idea/id.json", JSON.stringify(file), {
        encoding: "utf-8",
        flag: "w",
      }).catch((error) => {
        console.error('Error writing the JSON file:', error);
      });
      console.log("Ghi file thành công");

      let pool = await sql.connect(config);
      let pool2 = await sql.connect(config);
      try{
        const result = await pool.request()
                                .input('BillID', file.bill)
                                .input('Date', date)
                                .input('Time', time)
                                .execute('Add_Bill');

        ListOrder.map(async (o) => {
              const result2 = await pool2.request()
                                      .input('UserID', o.UserID)
                                      .input('BookID', o.ID)
                                      .input('Date', o.Date)
                                      .input('Time', o.Time)
                                      .input('BillID', file.bill)
                                      .execute('Update_Order');
        });

        console.log("Thêm bill thành công");
        response.send("Thêm bil thành công");
      } catch(error) {
        console.log("Lỗi ở pha thêm bill: ", error);
        response.status(400).send("Thêm bill thất bại");
      }
    })
    .catch((error) => {
      console.error('Error reading the JSON file:', error);
      response.status(400).send("create new account failed!");
    });
});


app.get("/find_by_key/:key", async (request, response) => {
  const key = request.params.key;
  console.log(key);
  let pool = await sql.connect(config);
  try{
    const result = await pool.request()
                            .input('Key', key)
                            .input('N', 100)
                            .execute('Find_By_Key');
    console.log(result.recordset);
    pool.close();
    response.send(result.recordset);
  } catch(error) {
    console.log("Lỗi ở pha lấy thông tin đơn hàng chưa thanh toán: ", error);
    response.status(400).send("Lỗi quá trình lấy đơn hàng chưa thành toán");
  } finally {
    pool.close();
  }
});

app.get("/get_paid_order", async (request, response) => {
  let pool = await sql.connect(config);
  try{
    const result = await pool.request()
                            .execute('GetPaidOrder');
    console.log(result.recordset);
    pool.close();
    response.send(result.recordset);
  } catch(error) {
    console.log("Lỗi ở pha lấy thông tin đơn hàng chưa thanh toán: ", error);
    response.status(400).send("Lỗi quá trình lấy đơn hàng chưa thành toán");
  } finally {
    pool.close();
  }
});

app.get("/get_not_paid_order", async (request, response) => {
  console.log("load not paid");
  let pool = await sql.connect(config);
  try{
    const result = await pool.request()
                            .execute('GetNotPaidOrder');
    console.log(result.recordset);
    pool.close();
    response.send(result.recordset);
  } catch(error) {
    console.log("Lỗi ở pha lấy thông tin đơn hàng chưa thanh toán: ", error);
    response.status(400).send("Lỗi quá trình lấy đơn hàng chưa thành toán");
  } finally {
    pool.close();
  }
});

app.get("/top_rating/:num", async (request, response) => {
  const n = request.params.num;
  let pool = await sql.connect(config);
  try{
    const result = await pool.request()
                            .input('N', n)
                            .execute('TopRating');
    console.log(result.recordset);
    pool.close();
    response.send(result.recordset);
  } catch(error) {
    console.log("Lỗi ở pha lấy thông tin đơn hàng chưa thanh toán: ", error);
    response.status(400).send("Lỗi quá trình lấy đơn hàng chưa thành toán");
  } finally {
    pool.close();
  }
});

app.get("/top_author/:num", async (request, response) => {
  const n = request.params.num;
  let pool = await sql.connect(config);
  try{
    const result = await pool.request()
                            .input('N', n)
                            .execute('TopAuthor');
    console.log(result.recordset);
    pool.close();
    response.send(result.recordset);
  } catch(error) {
    console.log("Lỗi ở pha lấy thông tin đơn hàng chưa thanh toán: ", error);
    response.status(400).send("Lỗi quá trình lấy đơn hàng chưa thành toán");
  } finally {
    pool.close();
  }
});

app.get("/book_of/:author", async (request, response) => {
  const author = request.params.author;
  let pool = await sql.connect(config);
  try{
    const result = await pool.request().input('Author', author).execute('Book_Of_Author');
    console.log(result.recordset);
    pool.close();
    response.send(result.recordset);
  } catch(error) {
    console.log("Lỗi ở pha lấy thông tin đơn hàng chưa thanh toán: ", error);
    response.status(400).send("Lỗi quá trình lấy đơn hàng chưa thành toán");
  } finally {
    pool.close();
  }
});



