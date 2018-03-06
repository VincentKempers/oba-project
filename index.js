// var sparqlquery = `
// PREFIX dc: <http://purl.org/dc/elements/1.1/>
//     PREFIX foaf: <http://xmlns.com/foaf/0.1/>
//     SELECT ?cho ?title ?img WHERE {
//    {
//      ?cho dc:type "Poster."^^xsd:string .
//      ?cho dc:subject "Pop Music."^^xsd:string .
//      ?cho dc:title ?title .
//      ?cho foaf:depiction ?img .
//    }
//    UNION
//    {
//      ?cho dc:type "Poster."^^xsd:string .
//      ?cho dc:subject "Music."^^xsd:string .
//      ?cho dc:title ?title .
//      ?cho foaf:depiction ?img .
//    }
//    }
//     LIMIT 100`;
//     // more fun dc:types: 'affiche', 'japonstof', 'tegel', 'herenkostuum'
//     // more fun dc:subjects with Poster.: 'Privacy.', 'Pop music.', 'Music.', 'Squatters movement.'

  // var encodedquery = encodeURI(sparqlquery);

'use strict';
  let app = {
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
    init:  function() {
       app.encodedquery = encodeURI(this.sparqlquery);
       app.queryurl= 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=' + this.encodedquery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
 
      fetch(this.queryurl)
  .then((resp) => resp.json()) // transform the data into json
    .then(function(data) {
    
    var rows = data.results.bindings; // get the results
    var imgdiv = document.getElementById('images');
    console.log(rows);

    for (let i = 0; i < rows.length; ++i) {

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
  }).catch(function(error) {
    // if there is any error you will catch them here
    console.log(error);
    })
  },
  
};

app.init();