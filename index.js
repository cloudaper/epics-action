import * as core from '@actions/core';
import * as github from '@actions/github';

async function getReferencedEpics({ octokit }) {
  const epicLabelName = core.getInput('epic-label-name', { required: true });

  if (github.context.payload.action !== 'deleted') {
    const events = await octokit.rest.issues.listEventsForTimeline({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: github.context.payload.issue.number,
    });

    return events.data
      .filter((item) => (item.event === 'cross-referenced' && item.source))
      .filter((item) => item.source.issue.labels
        .filter((label) => label.name.toLowerCase() === epicLabelName.toLowerCase()).length > 0);
  }

  return [];
}

async function updateEpic({ octokit, epic }) {
  const autoCloseEpic = core.getInput('auto-close-epic', { required: false });

  const issueNumber = github.context.payload.issue.number;
  const issueState = github.context.payload.issue.state;
  const convertedIssueState = issueState === 'closed' ? 'x' : ' ';
  const epicNumber = epic.source.issue.number;
  let epicState = epic.source.issue.state;
  let epicBody = epic.source.issue.body;

  const pattern = new RegExp(`- \\[[ |x]\\] .*#${issueNumber}.*`, 'gm');
  const matches = Array.from(epicBody.matchAll(pattern));
  const matchCount = matches.length;

  matches.forEach((match) => {
    epicBody = epicBody.replace(match[0], match[0].replace(/- \[[ |x]\]/, `- [${convertedIssueState}]`));
  });

  const allTasksPattern = /- \[[ |x]\] .*/gm;
  const doneTasksPattern = /- \[[x]\] .*/gm;
  const allTasks = Array.from(epicBody.matchAll(allTasksPattern));
  const doneTasks = Array.from(epicBody.matchAll(doneTasksPattern));
  const allTasksCount = allTasks.length;
  const doneTasksCount = doneTasks.length;

  if (!!autoCloseEpic
    && matchCount
    && allTasksCount === doneTasksCount
  ) {
    epicState = 'closed';
  }

  const result = await octokit.rest.issues.update({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: epicNumber,
    body: epicBody,
    state: epicState,
  });

  return result;
}

async function updateEpics({ octokit, epics }) {
  return Promise.all(epics.map((epic) => updateEpic({ octokit, epic })));
}

async function run() {
  try {
    const token = core.getInput('github-token', { required: true });

    const octokit = github.getOctokit(token);

    const epics = await getReferencedEpics({ octokit });
    await updateEpics({ octokit, epics });
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
