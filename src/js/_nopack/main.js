;(function($, exports){

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

// helper functions
function unfold(e) {
  var target = $(e.target).parent()

  target.prev('.fold').removeClass('fold')

  target.remove()

  if (textSorption) {
    textSorption.update()
  }
}

// when load ready, do all the inline-script
var inlineScript = $('script[type="text/fake"]')
if (inlineScript.length) {
  eval(inlineScript.text())
}

}($, window))
