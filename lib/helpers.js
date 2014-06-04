function commentUrl(template, current) {
  var post = current.post
    , postUrl = template.site.url + '/' + post.dest
    , issueUrl = 'https://github.com/' + template.comments.githubRepo + '/issues/new'
    , body = '> {URL}'.replace('{URL}', postUrl)
    , label = post.title
  console.info(body, label)
  return issueUrl
    + '?label=' + encodeURIComponent(label)
    + '&body=' + encodeURIComponent(body)
}

module.exports = {
  commentUrl: commentUrl
}
