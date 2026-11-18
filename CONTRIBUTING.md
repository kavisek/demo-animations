# Contributing to demo-animations

Thanks for your interest in contributing!

## Development setup

You need [Docker](https://docs.docker.com/get-docker/) with Compose v2, or Node.js 20.9 or later if you'd rather run the app directly.

```sh
git clone https://github.com/kavisek/demo-animations.git
cd demo-animations
make start      # http://localhost:3000, hot reloads as you edit frontend_tailwind/
make stop
```

Without Docker:

```sh
cd frontend_tailwind
npm ci
npm run dev
```

## Running checks

CI runs these on every pull request:

```sh
cd frontend_tailwind
npm run lint
npm run build
```

## Making a change

1. Open an issue first for anything bigger than a small fix, so we can agree on the approach.
2. Fork the repo and create a branch: `git switch -c feat/my-change`.
3. Write commits in [Conventional Commits](https://www.conventionalcommits.org/) style (`feat:`, `fix:`, `docs:`, `chore:`).
4. Make sure the checks above pass.
5. Open a pull request against `main` and fill in the template.

## Code of conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## License

By contributing, you agree that your contributions are licensed under the project's [license](LICENSE).
