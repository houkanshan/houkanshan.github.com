function loadCss(filename) {
  var fileref = document.createElement("link")
  fileref.setAttribute("rel", "stylesheet")
  fileref.setAttribute("href", filename)

  document.getElementsByTagName("head")[0].appendChild(fileref)
}

loadCss('/css/hljs-github.css')
