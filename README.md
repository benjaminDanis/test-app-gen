# DJ SPA Platform
Welcome to the Dow Jones Single Page App Platform!

This repo is designed to be used as a [template repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository) for newly created single-page-apps. The structure utilizes the NextJS `/pages` directory, and the application itself contains all of the dependencies you will need to spin-up  a new consumer facing (B2B coming soon) SPA.

The platform is built on top of our core functionality, which you can view in our [sonata repository](https://github.dowjones.net/DJ-SPA/sonata).

The SPA Platform uses the NextJS framework to generate performant single-page-apps quickly and easily. Our goal is provide a platform that allows developers to focus solely on application logic, and leverages an application "shell" that contains all common integrations across brands. These integrations (like ads, analytics, & entitlements) come out of the box with little to no configuration required. 

## Architecture

Single Page Apps promote a more immersive experience for users, which is why performance is a huge focus for the platform. Ideally, we strive to maintain sub-second page load times between pages, and as close to that on initial page loads as well. We have adhered to some general guidelines when developing Single Page Apps that help us achieve these low load times that should be utilized whenever possible.

### User Agnostic Server Renders

Any requests that are made to the application server that can be user-agnostic, should be. This allows us to leverage CloudFront and serve pages quickly, without forcing users to wait on a server to respond to their interactions.

### Non-React Code

Utilizing React’s dangerously set inner html for code that does not rely on application state, or does not update application state directly, not only moves that code up the critical rendering path (since the browser isn’t waiting on the react and react-dom library to load before it begins parsing), it consequently drops React as a dependency entirely.

For example, our entitlements integration is completely library/framework agnostic; it is 100% compatible with any JS library/framework and could be loaded asynchronously or inlined directly. To accomplish this, we utilize our Global Messaging System - a pure JS, pub/sub library used by frontend components to communicate and react to different self-described events.

## Usage & Installation

1. Install `NodeJS` and `redis`
2. Add an entry to your `/etc/hosts` file with your application's domain, like so:
`127.0.0.1  www.local.domain.com`
3. Follow instructions to add local consumer certs to your machine for local https [here](https://github.dowjones.net/responsive/local-consumer-ssl-certs).

### Bun Install Support

This template app supports the use of [bun](https://bun.sh) to install and manage dependencies, which has been proven to drastically reduce local install times compared to `npm` and other NodeJS dependency managers. As a result, it will also install with `bun` when building on Servo. You don't have to use `bun` locally, and to prevent Servo from using it, simply remove the `bun.lockb` file.

### Setting up a new application.

Simply create a new repository using the `dj-spa-platform` repo as a template, and clone it to your machine. That repository comes with all the baseline dependencies and integrations that are necessary for a consumer.

Out-of-the-box support includes:
1. Advertisements
2. Analytics
3. data-provider
4. Entitlements
5. Content Encryption/Decryption
6. React Contexts & Hooks (user data, content data, etc.)
7. Universal Design System (uds-kit)

### Running your new application locally.

1. Install the application using `npm i` or `pnpm i`
	- there is an [open issue on NPM](https://github.com/npm/cli/issues/4828) that may prevent the usage of package-lock on servo
	- some develoeprs have experienced issues installing the app using `npm` while on GlobalProtect. Common remedies include:
		- `pnpm i`
		- clearing npm cache and `.npm` directory, then installing with `npm i`, and repeating until completion
2. Update your `.env.local` with the proper values.
3. Start your local `redis`server using: `redis-server`
4. Start your application https dev server using: `npm run dev:secure`

### Deploying your new application to the cloud.
See instructions below on: [Deploying a single page applicaton on Servo](####deploying-a-single-page-application-on-servo.).

## Platform Features

### @newscorp-djcs/sonata-core/data-provider

An isomorphic, pure JS lib that allows applications to send/receive data from data sources. Supports redis connections on server-side implementations. Automatically creates NextJS API endpoints for each data type. Custom routes for each data-type can be created to override the default GET request handlers.

#### Shared Data Layer (GraphQL)

Our GraphQL instance which houses queries for many consumer data sources.

We have a couple of queries built into our single page app, which allow us to use Shared Data Layer. In the queries folder, there is a query for fetching an article as well as a collection. We also include a query for getting articles by keywords, and a query for fetching navigation menu data by individual brands.

We can make server side requests directly to the Shared Data Graph using these queries, accessing the same source that [Apollo Studio](https://studio.apollographql.com/org/dj-shared-data/graphs) uses. In addition, any client side queries can be routed through the app’s API, which will allow us to protect the source URL from unwanted requests.

#### Adding new queries & fetch logic.

New queries can be added, provided that they are namespaced under a unique `dataType`, by pull request to the `@newscorp-djcs/sonata-core`package.

#### Adding new data sources.

Adding new endpoints to the data-provider is simple. As long as implementations are using pure JS that are compatible across browser and server JS runtimes, they can be included in data-provider. These can be added by pull request to the `@newscorp-djcs/sonata-core` package as well.

## React Components, Hooks, & Contexts

### `DataProvider`

We make this content available to our entire page by wrapping it in this component. It takes one prop, `value`, with the entire page's contents stored in a single object.

#### Example:
```jsx
const Page = ({ content }) => {
  return (
    <DataProvider value={content}>
    </DataProvider>
  );
}

export const getServerSideProps = async ({ req: { query: { articleId } } }) => {
  const response = await getArticleById(articleId);
  return {
    props: {
      content: { article: { [articleId]: response } }
    }
  }
}

export default Page;
```

### `useDataContext`

To access all of this content from any component, we use a Data Context. It holds a single value called `content` which is where we store all of the server side or client side requested data.

#### Example:
```javascript
const content = useDataContext();
```

This example shows how you can use content from the Data Context on any component in the page.

### `usePageContent`

To allow content to be fetched from the client side conveniently, you can use this method. It takes a single argument, an object with the properties `content` and `pageType`.

#### Example:
```javascript
const { content } = usePageContent({ content: pageProps.content, pageType: 'section' });
```

This example shows how the content from the server side request is being passed to the method, along with a page type for the data that it needs to collect. 

Interestingly, the returned `content` does not duplicate any of the original from the page props, it preserves the reference to whatever object is being passed from `pageProps.content` and adds the new data to that object. This minimizes the usage of storage space on the webpage.

## Infrastructure

### Servo

Our in-house code deployment platform, Servo, provides a UI on top of AWS services that allows us to quickly deploy our code and share with stakeholders.

#### Servo applications & stacks.

Servo UI sits on top of AWS services that allow us to deploy code in GitHub onto Docker containers, with support for DR, instance scale up/down, and load balancing.

These resources are organized under Servo Apps and Servo Stacks. An App contains one or more Stacks. A stack contains the resources required to run our applications.

A typical Servo stack consists of the following:

- a minimum of one EC2 instance (instance sizes ranges are configurable)

- an auto scaling group

- an application load balancer

- an nginx web server

- access to CloudWatch logs

- provisioned S3 storage (IAM access baked into stack)

- pm2 for process management


Some optional resources/functions are:

- Redis cluster

- CRON jobs

- ACM Certificates

- slack notifications

- MongoDB Atlas cluster

- Newrelic

- S3 storage

The Servo documentation is extremely detailed, and should be referenced for any further questions.

##### 12 Factor Applications

Servo itself follows the 12 Factor Application architecture, and requires that all applications deployed on its platform do so as well.

From 12factor.net:

> The twelve-factor app is a methodology for building software-as-a-service apps that:
> 
> Use **declarative** formats for setup automation, to minimize time and cost for new developers joining the project;  
> Have a **clean contract** with the underlying operating system, offering **maximum portability** between execution environments;  
> Are suitable for **deployment** on modern **cloud platforms**, obviating the need for servers and systems administration;  
> **Minimize divergence** between development and production, enabling **continuous deployment** for maximum agility;  
> And can **scale up** without significant changes to tooling, architecture, or development practices.  

While there many implications to consider in this paradigm, one is extremely relevant to Single Page Applications: *Environmental variables are injected at runtime, and are not available at build time.*

This is solved on a case-by-case basis, and has never prevented an application from running successfully on Servo.

#### Deploying a single page application on Servo.
1.  Create a .servo file and store it in the root directory of the application
2.  Create a new application on next.servo.com
	- non-production apps should be created in the dev account, production applications in the prod 					account
2.  point to GitHub repo for application source code
4.  Create a new stack within that application
	- dev, int, stg, beta, prod all valid names
	- PR stacks can be configured
6.  Add stack env vars
7.  Configure network ingress/egress settings
8.  Adjust health check route to /api/health
	- Ensure there is no application code protecting this URL, it must be public
10.  If the application is meant to be accessible publicly, change the application load balancer type to public (default is internal)
11.  Add the proper permissions for building, deploying, etc.
12.  Authorize any necessary certificates
13.  Build from a desired commit
14.  Deploy commit with a descriptive message
15.  Test application URLs

### AWS CloudFront
Each of brands sit behind a CloudFront distribution. We manage changes such as adding new origins, creating new behaviors, or associating Lambda functions through various terraform files. Servo stacks can be easily updated to support these types of changes.

## Consumer Services

### Entitlements

For consumer products, entitlements are relatively straightforward: a user is either entitled or not to read unlimited articles for a certain brand. There are some caveats, but those have generally been abstracted away from the developer. A developer can easily determine whether a user is entitled to full article content based on a simple client-side request to our content-access API. This content-access API lives on the `/client` route of a brand's domain (by way of a CloudFront behavior directing requests to a production content-access application), and will respond with either the current user's entitlements (based on the JWT sent in the request).

#### Content Encryption

Regardless of a user's given entitlements, the request for an article is always made, and content is always returned. Before returning the content to the client, however, the content is first encrypted by the server. That content can then be decrypted with the proper key, which is returned by request to the `/client` endpoint from an authenticated and authorized user.

Our entitlements service, paired with the accompanying encryption/decryption of content, allows us to decouple requests for content from the user itself, and enables efficient usage of CDN caching. The platform has a pre-built entitlements integration, as well as encryption/decryption utilities.

## Unified Design System

### UDS-kit
The Unified Design System is a streamlined approach to building user interfaces. It allows us to take existing components and build layouts that reflect a shared design methodology. These are the building blocks of our applications which we can import by installing a library.

Under the unified design system there are a number of components that make up most of our layouts, starting with the Flex Card. It incorporates the design system that we have established, while providing enough flexibility to allow for the adaption of the component in different scenarios. 

We use these foundational components to create uniform layouts but also inject our brand’s theme into them. At the root of all of our UDS components is the theme that represents each brand. We use a similar pattern as Newskit (https://www.newskit.co.uk/) to make the theme available to the components but we have made several optimizations to the way that components render.

## orchestrator
