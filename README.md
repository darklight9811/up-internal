# WorkerParty

WorkerParty is an app to help organize political parties, its meant to be open-source so everyone can contribute.

## To Do List
- [ ] Add admin management
- [ ] Add party cores
- [ ] Add member subscription registering
- [ ] Add in-app chat
- [ ] Add register requests

## Installation

To install it, you will need: [bunjs](bun.sh), a postgres server, a [resend account](https://resend.com/) and knowledge using git, typescript, react and others. To copy the repository locally (in the directory that you prefer):

```
git clone https://github.com/darklight9811/workerparty
```

Then you can install the code dependencies using:
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

## Structure
The codebase is a monorepo, meant to clearly separate concerns and code for reusability

```
workerparty/
|	// any application that will be deployed to the final user
├── apps/
|	|
|	└── dashboard/
|
├── packages/
|	|	// Domains are features in their indisible concern, also called business domains
│   ├── domains/src/
|	|	|
|	|	|	// Each domain contain an index that is meant for client/server exports (needs to work for both client and server)
|	|	├── domains/(domain)/
|	|	|	|
|	|	|	|	// All frontend components that have visual and domain logic
|	|	|	├── components/
|	|	|	|
|	|	|	|	// All backend code that won't be available to the frontend, you can create an index to export the service (don't export any sql/table file)
|	|	|	├── server/
|	|	|	|	|
|	|	|	|	|	// the trpc router unit of that domain
|	|	|	|	├── router.server.ts
|	|	|	|	|
|	|	|	|	|	// the service that contains the business logic for the domain
|	|	|	|	├── service.server.ts
|	|	|	|	|
|	|	|	|	|	// the sql queries that interact with database, later on we can migrate to raw sql to increase performance
|	|	|	|	├── sql.server.ts
|	|	|	|	|
|	|	|	|	|	// the sql table that composes the database structure and relations of the domain
|	|	|	|	└── table.server.ts
|	|	|	|
|	|	|	|	// The validation schema that can be reused for both the backend and the frontend
|	|	|	└── schema.ts
|	|	|
|	|	|	// after creating a router in one of the domains, update this file to make it available in the trpc ecosystem
|	|	└── server.ts
|	|
|	|	// DS stands for design system, this package contains code not directly tied to any business logic
│   ├── ds/
|	|	|
|	|	|	// All visual react components used in the application
|	|	├── components/
|	|	|
|	|	|	// All react hooks used in the application
|	|	├── hooks/
|	|	|
|	|	|	// Any custom icon component (that lucide doesn't cover)
|	|	├── icons/
|	|	|
|	|	|	// Some generic helper functions
|	|	├── lib/
|	|	|
|	|	|	// The general styling config that setups tailwind and the theme
│   │   └── style.css
|	|	
│   |   // All email templates to be sent by the backend
│   └── emails/
|
|	// static assets to be served in the applications, such as locales, images, etc
├── public/
|
|	// Scripts are code related to quality assurance and CICD
└── scripts/src/
	|
	|	// Get the code line coverage result and parse it into a summary
	├── coverage
	|
	|	// Make sure all the localization files contains the same keys
	└── locale
```