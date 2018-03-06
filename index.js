var sparqlquery = `
PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    SELECT ?cho ?title ?img WHERE {
   {
     ?cho dc:type "Poster."^^xsd:string .
     ?cho dc:subject "Pop Music."^^xsd:string .
     ?cho dc:title ?title .
     ?cho foaf:depiction ?img .
   }
   UNION
   {
     ?cho dc:type "Poster."^^xsd:string .
     ?cho dc:subject "Music."^^xsd:string .
     ?cho dc:title ?title .
     ?cho foaf:depiction ?img .
   }
   }
    LIMIT 100`;
//     // more fun dc:types: 'affiche', 'japonstof', 'tegel', 'herenkostuum'
//     // more fun dc:subjects with Poster.: 'Privacy.', 'Pop music.', 'Music.', 'Squatters movement.'

  var encodedquery = encodeURI(sparqlquery);

//   var queryurl = 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=' + encodedquery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

//     fetch(queryurl)
//   .then((resp) => resp.json()) // transform the data into json
//     .then(function(data) {
    
//     rows = data.results.bindings; // get the results
//     imgdiv = document.getElementById('images');
//     console.log(rows);

//     for (i = 0; i < rows.length; ++i) {
//         var sections = document.createElement('section');
//         var img = document.createElement('img');
//         var p = document.createElement('p');

//         img.src = rows[i]['img']['value'];
//         img.title = rows[i]['title']['value'];
//         p.innerHTML = img.title;

//         imgdiv.appendChild(sections);
//         sections.appendChild(img);
//         sections.appendChild(p);
//     }
//   })
//   .catch(function(error) {
//     // if there is any error you will catch them here
//     console.log(error);
//   });
'use strict';
  let app = {
    queryurl: 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=' + this.encodedquery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on',
    init:  function() {
      fetch(this.queryurl)
  .then((resp) => resp.json()) // transform the data into json
    .then(function(data) {
    
    rows = data.results.bindings; // get the results
    imgdiv = document.getElementById('images');
    console.log(rows);

    for (i = 0; i < rows.length; ++i) {

        var sections = document.createElement('section');
        var linkAround = document.createElement('a');
        var img = document.createElement('img');
        var p = document.createElement('p');

        img.src = rows[i]['img']['value'];
        img.title = rows[i]['title']['value'];
        linkAround.href = rows[i]['title']['value'];
        p.innerHTML = img.title;

        imgdiv.appendChild(sections);
        sections.appendChild(linkAround)
        linkAround.appendChild(img);
        linkAround.appendChild(p);
    }
  })
    .catch(function(error) {
    // if there is any error you will catch them here
    console.log(error);
    })
  },
  sparqlquery: `
PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    SELECT ?cho ?title ?img WHERE {
   {
     ?cho dc:type "Poster."^^xsd:string .
     ?cho dc:subject "Pop Music."^^xsd:string .
     ?cho dc:title ?title .
     ?cho foaf:depiction ?img .
   }
   UNION
   {
     ?cho dc:type "Poster."^^xsd:string .
     ?cho dc:subject "Music."^^xsd:string .
     ?cho dc:title ?title .
     ?cho foaf:depiction ?img .
   }
   }
    LIMIT 100`,
    encodedquery: encodeURI(this.sparqlquery)
};

app.init();