# Contributing

Feel free to open a PR. GitHub Actions will automatically build & push the distribution file after each push.

Don't worry when the build & check action doesn't run: it has to be triggered manually as it is not triggered when [workflow pushes](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#triggering-new-workflows-using-a-personal-access-token).

## Releasing

To make a new release, simply create a new GitHub release (& tag), wait and update release notes after a while.

GitHub Actions will automatically bump the version in package.json and push all tags, incl. major and minor versions.
