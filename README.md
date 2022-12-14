<p align="center">
  <img src="./doc/gopher.png" alt="limgo gopher" />
  <h2 align="center">limgo-badge-action</h3>
  <p align="center">Show your test coverage</p>
  <p align="center">
    <a href="https://github.com/GoTestTools/limgo-badge-action/releases/latest"><img alt="GitHub release" src="https://img.shields.io/github/release/GoTestTools/limgo-badge-action.svg?logo=github&"></a>
    <a href="http://unlicense.org/"><img alt="unlicense" src="https://img.shields.io/badge/license-Unlicense-blue.svg"></a>
  </p>
</p>

---

This action uses the coverage output from [limgo](https://github.com/GoTestTools/limgo) to generate a badge visualizing the achieved test coverage. 

## Usage

You can use `limgo-badge-action` with the following configuration:

```yaml
jobs:
  build:
    name: Test
    runs-on: ubuntu-latest
    steps:
      # Checkout your project with git
      - name: Checkout
        uses: actions/checkout@v2

      # Install Go on the VM running the action.
      - name: Set up Go
        uses: actions/setup-go@v2
        with:
          go-version: 1.19

      # Run your tests with -coverprofile
      - name: Run tests
        run: |
          go test ./... -coverprofile=test.cov
        
      # Run the test coverage check using the limgo-action and output the statistic file
      - name: Run test coverage check
        uses: GoTestTools/limgo-action@v1.0.0
        with:
          version: "v0.0.0-beta"
          args: "-coverfile=test.cov -outfile=covcheck.tmp -config=.limgo.json -v=3"
      
      # Generate the badge only for commits on the main branch
      - name: Generate test badge
        if: github.ref == 'refs/heads/main'
        uses: GoTestTools/limgo-badge-action@v1.0.0 
        with:
          # name of the limgo test coverage file
          limgo_file: covcheck.tmp
          # format of the limgo test coverage file
          limgo_file_format: tab
          # name of the badge
          badge_name: limgo-badge.png
          # repository where the generated badge is pushed to
          repo: github.com/GoTestTools/limgo
          # branch of the repository where the generated badge is pushed to (will be created if it doesn't exist)
          branch: limgo-badge
          # github token which is required to create and push to the repository
          github_token: ${{ secrets.GH_TOKEN }}
          # github user who owns the github_token
          github_token_owner: engelmi
          # flag to show the branch coverage in the generated badge
          badge_enabled_branch: false
          # flag to show the statement coverage in the generated badge
          badge_enabled_stmt: false
          # flag to show the line coverage in the generated badge
          badge_enabled_lines: true
```

For more information about `limgo` please see the [limgo](https://github.com/GoTestTools/limgo) repository.

For more information about `limgo-action` please see the [limgo-action](https://github.com/GoTestTools/limgo-action) repository.
