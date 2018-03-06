
'use strict';


  let app = {
  sparqlquery: `
PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
    SELECT ?cho ?title ?img ?date WHERE {
     ?cho dc:type "Poster."^^xsd:string .
     ?cho dc:subject "Music."^^xsd:string .
     ?cho dc:title ?title .
     ?cho foaf:depiction ?img .
     ?cho sem:hasBeginTimeStamp ?date .
   }
   ORDER BY ?date
    LIMIT 100`,
    init:  function() {
       app.encodedquery = encodeURI(this.sparqlquery);
       app.queryurl= 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=' + this.encodedquery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
 
      fetch(this.queryurl)
  .then((resp) => resp.json()) // transform the data into json
    .then(function(data) {
    
    var rows = data.results.bindings; // get the results
    var imgdiv = document.getElementById('images');

    content.collection = rows.map(function (d) {
      return {
        image: d.img.value,
        title: d.title.value,
        slug: d.title.value.replace(/\s+/g, '-').toLowerCase(),
        date: d.date.value
      };
    });

    for (let i = 0; i < rows.length; ++i) {

        var sections = document.createElement('div');
        var linkAround = document.createElement('a');
        var img = document.createElement('img');
        var p = document.createElement('p');

        img.src = rows[i]['img']['value'];
        img.title = rows[i]['title']['value'];
        linkAround.href = "#detail/" + rows[i]['title']['value'];
        p.innerHTML = img.title;

        imgdiv.appendChild(sections);
        sections.appendChild(linkAround)
        linkAround.appendChild(img);
        linkAround.appendChild(p);
    }
  }).catch(function(error) {
    console.log(error);
    });
  }
};

let content = (function() {

  function hideElements(selector) {
    document.querySelectorAll(selector).forEach(function(element) {
      element.classList.add('hidden');
    });
  }
  function showElement(selector) {
      document.querySelector(selector).classList.remove('hidden');
  };

  var collection = {};

  return {
   toggle: function(id) {
     hideElements('section');
     showElement(id);
   },
   router: function(){
     routie({
      'images': function(){
        content.toggle(window.location.hash);
      },
      'detail/*': function(detail) {
        renderPage.detailHtml(detail);
      }
    });
   },
   collection: collection
  }
})();

var renderPage = {
  detailHtml: function(detail) {
    var html = `<div>`;
    content.collection.forEach(function(d){
      console.log(d);
      if (detail == d.title) {
        html += `
        <h1>${d.title}</h1>
        <p>${d.date}</p>
        <img src="${d.image}" title="${d.title}">
        <p>Lorem ipsum dolor sit amet, in amet omnesque pri, vis adhuc imperdiet ei. Te sit nobis nominati reprimique, vis verterem scribentur eu. Ad dicunt molestie partiendo has, an vocent splendide mea. Sapientem abhorreant ei eam. Nam dicta errem appetere in, euismod veritus mnesarchum his ei.
        </p>
        <iframe src="https://open.spotify.com/embed?uri=spotify:album:1DFixLWuPkv3KT3TnV35m3"
        width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        `;
      } else {
        console.log('no');
      }
      html += `</div>`;
      document.getElementById("detail").innerHTML = html;
    });
  }
};

app.init();
content.router('#images');
console.log(content.collection);