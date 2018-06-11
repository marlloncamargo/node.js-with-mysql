var express   =    require("express");
var cors      =    require('cors');
var mysql     =    require('mysql');
var app       =    express();

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'categories',
    debug    :  false
});

app.use(cors());

function handle_database(req,res) {
  pool.getConnection(function(err,connection){
    if (err) {
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }

    console.log('connected as id ' + connection.threadId);

    connection.query("SELECT fb.id AS id_facebook, fb.ds AS ds_facebook, ct.id AS id_category, ct.ds AS ds_category FROM category_facebook fc, category ct, facebook fb WHERE fc.id_category = ct.id AND fc.id_facebook = fb.id",function(err,rows){
        connection.release();
        if(!err) {
            res.json(rows);
        }
    });

    connection.on('error', function(err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
    });
  });
}

function search_by_category(req,res) {
  pool.getConnection(function(err,connection){
    if (err) {
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }

    console.log('connected as id ' + connection.threadId);

    connection.query("SELECT fb.id AS id_facebook, fb.ds AS ds_facebook, ct.id AS id_category, ct.ds AS ds_category FROM category_facebook fc, category ct, facebook fb WHERE fc.id_category = ct.id AND fc.id_facebook = fb.id and fc.id_category = ?",[req.params.id], function(err,rows){
        connection.release();
        if(!err) {
            res.json(rows);
        }
    });

    connection.on('error', function(err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
    });
  });
}

app.get("/categories",function(req,res){-
        handle_database(req,res);
});

app.get("/categories/:id",function(req,res){-
        search_by_category(req,res);
});

app.listen(8090);
