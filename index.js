import express from "express"
import mysql from "mysql"

const app = express()
const port = 3000

const db = mysql.createConnection({
  host : "127.0.0.1",
  port: 3306,
  user : "user_ex",
  password : "1234",
  database : "backend"
})

db.connect((err) => {
  console.log("DB 연결 성공");
  if(err) console.log(err);
});

app.use(express.json());

app.get('/', (req, res) => {
  res.setHeader('status', 200);
  res.setHeader('type','html');
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res)=>{
    res.setHeader('status', 200);
    res.setHeader('type', 'json');
    res.json({"name": "홍길동", "age":20});
})

app.get('/param/:number', (req, res)=> {
  const number = req.params.number;
  res.send(`parameter ${number} 에 대한 요청 처리중`);
})

app.get('/query', (req, res)=> {
  console.log(req.query);
  const {id,name,age,email} = req.query;
  res.send(`${id}, ${name}, ${age}, ${email} 에 대한 요청 처리중`);
})

app.get('/nations', (req, res)=> {
  const sql = "select * from nations_table";
  db.query(sql, (err, results) => {
    if(err) console.log(err);
    console.log(results);
    for (const result of results) {
      console.log(result);
    }
    res.setHeader('type', 'json')
    res.send(results);
  })
})

app.get('/nations/:id', (req, res)=> {
  console.log(req.params.id);
  const id = req.params.id;
  const sql = "select * from nations_table where id=? ";
  db.query(sql, [id], (err, results) => {
    if(err) console.log(err);
    console.log(results);
    res.setHeader('status', 200);
    if(results.length) {
      console.log(results[0]);
      res.setHeader('type', 'json');
      res.send(results[0]);
    } else {
      res.setHeader('status', 404);
      res.setHeader('type','html');
      res.send('<p>요청한 자료를 찾을 수 없습니다.</p>')
    }
  })
})

app.post('/nations', (req,res)=>{
  console.log(req.body);
  const {name, capital, population} = req.body;
  //SQL - INSERT
  const sql = "insert into nations_table (name,capital,population) values (?, ?, ?)";
  db.query(sql, [name, capital, population], (err, results)=>{
    if(err) {
      console.log(err);
      res.send("등록요청 처리중 오류 발생");
    } else {
      console.log(results);
      res.redirect(302, `http://localhost:${port}/nations`);
      //res.send(`${results.insertId} , ${name}, ${capital},  ${population} 에 대한 post 요청 처리 완료`);
    }
  })
});

app.put('/nations/:id', (req, res)=> {
  const {id, name, capital, population } = req.body;
    console.log(req.body);
    console.log(req.params.id);
    const sql = "update nations_table set population = ? where id = ?"
    db.query(sql, [population, id], (err, results)=>{
      if(err) console.log(err);
      console.log(results);
    })
    res.send("처리중");
}); // POST 보충 설명 , PATCH 와 비교

app.delete('/nations/:id', (req, res)=> {
  const id = req.params.id;
  const sql = "delete from nations_table where id = ?"
  db.query(sql, [id], (err,results) => {
    if(err) console.log(err);
    console.log(results);
  })
  res.redirect(302, `http://localhost:${port}/nations`);
});

app.patch('', ()=>{});

app.listen(port, "localhost", () => {
  console.log(`localhost 도메인의 port ${port} 번에 서버 생성 후 대기 중...`)
})