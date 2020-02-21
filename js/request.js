const request = (function(){

  const base_url = "http://127.0.0.1:3000";

  //A function used for all four requests (POST, PUT, GET and DELETE).
  const makeAPIRequest = function(request_type, query, params) {
    return new Promise(function(resolve, reject){
      var query_url = base_url + query;
      var xhttp = new XMLHttpRequest();

      xhttp.open(request_type, query_url);
      xhttp.setRequestHeader('Content-Type', 'application/json')

      xhttp.addEventListener('load', function() {
        if(this.status === 200) {
          resolve(this.response);
        } else {
          reject(this.response);
        }
      });

      //Check to see if the params have been included in the request.
      params = (typeof params === 'undefined') ? 'default' : params;

      //If params have been included then send them.
      if (params === "default") {
        xhttp.send();
      } else {
        xhttp.send(JSON.stringify(params));
      }
    });
  }

  //Used to encode any parameters passed to the searchDatabase function.
  const encodeParameters = function(params) {
    var strArray = [];
    Object.keys(params).forEach(function(key) {
      var paramString = encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      strArray.push(paramString);
    });
    return strArray.join("&");
  };

  //Search the database for something specific, the params including the type and relevant detail.
  const searchDatabase = function(params) {
    var results = request.makeAPIRequest("GET", "/search?" + request.encodeParameters(params));
    return results;
  }

  //Add a single text item to a list using a list element.
  const addListItem = function(text, list) {
    var text = document.createTextNode(text);
    var list_item = document.createElement('li');
    list_item.appendChild(text);
    list.appendChild(list_item);
  }

  //Update the output with just one text result.
  const updateSingleOutput = function(result, list) {
    list.innerHTML = "";
    request.addListItem("Result: ", list);
    request.addListItem(result, list);
  }

  //Add all the relevant information needed for the user to enter the right input.
  const updateData = function(query_type, list) {
    list.innerHTML = "";

    //Check to see if the query type is of users, rooms or authors.
    if(query_type === "users" || query_type === "rooms" || query_type === "authors") {
      //Get all of that query type in the database
      makeAPIRequest("GET", "/" + query_type)
      .then(function(results){
        addListItem("Current " + query_type + ": ", list);
        var parsed_results = JSON.parse(results);
        parsed_results.forEach(function(result){
          //Depending on which query type, add to the UI a list item containing the relevant information.
          if (query_type === "users") {
            addListItem("Name: " + result.name + ", Barcode: " + result.barcode + ", Member Type: " + result.memberType, list);
          }
          if (query_type === "rooms") {
            addListItem("Room Name: " + result.name, list);
          }
          if (query_type === "authors") {
            addListItem("Author Name: " + result.name, list);
          }
        })
      })
    }

    //Similar to the previous if statement, checks for a books query
    if(query_type === "books") {
      //This time all is similar except the allEntities=true to obtain all Authors for the book.
      makeAPIRequest("GET", "/" + query_type + "?allEntities=true")
      .then(function(books){
        var parsed_books = JSON.parse(books);
        addListItem("Current " + query_type + ": ", list);
        parsed_books.forEach(function(book){
          var authors = "";
          addListItem("Title: " + book.title + ", ISBN: " + book.isbn, list);
          book.Authors.forEach(function(author){
            authors += author.name + ", ";
          })
          addListItem("Authors: " + authors, list);
          addListItem(" - ", list);
        })
      })
    }
  }

  //A function that splits a date up into it's constituent parts
  const splitDate = function(booking_time) {
    //Split into date and time.
    var date_and_time = booking_time.split('T');
    //Split into days, months and years
    var date = date_and_time[0].split('-');
    //Split into hours, minutes, seconds etc..
    var time = date_and_time[1].split(':');

    //Make a string that represents the UK date format.
    date = date[2] + "-" + date[1] + "-" + date[0];
    //Only include the hours and minutes in the time string.
    time = time[0] + ":" + time[1];

    return [date, time];
  }

  // Return the constant functions for re-use.
  return {
    makeAPIRequest : makeAPIRequest,
    encodeParameters : encodeParameters,
    searchDatabase : searchDatabase,
    updateSingleOutput : updateSingleOutput,
    updateData : updateData,
    addListItem : addListItem,
    splitDate : splitDate
  }
})();
