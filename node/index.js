const express = require("express")
const app = express()
const port = 3000
const mysql = require("mysql")

const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb",
}

const connection = mysql.createConnection(config)

// iniciar banco
const tableName = "people"
const field = "name"
const value = "Luchage"
// connect
connection.connect((err) => {
  if (err) throw err

  const sqlShowTables = "SHOW TABLES;"
  const sqlCreateTable = `CREATE TABLE ${tableName}(
        id int not null auto_increment,
        name varchar(255),
        primary key(id)
        );`

  // verificar tabela antes de criar
  connection.query(sqlShowTables, function (err, tables) {
    if (err) throw err

    let exists = false

    tables.map((table) => {
      if (tableName === table.Tables_in_nodedb) {
        exists = true
      }
    })

    if (!exists) {
      // criar tabela
      connection.query(sqlCreateTable)
    }
  })
})

app.get("/", (req, res) => {
  const sql = `SELECT * FROM people`
  const sqlInsert = `INSERT INTO people(${field}) VALUES(?)`
  // insere nome
  connection.query(sqlInsert, value, () => {
    // select
    connection.query(sql, (err, rows) => {
      if (err) throw err

      let list = ""
      rows.map((people) => {
        list += `<li>${people.id} - ${people.name}</li>`
      })

      const peoples = `<ul>${list}</ul>`
      const result = `<h1>Full Cycle Rocks!</h1>
                              ${peoples}`

      res.send(result)
    })
  })
})

app.listen(port, () => {
  console.log("Rodando na porta ", port)
})
