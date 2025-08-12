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
├── apps/
|	|	// any application that will be deployed to the final user
|	├── dashboard/
├── packages/
│   ├── domains/src/
|	|	|	// Domains are features in their indisible concern, also called business domains
|	|	├── domains/(domain)/
|	|	|	// Each domain contain an index that is meant for client/server exports (needs to work for both client and server)
|	|	|	├── components/
|	|	|	|	// All frontend components that have visual and domain logic
|	|	|	|
|	|	|	├── server/
|	|	|	|	// All backend code that won't be available to the frontend, you can create an index to export the service (don't export any sql/table file)
|	|	|	|	├── router.server.ts
|	|	|	|	|	// the trpc router unit of that domain
|	|	|	|	├── service.server.ts
|	|	|	|	|	// the service that contains the business logic for the domain
|	|	|	|	├── sql.server.ts
|	|	|	|	|	// the sql queries that interact with database, later on we can migrate to raw sql to increase performance
|	|	|	|	└── table.server.ts
|	|	|	|		// the sql table that composes the database structure and relations of the domain
|	|	|	|
|	|	|	└── schema.ts
|	|	|		// The validation schema that can be reused for both the backend and the frontend
|	|	└── server.ts
|	|		// after creating a router in one of the domains, update this file to make it available in the trpc ecosystem
|	|
│   ├── ds/
|	|	|	// DS stands for design system, this package contains code not directly tied to any business logic
|	|	├── components/
|	|	|	// All visual react components used in the application
|	|	├── hooks/
|	|	|	// All react hooks used in the application
|	|	├── icons/
|	|	|	// Any custom icon component (that lucide doesn't cover)
|	|	├── lib/
|	|	|	// Some generic helper functions
│   │   └── style.css
|	|	 	// The general styling config that setups tailwind and the theme
|	|	
│   └── emails/
│       └── All email templates to be sent by the backend
|
├── public/
|	// static assets to be served in the applications, such as locales, images, etc
|
└── scripts/src/
	|	// Scripts are code related to quality assurance and CICD
	├── coverage
	|	// Get the code line coverage result and parse it into a summary
	└── locale
		// Make sure all the localization files contains the same keys

```