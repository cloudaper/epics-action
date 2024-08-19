# Epic issues for GitHub

> [!NOTE]
> #### This action vs. GitHub task lists
>
> This action was created before GitHub introduced the [task lists](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-task-lists) feature, which esentially does the same thing: synces the status of a task list item with a reference to an issue based on the issues state.
>
> However, you can still use this action for the auto close epic feature.
>
> There is even more sopishicated [tasklists](https://docs.github.com/en/issues/managing-your-tasks-with-tasklists) (not the missing space) feature in works at private beta, so the future of this action is uncertain, but for now it should remain functional.

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
    types: [opened, closed, reopened]
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
