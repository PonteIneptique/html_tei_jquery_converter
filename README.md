TEI HTML Converter
===

Converts HTML to TEI through your own specifications !

## How to ?

```html
 <script src="../../../src/jquery.html_tei_converter.js"></script>
 <script type="text/javascript">
  $("#html-element").HTML2TEI_Converter({
    //Options here !
  });
 </script>
```

### Params of `HTML2TEI_Converter(options)`

* **object** *options.conversion* Conversion table
* **string** *options.conversion[key]* key should represent a css selector while value should be a valid TEI XML element OR
* **string** *options.conversion[key].tag* Tag to convert to
* **string** *options.conversion[key][@att]* Name of the attribute preceded by @ as key, corresponding attribute name in XML TEI
* **callback** *options.conversion[key][@att].cb* If options.conversion[key][@att] is an object, cb should be a function returning a string, given the current element as value
* **string** *options.conversion[key][@att].name* Name of the new attr
* **Array** *options.extract* List of nodes to extract from their parents (be careful, nodes have already been transformed)
* **Array** *options.remove* Attributes and nodes to remove by default (Start with @ for attribute)
* **string** *options.filename* Filename to be exported too
* **string** *options.prefix* Stuff to prepend before the export
* **string** *options.suffix* Stuff to append after the exported

### Example
```javascript
$("#witness-content").HTML2TEI_Converter({
      "conversion" : {
        // Transform h1 and h2 to head
        "h1, h2": "head", 
        "li" : "l",
        "ol": "lg",
        //Transform these tags to w
        "span.norm, span.word.choice:visible": {
          "tag": "w",
          //Add an attribute id using a callback
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
      // Replace the parent of `span.choice-apparatus w` by w
      "extract": ["span.choice-apparatus w"],
      // Remove the following attributes and nodes
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