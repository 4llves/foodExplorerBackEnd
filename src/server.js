const express = require('express');//importo

const routes = require("./routes");

const app = express();//inicio o express
app.use(express.json());//padrão que receberá as info pelo corpo da req

app.use(routes);

const PORT = 3333;//crio o numero da porta
app.listen(PORT, () => console.log(`Server ir running on Port ${PORT} 🚀`));//aqui vai ficar escutando a porta que informei