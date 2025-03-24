# Release requirements

## Branches
- main
- develop
- feature-branch-name

## Branch protection
- main branch is protected (no direct commits)
- develop branch source is main
- develop branch is protected (no direct commits)
- feature branches source is develop
- feature branches are not protected

## Actions
- release (triggered on push to main)
- manual_deploy (manual run github action)
- deploy (triggered on push to develop, push to main)
- pr_check (triggered on PR to develop)

## Feature development release process
- create a release branch from develop
- commit changes
- release to dev env (manual run github action)
  - select feature branch
  - set env variable NUXT_RELEASE_TIMESTAMP={timestamp}
  - set env variable NUXT_RELEASE_VERSION={version}
  - set env variable NUXT_RELEASE_HASH={hash}
  - set env variable NUXT_RELEASE_SOURCE={feature-branch-name}
  - set env variable NUXT_RELEASE_TARGET=dev
  - set env variable NUXT_RELEASE_TYPE=feature

## Development release process
- create a feature branch from develop
- make changes and commit
- push to github
- create a PR
- get PR approved
- merge PR to develop
- release to dev env triggered (automated action on merge)
  - set env variable NUXT_RELEASE_TIMESTAMP={timestamp}
  - set env variable NUXT_RELEASE_VERSION={version}
  - set env variable NUXT_RELEASE_HASH={hash}
  - set env variable NUXT_RELEASE_SOURCE=develop
  - set env variable NUXT_RELEASE_TARGET=dev
  - set env variable NUXT_RELEASE_TYPE=develop

## Main release process
- push to main
- release to prod env triggered (automated action on merge)
  - set env variable NUXT_RELEASE_TIMESTAMP={timestamp}
  - set env variable NUXT_RELEASE_VERSION={version}
  - set env variable NUXT_RELEASE_HASH={hash}
  - set env variable NUXT_RELEASE_SOURCE=main
  - set env variable NUXT_RELEASE_TARGET=main
  - set env variable NUXT_RELEASE_TYPE=main

## Hotfix release process
- create a hotfix branch from main
- commit changes
- optional: release to dev env (manual run github action)
- release to prod env triggered (automated action on merge)
  - set env variable NUXT_RELEASE_TIMESTAMP={timestamp}
  - set env variable NUXT_RELEASE_VERSION={version}
  - set env variable NUXT_RELEASE_HASH={hash}
  - set env variable NUXT_RELEASE_SOURCE={hotfix-branch-name}

