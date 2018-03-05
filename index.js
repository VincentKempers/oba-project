var sparqlquery = `
PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    SELECT ?cho ?title ?img WHERE {
      ?cho dc:type "Poster."^^xsd:string .
      ?cho dc:subject "Music."^^xsd:string .
      ?cho dc:title ?title .
      ?cho foaf:depiction ?img .
    }
    LIMIT 300`;
    // more fun dc:types: 'affiche', 'japonstof', 'tegel', 'herenkostuum'
    // more fun dc:subjects with Poster.: 'Privacy.', 'Pop music.', 'Music.', 'Squatters movement.'

  var encodedquery = encodeURI(sparqlquery);

  var queryurl = 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=' + encodedquery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

    fetch(queryurl)
  .then((resp) => resp.json()) // transform the data into json
    .then(function(data) {
    
    rows = data.results.bindings; // get the results
    imgdiv = document.getElementById('images');
    console.log(rows);

    for (i = 0; i < rows.length; ++i) {
        
        var img = document.createElement('img');
        img.src = rows[i]['img']['value'];
        img.title = rows[i]['title']['value'];
        imgdiv.appendChild(img);
    }
  })
  .catch(function(error) {
    // if there is any error you will catch them here
    console.log(error);
  });