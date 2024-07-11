#### Assumptions

- Parking spots bookings can't be overlapped.
- Parking spots bookings can have a start date in the past.
- Parking spots bookings can't have an end date in the past.

---

#### Authentication
Add a header "x-api-key" with one of these values 

- Admin: `adminToken1`
- User1: `userToken1`
- User2: `userToken2`

Note: 
> Db is seeded with a dummy admin, two users and parking spots if their tables are empty on development environment


---

#### Setup

- Install lts versions of nodejs, docker and docker compose
- Install task cli globally (it's similar to [Make](https://www.computerhope.com/unix/umake.htm) in linux)
    -  `npm install -g @go-task/cli`
- Run `task init`

--- 

#### Start the development
- `task run`

--- 

#### Docs
> Make sure to run the server first
- [View Docs](http://localhost:3000/docs)

---

#### Tests

##### Run the unit tests
- `task test:run`

##### Run the e2e tests
> Initialize the test containers first using `task test:e2e:init`
- `task test:e2e:run`
--- 


#### Migrations
> Migrations are run automatically on the development, testing environments

##### Create a new migration
- `task migration:create -- {migration-name}`

##### Run all migrations
- `task migration:run`

##### Revert the latest migration
- `task migration:revert`

