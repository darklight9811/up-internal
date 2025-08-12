# WorkerParty

WorkerParty is an app to help organize political parties, its meant to be open-source so everyone can contribute.

## To Do List
- [ ] Add admin management
- [ ] Add party cores
- [ ] Add member subscription registering
- [ ] Add in-app chat
- [ ] Add register requests

## Installation

To install it, you will need: [bunjs](bun.sh), a postgres server and a [resend account](https://resend.com/) and knowledge using git, typescript, react and others. To copy the repository locally (in the directory that you prefer):

```
git clone https://github.com/darklight9811/workerparty
```

```
bun i
```

Create and populate the `.env` file:
```
DATABASE_URL=""
RESEND_API_KEY=""
KEY_SECRET=""
```

And run it using:
```
bun dev
```