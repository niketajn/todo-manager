function createTable(db) {
    db.transaction(function(tx) {
        tx.executeSql('create table IF NOT EXISTS category (id integer primary key, name text not null)', [], function(transaction, result) {
          console.log('Ctageory Table created Successfully!');
          displayCategoryRecords(db);
          createTaskTable(db);
        }, function(transaction, error) {
            console.log(error);
        });
    }, transError, transSuccess);
}


function createTaskTable(db) {
    db.transaction(function(tx) {
        tx.executeSql('create table IF NOT EXISTS task (id integer primary key, title text not null ,description text,todoDate date,dateCreated date,categoryID integer not null,FOREIGN KEY(categoryID) references category(id))', [], function(transaction, result) {
          console.log('Task Table created Successfully!');
          //insertTaskRecords(db);
        }, function(transaction, error) {
            console.log(error);
        });
    }, transError, transSuccess);
}

function transError(t, e) {
    //console.log(t);
    //console.log(e);
    console.error("Error occured ! Code:" + e.code + " Message : " + e.message);
}

function transSuccess(t, r) {
    console.info("Task Transaction completed Successfully!");
    //console.log(t);
   // console.log(r);
}


function insertTaskRecords(db,title,description,todoDate,categoryID) {
    
    if (db) {
        db.transaction(function(tx) {
            tx.executeSql('insert into task(title,description,todoDate,dateCreated,categoryID) values(?,?,?,date(\'now\'),?)', [title,description,todoDate,categoryID], function(transaction, result) {
           // displayTaskRecords(db);
            }, function(transaction, error) {
                console.log(error);
            });
            
        }, transError, transSuccess);
    } else {
        console.log('No Database man! wait creating it for you!');
        createDb();
    }
}

function displayCategoryRecords(db){
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM category", [], function(sqlTransaction, sqlResultSet) {
            var rows = sqlResultSet.rows;
            var len = rows.length;
            var select = $('#category');
            select.empty();

            for (var i = 0; i < len; i++) {
                var category = rows[i];
                var opt = $('<option></option>');
                opt.attr('value',category.id);
                opt.html(category.name);
                select.append(opt);
            }
           console.log('category Displayed');
        }, function(sqlTransaction, sqlError) {
            switch (sqlError.code) {
                case sqlError.SYNTAX_ERR:
                    console.error("Syntax error has occurred. " + sqlError.message);
                    break;
                default:
                    console.error("Other error");
            }
        });
    }, transError, transSuccess);
}

$('#todoForm').on('submit',function(e){
    e.preventDefault();
    var categoryID = $('#category').val();
    var title,description,todoDate,createdOn;
    title = $('input[name=title]').val();
    description = $('textarea[name=description]').val();
    todoDate = $('input[name=date]').val();
   insertTaskRecords(db,title,description,todoDate,categoryID);
   window.location='index.html';
   //displayTaskRecords(db);
});



var date_input=$('input[name="date"]');
    date_input.datepicker({
            format: 'dd-M-yyyy',
            todayHighlight: true,
            autoclose: true,
    }); 