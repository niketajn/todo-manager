function createTable(db) {
    db.transaction(function(tx) {
        tx.executeSql('create table IF NOT EXISTS category (id integer primary key, name text)', [], function(transaction, result) {
            console.log('Table created Successfully!');
        }, function(transaction, error) {
            console.log(error);
        });
    }, transError, transSuccess);
}

function transError(t, e) {
    console.log(t);
    console.log(e);
    console.error("Error occured ! Code:" + e.code + " Message : " + e.message);
}

function transSuccess(t, r) {
    console.info("Transaction completed Successfully!");
    console.log(t);
    console.log(r);
}


$('#add_category').on('click',function(){
	var categoryName;
	categoryName = $('input[name=category_name]').val();
	insertRecords(db,categoryName);
	$('#cancel').click();
	displayRecords(db);

})

function insertRecords(db,categoryName) {
    if (db) {
        db.transaction(function(tx) {
            tx.executeSql('insert into category(name) values(?)', [categoryName], function(transaction, result) {
            }, function(transaction, error) {
                console.log(error);
            });
            
        }, transError, transSuccess);
    } else {
        console.log('No Database man! wait creating it for you!');
        createDb();
    }
}


function displayRecords(db){
	db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM category", [], function(sqlTransaction, sqlResultSet) {
            var rows = sqlResultSet.rows;
            var len = rows.length;
            
            var ul = $('#categoryGroup');

            ul.empty();

            for (var i = 0; i < len; i++) {
                var category = rows[i];
            	
            	var li = $('<li></li>');

            	var span1 = $('<span></span>');
            	span1.addClass('categoryID');
            	span1.css('display','none');
            	span1.html(category.id);

            	li.addClass('list-group-item listItem');
			 	li.html(category.name);
			 	ul.append(li);

            	span = $('<span class="fa fa-trash-o fa-lg fa-fw pull-right" title="Delete"></span>');
            	span.click(deleteCategory);
                li.append(span);
                li.append(span1);
            }
            console.log('Done!!!');
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

function deleteCategory(){
	var categoryid;
			if (confirm("Are you sure?")) {     	
				var button = $(event.target);  //which button is clicked
		    	var li = button.parent();
		    	categoryid = li.find('.categoryID').html(); //find inside tr children
		    	deleteRecordByID(db,categoryid);
		    	
		    }
    }

function deleteRecordByID(db,categoryid) {
    db.transaction(function(tx) {
    	console.log(categoryid);
        tx.executeSql('delete from category where id=?', [categoryid], function(transaction, result) {
            console.info('Record Deleted Successfully!');
            displayRecords(db);
        }, function(transaction, error) {
            console.log(error);
        });
    }, transError, transSuccess);
}
