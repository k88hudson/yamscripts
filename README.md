```bash
yamscripts init
yamscripts compile
yamscripts help
```

```yaml
scripts:
  test: mocha -R spec
  start: node server.js
```

```yaml
scripts:
  test:
    pre: ./build.js
    mocha: mocha -R spec
    karma: karma start
    post: coverage.js > coveralls
```

```yaml
# TODO: This will be deprecated
scripts:
  test:
    _parallel: true
    pre: ./build.js
    post: coverage.js > coveralls
    mocha: mocha -R spec
    karma: karma start
```

```yaml
# TODO: This doesn't work yet
scripts:
  test:
    parallel: true
    scripts:
      pre: ./build.js
      post: coverage.js > coveralls
      mocha: mocha -R spec
      karma: karma start
```

```yaml
scripts:
  setup: ./setup.js
  test: =>setup && mocha -R spec
  # This compiles to:
  # npm run setup && mocha -R spec
```
