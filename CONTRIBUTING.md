# Contributing to CTest Lab

## Formatting the Code

Use [prettier](https://prettier.io/) to format the code. I configured prettier
in [package.json](package.json); you should be able to run it without any
special options:

```bash
npx prettier --write .
```

If your IDE has an extension to run prettier, that can help automate it for you.
If you use [VS Code](https://code.visualstudio.com/), I configured
[esbenp.prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
as the default formatter.

## Testing the User Documentation

If you modify the user documentation, test your changes locally. Follow these
steps:

1. [Install Jekyll](https://jekyllrb.com/docs/installation/)
1. Install Ruby Gems: `bundle install`
1. Build and serve the documentation: `bundle exec jekyll serve`
1. Open the site, <http://localhost:4000>, in your web browser.

You only need to perform step 1 once. You need to perform step 2 each time you
clone the repository or update [_docs/Gemfile_](docs/Gemfile). You need to run
step 3 anytime you edit [\*docs/\_config.yml](docs/_config.yml); if you edit the
Markdown files, Jekyll should automatically update the site, though you need to
manually refresh your browser.
