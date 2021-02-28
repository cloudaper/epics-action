# Epic issues for GitHub

This action allows you to create epic issues on GitHub. Simply label an issue as `epic` and reference another issues in the task list:

```markdown
This is an epic issue. List of individual issues is below:

- [ ] First issue #1
- [ ] Another issue (#2)
- [ ] Last issue #3 (not that important)
```

The action automatically updates the task list when referenced issue is closed (or reopened).

## Inputs

- **`github-token`**  
  the GitHub token secret (use `${{ secrets.GITHUB_TOKEN }}` in action YAML)  
  _required_
- **`epic-label-name`**  
  name of the label you want to use for epic issues  
  _default: `epic`_
- **`auto-close-epic`**  
  auto close epic when all referenced issues are closed  
  _default: `false`_

## Example usage

```yaml
name: Update epics
on:
  issues:
    types: [opened, created, closed, reopened, deleted]
jobs:
  epics:
    runs-on: ubuntu-latest
    name: Update epic issues
    steps:
      - name: Run epics action
        uses: cloudaper/epics-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          epic-label-name: feature
          auto-close-epic: true
```
