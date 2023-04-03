var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
// var router = express.Router();

var path = require('path');
const { connect } = require('http2');

// Please provide correct database information here
var connection = mysql.createConnection({
    host: '<HOST>',
    user: '<USER>',
    password: '<PASSWORD>',
    database: '<DATABASE NAME>'
});

connection.connect;

var cur_rest_id;
var cur_location_id;
global.query_result;
var user_id = -1;
var username = "None";
var review_id;
var in_reviewer = 0;

var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));


/* GET home page, respond by rendering index.ejs */
app.get('/', function (req, res) {
    res.render('login', { title: 'Robust Restaurant System Login' });
});

app.get('/addcommentsuccess', function (req, res) {
    res.send('comment added successfully!');
});

app.get('/addcommentfail', function (req, res) {
    res.send('No such restaurant! Or you input an invalid rating!');
});

app.get('/delcommentsuccess', function (req, res) {
    res.send('Comment deleted successfully!');
});

app.get('/addsuccess', function (req, res) {
    res.send('Restaurant added successfully!');
});

app.get('/delsuccess', function (req, res) {
    res.send('Restaurant deleted successfully!');
});

app.get('/updatesuccess', function (req, res) {
    res.send('Restaurant updated successfully!');
});

app.get('/loginfail', function (req, res) {
    res.send("Wrong password or wrong username!");
});

app.get('/notadmin', function (req, res) {
    res.send("You are not an adminstrator!");
})

app.get('/mustlogin', function (req, res) {
    res.send("You must login to do this!");
})

app.get('/invalidcompare', function (req, res) {
    res.send("Please type in valid restaurant ID or one of restaurants may not offer any food and therefore can't be compared due to some incompleteness of this system so far. Please try another restaurant ID!");
})

app.get('/norestid', function (req, res) {
    res.send("This Restaurant ID corresponds to no restaurant!");
})

app.get('/noreviewid', function (req, res) {
    res.send("This Review ID corresponds to no review!");
})

app.get('/notyours', function (req, res) {
    res.send("This comment isn't written by you, you can't delete it!")
})

app.post('/showcomment', function (req, res) {
    var restid = req.body.comment_restid;
    var sql = `SELECT * FROM Contain NATURAL JOIN Review NATURAL JOIN Restaurant NATURAL JOIN Writes NATURAL JOIN Reviewer  WHERE RestaurantID = ${restid};`;
    connection.query(sql, function (err, result) {
        if (err) {
            res.send(err);
            return;
        }
        if (result.length == 0) {
            res.redirect('/norestid');
            return;
        }
        res.render('show_comment', { title: 'Review of restaurant', data: result });
    })


})
// this code is executed when a user clicks the form submit button
//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
// add a comment
app.post('/addcomment', function (req, res) {
    var ins_rating = req.body.Rating;
    var ins_comment = req.body.comment;
    var ins_RestaurantID = req.body.RestaurantID;
    if (user_id == -1) {
        res.redirect('/mustlogin');
    }
    var ins_reviewerid = user_id;
    var ins_reviewername = username;


    var date = new Date();
    var ins_date = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);

    var check_sql = `SELECT * FROM Restaurant r WHERE r.RestaurantID='${ins_RestaurantID}' `;

    var review_sql = `INSERT INTO Review (ReviewID, Rating, Comment, ReviewDate) 
              VALUES ('${review_id}','${ins_rating}','${ins_comment}', '${ins_date}')`;

    var contain_sql = `
              INSERT INTO Contain (RestaurantID, ReviewID) 
              VALUES ('${ins_RestaurantID}','${review_id}')`;

    var write_sql = `
              INSERT INTO Writes (ReviewerID, ReviewID) 
              VALUES ('${ins_reviewerid}','${review_id}')`;

    var reviewer_sql = `INSERT INTO Reviewer VALUES ('${ins_reviewerid}', '${ins_reviewername}');`;


    connection.query(check_sql, function (err, result) {
        if (err) {
            res.send(err)
            return;
        }
        if (result == 0 || ins_rating <> 5) {
            console.log("no such Restaurant");
            res.redirect('/addcommentfail');
            return;
        }
    });

    if (in_reviewer == 0) {
        connection.query(reviewer_sql, function (err, result) {
            if (err) {
                res.send(err);
                return;
            }
        })
    }


    connection.query(review_sql, function (err, result) {
        if (err) {
            res.send(err)
            return;
        }
    });

    connection.query(write_sql, function (err, result) {
        if (err) {
            res.send(err)
            return;
        }
    });
    connection.query(contain_sql, function (err, result) {
        if (err) {
            res.send(err)
            return;
        }
        review_id = review_id + 1;
        res.redirect('/addcommentsuccess');
    });


});


//  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
app.post('/addrest', function (req, res) {
    var restname = req.body.RestaurantName;
    var phonenumber = req.body.PhoneNumber;
    var pricelevel = req.body.PriceLevel;
    var averating = req.body.AverageRating;
    var ratingnum = req.body.RatingNum;
    var cuisine = req.body.Cuisine;
    var delivery = req.body.Delivery;
    var dinein = req.body.Dine_In;
    var location = req.body.location;

    var locsql1 = `INSERT INTO Location (LocationID, Address) VALUES (${cur_location_id},'${location}')`;
    var locsql2 = `INSERT INTO Locate (RestaurantID,LocationID) VALUES (${cur_rest_id},${cur_location_id})`;

    var sql = `INSERT INTO Restaurant (RestaurantID, RestaurantName, PhoneNumber, PriceLevel, AverageRating, Cuisine, Delivery, Dine_In, RatingNum) VALUES ('${cur_rest_id}','${restname}','${phonenumber}', '${pricelevel}', '${averating}', '${cuisine}', '${delivery}', '${dinein}', '${ratingnum}')`;

    connection.query(sql, function (err, result) {
        if (err) {
            res.send(err)
            return;
        }
    });

    connection.query(locsql1, function(err, result) {
        if(err){
            res.send(err);
            return;
        }
    })

    connection.query(locsql2, function(err,result) {
        if(err){
            res.send(err);
            return;
        }
        res.redirect('/addsuccess');
    })
});


app.post('/delrest', function (req, res) {
    var restname = req.body.RestaurantName;
    var why_not_working = req.body.RestaurantID;
    var locationid = req.body.dellocationID;


    if (restname.length === 0 || why_not_working === null) {
        console.log('please input a restaurant name and ID');
    } else {
        var sql = `DELETE FROM Restaurant WHERE RestaurantName='${restname}' AND RestaurantID=${why_not_working}`;
    }
    var del_loc_sql = `DELETE FROM Locate WHERE RestaurantID = ${why_not_working} AND LocationID = ${locationid}`;

    connection.query(del_loc_sql, function (err, result) {
        if (err) {
            res.send(err)
            return;
        }
    });


    connection.query(sql, function (err, result) {
        if (err) {
            res.send(err)
            return;
        }
        res.redirect('/delsuccess');
    });
});

app.post('/updrest', function (req, res) {
    var rest_id = req.body.idToUpdate;
    var new_rest_name = req.body.restNameToUpdate;
    var new_phone_num = req.body.phoneNumToUpdate;
    var new_price_lvl = req.body.priceLevelToUpdate;
    var new_avg_rating = req.body.avgRatingToUpdate;
    var new_cuisine = req.body.cuisineToUpdate;
    var new_delivery = req.body.deliveryUpdate;
    var new_dinein = req.body.dineInUpdate;

    var sql = `UPDATE Restaurant SET RestaurantName='${new_rest_name}', PhoneNumber='${new_phone_num}', PriceLevel=${new_price_lvl}, AverageRating=${new_avg_rating}, Cuisine='${new_cuisine}', Delivery=${new_delivery}, Dine_In=${new_dinein} WHERE RestaurantID=${rest_id}`;

    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err) {
            res.send(err)
            return;
        }
        res.redirect('/updatesuccess');

    });
});

// Find best rated dish based on zipcode
app.post('/findbestfoodzip', function (req, res) {
    var zipcode_num = req.body.zipcodeToFind;

    var sql = `SELECT FoodName, ROUND(AVG(AverageRating), 2) as AVGRating FROM OfferFood NATURAL JOIN Restaurant NATURAL JOIN Locate NATURAL JOIN Location WHERE Zipcode = '${zipcode_num}' GROUP BY FoodName ORDER BY AVGRating DESC`;

    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err) {
            res.send(err)
            return;
        }
        res.render('search_zip', { title: 'Zipcode Search Result', data: result, keyword: zipcode_num })
    });
});


// Search with time
app.post('/searchwithtime', function (req, res) {
    var rest_word = req.body.keyword;
    var rest_time = req.body.time;
    var rest_day = req.body.day;
    var sql = `
  SELECT RestaurantID, RestaurantName, Cuisine, FoodName,OpenTime
  FROM OfferFood o NATURAL JOIN Restaurant r NATURAL JOIN BusinessHours NATURAL JOIN 
  Schedules s1 
  WHERE (o.FoodName like "%${rest_word}%" or r.RestaurantName like "%${rest_word}%" ) 
  AND DayOfWeek = "${rest_day}"
  and RestaurantID in 
( 
 SELECT RestaurantID 
 FROM Restaurant r NATURAL JOIN BusinessHours NATURAL JOIN Schedules 
 WHERE DayOfWeek = "${rest_day}" and Hour(OpenTime)>${rest_time} 
)
  order by OpenTime asc;   `

    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err) {
            res.send(err)
            return;
        }

        res.render('search_time', { title: 'Time Search Result', data: result, word: rest_word, time: rest_time, day: rest_day })
    });
});

// Search keyword
app.post('/searchkeyword', function (req, res) {
    var rest_word = req.body.keyword;
    var sql = `
  SELECT *
  FROM OfferFood o NATURAL JOIN Restaurant r
  WHERE (o.FoodName like "%${rest_word}%" or r.RestaurantName like "%${rest_word}%" );`

    connection.query(sql, function (err, result) {
        if (err) {
            res.send(err)
            return;
        }

        res.render('search_key', { title: 'Keyword Search Result', data: result, keyword: rest_word })
    });
});

// User Login
app.post('/restaurant-user-system', function (req, res) {
    var usr_name = req.body.username;
    var passwd = req.body.password;
    var sql = `
  SELECT *
  FROM User
  WHERE UserName = "${usr_name}" AND Password = "${passwd}";`;


    connection.query(sql, function (err, result) {
        if (err) {
            res.send(err);
            return;
        }

        user_id = -1;
        username = "None";
        if (result.length == 0) {
            res.redirect('/loginfail');
            return;
        } else {
            user_id = result[0].UserID;
            username = result[0].UserName;

            // Set review id
            var get_reviewid_sql = `SELECT MAX(ReviewID) as max_id FROM Review `;
            connection.query(get_reviewid_sql, function (err, result) {
                if (err) {
                    res.send(err);
                    return;
                }
                review_id = result[0].max_id + 1;
                console.log(review_id);
            })

            in_reviewer = 0;
            // Whether this user is in reviewer list
            var reviewer_sql = `SELECT * FROM Reviewer WHERE ReviewerID = ${user_id}`
            connection.query(reviewer_sql, function (err, result) {
                if (err) {
                    res.send(err);
                    return;
                }
                if (result.length != 0) {
                    in_reviewer = 1;
                }
            })

            res.render('user_index', { title: 'Robust Restaurant System' });
        }
    })

})

// Admin Login
app.post('/restaurant-admin-system', function (req, res) {
    var usr_name = req.body.username;
    var passwd = req.body.password;
    var sql = `
  SELECT *
  FROM User
  WHERE UserName = "${usr_name}" AND Password = "${passwd}";`;

    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err) {
            res.send(err);
            return;
        }
        username = "None";
        user_id = -1;
        if (result.length == 0) {
            res.redirect('/loginfail');
            return;
        }
        else {
            if (result[0].isAdmin == 1) {
                user_id = result[0].UserID;
                username = result[0].UserName;

                // Set restaurant ID
                var get_restid_sql = `SELECT MAX(RestaurantID) as max_id FROM Restaurant `;
                connection.query(get_restid_sql, function (err, result) {
                    if (err) {
                        res.send(err);
                        return;
                    }
                    cur_rest_id = result[0].max_id + 1;
                })

                // Set location ID
                var get_locid_sql = `SELECT MAX(LocationID) as max_id FROM Location `;
                connection.query(get_locid_sql, function (err, result) {
                    if (err) {
                        res.send(err);
                        return;
                    }
                    cur_location_id = result[0].max_id + 1;
                })


                res.render('admin_index', { title: 'Robust Restaurant System' });
            } else {
                res.redirect('/notadmin');
            }
        }

    })
})

// Trial
app.post('/restaurant-trial-system', function (req, res) {
    res.render('user_index', { title: 'Robust Restaurant System' });
})


// Basic search (restaurant)
app.post('/search-restaurant', function (req, res) {

    var rest = req.body.restaurant_input;

    var sql;
    if (!rest) {
        sql = `SELECT * FROM Restaurant NATURAL JOIN Locate NATURAL JOIN Location `;
    } else {
        sql = `SELECT * FROM Restaurant NATURAL JOIN Locate NATURAL JOIN Location WHERE RestaurantName LIKE "%${rest}%";`
    }

    connection.query(sql, function (err, result) {
        if (err) {
            res.send(err);
            return;
        }

        res.render('search_restaurant', { title: "Restaurant Search Result", data: result, keyword: rest });
    })

})

app.post('/admin-search-restaurant', function (req, res) {

    var rest = req.body.restaurant_input;

    var sql;
    if (!rest) {
        sql = `SELECT * FROM Restaurant NATURAL JOIN Locate NATURAL JOIN Location `;
    } else {
        sql = `SELECT * FROM Restaurant NATURAL JOIN Locate NATURAL JOIN Location WHERE RestaurantName LIKE "%${rest}%";`
    }

    connection.query(sql, function (err, result) {
        if (err) {
            res.send(err);
            return;
        }
        console.log(result);

        res.render('admin_search_rest', { title: "Restaurant Search Result", data: result, keyword: rest });
    })

})

app.listen(80, function () {
    console.log('Node app is running on port 80');
});

// Show favourite restaurants  
app.post('/show-favourite', function (req, res) {
    if (user_id == -1) {
        res.redirect('./mustlogin');
    }

    var sql = `SELECT *
  FROM Restaurant NATURAL JOIN Likes NATURAL JOIN Locate NATURAL JOIN Location
  WHERE UserID = ${user_id}`

    connection.query(sql, function (err, result) {
        if (err) {
            res.send(err);
            return;
        }

        res.render('favourite_restaurant', { title: "Favourite Restaurant", data: result });
    })
})

// Comparison  
app.post('/comparison', function (req, res) {
    var restid1 = req.body.rest1;
    var restid2 = req.body.rest2;

    var sql = `SELECT r.RestaurantID, r.RestaurantName, r.PriceLevel, r.AverageRating, RatingNum, r.Cuisine, r.Delivery, r.Dine_In, ln.Address
  FROM Restaurant r NATURAL JOIN Locate le NATURAL JOIN Location ln
  WHERE r.RestaurantID = ${restid1} OR r.RestaurantID = ${restid2}
`

    connection.query(sql, function (err, result) {
        if (err) {
            res.send(err);
            return;
        }

        console.log(result);
        if (result.length != 2) {
            res.redirect("./invalidcompare");
        } else {
            var list = ["ID", "Name", "Price Level", "Average Rating", "Number of Rating", "Cuisine", "Delivery", "Dine In", "Address"];
            var col1 = [];
            var col2 = [];
            var result1 = [];
            var result2 = [];
            for (const property in result[0]) {
                col1.push(result[0][property]);
            }
            for (const property in result[1]) {
                col2.push(result[1][property]);
            }

            // -------------
            // ID
            result1.push('-');
            result2.push('-');
            // Name
            result1.push('-');
            result2.push('-');
            // Price Level
            if (!col1[2] || !col2[2] || (col1[2] == col2[2])) {
                result1.push('-');
                result2.push('-');
            } else {
                if (col1[2] > col2[2]) {
                    result1.push('↓');
                    result2.push('↑');
                } else {
                    result1.push('↑');
                    result2.push('↓');
                }
            }
            // Average Rating
            if (!col1[3] || !col2[3] || (col1[3] == col2[3])) {
                result1.push('-');
                result2.push('-');
            } else {
                if (col1[3] < col2[3]) {
                    result1.push('↓');
                    result2.push('↑');
                } else {
                    result1.push('↑');
                    result2.push('↓');
                }
            }
            // Number of Rating
            if (!col1[4] || !col2[4] || (col1[4] == col2[4])) {
                result1.push('-');
                result2.push('-');
            } else {
                if (col1[4] < col2[4]) {
                    result1.push('↓');
                    result2.push('↑');
                } else {
                    result1.push('↑');
                    result2.push('↓');
                }
            }
            // Cuisine  
            result1.push('-');
            result2.push('-');

            // Delivery  
            if (!col1[6] || !col2[6] || (col1[6] == col2[6])) {
                result1.push('-');
                result2.push('-');
            } else {
                if (col1[6] < col2[6]) {
                    result1.push('↓');
                    result2.push('↑');
                } else {
                    result1.push('↑');
                    result2.push('↓');
                }
            }
            // Dine In
            if (!col1[7] || !col2[7] || (col1[7] == col2[7])) {
                result1.push('-');
                result2.push('-');
            } else {
                if (col1[7] < col2[7]) {
                    result1.push('↓');
                    result2.push('↑');
                } else {
                    result1.push('↑');
                    result2.push('↓');
                }
            }
            // Address  
            result1.push('-');
            result2.push('-');

            // -------------

            res.render('compare', { title: "Restaurant Comparsion", rest1: result[0], rest2: result[1], compare_list: list, col1: col1, col2: col2, result1: result1, result2: result2 });
        }




    })

})


app.post('/storedproctest', function (req, res) {
    if(user_id == -1){
        res.redirect('/mustlogin');
    }

    var dayofweek = req.body.dayofweek;
    var timeofday = req.body.timeofday;
    /*  var sql1 = `DROP PROCEDURE <procedure_name>`
      var sql2 = `CREATE PROCEDURE <procedure_name(_args)
            BEGIN
            COMMANDS;
            END;>`*/
    var sql3 = `CALL new_procedure('${dayofweek}',${timeofday},${user_id});`

    /*ALSO CHANGE THE VARIABLE NAME BELOW WHEN TESTING. PROBABLY COPY AND PASTE THE BELOW CODE TWO OTHER PLACES THO*/
    console.log(sql3);
    connection.query(sql3, function (err, result) {
        if (err) {
            res.send(err)
            return;
        }

        res.render('procedure',{title:"Stored Procedure", dayofweek:dayofweek, timeofday:timeofday, data:result[0]})
    });
});
