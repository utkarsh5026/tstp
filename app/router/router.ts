import { HttpRequest } from "../req/request";
import { HttpResponse } from "../res/response";
import { HttpMethod } from "../req/methods";
import * as path from "path";

/**
 * A type representing a route handler function.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
type RouteHandler = (
  req: HttpRequest,
  res: HttpResponse,
  next: () => void
) => void;

/**
 * An interface representing a route.
 */
export interface Route {
  method: HttpMethod; // The HTTP method for the route (GET, POST, etc.).
  path: string; // The path for the route.
  handlers: RouteHandler[]; // An array of handler functions for the route.
}

/**
 * A class representing a router.
 */
export class Router {
  _prefix: string; // The prefix for all routes in this router.
  _routes: Route[]; // An array of routes in this router.

  /**
   * Creates a new Router instance.
   * @param prefix - The prefix for all routes in this router.
   */
  constructor(prefix: string) {
    this._prefix = prefix;
    this._routes = [];
  }

  /**
   * Gets the prefix for all routes in this router.
   * @returns The prefix string.
   */
  get prefix(): string {
    return this._prefix;
  }

  /**
   * Adds a new route to the router.
   * @param routePath - The path for the route.
   * @param method - The HTTP method for the route.
   * @param handlers - An array of handler functions for the route.
   */
  addRoute(
    routePath: string,
    method: HttpMethod,
    handlers: RouteHandler[]
  ): void {
    const absPath = path.join(this._prefix, routePath);
    const route = { method, path: absPath, handlers };
    this._routes.push(route);
  }

  /**
   * Adds a new GET route to the router.
   * @param path - The path for the route.
   * @param handlers - An array of handler functions for the route.
   * @returns The current Router instance.
   */
  get(path: string, ...handlers: RouteHandler[]): Router {
    this.addRoute(path, HttpMethod.GET, handlers);
    return this;
  }

  /**
   * Adds a new POST route to the router.
   * @param path - The path for the route.
   * @param handlers - An array of handler functions for the route.
   * @returns The current Router instance.
   */
  post(path: string, ...handlers: RouteHandler[]): Router {
    this.addRoute(path, HttpMethod.POST, handlers);
    return this;
  }

  /**
   * Adds a new PUT route to the router.
   * @param path - The path for the route.
   * @param handlers - An array of handler functions for the route.
   * @returns The current Router instance.
   */
  put(path: string, ...handlers: RouteHandler[]): Router {
    this.addRoute(path, HttpMethod.PUT, handlers);
    return this;
  }

  /**
   * Adds a new DELETE route to the router.
   * @param path - The path for the route.
   * @param handlers - An array of handler functions for the route.
   * @returns The current Router instance.
   */
  delete(path: string, ...handlers: RouteHandler[]): Router {
    this.addRoute(path, HttpMethod.DELETE, handlers);
    return this;
  }

  /**
   * Matches a route based on the HTTP method and path.
   * @param method - The HTTP method to match.
   * @param path - The path to match.
   * @returns An object containing the matched handlers and parameters, or null if no match is found.
   */
  match(
    method: HttpMethod,
    path: string
  ): { handlers: RouteHandler[]; params: Record<string, string> } | null {
    for (const route of this._routes) {
      if (route.method !== method) continue;

      const params: Record<string, string> = {};
      const routePathParts = route.path.split("/");
      const pathParts = path.split("/");

      if (routePathParts.length !== pathParts.length) continue;

      let matched = true;

      for (let i = 0; i < routePathParts.length; i++) {
        if (routePathParts[i].startsWith(":")) {
          const paramName = routePathParts[i].slice(1);
          params[paramName] = pathParts[i];
          continue;
        } else if (routePathParts[i] !== pathParts[i]) {
          matched = false;
          break;
        }
      }

      if (matched) return { handlers: route.handlers, params };
    }
    return null;
  }

  /**
   * Gets all routes in this router.
   * @returns An array of routes.
   */
  get routes(): Route[] {
    return this._routes;
  }

  /**
   * Handles an incoming HTTP request by matching it to a route and executing the corresponding handlers.
   * @param req - The HTTP request object.
   * @param res - The HTTP response object.
   * @returns A promise that resolves to a boolean indicating whether the request was handled.
   */
  async handleRoute(req: HttpRequest, res: HttpResponse): Promise<boolean> {
    const match = this.match(req.method, req.url);
    if (!match) return false;

    for (const handler of match.handlers) {
      // Execute each handler as a promise.
      await new Promise<void>((resolve) => {
        handler(req, res, () => {
          resolve();
        });
      });

      if (res.headersSent) return true;
    }

    return true;
  }
}
