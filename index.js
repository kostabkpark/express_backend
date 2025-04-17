import express from "express"

const app = express()
const port = 3000

app.get('/', (req, res) => {
//   console.log(req.method, req.params, req.query, req.route, req.headers , req.ip, req.protocol  )
//   console.log(res);
  res.setHeader('status', 200);
  res.setHeader('type','html');
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res)=>{
    res.setHeader('status', 200);
    res.setHeader('type', 'json');
    res.json({"name": "홍길동", "age":20});
})

app.get('/param/:id', (req, res)=> {
  const id = req.params.id;
  res.send(`parameter ${id} 에 대한 요청 처리중`);
})

app.get('/query', (req, res)=> {
  console.log(req.query);
  res.send("파라미터 요청 처리중");
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})