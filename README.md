TEI HTML Converter
===

Converts HTML to TEI through your own specifications !

Example
```javascript
$("#witness-content").TEIWitness({
      "conversion" : {
        "h1, h2": "head",
        "li" : "l",
        "ol": "lg",
        "span.norm, span.word.choice:visible": {
          "tag": "w",
          "@id": {
            name: "xml:id",
            cb: function(current) {
              if(typeof current.parent !== "undefined" && current.parent().attr("id")) {
                return current.parent().attr("id");
              } else {
                return current.attr("id");
              }
            }
          }
        }
      },
      "extract": ["span.choice-apparatus w"],
      "remove": ["@class", "@style", "@data-source", "span", "@data-original-title", "@data-title", "@title"],
      "prepend" : `<?xml version="1.0" encoding="UTF-8"?>
<?xml-model href="http://www.tei-c.org/release/xml/tei/custom/schema/relaxng/tei_all.rng" type="application/xml" schematypens="http://relaxng.org/ns/structure/1.0"?>
<?xml-model href="http://www.tei-c.org/release/xml/tei/custom/schema/relaxng/tei_all.rng" type="application/xml"
  schematypens="http://purl.oclc.org/dsdl/schematron"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
      <fileDesc>
         <titleStmt>
            <title>Title</title>
         </titleStmt>
         <publicationStmt>
            <p>Publication Information</p>
         </publicationStmt>
         <sourceDesc>
            <p>Information about the source</p>
         </sourceDesc>
      </fileDesc>
  </teiHeader>
  <text>
      <body>`,
      "append" : `
      </body>
  </text>
</TEI>`
});
```