function createTable(db) {
    db.transaction(function(tx) {
        tx.executeSql('create table IF NOT EXISTS category (id integer primary key, name text not null)', [], function(transaction, result) {
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

$('.btnCategory').on('click',function(){
    displayRecords(db)
});

function displayRecords(db){
	db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM category", [], function(sqlTransaction, sqlResultSet) {
            var rows = sqlResultSet.rows;
            var len = rows.length;
            var select = $('select[name=category]');

            select.empty();

            for (var i = 0; i < len; i++) {
                var category = rows[i];
            	console.log(category)
            	var opt = $('<option></option>');
                opt.attr('value',category.name);
            	opt.attr('id',category.id);
			 	opt.html(category.name);
                select.append(opt);
			 	
                
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