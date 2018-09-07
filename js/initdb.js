var db,db_name,db_version,db_describe,db_size;

$(document).ready(function(){
	
	function createDb() {
	    db_name = 'todoDB';
	    db_version = '1.0';
	    db_describe = 'Test DB';
	    db_size = 2048;
	    db = openDatabase(db_name, db_version, db_describe, db_size)
        console.log("Database opened Successfully! Or created for the first time !");
        createTable(db);
	}

	createDb();

	displayRecords(db)
});
