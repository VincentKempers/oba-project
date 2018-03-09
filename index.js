
'use strict';

let app = {
  limit: 100,
  offset: 0,
sparqlquery: `
   PREFIX dc: <http://purl.org/dc/elements/1.1/>
   PREFIX foaf: <http://xmlns.com/foaf/0.1/>
   PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
   SELECT DISTINCT  ?cho ?img ?date ?title ?desc WHERE {
    ?cho dc:type "Poster."^^xsd:string .
    ?cho dc:subject "Pop music."^^xsd:string .
    ?cho dc:title ?title .
    ?cho dc:description ?desc .
    ?cho foaf:depiction ?img .
    ?cho sem:hasBeginTimeStamp ?date .
  FILTER (?title != "[Poster.]"^^xsd:string)
  FILTER (?title != "Paradiso Talentenshow."^^xsd:string)
  FILTER (?title != "Talentenshow."^^xsd:string)
  FILTER (?title != "Talentengala."^^xsd:string)
  FILTER (?title != "Paradiso talentenshow."^^xsd:string)
  FILTER (?title != "Talentenshow Paradiso."^^xsd:string)
  FILTER (?title != "Paradiso Talenten Gala."^^xsd:string)
  FILTER (?title != "Paradiso TalentenGala."^^xsd:string)
  FILTER (?title != "Talenten Gala!"^^xsd:string)
  FILTER (?title != "Paradiso Talentenshow Gala."^^xsd:string)
  }
  ORDER BY ?date
  LIMIT 1000`,
    init:  function() {
      var sparqlquery = this.sparqlquery;

      app.encodedquery = encodeURIComponent(sparqlquery);
      app.queryurl= 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=' + this.encodedquery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
 
      fetch(this.queryurl)
      .then((resp) => resp.json()) // transform the data into json
      .then(function(data) {
    
      var rows = data.results.bindings; // get the results
      
      content.collection = rows.map(function (d) {
        var theDate = d.date.value;
        var start = theDate.indexOf('');
        var end = theDate.indexOf('?');
        theDate = theDate.substring(start, end);

        return {
          image: d.img.value,
          title: d.title.value,
          slug: d.title.value.replace(/[\s+.]/g, '-').toLowerCase(),
          date: d.date.value.replace(/[?-]/g, ' '),
          desc: d.desc.value.replace(/[?-]/g, ' ')
        };
      });
      renderPage.searchPage();
    })
      .catch(function(error) {
        console.log(error);
    });
  }
};

let content = (function() {

  var collection = {};

  return {
   router: function(){
     routie({
      'images': function(){
        document.getElementById('images').classList.remove('hidden');
        document.getElementById('detail').classList.add('hidden');
      },
      'detail/*': function(detail) {
        renderPage.detailIMG(detail);
        renderPage.detailTekst(detail);
        document.getElementById('detail').classList.remove('hidden');
        document.getElementById('images').classList.add('hidden');
      }
    });
   },
   collection: collection
  }
})();

var renderPage = {
  searchPage: function() {
    var imgdiv = document.getElementById('posters');
    var sections = document.createElement('ul');
    sections.id = "myUL";
    imgdiv.appendChild(sections);
        content.collection.forEach(function(d){
          var listItem = document.createElement('li');
          var linkDetail = document.createElement('a');
          var img = document.createElement('img');
          
          img.src = d.image;
          img.title = d.title;
          linkDetail.href = "#detail/" + d.slug;
          linkDetail.innerHTML = d.title;

          
          sections.appendChild(listItem);
          listItem.appendChild(linkDetail);
          linkDetail.appendChild(img);
      });
  },
  detailIMG: function(detail) {
    var html = `<a href="#images"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
          <path d="M38 12.83L35.17 10 24 21.17 12.83 10 10 12.83 21.17 24 10 35.17 12.83 38 24 26.83 35.17 38 38 35.17 26.83 24z"/>
          <path d="M0 0h48v48H0z" fill="none"/>
        </svg></a>`;
    content.collection.forEach(function(d) {
      if (d.slug === detail && detail !== "undefined") {
        html += `
        <article>
          <h3>${d.title}</h3>
          <img src="${d.image}" title="${d.title}">
          <p>Evenement werd gehouden rond: ${d.date}</p>
          <p>${d.desc}</p>
        </article>`;
      }
      document.getElementById("allimages").innerHTML = html;
    });
  },
  detailTekst: function(detail) {
    var html;
    data.forEach(function(d){
      if (d.title.replace(/[\s+.]/g, '-').toLowerCase() === detail) {
      html += `
      <div class="explain">
          <iframe src="https://open.spotify.com/embed?uri=${d.embed}"
          width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
      </div>
    `;
      } else {
        console.log('error')
      }
    });
    var detailEl = document.getElementById('spotify');
    detailEl.innerHTML = html;
  }
};

function myFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById('myInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].classList.remove('hidden');
        } else {
            li[i].classList.add('hidden');;
        }
    }
}

app.init();
content.router('images');
console.log(content.collection.title)