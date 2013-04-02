var NoActionException = require('./../exceptions/NoAction')
  , Class = require('uberclass');

module.exports = Class.extend(
/* @Static */
{
	actionsEnabled: true,

	httpMethodsEnabled: true,

	bind: function() {
		return this.callback('newInstance');
	}
},
/* @Prototype */
{
	req: null,
	res: null,
	next: null,
	resType: 'json',

	setup: function(req, res, next) {
		try {
			return this.performanceSafeSetup(req, res, next);
		} catch(e) {
			return [e];
		}
	},

	performanceSafeSetup: function(req, res, next) {
		var method = null;

		this.next = next;
		this.req = req;
		this.res = res;

		// Route based on an action first if we can
		if (this.Class.actionsEnabled && typeof this.req.params.action != 'undefined') {
			if (isNaN(this.req.params.action)) {
				var funcName = this.req.params.action + 'Action';

				if (typeof this[funcName] == 'function') {
					return [null, funcName, next];
				} else {
					throw new NoActionException();
				}
			} else {
				method = this.req.method.toLowerCase() + 'Action';
				if (typeof this[method] == 'function') {

					this.req.params.id = this.req.params.action;
					delete this.req.params.action;

					return [null, method, next];
				} else {
					throw new NoActionException();
				}
			}
		} else if (this.Class.actionsEnabled && this.req.params.action == undefined && this['listAction'] != undefined) {
			return [null, 'listAction', next];
		}

		// Route based on the HTTP Method, otherwise throw an exception
		if (this.Class.httpMethodsEnabled) {
			var method = this.req.method.toLowerCase() + 'Action';
			if (typeof this[method] != 'function')
				throw new NoActionException();
		}

		// If we got this far without an action but with a method, then route based on that
		return [null, method, next];
	},

	init: function(error, method, next) {
		if (error && error instanceof NoActionException) {
			this.next();
		} else {
			try {
				if (error)
					throw error;

				if (method != null) {
					this[method](this.req, this.res);
				} else {
					this.next();
				}

			} catch(e) {
				this.handleException(e);
			}
		}
	},

	send: function(content, code, type) {
		code 
			? this.res[type || this.resType](code, content)
			: this.res[type || this.resType](content)
	},

	handleException: function(exception) {
		this.send({ error: 'Unhandled exception: ' + exception });
	}
});