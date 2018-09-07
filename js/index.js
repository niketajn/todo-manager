const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "June",
              "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

function createTable(db) {
    db.transaction(function(tx) {
        tx.executeSql('create table IF NOT EXISTS category (id integer primary key, name text not null)', [], function(transaction, result) {
          console.log('Ctageory Table created Successfully!');
          createTaskTable(db);
        }, function(transaction, error) {
            console.log(error);
        });
    }, transError, transSuccess);
}


function createTaskTable(db) {
    db.transaction(function(tx) {
        tx.executeSql('create table IF NOT EXISTS task (id integer primary key,title text not null,description text,todoDate date,dateCreated date,categoryID integer not null,FOREIGN KEY(categoryID) references category(id))', [], function(transaction, result) {
          console.log('Task Table created Successfully!');
          displayTaskRecords(db);
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

function displayTaskRecords(db){
    db.transaction(function(tx) {

        tx.executeSql("SELECT task.id,task.title,task.description,task.todoDate,task.dateCreated,category.id FROM task inner join category on task.categoryID = category.id order by dateCreated asc", [], function(sqlTransaction, sqlResultSet) {
            var rows = sqlResultSet.rows;
            var len = rows.length;
            console.log(task);

            if(len == 0){
              $('.divBody').html('No Todo List. Please click Category to add category');
            }
            var ul = $('#taskList');

            ul.empty();
            for (var i = 0; i < len; i++) {
              var task = rows[i];
              //console.log(task);
              var li = $('<li></li>');
              

              var p1 = $('<p></p>');
              //p1.html(task.dateCreated);
              li.addClass('list-group-item listItem');
              li.append(p1);


              
              var created_on = new Date(task.dateCreated);
              
              var month = monthName[created_on.getMonth()+1];
              var year = created_on.getFullYear();
              var day = created_on.getDate();
              
              var dateCreated = day+"-"+month+"-"+year
              
              p1.html(dateCreated)

              var span1=$('<span></span>');
              span1.html(task.todoDate);
              span1.addClass('pull-right');
              p1.append(span1);

              var p2 = $('<p></p>');
              p2.html(task.title);

              li.append(p2);
              
              var p = $('<p></p>');
              p.html(task.description);

              li.append(p);

              ul.append(li);
              
            }

            console.log('task record Displayed');
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

/*function dropCategory(db,categoryid) {
    db.transaction(function(tx) {
        tx.executeSql('drop table category', [], function(transaction, result) {
            console.info('Dropped Successfully!');
        }, function(transaction, error) {
            console.log(error);
        });
    });
}

function dropTask(db,categoryid) {
    db.transaction(function(tx) {
        tx.executeSql('drop table task', [], function(transaction, result) {
            console.info('Dropped Successfully!');
        }, function(transaction, error) {
            console.log(error);
        });
    });
}*/