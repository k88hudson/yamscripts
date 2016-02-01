## Usage

Install globally

```
npm install yamscripts -g
```

Run init in the root of your project

```
yamscripts init
```

Write some scripts in `yamscripts.yml`.

```yaml
scripts:
# test: This is just a way to run the tests once
  test: mocha -R spec
  start: node server.js
```

 Run `npm run yamscripts` to compile changes. Now your scripts should be available as npm scripts!

 Run `npm run help` to see help documentation generated from your comments. Any comment prefixed by `{script name}:` will be included in the auto-generated docs.


## Examples


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
