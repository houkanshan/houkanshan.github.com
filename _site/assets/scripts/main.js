var body = $('body')

// event bind
body.on('click', '.unfold', unfold)

// count line for fold
$('.fold').each(function(i, e){
  var target = $(e)
    , content = target.find('.bd')
    , height = content.height()
    , lineCnt = height / 21 | 0
    , unfoldButton = target.next('.unfold-outer').find('.unfold')
    , orignText = unfoldButton.text()

    unfoldButton.text(orignText + ' ( 约末'+ lineCnt + '行 )')
})



function unfold(e) {
  var target = $(e.target).parent()
  
  target.prev('.fold').removeClass('fold')
  target.remove()
}
