# Contribution guide

Thanks for showing interest to contribute to Blockscout. The following steps will get you up and running.

## Project setup

1. Fork the repo by clicking <kbd>Fork</kbd> button at the top of the repo main page and name it appropriately

2. Clone your fork locally
    ```sh
    git clone https://github.com/<your_github_username>/<fork_name>.git
    cd <fork_name>
    ```

3. Make sure you're running Node.js 18+ and NPM 8+; if not, upgrade it accordingly, for example using [nvm](https://github.com/nvm-sh/nvm).
    ```sh
    node -v
    npm -v
    ```

4. Install dependencies
    ```sh
    yarn
    ```

## Toolkit

We are using following technology stack in the project
- [Yarn](https://yarnpkg.com/) as package manager
- [ReactJS](https://reactjs.org/) as UI library
- [Next.js](https://nextjs.org/) as application framework
- [Chakra](https://chakra-ui.com/) as component library; our theme customization could be found in `/theme` folder
- [TanStack Query](https://tanstack.com/query/v4/docs/react/overview/) for fetching, caching and updating data from the API
- [Jest](https://jestjs.io/) as JavaScript testing framework
- [Playwright](https://playwright.dev/) as a tool for components visual testing

And of course our premier language is [Typescript](https://www.typescriptlang.org/).

## Local development

1. Prepare your environment variables:  
    - clone `.env.example` into `configs/envs/.env.secrets` and fill it with necessary secrets for the [external services](./ENVS.md#external-services-configuration) integration; you can pick up only those that your needed
    - choose one of the following options:  
        A. create `.env.local` file in the root folder with environment variables from the [list](./ENVS.md); all required variables should be present in the file;  
        B. pick up one of the predefined configurations located at `/configs/envs` folder; no actual action is needed at this stage;
2. Run your local dev server:
    - if you picked up option "A" above, use `yarn dev` command
    - if your options is "B", use `yarn dev:<config_name>` command
3. In browser navigate to the URL from the command output (by default, it is `http://localhost:3000`)

## Adding new dependencies
For all types of dependencies:
- **Do not add** a dependency if the desired functionality is easily implementable
- If adding a dependency is necessary, please be sure that is is well-maintained and trustworthy

## Adding new ENV variable

*Note*, if the variable should be exposed to the browser don't forget to add prefix `NEXT_PUBLIC_` to its name.

These are the steps that you have to follow to make everything work:
1. First and foremost, document variable in the [/docs/ENVS.md](./ENVS.md) file; provide short description, its expected type, requirement flag, default and example value; **do not skip this step** otherwise the app will not receive variable value at run-time
2. Make sure that you have added a property to React app config (`/configs/app/index.ts`) in appropriate section that is associated with this variable; do not use ENV variable values directly in the application code
3. For local development purposes add the variable with its appropriate values to pre-defined ENV configs `/configs/envs` where it is needed
4. Add the variable to CI configs where it is needed
    - `deploy/values/review/values.yaml.gotmpl` - review development environment
    - `deploy/values/main/values.yaml` - main development environment
    - `deploy/values/review-l2/values.yaml.gotmpl` - review development environment for L2 networks
    - `deploy/values/l2-optimism-goerli/values.yaml` - main development environment
5. Don't forget to mention in the PR notes that new ENV variable were added  

## Writing & Running Tests

Every feature or bugfix should be accompanied by tests, either unit tests or component visual tests, or both, except from trivial fixes (for example, typo fix). All commands for running tests you can find [below](./CONTRIBUTING.md#command-list).

### Jest unit tests

If your changes only related to the logic of the app and not to its visual presentation, then try to write unit tests using [Jest](https://jestjs.io/) framework and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). In general these tests are "cheaper" and faster than Playwright ones. Use them for testing your utilities and React hooks, as well as the whole components logic. 

Place your test suites in `.test.ts` or `.test.tsx` files. You can find or add some mocks or other helpful utilities for these tests purposes in the `/jest` folder. 

*Note*, that we are using custom renderer and wrapper in all test for React components, so please do not import package `@testing-library/react` directly in your test suites, instead use imports from `jest/lib` utility.

### Playwright components tests

For changes associated with the UI itself write components visual tests using [Playwright](https://playwright.dev/) framework and its *experimental* [Components test library](https://playwright.dev/docs/test-components). Please be aware of known [issues and limitations](https://playwright.dev/docs/test-components#known-issues-and-limitations) of this library.

Your tests files should have `.pw.tsx` extension. All configs, mocks, fixtures and other utilities for these tests live in `/playwright` folder.

We have 3 pre-configured projects. You can run your test with the desired project by simply adding its [tag](https://playwright.dev/docs/test-annotations#tag-tests) to the test name:
- `default` - default project for all test, uses desktop Chrome desktop device; don't need to specify its tag, instead use `-@default` tag to skip test run with this project
- `mobile` - project for testing on mobile devices, uses Safari mobile browser; add tag `+@mobile` to run test with this project
- `dark-color-mode` - project for testing app in the dark color mode, uses desktop Chrome desktop device with forced dark color mode; add tag `+@dark-mode` to run test with this project.

*Note* that, since we are developing not on the same operating system as our CI system, we have to use Docker to generate or update the screenshots. In order to do that use `yarn test:pw:docker <path-to-file> --update-snapshots` command. Please **do not commit** any screenshots generated via `yarn test:pw:local` command, their associated tests will fail in the CI run.

## Making a Pull Request

### Steps to PR

1. Make sure that you fork and clone repo; check if the main branch has all recent changes from the original repo

    > Tip: Keep your `main` branch pointing at the original repository and make pull
    > requests from branches on your fork. To do this, run:
    >
    > ```
    > git remote add upstream https://github.com/blockscout/frontend.git
    > git fetch upstream
    > git branch --set-upstream-to=upstream/main main
    > ```
    >
    > This will add the original repository as a "remote" called "upstream," Then
    > fetch the git information from that remote, then set your local `main` branch
    > to use the upstream main branch whenever you run `git pull`. Then you can make
    > all of your pull request branches based on this `main` branch. Whenever you
    > want to update your version of `main`, do a regular `git pull`.

2. Create a branch for your PR with `git checkout -b <your-branch-name>`; we do not follow any branch name convention just yet
3. Commit your changes. Commits should be one logical change that still allows all tests to pass. Prefer smaller commits if there could be two levels of logic grouping. The goal is to allow contributors in the future (including your future self) to determine your reasoning for making changes and to allow them to cherry-pick, patch or port those changes in isolation to other branches or forks. Again, there is no strict commit message convention, but make sure that it clear and fully describes all changes that were made
4. If during your PR you reveal a pre-existing bug, try to isolate the bug and fix it on an independent branch and PR it first
5. Where possible, please provide unit tests that demonstrate new functionality or bug fix is working

### Opening PR and getting it accepted

1. Push your changes and create a Pull Request. If you are still working on the task, please use "Draft Pull Request" option, so we know that it is not ready yet. In addition, you can add label "WIP" to your PR, so all CI checks will not be triggered. 
2. Once you finish your work, remove label "WIP" from PR, if it was added before, and publish PR if it was in the draft state
3. Make sure that all code checks and tests are successfully passed
4. Add description to your Pull Request and link an existing issue(s) that it is fixing
5. Request review from one or all core team members: @tom2drum, @isstuev. Our core team are committed to reviewing patches in a timely manner.
6. After code review is done, we merge pull requests by squashing all commits and editing the commit message if necessary using the GitHub user interface.

*Note*, if you Pull Request contains any changes that are not backwards compatible with the previous versions of the app, please specify them in PR description and add label ["breaking changes"](https://github.com/blockscout/frontend/labels/breaking%20changes) to it.

## Command list

| Command | Description |
| --- | --- |
| **Running and building** |
| `yarn dev` | run local dev server with user's configuration |
| `yarn dev:preset <config_preset_name>` | run local dev server with predefined configuration |
| `yarn build:docker` | build a docker image locally |
| `yarn start:docker:local` | start an application from previously built local docker image with user's configuration |
| `yarn start:docker:preset <config_preset_name>` | start an application from previously built local docker image with predefined configuration |
| **Linting and formatting** |
| `yarn lint:eslint` | lint project files with ESLint |
| `yarn lint:eslint:fix` | lint project files with ESLint and automatically fix problems |
| `yarn lint:tsc` | compile project typescript files using TypeScript Compiler |
| `yarn format-svg` | format and optimize SVG icons in the `/icons` folder using SVGO tool |
| **Testing** |
| `yarn test:jest` | run all Jest unit tests |
| `yarn test:jest:watch` | run all Jest unit tests in watch mode |
| `yarn test:pw:local` | run Playwright component tests locally |
| `yarn test:pw:docker` | run Playwright component tests in docker container |
| `yarn test:pw:ci` | run Playwright component tests in CI |

## Tips & Tricks

### Code Editor

#### VSCode

There are some predefined tasks for all commands described above. You can see its full list by pressing <kbd>cmd + shift + P</kbd> and using command `Task: Run task`

Also there is a Jest test launch configuration for debugging and running current test file in the watch mode.

And you may find the Dev Container setup useful too.