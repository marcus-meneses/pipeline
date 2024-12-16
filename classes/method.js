"use strict";
const fileSystem = require("fs");
const virtualMachine = require("vm");
//const gc = require("expose-gc/function");

class Cog {
  returnData = { __magic_empty: true };

  constructor(verb) {
    this.verb = verb;
  }

  error(message, status) {
    return {
      error: {
        message: message || "Unexpected behavior!",
        status: status || 500,
      },
    };
  }

  async before(method) {
    const returnData = method();
    if (returnData) {
      this.returnData = returnData;
    }
  }

  async any(method) {
    if (this.returnData.__magic_empty) {
      delete this.returnData.__magic_empty;
      this.returnData = method();
    }
  }

  async get(method) {
    if (this.returnData.__magic_empty) {
      if (this.verb == "GET") {
        this.returnData = method();
      }
    }
  }

  async post(method) {
    if (this.returnData.__magic_empty) {
      if (this.verb == "POST") {
        this.returnData = method();
      }
    }
  }

  async patch(method) {
    if (this.returnData.__magic_empty) {
      if (this.verb == "PATCH") {
        this.returnData = method();
      }
    }
  }

  async put(method) {
    if (this.returnData.__magic_empty) {
      if (this.verb == "PUT") {
        this.returnData = method();
      }
    }
  }

  async delete(method) {
    if (this.returnData.__magic_empty) {
      if (this.verb == "DELETE") {
        this.returnData = method();
      }
    }
  }
}

class Method {
  startCountdown(methodIdentifier) {
    global.timeouts[`${methodIdentifier}`] = setTimeout(() => {
      clearTimeout(global.timeouts[`${methodIdentifier}`]);
      global.methods[`${methodIdentifier}`] = null;
      global.timeouts[`${methodIdentifier}`] = null;
      delete global.methods[`${methodIdentifier}`];
      delete global.timeouts[`${methodIdentifier}`];
      //gc();
    }, this.context.METHOD_CACHE_TTL);
  }

  resetCountdown(methodIdentifier) {
    if (global.timeouts[`${methodIdentifier}`]) {
      clearTimeout(global.timeouts[`${methodIdentifier}`]);
      this.startCountdown(`${methodIdentifier}`);
    }
  }

  constructor(methodName, context, verb) {
    this.context = context;
    this.context.verb = verb;
    this.context.require = require;
    this.context.console = console;
    this.context.cog = new Cog(verb);
    this.verb = verb;

    this.methodName = methodName;
    this.methodCode = "";

    if (!global.methods[`${methodName}`]) {
      try {
        this.methodCode = fileSystem.readFileSync(
          `./methods/${methodName}.js`,
          "utf8"
        );
        global.methods[`${methodName}`] = new virtualMachine.Script(
          this.methodCode
        );
        this.startCountdown(methodName);
      } catch (error) {
        this.return = this.context.cog.error(
          `Method ${this.methodName} unknown`,
          404
        );
      }
    } else {
      this.resetCountdown(methodName);
    }
  }

  async run() {
    try {
      if (!global.methods[this.methodName])
        return {
          error: { message: `Method ${this.methodName} unknown`, status: 404 },
        };
      virtualMachine.createContext(this.context);
      await global.methods[this.methodName].runInContext(this.context, {
        timeout: Number(this.context.METHOD_TIMEOUT),
      });
      this.return = this.context.cog.returnData.__magic_empty
        ? null
        : this.context.cog.returnData;
      if (this.return == null)
        return this.context.cog.error(
          `Cannot ${this.verb} ${this.methodName}`,
          404
        );
      return this.return;
    } catch (error) {
      return this.context.cog.error(error.message, error.status);
    }
  }
}

module.exports = Method;
