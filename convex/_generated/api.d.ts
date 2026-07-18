/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as chats from "../chats.js";
import type * as documents from "../documents.js";
import type * as jobs from "../jobs.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_jobs from "../lib/jobs.js";
import type * as lib_openai from "../lib/openai.js";
import type * as lib_tags from "../lib/tags.js";
import type * as notes from "../notes.js";
import type * as search from "../search.js";
import type * as tags from "../tags.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  chats: typeof chats;
  documents: typeof documents;
  jobs: typeof jobs;
  "lib/auth": typeof lib_auth;
  "lib/jobs": typeof lib_jobs;
  "lib/openai": typeof lib_openai;
  "lib/tags": typeof lib_tags;
  notes: typeof notes;
  search: typeof search;
  tags: typeof tags;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
