var gErrMsg=null;

String.format = function() {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {       
    var reg = new RegExp("\\{" + i + "\\}", "gm");             
    s = s.replace(reg, arguments[i + 1]);
  }

  return s;
}

function show_alert(atype,atitle,anote) {
  var UIque = String.format("<div class='alert-message {0} fade in hide' data-alert='alert'>",atype);
      UIque+= String.format("<a class='close' href='#'>×</a>");
      UIque+= String.format("<p><strong>{0}</strong> {1}</p>",atitle,anote);
  UIque+="</div>";
  return UIque;
}

