/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as authActions from "../authActions.js";
import type * as chatRequests from "../chatRequests.js";
import type * as lib from "../lib.js";
import type * as lib_siweMessage from "../lib/siweMessage.js";
import type * as lib_siweSession from "../lib/siweSession.js";
import type * as messages from "../messages.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  authActions: typeof authActions;
  chatRequests: typeof chatRequests;
  lib: typeof lib;
  "lib/siweMessage": typeof lib_siweMessage;
  "lib/siweSession": typeof lib_siweSession;
  messages: typeof messages;
  users: typeof users;
}>;

export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
