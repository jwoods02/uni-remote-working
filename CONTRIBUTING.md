# Indroduction

When considering contributing please refer to the Taiga sprint board and issues board.

# Git Branching Strategy

We are using a version of the Gitflow protocol for our branching strategy. For more information: https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow

## Master

The master branch is for releases for the client. These are usually created at the end of each sprint.

## Develop

This branch is the main development branch. This should always be up to date with develop, while including all merged feature branches not in master. This branch should always build and work.

## Features

Feature branches are titled: `feature/02-short-title`

Feature branch numbers and titles should always correspond with numbers from Taiga, either for user stories, or for Taiga issues.

Issues are features, unless they need to be applied to the master branch.

## Hotfix

Hotfix branches are titled: `hotfix/04-urgenet-title`

Hotfix branches ONLY EXIST WHEN INTERACTING WITH MASTER.

Hotfix branches are the only branches that should fork from master.

If a issue does not need to be immediately applied to master, it should be a feature branch.

# Pull Request Process

NOTE: Pull requests that are not finished should be marked [WIP]

1. The developer ensures the target branch has been merged into their branch with no conflicts.
2. The developer opens a pull request into the target branch.
3. The developer should include the intended changes of their code using bullet points. Any architectural decisions should be documented here also. (Good for code reviewer and write up)
4. The code reviewer should build the branch locally and ensure it builds and new functionality works
5. The code reviewer should check the GitLab diffs to ensure code quality is good and code makes sense.
6. If the code reviewer is satisfied, they should merge the pull request and delete the merged branch.
7. If not, they should leave comments / queries on the pull request.

# Our Standards

- Show respect. Don’t interrupt; let people finish what they’re saying. It’s acceptable to disagree with each other. No personal attacks, attack issues, we debate the merit of ideas, not people.
- Contribution. Everyone has equal voice and valuable contribution.
- Meeting. Be on time, end on time, have an agenda.
- Transparency. No hidden agendas. We will give feedback, we will receive feedback, and we will act on feedback.
- Impediments. Solve roadblocks within the team. If the impediment cannot be solved within the team, give it to the Scrum master.
- Make commitments as a team. We will be held accountable to our commitments. – we work as a team to make a commitment and deliver on it.
- Incomplete stories are bad – it is better to help get an existing story to “done” than to start another story that can’t be finished in the current sprint.
- Make decisions as a team. Ensure every team member is aware of decisions taken.
- Perform the necessary risk management early in the project by conducting extensive research in relation to technologies and tools.
- Do not diverge when assigning and splitting work - keep communication and pull back to common ground.
- Demonstrate due diligence before descoping features mentioned by the client.
