/**
 * @requires jQuery
 * 
 * @link https://github.com/PonteIneptique/TEIWitness
 * @author PonteIneptique (Thibault Clérice)
 * @version 0.0.1
 * @license https://github.com/PonteIneptique/TEIWitness/blob/master/LICENSE
 *
 */
(function ( $ ) {

    var download = function(filename, text) {
      /**
       * Create a download document in a href and click on it
       * 
       * @function
       * @name download
       * @source http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
       * 
       * @param  {string}     filename           Filename to use for download
       * @param  {text}       text               Text to input in the download form
       *
       */
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    } 

    $.fn.TEIWitness = function(options) {
      /**
       * Generate XML-TEI from a HTML container
       * 
       * @function
       * 
       * @param  {object}     options.conversion                   Conversion table
       * @param  {string}     options.conversion[key]              key should represent a css selector while value should be a valid TEI XML element OR
       * @param  {string}     options.conversion[key].tag          Tag to convert to
       * @param  {string}     options.conversion[key][@att]        Name of the attribute preceded by @ as key, corresponding attribute name in XML TEI
       * @param  {callback}   options.conversion[key][@att].cb     If options.conversion[key][@att] is an object, cb should be a function returning a string, given the current element as value
       * @param  {string}     options.conversion[key][@att].name   Name of the new attr
       * @param  {[string]}   options.extract                      List of nodes to extract from their parents (be careful, nodes have already been transformed)
       * @param  {[string]}   options.remove                       Attributes and nodes to remove by default (Start with @ for attribute)
       * @param  {string}     options.filename                     Filename to be exported too
       * @param  {string}     options.prefix                       Stuff to prepend before the export
       * @param  {string}     options.suffix                       Stuff to append after the export
       *
       */
        
        var $target = this.clone(),
            _default = {
              conversion: {},
              extract: [],
              remove: [],
              filename: "tei.xml",
              prepend: "",
              append: ""
            };

        var $element = $("<div />").append($target);
        $element.css("overflow", "hidden").width(1).height(1);
        this.after($element);
        options = $.extend({}, _default, options);

        $.each(options.conversion, function(key, value) {
          if(typeof value === "string") {
            var tag = value,
                new_attr = [];
          } else {
            var tag = value.tag,
                new_attr = value;
            delete new_attr.tag;
          }
          var elements;

          /*if(key.endsWith(":visible")) {
            var key = key.replace(":visible", "")
            elements = $element.find(key).filter(":visible");*/
          //} else {
            var elements = $element.find(key);
          //}

          // For each element
          elements.each(function() {

            //Retrieve current attribute
            var attr  = this.attributes,
            // Store current node
                current = $(this),
            //Register template for new tag
                newElement = $('<'+tag+'/>');


            // Add to the new element the old attributes
            for (var a = attr.length - 1; a >= 0; a--) {
                var attrib = attr[a];
                newElement.attr(attrib.name, attrib.value);
            };
            
            //Reinsert html of old element in new element
            newElement.html(current.html());

            //For each attribute replace
            $.each(new_attr, function(old_attr, value) {
              old_attr = old_attr.substring(1);
              var new_attr_name = value;
              if(typeof value === "string") {
                // Add using old valuee
                newElement.attr(new_attr_name, current.attr(old_attr));
              } else {
                // We have a callback
                var cb = value.cb,
                    new_attr_name = value.name;
                newElement.attr(new_attr_name, cb(current));
              }
              // Removee old attribute
              newElement.removeAttr(old_attr);
            })

            //Replace element
            current.replaceWith(
              newElement
            );
          });
        // End of conversion
        });

        $.each(options.extract, function(index, selector) {
          $element.find(selector).each(function() {
            var el = this;
            $(this).parent().replaceWith(el);
          })
        });

        $.each(options.remove, function(index, key) {
          if (key.startsWith("@")) {
            var key = key.substring(1);
            $element.find("["+key+"]").each(function() { $(this).removeAttr(key); });
          } else {
            $element.find(key).remove();
          }
        });
        var output = $element.children().first();
        download(options.filename, options.prepend + output.html() + options.append);
        $element.remove();
    };
 
}( jQuery ));