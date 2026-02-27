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
      max: 10,
      min: 0,
      idleTimeoutMillis: 60000
    }
}

var sql = require("mssql");
var conn = new sql.ConnectionPool(config);

const Get = async (query) => {
    let pool = await sql.connect(config);
    try {
        let request = pool.request();
        let result = await request.query(query);
        await pool.close();
        return result;
    } catch (err) {
        console.log("Error: ", err);
        return("error");
    } finally {
        await pool.close();
    }
}

const Adjust = async (query) => {
    let pool = await sql.connect(config);
    try {
        let request = pool.request();
        let result = await request.query(query);
        await pool.close();
        return result;
    } catch (err) {
        console.log("Error: ", err);
        return("error");
    } finally {
        await pool.close();
    }
}

const fs = require("node:fs/promises");

const InsertWithNewID = async (table, query, check) => {
    try {
        if(check){
            console.log("Đang thực thi kiểm tra trùng lặp");
            result = await Get(check);
            console.log(result);
            if(result.recordsets[0].length){
                console.log("Trùng lặp với dữ liệu sẵn có");
                throw new Error;
            }
            console.log("Không có trùng lặp, đang thực hiện insert");
        }
        let pool = await sql.connect(config);
        try {
          let request = pool.request();
          let result = await request.query(query);
          console.log("Tạo tài khoản mới thành công");
          await pool.close();
          return 1;
        } catch (err) {
          console.log("Tạo tài khoản mới thất bại!: ", err);
          return 0;
        } finally {
          await pool.close();
        }
    } catch(error) {
        console.log(`error in process insert with new id to table: ${table}: ${error}`);
        return 0;
    }
    return 0;
}

const Insert = async (table, query, check) => {
    try {
        if(check){
            console.log("Đang thực thi kiểm tra trùng lặp");
            const result = await Get(check);
            console.log(result);
            if(result.recordsets[0].length){
                console.log("Trùng lặp với dữ liệu sẵn có");
                throw new Error;
            }
            console.log("Không có trùng lặp, đang thực hiện insert");
        }
        let pool = await sql.connect(config);
        try {
          let request = pool.request();
          let result = await request.query(query);
          await pool.close();
          console.log("Tạo tài khoản mới thành công");
          return 1;
        } catch (err) {
          console.log("Tạo tài khoản mới thất bại!: ", err);
          return 0;
        } finally {
          await pool.close();
        }
    } catch(error) {
        console.log(`error in process insert with new id to table: ${table}: ${error}`);
        return 0;
    }
    return 0;
}

module.exports = {Get, InsertWithNewID, Insert};