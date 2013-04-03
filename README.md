## Controller

The main aim of controller is help simplify the most common tasks that you need to do when setting up routes and functions/classes to handle them.


### Routing:
	
	var ExampleController = controller('ExampleController'/* , injectedArgs ... */)

	// Default route setup ~ '/example' or '/example/hello'
	app.all('/example/?:action?', ExampleController.bind())

	// Action + ID Routes setup ~ '/example/custom/12'
	app.all('/example/:action/:id?', ExampleController.bind())
Note: if you use both types of routes, be sure to place your routes in this order

### Making A Controller:

	module.exports = ExampleController = function() {
		return (require('./../classes/Controller.js')).extend(
		{
			// example that returns JSON, available from route '/example/hello'
			helloAction: function() {
				this.send({
					message: 'Hi there'
				})
			},

			// example that renders a view, available from route '/example/view'
			viewAction: function() {
				this.render('view.ejs', {});
			}
		});
	};

### RESTful Actions

	module.exports = ExampleController = function() {
		return (require('./../classes/Controller.js')).extend(
		{
			postAction: function() {
				this.send({
					status: 'Created record!' 
				});
			},

			listAction: function() {
				this.send({
					status: 'Sending you the list of examples.'
				});
			},

			getAction: function() {
				this.send({
					status: 'sending you record with id of ' + this.req.params.id
				});
			},

			putAction: function() {
				this.send({
					status: 'updated record with id ' + this.req.params.id
				});
			},

			deleteAction: function() {
				this.send({
					status: 'deleted record with id ' + this.req.params.id
				});
			}
		});
	};

### Making Actions:

When doing a 'GET /example' it will route either listAction() first OR getAction() if listAction is not defined, if neither are defined
express's next function will be called allowing it to fall through the controller and move onto any other middleware you configured

If you wanted '/example/hello' as a route, you simply implement helloAction() in your controller and it will be automatically routed to it.

This is the default way to setup a controller to use actions, by default you can also vist '/example/12' and it will route to the getAction() function in your controller (if its defined) with this.req.params.id set for you to use. (the same applies for all http methods, eg PUT/DELETE/POST/GET etc)

### Using Proxy
In this example i demonstrate how to use a proxy function, that will be called in the correct context with the arguments that would have been passed to the function you otherwise would have had to put there.

Note: handleException is an inbuilt Controller method

	module.exports = ExampleController = function() {
		return (require('./../classes/Controller.js')).extend(
		{
			getAction: function() {
				model.findAll()
					.success(this.proxy('handleFindAll'))
					.error(this.proxy('handleException'));
			},

			handleFindAll(allModels) {
				this.send(allModels);
			}
		});
	};


### Error handling:

By default any Exceptions thrown inside Controllers will be caught (before crashing your app) and a proper/sane response will be sent to the client.

# Solved Problems

## Javascript/CSS smashing. (StealJS recommended by Richard)

	To do a production build,
		1. cd public
		2. (Windows) steal\js.bat scripts/build.js or (Nix) steal\js scripts/build.js
		3. (TODO) Grunt build support for CI and CLI

## Environment-specific configuration mechanisms
	
	NCONF Configuration Files:
	
	config/global.json is where you put all your defaults/global stuff
	config/NODE_ENV.json is also loaded and recursively merged with global (where NODE_ENV is one of 'local', 'dev', 'stag' or 'prod')

	You should set your NODE_ENV environment variable (but on your local machine you shouldn't need to, it will default to use config/local.json)


# Problems we need to solve and/or demonstrate solutions for:

## Examples of several types of data storage calls
	1. Postgres (MySQL as well?), NoSQL, Redis
	2. Transaction example




## Demonstration of the important of modularizing data calls into service layer objects.

	Example of dependency injection.
	I've tried to make the controllers and services all use
	this principle, but it's probably the most important thing
	to me, so I keep beating this horse.


## Production Deployment Mechanism

	Need multiple instances and a means of not losing session information if one instance dies.
	
	1. Brian recommended Redis, (+1 from richard for redis)
	2. I saw a neat demo on gossip protocol and streaming that looked fun.
	
	Redis sounds easier and more straightforward.


## Continuous integration

	grunt + jasmine-node is what I usually use but there's lots of options here
	Richard: (Grunt will work well as StealJS has a plugin for building the JS)

## End-to-end testing

	Brian Carlson mentioned a cool automated REST tester using something like CuRL

