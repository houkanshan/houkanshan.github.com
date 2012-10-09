module Jekyll
  class GistTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      text = text.split(' ')
      @text = text[0]
    end

    def render(context)
      "<script src=\"http://gist.github.com/#{@text}.js\">//make jekyll happy</script>"
    end
  end
end

Liquid::Template.register_tag('gist', Jekyll::GistTag)
