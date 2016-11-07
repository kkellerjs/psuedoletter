$(function() { //************************************************************************************************************



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//LETTER OBJECT CONTAINS COVER LETTER TEXT PROPERTIES

//NOTE: You can easily adjust the preset text in the letter object below.
//Be careful to follow the brackets[] pattern for indicating form fields.


var letter = {
  
  
  //..........................................................
  //TEXT FOR COVER LETTER TEMPLATE
  
  1: { 
    "section": "",
    "info": "", //"Get started!",
    "content": "It is with great enthusiasm that I submit my application for the position of [] at [], as advertised on [].",
    "placeholders": ["job title", "company", "website"],
    "excerpt": false //later versions--excerpts will contain keywords found in post, etc.
  },
  
  
  
  2: {
    "section": "",
    "info": "",
    "content": "As a [] with a strong background in [], I am confident that my [] and [] will serve to further advance [] achievements in [].",
    "placeholders": ["self-descriptor", "trait/subject", "trait/skill", "trait/skill", "company's", "job field"],
    "excerpt": false
  }, 
  
  
  3: {
  
  "section": "",
  "info": "Broadly discuss how some of your professional experience make you a good fit (3-5 sentences).",
  //will want to make these sizes adjust w/device size
  "content": "<textarea></textarea>",
  "placeholders": ["Your sentences here"],
  "excerpt": false,
  "smallerLineHeight": true
  
  },
  
  
  4: {
  
   "section": "",
   "info": "Discuss a specific accomplishment which lends itself to your qualifications for this position (3-5 sentences).",
   "content": "<textarea></textarea>",
   "placeholders": ["Your sentences here"],
   "excerpt": false,
   "smallerLineHeight": true
  },
  
  
  5: { 
  
   "section": "",
   "info": "",
   "content": "Additionally, I am thoroughly impressed by [] commitment to [], and, in particular, []. [] work in [] has [].",
   "excerpt": false,
   "placeholders": ["company's", "cause/field", "a project they did",
   					"company's", "project/field", "effect on the industry"],
   	"smallerLineHeight": true
  }, 
  
  
  6: {
  
  "section": "",
   "info": "",
   "content": "In closing, I am excited by the possibility of being involved in [] efforts to []. I would greatly appreciate any opportunity to further discuss my qualifications and what I will bring to the organization. Thank you for your consideration.",
   "excerpt": false,
   "placeholders": ["company's", "goal"],
   "smallerLineHeight": true
  },
  
  
  pages_total: 6,
  
  
  //..........................................................
  
  
  
  //..........................................................
  //FUNCTION TO ADD INSERT INPUT BOXES INTO TEMPLATE TEXT
  
    add_input_boxes: function(string) {  
    
    //return the original string with the input box inserted within it
    //if no calls for input boxes, return string untouched
   
    var original, text_here, inputTxt, placeholder, field;
    
    //grab words in brackets
    var inserts = string.match(/\[.*?\]/g);
    if (!inserts) { return string;} //no text boxes here
    
    for (var i = 0; i < inserts.length; i++) {
      
      placeholder = false;
      original = inserts[i];

      //if no stored text, use placeholder
      if (!original.match(/[a-zA-Z0-9]/)) {
        placeholder = true;
      }
      
      //remove brackets
      insert = inserts[i].replace(/[\[\]]/g, "");
      
      //add input box
      if (!placeholder) {
        inputTxt = "<input type=\"text\" value=\"" + insert + "\">";
      } else {
        inputTxt = "<input type=\"text\" placeholder = " + letter[navigate.currentPage].placeholders[i] + ">";
      }
      
      string = string.replace(original, inputTxt);
    }
    
    return string;
 },
 //...............................................................
  
  add_textarea_placeholder: function(string) {
    
    if(!string.match(/textarea/)) { return string;}
    
    //if empty...
    if (!string.match(/\>[a-zA-Z0-9]/)) {
      string = "<textarea placeholder = " + letter[navigate.currentPage].placeholders[0] + "></textarea>";
    }
 
    return string;
  },
  //............................................................... 
  
  
  add_html_spaces: function() {
 
   //add html spaces to placeholder text
    
    for (var i = 1; i <= letter.pages_total; i++) { 
      
      var newHolders = [];
      var placeholders = letter[i].placeholders;
      for (var j = 0; j < placeholders.length; j++) {
        var holder = placeholders[j].replace(/\s/g, "&nbsp;");
        newHolders.push(holder);
      }
      letter[i].placeholders = newHolders;
   }
 }
//............................................................... 
 
} //~~~~~~~~~~~~~~~~~~~~END OF LETTER OBJECT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

















//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//NAVIGATION OBJECT FOR NAVIGATING THROUGH COVER LETTER TUTORIAL


//...............................................................
var navigate = { 
  
  currentPage: 1,
  
  new_page: function() {
  
    //update any potentially new values
    
    letter.add_html_spaces();
    
    //grab new page's content
    var info = letter[navigate.currentPage].info;
    var section = letter[navigate.currentPage].section; //might not use
    var add_excerpt = letter[navigate.currentPage].excerpt;
    var content = letter[navigate.currentPage].content;

    var pageNum = "page_" + navigate.currentPage;
    if (localStorage[pageNum]) {
      content = localStorage[pageNum];
    }
      
    
    //add any inputboxes
    content = letter.add_input_boxes(content);
    //add any (placeholders) to text areas
    content = letter.add_textarea_placeholder(content);
    
    
    //update page
    document.getElementById("info").innerHTML = info;
    document.getElementById("content").innerHTML = content;
    
    if (letter[navigate.currentPage].smallerLineHeight) {
     $("#info").css("line-height", 1.3);
    }
    
    //if there is NO next page, change text on button
    if (navigate.currentPage + 1 > letter.pages_total) {
      $("#next").html("Export");
    } else {
      $("#next").html("next >>");
    }
    
    if (navigate.currentPage == 1) {
     $("#back").css("display", "none");
    } else {
     $("#back").css("display", "inline-block");
    }
  },//...............................................................
  
  
  
  
  
  //...............................................................
  store_fields: function() {
    
    //update letter object & store content as val for page# in chrome storage
    
    var pageNo = navigate.currentPage;
    var content = letter[pageNo].content;
    var pieces = content.split(/\[/g);

    //break sentence into pieces
    var contentPieces = [];
    for (var i =0; i < pieces.length; i++) {
      var piece = pieces[i];
      //replace input boxes with easily findable text
      piece = pieces[i].replace(/.*?\]/g, "[VALUE]");
      contentPieces.push(piece);
    }

    
    var ct = 0;
    var contentStr = "";
    $("input").each(function() {
      text = $(this).val();
      while (!contentPieces[ct].match(/VALUE/) && ct <= contentPieces.length) {
        //append unchanged text to str
        contentStr += contentPieces[ct];
        ct++;
      }
      //if there's a field, replace original box val with new val
      if (ct <= contentPieces.length) {
        piece = contentPieces[ct].replace(/VALUE/, text);
        contentStr += piece;
      }
      ct++;
    });
    
    //grab new input box text
    //this part functions for ONE input box per page, without fields on same page.
    $("textarea").each(function() {
      var newText = $(this).val();
      contentStr = "<textarea>" + newText + "</textarea>";
    });

    
    //update object
    letter[pageNo].content = contentStr;
    
     //save to local storage: key=pageVal, val = contentStr
     var pageVal = "page_" + pageNo;
     localStorage[pageVal] = contentStr;

  },//...............................................................
  
  
  
  
  
  
  //...............................................................
  export_letter: function() {
  
    var letterStr = "";
    var str;
  
    //grab all values in letter object, which should be entirely updated
    for (var i = 1; i <= letter.pages_total; i++) {
     letterStr += "\t" + letter[i].content + "\n";
    }
    
    letterStr = letterStr.replace(/\<textarea\>\<\/textarea\>/, "(empty text box) ");
    letterStr = letterStr.replace(/\<textarea\>/g, "");
    letterStr = letterStr.replace(/\<\/textarea\>/g, "");
    letterStr = letterStr.replace(/\[\]/g, "(empty field)");
    letterStr = letterStr.replace(/[\[\]]/g, "");
    
    convert_text(letterStr);
    
    function convert_text(text) {
    
      var bytes = new Uint8Array(text.length);
      for (var i = 0; i < text.length; i++) {
       bytes[i] = text.charCodeAt(i);
      }
      var compiled = new Blob([bytes], {type: "text/html"});
      var url = URL.createObjectURL(compiled);
      var a = document.createElement("a");
      a.download = "Psuedoletter.doc",
      a.href = url;
      a.textContent = "Download Psuedoletter.doc";
      a.click();
    }
  
  }//...............................................................
  
  
  
  

}
//~~~~~~~~~~~~~~~~~~END OF NAVIGATE OBJECT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


























//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//CLICK EVENTS


$("#next").click(function() {
  if (letter.hasOwnProperty(navigate.currentPage + 1)) {
    
    //store data on this page
    navigate.store_fields();
    
    
    //if there is a next page, update current page number
    navigate.currentPage++;
    
    
    //run new page script
    navigate.new_page();
    
  } else {
  
    //store fields
    navigate.store_fields();
  
    //EXPORT
    navigate.export_letter();
    
   
  }
});


$("#back").click(function() {
  if (letter.hasOwnProperty(navigate.currentPage - 1)) {
    
    //store data on this page
    navigate.store_fields();
    
    
    //if there is a previous page, update current page number
    navigate.currentPage--;
    
    //run new page script
    navigate.new_page();
  }
});



$("#clear").click(function() {


 localStorage.removeItem("page_" + navigate.currentPage);
 
 for (var i = 1; i < letter.pages_total; i++) {
 
   var match = letter[i].content.match(/(\[)([a-z0-9]+)(\])/gi);
   
   if (match) {
    letter[i].content = letter[i].content.replace(/(\[)([a-z0-9]+)(\])/gi, "[]");
    }
    
   //if text area, just rewrite value
   if (letter[i].content.match(/textarea/gi)) {
    letter[i].content = "<textarea></textarea>";
   }
   
 }

 //refresh
 navigate.new_page();
 
});




$(document).keyup(function() {
  //also store fields on keyup
  //hasn't been tested a whole lot
  
  navigate.store_fields();

});

//~~~~~~~~~~~~~~~~~END OF CLICK EVENTS~~~~~~~~~~~~~~~~~~~~~




//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//MAIN


navigate.new_page();


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  






}); //************************************************************************************************************
