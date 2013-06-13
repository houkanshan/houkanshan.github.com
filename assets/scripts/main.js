(function(){

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


// init scrollSlow
//var scroll = new Scroll({
  //breakElems: $('h2')
//})
this.parallax = new Parallax({
  moveTarget: $('.wrapper'),
  points: [
    {
      offset: 100,
      velocityRadio: 0.1, // slow
    }, 
    {
      offset: 200,
      velocityRadio: 0, // stop
      delay: 400
    }, 
    {
      offset:400,
      velocityRadio: 1 // 1/2 speed
    },
    {
      offset:600,
      velocityRadio: 1   // normal speed
    }
  ]
})


// helper functions
function unfold(e) {
  var target = $(e.target).parent()
  
  target.prev('.fold').removeClass('fold')
  target.remove()
}

}())
