(function($, exports){

var body = $('body')

// event bind
body.on('click', '.unfold', unfold)

// count line for fold
$('.fold').each(function(i, e){
  var target = $(e)
    , content = target.find('.bd')
    , height = content.height()
    , lineHeight = 21
    , lineCnt = height / lineHeight | 0
    , unfoldButton = target.next('.unfold-outer').find('.unfold')
    , orignText = unfoldButton.text()

    unfoldButton.text(orignText + ' ( 约'+ lineCnt + '行 )')
})

// text sorption
if (page.type === 'post') {
  var textSorption = new TextSorption({
    elems: $('h3'),
    slowDown: false
  })

  setTimeout(function(){
    textSorption.update()
  }, 5000)
  setTimeout(function(){
    textSorption.update()
  }, 20000)
  exports.textSorption = textSorption
}



// helper functions
function unfold(e) {
  var target = $(e.target).parent()
  
  target.prev('.fold').removeClass('fold')
  
  target.remove()

  if (textSorption) {
    textSorption.update()
  }
}

}($, window))
