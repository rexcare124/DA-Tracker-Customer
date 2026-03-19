
/**
 * Client
**/

import * as runtime from '@prisma/client/runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model VerificationToken
 * 
 */
export type VerificationToken = $Result.DefaultSelection<Prisma.$VerificationTokenPayload>
/**
 * Model Property
 * 
 */
export type Property = $Result.DefaultSelection<Prisma.$PropertyPayload>
/**
 * Model Manager
 * 
 */
export type Manager = $Result.DefaultSelection<Prisma.$ManagerPayload>
/**
 * Model Tenant
 * 
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model Location
 * 
 */
export type Location = $Result.DefaultSelection<Prisma.$LocationPayload>
/**
 * Model Application
 * 
 */
export type Application = $Result.DefaultSelection<Prisma.$ApplicationPayload>
/**
 * Model Lease
 * 
 */
export type Lease = $Result.DefaultSelection<Prisma.$LeasePayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Highlight: {
  HighSpeedInternetAccess: 'HighSpeedInternetAccess',
  WasherDryer: 'WasherDryer',
  AirConditioning: 'AirConditioning',
  Heating: 'Heating',
  SmokeFree: 'SmokeFree',
  CableReady: 'CableReady',
  SatelliteTV: 'SatelliteTV',
  DoubleVanities: 'DoubleVanities',
  TubShower: 'TubShower',
  Intercom: 'Intercom',
  SprinklerSystem: 'SprinklerSystem',
  RecentlyRenovated: 'RecentlyRenovated',
  CloseToTransit: 'CloseToTransit',
  GreatView: 'GreatView',
  QuietNeighborhood: 'QuietNeighborhood'
};

export type Highlight = (typeof Highlight)[keyof typeof Highlight]


export const Amenity: {
  WasherDryer: 'WasherDryer',
  AirConditioning: 'AirConditioning',
  Dishwasher: 'Dishwasher',
  HighSpeedInternet: 'HighSpeedInternet',
  HardwoodFloors: 'HardwoodFloors',
  WalkInClosets: 'WalkInClosets',
  Microwave: 'Microwave',
  Refrigerator: 'Refrigerator',
  Pool: 'Pool',
  Gym: 'Gym',
  Parking: 'Parking',
  PetsAllowed: 'PetsAllowed',
  WiFi: 'WiFi'
};

export type Amenity = (typeof Amenity)[keyof typeof Amenity]


export const PropertyType: {
  Rooms: 'Rooms',
  Tinyhouse: 'Tinyhouse',
  Apartment: 'Apartment',
  Villa: 'Villa',
  Townhouse: 'Townhouse',
  Cottage: 'Cottage'
};

export type PropertyType = (typeof PropertyType)[keyof typeof PropertyType]


export const ApplicationStatus: {
  Pending: 'Pending',
  Denied: 'Denied',
  Approved: 'Approved'
};

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus]


export const PaymentStatus: {
  Pending: 'Pending',
  Paid: 'Paid',
  PartiallyPaid: 'PartiallyPaid',
  Overdue: 'Overdue'
};

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]

}

export type Highlight = $Enums.Highlight

export const Highlight: typeof $Enums.Highlight

export type Amenity = $Enums.Amenity

export const Amenity: typeof $Enums.Amenity

export type PropertyType = $Enums.PropertyType

export const PropertyType: typeof $Enums.PropertyType

export type ApplicationStatus = $Enums.ApplicationStatus

export const ApplicationStatus: typeof $Enums.ApplicationStatus

export type PaymentStatus = $Enums.PaymentStatus

export const PaymentStatus: typeof $Enums.PaymentStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationTokens
    * const verificationTokens = await prisma.verificationToken.findMany()
    * ```
    */
  get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.property`: Exposes CRUD operations for the **Property** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Properties
    * const properties = await prisma.property.findMany()
    * ```
    */
  get property(): Prisma.PropertyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.manager`: Exposes CRUD operations for the **Manager** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Managers
    * const managers = await prisma.manager.findMany()
    * ```
    */
  get manager(): Prisma.ManagerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.location`: Exposes CRUD operations for the **Location** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Locations
    * const locations = await prisma.location.findMany()
    * ```
    */
  get location(): Prisma.LocationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.application`: Exposes CRUD operations for the **Application** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Applications
    * const applications = await prisma.application.findMany()
    * ```
    */
  get application(): Prisma.ApplicationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lease`: Exposes CRUD operations for the **Lease** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Leases
    * const leases = await prisma.lease.findMany()
    * ```
    */
  get lease(): Prisma.LeaseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.11.1
   * Query Engine version: f40f79ec31188888a2e33acda0ecc8fd10a853a9
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Account: 'Account',
    Session: 'Session',
    VerificationToken: 'VerificationToken',
    Property: 'Property',
    Manager: 'Manager',
    Tenant: 'Tenant',
    Location: 'Location',
    Application: 'Application',
    Lease: 'Lease',
    Payment: 'Payment'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "account" | "session" | "verificationToken" | "property" | "manager" | "tenant" | "location" | "application" | "lease" | "payment"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      VerificationToken: {
        payload: Prisma.$VerificationTokenPayload<ExtArgs>
        fields: Prisma.VerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findMany: {
            args: Prisma.VerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          create: {
            args: Prisma.VerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          createMany: {
            args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          delete: {
            args: Prisma.VerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          update: {
            args: Prisma.VerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          upsert: {
            args: Prisma.VerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.VerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationToken>
          }
          groupBy: {
            args: Prisma.VerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenCountAggregateOutputType> | number
          }
        }
      }
      Property: {
        payload: Prisma.$PropertyPayload<ExtArgs>
        fields: Prisma.PropertyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PropertyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PropertyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          findFirst: {
            args: Prisma.PropertyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PropertyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          findMany: {
            args: Prisma.PropertyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          create: {
            args: Prisma.PropertyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          createMany: {
            args: Prisma.PropertyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PropertyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          delete: {
            args: Prisma.PropertyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          update: {
            args: Prisma.PropertyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          deleteMany: {
            args: Prisma.PropertyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PropertyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PropertyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>[]
          }
          upsert: {
            args: Prisma.PropertyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PropertyPayload>
          }
          aggregate: {
            args: Prisma.PropertyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProperty>
          }
          groupBy: {
            args: Prisma.PropertyGroupByArgs<ExtArgs>
            result: $Utils.Optional<PropertyGroupByOutputType>[]
          }
          count: {
            args: Prisma.PropertyCountArgs<ExtArgs>
            result: $Utils.Optional<PropertyCountAggregateOutputType> | number
          }
        }
      }
      Manager: {
        payload: Prisma.$ManagerPayload<ExtArgs>
        fields: Prisma.ManagerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ManagerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ManagerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerPayload>
          }
          findFirst: {
            args: Prisma.ManagerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ManagerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerPayload>
          }
          findMany: {
            args: Prisma.ManagerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerPayload>[]
          }
          create: {
            args: Prisma.ManagerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerPayload>
          }
          createMany: {
            args: Prisma.ManagerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ManagerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerPayload>[]
          }
          delete: {
            args: Prisma.ManagerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerPayload>
          }
          update: {
            args: Prisma.ManagerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerPayload>
          }
          deleteMany: {
            args: Prisma.ManagerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ManagerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ManagerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerPayload>[]
          }
          upsert: {
            args: Prisma.ManagerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ManagerPayload>
          }
          aggregate: {
            args: Prisma.ManagerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateManager>
          }
          groupBy: {
            args: Prisma.ManagerGroupByArgs<ExtArgs>
            result: $Utils.Optional<ManagerGroupByOutputType>[]
          }
          count: {
            args: Prisma.ManagerCountArgs<ExtArgs>
            result: $Utils.Optional<ManagerCountAggregateOutputType> | number
          }
        }
      }
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      Location: {
        payload: Prisma.$LocationPayload<ExtArgs>
        fields: Prisma.LocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findFirst: {
            args: Prisma.LocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findMany: {
            args: Prisma.LocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          delete: {
            args: Prisma.LocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          update: {
            args: Prisma.LocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          deleteMany: {
            args: Prisma.LocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          aggregate: {
            args: Prisma.LocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocation>
          }
          groupBy: {
            args: Prisma.LocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocationCountArgs<ExtArgs>
            result: $Utils.Optional<LocationCountAggregateOutputType> | number
          }
        }
      }
      Application: {
        payload: Prisma.$ApplicationPayload<ExtArgs>
        fields: Prisma.ApplicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApplicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApplicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          findFirst: {
            args: Prisma.ApplicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApplicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          findMany: {
            args: Prisma.ApplicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          create: {
            args: Prisma.ApplicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          createMany: {
            args: Prisma.ApplicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApplicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          delete: {
            args: Prisma.ApplicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          update: {
            args: Prisma.ApplicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          deleteMany: {
            args: Prisma.ApplicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApplicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApplicationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          upsert: {
            args: Prisma.ApplicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          aggregate: {
            args: Prisma.ApplicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApplication>
          }
          groupBy: {
            args: Prisma.ApplicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApplicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApplicationCountArgs<ExtArgs>
            result: $Utils.Optional<ApplicationCountAggregateOutputType> | number
          }
        }
      }
      Lease: {
        payload: Prisma.$LeasePayload<ExtArgs>
        fields: Prisma.LeaseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LeaseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeasePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LeaseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeasePayload>
          }
          findFirst: {
            args: Prisma.LeaseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeasePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LeaseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeasePayload>
          }
          findMany: {
            args: Prisma.LeaseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeasePayload>[]
          }
          create: {
            args: Prisma.LeaseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeasePayload>
          }
          createMany: {
            args: Prisma.LeaseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LeaseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeasePayload>[]
          }
          delete: {
            args: Prisma.LeaseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeasePayload>
          }
          update: {
            args: Prisma.LeaseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeasePayload>
          }
          deleteMany: {
            args: Prisma.LeaseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LeaseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LeaseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeasePayload>[]
          }
          upsert: {
            args: Prisma.LeaseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeasePayload>
          }
          aggregate: {
            args: Prisma.LeaseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLease>
          }
          groupBy: {
            args: Prisma.LeaseGroupByArgs<ExtArgs>
            result: $Utils.Optional<LeaseGroupByOutputType>[]
          }
          count: {
            args: Prisma.LeaseCountArgs<ExtArgs>
            result: $Utils.Optional<LeaseCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    account?: AccountOmit
    session?: SessionOmit
    verificationToken?: VerificationTokenOmit
    property?: PropertyOmit
    manager?: ManagerOmit
    tenant?: TenantOmit
    location?: LocationOmit
    application?: ApplicationOmit
    lease?: LeaseOmit
    payment?: PaymentOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    accounts: number
    sessions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }


  /**
   * Count Type PropertyCountOutputType
   */

  export type PropertyCountOutputType = {
    applications: number
    leases: number
    favoritedBy: number
    tenants: number
  }

  export type PropertyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | PropertyCountOutputTypeCountApplicationsArgs
    leases?: boolean | PropertyCountOutputTypeCountLeasesArgs
    favoritedBy?: boolean | PropertyCountOutputTypeCountFavoritedByArgs
    tenants?: boolean | PropertyCountOutputTypeCountTenantsArgs
  }

  // Custom InputTypes
  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PropertyCountOutputType
     */
    select?: PropertyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountLeasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeaseWhereInput
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountFavoritedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
  }

  /**
   * PropertyCountOutputType without action
   */
  export type PropertyCountOutputTypeCountTenantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
  }


  /**
   * Count Type ManagerCountOutputType
   */

  export type ManagerCountOutputType = {
    managedProperties: number
  }

  export type ManagerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    managedProperties?: boolean | ManagerCountOutputTypeCountManagedPropertiesArgs
  }

  // Custom InputTypes
  /**
   * ManagerCountOutputType without action
   */
  export type ManagerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ManagerCountOutputType
     */
    select?: ManagerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ManagerCountOutputType without action
   */
  export type ManagerCountOutputTypeCountManagedPropertiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyWhereInput
  }


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    applications: number
    leases: number
    favorites: number
    properties: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | TenantCountOutputTypeCountApplicationsArgs
    leases?: boolean | TenantCountOutputTypeCountLeasesArgs
    favorites?: boolean | TenantCountOutputTypeCountFavoritesArgs
    properties?: boolean | TenantCountOutputTypeCountPropertiesArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountLeasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeaseWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountFavoritesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountPropertiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyWhereInput
  }


  /**
   * Count Type LocationCountOutputType
   */

  export type LocationCountOutputType = {
    properties: number
  }

  export type LocationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    properties?: boolean | LocationCountOutputTypeCountPropertiesArgs
  }

  // Custom InputTypes
  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationCountOutputType
     */
    select?: LocationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountPropertiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyWhereInput
  }


  /**
   * Count Type LeaseCountOutputType
   */

  export type LeaseCountOutputType = {
    payments: number
  }

  export type LeaseCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payments?: boolean | LeaseCountOutputTypeCountPaymentsArgs
  }

  // Custom InputTypes
  /**
   * LeaseCountOutputType without action
   */
  export type LeaseCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaseCountOutputType
     */
    select?: LeaseCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LeaseCountOutputType without action
   */
  export type LeaseCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    prefix: string | null
    firstName: string | null
    lastName: string | null
    suffix: string | null
    password: string | null
    username: string | null
    defaultPrivacyLevel: string | null
    stateOfResidence: string | null
    cityOfResidence: string | null
    zipCode: string | null
    howDidYouHearAboutUs: string | null
    forumUrl: string | null
    youtubeUrl: string | null
    referredByUsername: string | null
    flyerPromoCode: string | null
    otherHeardAboutText: string | null
    termsAndPolicyAccepted: boolean | null
    otherInterestText: string | null
    otherInformationSourceText: string | null
    agreementAccepted: boolean | null
    onboardingComplete: boolean | null
    otp: string | null
    otpExpires: Date | null
    nextAuthId: string | null
    phoneNumber: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    prefix: string | null
    firstName: string | null
    lastName: string | null
    suffix: string | null
    password: string | null
    username: string | null
    defaultPrivacyLevel: string | null
    stateOfResidence: string | null
    cityOfResidence: string | null
    zipCode: string | null
    howDidYouHearAboutUs: string | null
    forumUrl: string | null
    youtubeUrl: string | null
    referredByUsername: string | null
    flyerPromoCode: string | null
    otherHeardAboutText: string | null
    termsAndPolicyAccepted: boolean | null
    otherInterestText: string | null
    otherInformationSourceText: string | null
    agreementAccepted: boolean | null
    onboardingComplete: boolean | null
    otp: string | null
    otpExpires: Date | null
    nextAuthId: string | null
    phoneNumber: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    prefix: number
    firstName: number
    lastName: number
    suffix: number
    password: number
    username: number
    defaultPrivacyLevel: number
    stateOfResidence: number
    cityOfResidence: number
    zipCode: number
    howDidYouHearAboutUs: number
    forumUrl: number
    youtubeUrl: number
    referredByUsername: number
    flyerPromoCode: number
    otherHeardAboutText: number
    termsAndPolicyAccepted: number
    dataInterests: number
    otherInterestText: number
    rankedMotivations: number
    rankedGovernments: number
    rankedInformationSources: number
    otherInformationSourceText: number
    agreementAccepted: number
    onboardingComplete: number
    otp: number
    otpExpires: number
    nextAuthId: number
    phoneNumber: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    prefix?: true
    firstName?: true
    lastName?: true
    suffix?: true
    password?: true
    username?: true
    defaultPrivacyLevel?: true
    stateOfResidence?: true
    cityOfResidence?: true
    zipCode?: true
    howDidYouHearAboutUs?: true
    forumUrl?: true
    youtubeUrl?: true
    referredByUsername?: true
    flyerPromoCode?: true
    otherHeardAboutText?: true
    termsAndPolicyAccepted?: true
    otherInterestText?: true
    otherInformationSourceText?: true
    agreementAccepted?: true
    onboardingComplete?: true
    otp?: true
    otpExpires?: true
    nextAuthId?: true
    phoneNumber?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    prefix?: true
    firstName?: true
    lastName?: true
    suffix?: true
    password?: true
    username?: true
    defaultPrivacyLevel?: true
    stateOfResidence?: true
    cityOfResidence?: true
    zipCode?: true
    howDidYouHearAboutUs?: true
    forumUrl?: true
    youtubeUrl?: true
    referredByUsername?: true
    flyerPromoCode?: true
    otherHeardAboutText?: true
    termsAndPolicyAccepted?: true
    otherInterestText?: true
    otherInformationSourceText?: true
    agreementAccepted?: true
    onboardingComplete?: true
    otp?: true
    otpExpires?: true
    nextAuthId?: true
    phoneNumber?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    prefix?: true
    firstName?: true
    lastName?: true
    suffix?: true
    password?: true
    username?: true
    defaultPrivacyLevel?: true
    stateOfResidence?: true
    cityOfResidence?: true
    zipCode?: true
    howDidYouHearAboutUs?: true
    forumUrl?: true
    youtubeUrl?: true
    referredByUsername?: true
    flyerPromoCode?: true
    otherHeardAboutText?: true
    termsAndPolicyAccepted?: true
    dataInterests?: true
    otherInterestText?: true
    rankedMotivations?: true
    rankedGovernments?: true
    rankedInformationSources?: true
    otherInformationSourceText?: true
    agreementAccepted?: true
    onboardingComplete?: true
    otp?: true
    otpExpires?: true
    nextAuthId?: true
    phoneNumber?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    prefix: string | null
    firstName: string | null
    lastName: string | null
    suffix: string | null
    password: string | null
    username: string | null
    defaultPrivacyLevel: string | null
    stateOfResidence: string | null
    cityOfResidence: string | null
    zipCode: string | null
    howDidYouHearAboutUs: string | null
    forumUrl: string | null
    youtubeUrl: string | null
    referredByUsername: string | null
    flyerPromoCode: string | null
    otherHeardAboutText: string | null
    termsAndPolicyAccepted: boolean
    dataInterests: string[]
    otherInterestText: string | null
    rankedMotivations: string[]
    rankedGovernments: string[]
    rankedInformationSources: string[]
    otherInformationSourceText: string | null
    agreementAccepted: boolean
    onboardingComplete: boolean
    otp: string | null
    otpExpires: Date | null
    nextAuthId: string | null
    phoneNumber: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    prefix?: boolean
    firstName?: boolean
    lastName?: boolean
    suffix?: boolean
    password?: boolean
    username?: boolean
    defaultPrivacyLevel?: boolean
    stateOfResidence?: boolean
    cityOfResidence?: boolean
    zipCode?: boolean
    howDidYouHearAboutUs?: boolean
    forumUrl?: boolean
    youtubeUrl?: boolean
    referredByUsername?: boolean
    flyerPromoCode?: boolean
    otherHeardAboutText?: boolean
    termsAndPolicyAccepted?: boolean
    dataInterests?: boolean
    otherInterestText?: boolean
    rankedMotivations?: boolean
    rankedGovernments?: boolean
    rankedInformationSources?: boolean
    otherInformationSourceText?: boolean
    agreementAccepted?: boolean
    onboardingComplete?: boolean
    otp?: boolean
    otpExpires?: boolean
    nextAuthId?: boolean
    phoneNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    prefix?: boolean
    firstName?: boolean
    lastName?: boolean
    suffix?: boolean
    password?: boolean
    username?: boolean
    defaultPrivacyLevel?: boolean
    stateOfResidence?: boolean
    cityOfResidence?: boolean
    zipCode?: boolean
    howDidYouHearAboutUs?: boolean
    forumUrl?: boolean
    youtubeUrl?: boolean
    referredByUsername?: boolean
    flyerPromoCode?: boolean
    otherHeardAboutText?: boolean
    termsAndPolicyAccepted?: boolean
    dataInterests?: boolean
    otherInterestText?: boolean
    rankedMotivations?: boolean
    rankedGovernments?: boolean
    rankedInformationSources?: boolean
    otherInformationSourceText?: boolean
    agreementAccepted?: boolean
    onboardingComplete?: boolean
    otp?: boolean
    otpExpires?: boolean
    nextAuthId?: boolean
    phoneNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    prefix?: boolean
    firstName?: boolean
    lastName?: boolean
    suffix?: boolean
    password?: boolean
    username?: boolean
    defaultPrivacyLevel?: boolean
    stateOfResidence?: boolean
    cityOfResidence?: boolean
    zipCode?: boolean
    howDidYouHearAboutUs?: boolean
    forumUrl?: boolean
    youtubeUrl?: boolean
    referredByUsername?: boolean
    flyerPromoCode?: boolean
    otherHeardAboutText?: boolean
    termsAndPolicyAccepted?: boolean
    dataInterests?: boolean
    otherInterestText?: boolean
    rankedMotivations?: boolean
    rankedGovernments?: boolean
    rankedInformationSources?: boolean
    otherInformationSourceText?: boolean
    agreementAccepted?: boolean
    onboardingComplete?: boolean
    otp?: boolean
    otpExpires?: boolean
    nextAuthId?: boolean
    phoneNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    prefix?: boolean
    firstName?: boolean
    lastName?: boolean
    suffix?: boolean
    password?: boolean
    username?: boolean
    defaultPrivacyLevel?: boolean
    stateOfResidence?: boolean
    cityOfResidence?: boolean
    zipCode?: boolean
    howDidYouHearAboutUs?: boolean
    forumUrl?: boolean
    youtubeUrl?: boolean
    referredByUsername?: boolean
    flyerPromoCode?: boolean
    otherHeardAboutText?: boolean
    termsAndPolicyAccepted?: boolean
    dataInterests?: boolean
    otherInterestText?: boolean
    rankedMotivations?: boolean
    rankedGovernments?: boolean
    rankedInformationSources?: boolean
    otherInformationSourceText?: boolean
    agreementAccepted?: boolean
    onboardingComplete?: boolean
    otp?: boolean
    otpExpires?: boolean
    nextAuthId?: boolean
    phoneNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "prefix" | "firstName" | "lastName" | "suffix" | "password" | "username" | "defaultPrivacyLevel" | "stateOfResidence" | "cityOfResidence" | "zipCode" | "howDidYouHearAboutUs" | "forumUrl" | "youtubeUrl" | "referredByUsername" | "flyerPromoCode" | "otherHeardAboutText" | "termsAndPolicyAccepted" | "dataInterests" | "otherInterestText" | "rankedMotivations" | "rankedGovernments" | "rankedInformationSources" | "otherInformationSourceText" | "agreementAccepted" | "onboardingComplete" | "otp" | "otpExpires" | "nextAuthId" | "phoneNumber" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string | null
      emailVerified: Date | null
      image: string | null
      prefix: string | null
      firstName: string | null
      lastName: string | null
      suffix: string | null
      password: string | null
      username: string | null
      defaultPrivacyLevel: string | null
      stateOfResidence: string | null
      cityOfResidence: string | null
      zipCode: string | null
      howDidYouHearAboutUs: string | null
      forumUrl: string | null
      youtubeUrl: string | null
      referredByUsername: string | null
      flyerPromoCode: string | null
      otherHeardAboutText: string | null
      termsAndPolicyAccepted: boolean
      dataInterests: string[]
      otherInterestText: string | null
      rankedMotivations: string[]
      rankedGovernments: string[]
      rankedInformationSources: string[]
      otherInformationSourceText: string | null
      agreementAccepted: boolean
      onboardingComplete: boolean
      otp: string | null
      otpExpires: Date | null
      nextAuthId: string | null
      phoneNumber: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly image: FieldRef<"User", 'String'>
    readonly prefix: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly suffix: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly defaultPrivacyLevel: FieldRef<"User", 'String'>
    readonly stateOfResidence: FieldRef<"User", 'String'>
    readonly cityOfResidence: FieldRef<"User", 'String'>
    readonly zipCode: FieldRef<"User", 'String'>
    readonly howDidYouHearAboutUs: FieldRef<"User", 'String'>
    readonly forumUrl: FieldRef<"User", 'String'>
    readonly youtubeUrl: FieldRef<"User", 'String'>
    readonly referredByUsername: FieldRef<"User", 'String'>
    readonly flyerPromoCode: FieldRef<"User", 'String'>
    readonly otherHeardAboutText: FieldRef<"User", 'String'>
    readonly termsAndPolicyAccepted: FieldRef<"User", 'Boolean'>
    readonly dataInterests: FieldRef<"User", 'String[]'>
    readonly otherInterestText: FieldRef<"User", 'String'>
    readonly rankedMotivations: FieldRef<"User", 'String[]'>
    readonly rankedGovernments: FieldRef<"User", 'String[]'>
    readonly rankedInformationSources: FieldRef<"User", 'String[]'>
    readonly otherInformationSourceText: FieldRef<"User", 'String'>
    readonly agreementAccepted: FieldRef<"User", 'Boolean'>
    readonly onboardingComplete: FieldRef<"User", 'Boolean'>
    readonly otp: FieldRef<"User", 'String'>
    readonly otpExpires: FieldRef<"User", 'DateTime'>
    readonly nextAuthId: FieldRef<"User", 'String'>
    readonly phoneNumber: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refresh_token" | "access_token" | "expires_at" | "token_type" | "scope" | "id_token" | "session_state", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionToken" | "userId" | "expires", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model VerificationToken
   */

  export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  export type VerificationTokenMinAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenMaxAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenCountAggregateOutputType = {
    identifier: number
    token: number
    expires: number
    _all: number
  }


  export type VerificationTokenMinAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenMaxAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenCountAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
    _all?: true
  }

  export type VerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationToken to aggregate.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationTokens
    **/
    _count?: true | VerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type GetVerificationTokenAggregateType<T extends VerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationToken[P]>
      : GetScalarType<T[P], AggregateVerificationToken[P]>
  }




  export type VerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationTokenWhereInput
    orderBy?: VerificationTokenOrderByWithAggregationInput | VerificationTokenOrderByWithAggregationInput[]
    by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum
    having?: VerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationTokenCountAggregateInputType | true
    _min?: VerificationTokenMinAggregateInputType
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type VerificationTokenGroupByOutputType = {
    identifier: string
    token: string
    expires: Date
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  type GetVerificationTokenGroupByPayload<T extends VerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type VerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectScalar = {
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }

  export type VerificationTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"identifier" | "token" | "expires", ExtArgs["result"]["verificationToken"]>

  export type $VerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      identifier: string
      token: string
      expires: Date
    }, ExtArgs["result"]["verificationToken"]>
    composites: {}
  }

  type VerificationTokenGetPayload<S extends boolean | null | undefined | VerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$VerificationTokenPayload, S>

  type VerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationTokenCountAggregateInputType | true
    }

  export interface VerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'], meta: { name: 'VerificationToken' } }
    /**
     * Find zero or one VerificationToken that matches the filter.
     * @param {VerificationTokenFindUniqueArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationTokenFindUniqueArgs>(args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VerificationToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationTokenFindFirstArgs>(args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany()
     * 
     * // Get first 10 VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany({ take: 10 })
     * 
     * // Only select the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.findMany({ select: { identifier: true } })
     * 
     */
    findMany<T extends VerificationTokenFindManyArgs>(args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VerificationToken.
     * @param {VerificationTokenCreateArgs} args - Arguments to create a VerificationToken.
     * @example
     * // Create one VerificationToken
     * const VerificationToken = await prisma.verificationToken.create({
     *   data: {
     *     // ... data to create a VerificationToken
     *   }
     * })
     * 
     */
    create<T extends VerificationTokenCreateArgs>(args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VerificationTokens.
     * @param {VerificationTokenCreateManyArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationTokenCreateManyArgs>(args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationTokens and returns the data saved in the database.
     * @param {VerificationTokenCreateManyAndReturnArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.createManyAndReturn({
     *   select: { identifier: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VerificationToken.
     * @param {VerificationTokenDeleteArgs} args - Arguments to delete one VerificationToken.
     * @example
     * // Delete one VerificationToken
     * const VerificationToken = await prisma.verificationToken.delete({
     *   where: {
     *     // ... filter to delete one VerificationToken
     *   }
     * })
     * 
     */
    delete<T extends VerificationTokenDeleteArgs>(args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VerificationToken.
     * @param {VerificationTokenUpdateArgs} args - Arguments to update one VerificationToken.
     * @example
     * // Update one VerificationToken
     * const verificationToken = await prisma.verificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationTokenUpdateArgs>(args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VerificationTokens.
     * @param {VerificationTokenDeleteManyArgs} args - Arguments to filter VerificationTokens to delete.
     * @example
     * // Delete a few VerificationTokens
     * const { count } = await prisma.verificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationTokenDeleteManyArgs>(args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationTokenUpdateManyArgs>(args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens and returns the data updated in the database.
     * @param {VerificationTokenUpdateManyAndReturnArgs} args - Arguments to update many VerificationTokens.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.updateManyAndReturn({
     *   select: { identifier: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VerificationToken.
     * @param {VerificationTokenUpsertArgs} args - Arguments to update or create a VerificationToken.
     * @example
     * // Update or create a VerificationToken
     * const verificationToken = await prisma.verificationToken.upsert({
     *   create: {
     *     // ... data to create a VerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends VerificationTokenUpsertArgs>(args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenCountArgs} args - Arguments to filter VerificationTokens to count.
     * @example
     * // Count the number of VerificationTokens
     * const count = await prisma.verificationToken.count({
     *   where: {
     *     // ... the filter for the VerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends VerificationTokenCountArgs>(
      args?: Subset<T, VerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationTokenAggregateArgs>(args: Subset<T, VerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>

    /**
     * Group by VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: VerificationTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationToken model
   */
  readonly fields: VerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VerificationToken model
   */
  interface VerificationTokenFieldRefs {
    readonly identifier: FieldRef<"VerificationToken", 'String'>
    readonly token: FieldRef<"VerificationToken", 'String'>
    readonly expires: FieldRef<"VerificationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationToken findUnique
   */
  export type VerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findUniqueOrThrow
   */
  export type VerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findFirst
   */
  export type VerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findFirstOrThrow
   */
  export type VerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findMany
   */
  export type VerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter, which VerificationTokens to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken create
   */
  export type VerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a VerificationToken.
     */
    data: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
  }

  /**
   * VerificationToken createMany
   */
  export type VerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken createManyAndReturn
   */
  export type VerificationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken update
   */
  export type VerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a VerificationToken.
     */
    data: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which VerificationToken to update.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken updateMany
   */
  export type VerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken updateManyAndReturn
   */
  export type VerificationTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to update.
     */
    limit?: number
  }

  /**
   * VerificationToken upsert
   */
  export type VerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the VerificationToken to update in case it exists.
     */
    where: VerificationTokenWhereUniqueInput
    /**
     * In case the VerificationToken found by the `where` argument doesn't exist, create a new VerificationToken with this data.
     */
    create: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
    /**
     * In case the VerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
  }

  /**
   * VerificationToken delete
   */
  export type VerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
    /**
     * Filter which VerificationToken to delete.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken deleteMany
   */
  export type VerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationTokens to delete
     */
    where?: VerificationTokenWhereInput
    /**
     * Limit how many VerificationTokens to delete.
     */
    limit?: number
  }

  /**
   * VerificationToken without action
   */
  export type VerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VerificationToken
     */
    omit?: VerificationTokenOmit<ExtArgs> | null
  }


  /**
   * Model Property
   */

  export type AggregateProperty = {
    _count: PropertyCountAggregateOutputType | null
    _avg: PropertyAvgAggregateOutputType | null
    _sum: PropertySumAggregateOutputType | null
    _min: PropertyMinAggregateOutputType | null
    _max: PropertyMaxAggregateOutputType | null
  }

  export type PropertyAvgAggregateOutputType = {
    id: number | null
    pricePerMonth: number | null
    securityDeposit: number | null
    applicationFee: number | null
    beds: number | null
    baths: number | null
    squareFeet: number | null
    averageRating: number | null
    numberOfReviews: number | null
    locationId: number | null
  }

  export type PropertySumAggregateOutputType = {
    id: number | null
    pricePerMonth: number | null
    securityDeposit: number | null
    applicationFee: number | null
    beds: number | null
    baths: number | null
    squareFeet: number | null
    averageRating: number | null
    numberOfReviews: number | null
    locationId: number | null
  }

  export type PropertyMinAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    pricePerMonth: number | null
    securityDeposit: number | null
    applicationFee: number | null
    isPetsAllowed: boolean | null
    isParkingIncluded: boolean | null
    beds: number | null
    baths: number | null
    squareFeet: number | null
    propertyType: $Enums.PropertyType | null
    postedDate: Date | null
    averageRating: number | null
    numberOfReviews: number | null
    locationId: number | null
    managerNextAuthId: string | null
  }

  export type PropertyMaxAggregateOutputType = {
    id: number | null
    name: string | null
    description: string | null
    pricePerMonth: number | null
    securityDeposit: number | null
    applicationFee: number | null
    isPetsAllowed: boolean | null
    isParkingIncluded: boolean | null
    beds: number | null
    baths: number | null
    squareFeet: number | null
    propertyType: $Enums.PropertyType | null
    postedDate: Date | null
    averageRating: number | null
    numberOfReviews: number | null
    locationId: number | null
    managerNextAuthId: string | null
  }

  export type PropertyCountAggregateOutputType = {
    id: number
    name: number
    description: number
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls: number
    amenities: number
    highlights: number
    isPetsAllowed: number
    isParkingIncluded: number
    beds: number
    baths: number
    squareFeet: number
    propertyType: number
    postedDate: number
    averageRating: number
    numberOfReviews: number
    locationId: number
    managerNextAuthId: number
    _all: number
  }


  export type PropertyAvgAggregateInputType = {
    id?: true
    pricePerMonth?: true
    securityDeposit?: true
    applicationFee?: true
    beds?: true
    baths?: true
    squareFeet?: true
    averageRating?: true
    numberOfReviews?: true
    locationId?: true
  }

  export type PropertySumAggregateInputType = {
    id?: true
    pricePerMonth?: true
    securityDeposit?: true
    applicationFee?: true
    beds?: true
    baths?: true
    squareFeet?: true
    averageRating?: true
    numberOfReviews?: true
    locationId?: true
  }

  export type PropertyMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    pricePerMonth?: true
    securityDeposit?: true
    applicationFee?: true
    isPetsAllowed?: true
    isParkingIncluded?: true
    beds?: true
    baths?: true
    squareFeet?: true
    propertyType?: true
    postedDate?: true
    averageRating?: true
    numberOfReviews?: true
    locationId?: true
    managerNextAuthId?: true
  }

  export type PropertyMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    pricePerMonth?: true
    securityDeposit?: true
    applicationFee?: true
    isPetsAllowed?: true
    isParkingIncluded?: true
    beds?: true
    baths?: true
    squareFeet?: true
    propertyType?: true
    postedDate?: true
    averageRating?: true
    numberOfReviews?: true
    locationId?: true
    managerNextAuthId?: true
  }

  export type PropertyCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    pricePerMonth?: true
    securityDeposit?: true
    applicationFee?: true
    photoUrls?: true
    amenities?: true
    highlights?: true
    isPetsAllowed?: true
    isParkingIncluded?: true
    beds?: true
    baths?: true
    squareFeet?: true
    propertyType?: true
    postedDate?: true
    averageRating?: true
    numberOfReviews?: true
    locationId?: true
    managerNextAuthId?: true
    _all?: true
  }

  export type PropertyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Property to aggregate.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Properties
    **/
    _count?: true | PropertyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PropertyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PropertySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PropertyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PropertyMaxAggregateInputType
  }

  export type GetPropertyAggregateType<T extends PropertyAggregateArgs> = {
        [P in keyof T & keyof AggregateProperty]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProperty[P]>
      : GetScalarType<T[P], AggregateProperty[P]>
  }




  export type PropertyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PropertyWhereInput
    orderBy?: PropertyOrderByWithAggregationInput | PropertyOrderByWithAggregationInput[]
    by: PropertyScalarFieldEnum[] | PropertyScalarFieldEnum
    having?: PropertyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PropertyCountAggregateInputType | true
    _avg?: PropertyAvgAggregateInputType
    _sum?: PropertySumAggregateInputType
    _min?: PropertyMinAggregateInputType
    _max?: PropertyMaxAggregateInputType
  }

  export type PropertyGroupByOutputType = {
    id: number
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls: string[]
    amenities: $Enums.Amenity[]
    highlights: $Enums.Highlight[]
    isPetsAllowed: boolean
    isParkingIncluded: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate: Date
    averageRating: number | null
    numberOfReviews: number | null
    locationId: number
    managerNextAuthId: string
    _count: PropertyCountAggregateOutputType | null
    _avg: PropertyAvgAggregateOutputType | null
    _sum: PropertySumAggregateOutputType | null
    _min: PropertyMinAggregateOutputType | null
    _max: PropertyMaxAggregateOutputType | null
  }

  type GetPropertyGroupByPayload<T extends PropertyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PropertyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PropertyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PropertyGroupByOutputType[P]>
            : GetScalarType<T[P], PropertyGroupByOutputType[P]>
        }
      >
    >


  export type PropertySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    pricePerMonth?: boolean
    securityDeposit?: boolean
    applicationFee?: boolean
    photoUrls?: boolean
    amenities?: boolean
    highlights?: boolean
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds?: boolean
    baths?: boolean
    squareFeet?: boolean
    propertyType?: boolean
    postedDate?: boolean
    averageRating?: boolean
    numberOfReviews?: boolean
    locationId?: boolean
    managerNextAuthId?: boolean
    applications?: boolean | Property$applicationsArgs<ExtArgs>
    leases?: boolean | Property$leasesArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
    manager?: boolean | ManagerDefaultArgs<ExtArgs>
    favoritedBy?: boolean | Property$favoritedByArgs<ExtArgs>
    tenants?: boolean | Property$tenantsArgs<ExtArgs>
    _count?: boolean | PropertyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["property"]>

  export type PropertySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    pricePerMonth?: boolean
    securityDeposit?: boolean
    applicationFee?: boolean
    photoUrls?: boolean
    amenities?: boolean
    highlights?: boolean
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds?: boolean
    baths?: boolean
    squareFeet?: boolean
    propertyType?: boolean
    postedDate?: boolean
    averageRating?: boolean
    numberOfReviews?: boolean
    locationId?: boolean
    managerNextAuthId?: boolean
    location?: boolean | LocationDefaultArgs<ExtArgs>
    manager?: boolean | ManagerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["property"]>

  export type PropertySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    pricePerMonth?: boolean
    securityDeposit?: boolean
    applicationFee?: boolean
    photoUrls?: boolean
    amenities?: boolean
    highlights?: boolean
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds?: boolean
    baths?: boolean
    squareFeet?: boolean
    propertyType?: boolean
    postedDate?: boolean
    averageRating?: boolean
    numberOfReviews?: boolean
    locationId?: boolean
    managerNextAuthId?: boolean
    location?: boolean | LocationDefaultArgs<ExtArgs>
    manager?: boolean | ManagerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["property"]>

  export type PropertySelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    pricePerMonth?: boolean
    securityDeposit?: boolean
    applicationFee?: boolean
    photoUrls?: boolean
    amenities?: boolean
    highlights?: boolean
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds?: boolean
    baths?: boolean
    squareFeet?: boolean
    propertyType?: boolean
    postedDate?: boolean
    averageRating?: boolean
    numberOfReviews?: boolean
    locationId?: boolean
    managerNextAuthId?: boolean
  }

  export type PropertyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "pricePerMonth" | "securityDeposit" | "applicationFee" | "photoUrls" | "amenities" | "highlights" | "isPetsAllowed" | "isParkingIncluded" | "beds" | "baths" | "squareFeet" | "propertyType" | "postedDate" | "averageRating" | "numberOfReviews" | "locationId" | "managerNextAuthId", ExtArgs["result"]["property"]>
  export type PropertyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | Property$applicationsArgs<ExtArgs>
    leases?: boolean | Property$leasesArgs<ExtArgs>
    location?: boolean | LocationDefaultArgs<ExtArgs>
    manager?: boolean | ManagerDefaultArgs<ExtArgs>
    favoritedBy?: boolean | Property$favoritedByArgs<ExtArgs>
    tenants?: boolean | Property$tenantsArgs<ExtArgs>
    _count?: boolean | PropertyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PropertyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    location?: boolean | LocationDefaultArgs<ExtArgs>
    manager?: boolean | ManagerDefaultArgs<ExtArgs>
  }
  export type PropertyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    location?: boolean | LocationDefaultArgs<ExtArgs>
    manager?: boolean | ManagerDefaultArgs<ExtArgs>
  }

  export type $PropertyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Property"
    objects: {
      applications: Prisma.$ApplicationPayload<ExtArgs>[]
      leases: Prisma.$LeasePayload<ExtArgs>[]
      location: Prisma.$LocationPayload<ExtArgs>
      manager: Prisma.$ManagerPayload<ExtArgs>
      favoritedBy: Prisma.$TenantPayload<ExtArgs>[]
      tenants: Prisma.$TenantPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      description: string
      pricePerMonth: number
      securityDeposit: number
      applicationFee: number
      photoUrls: string[]
      amenities: $Enums.Amenity[]
      highlights: $Enums.Highlight[]
      isPetsAllowed: boolean
      isParkingIncluded: boolean
      beds: number
      baths: number
      squareFeet: number
      propertyType: $Enums.PropertyType
      postedDate: Date
      averageRating: number | null
      numberOfReviews: number | null
      locationId: number
      managerNextAuthId: string
    }, ExtArgs["result"]["property"]>
    composites: {}
  }

  type PropertyGetPayload<S extends boolean | null | undefined | PropertyDefaultArgs> = $Result.GetResult<Prisma.$PropertyPayload, S>

  type PropertyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PropertyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PropertyCountAggregateInputType | true
    }

  export interface PropertyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Property'], meta: { name: 'Property' } }
    /**
     * Find zero or one Property that matches the filter.
     * @param {PropertyFindUniqueArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PropertyFindUniqueArgs>(args: SelectSubset<T, PropertyFindUniqueArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Property that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PropertyFindUniqueOrThrowArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PropertyFindUniqueOrThrowArgs>(args: SelectSubset<T, PropertyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Property that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindFirstArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PropertyFindFirstArgs>(args?: SelectSubset<T, PropertyFindFirstArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Property that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindFirstOrThrowArgs} args - Arguments to find a Property
     * @example
     * // Get one Property
     * const property = await prisma.property.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PropertyFindFirstOrThrowArgs>(args?: SelectSubset<T, PropertyFindFirstOrThrowArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Properties that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Properties
     * const properties = await prisma.property.findMany()
     * 
     * // Get first 10 Properties
     * const properties = await prisma.property.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const propertyWithIdOnly = await prisma.property.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PropertyFindManyArgs>(args?: SelectSubset<T, PropertyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Property.
     * @param {PropertyCreateArgs} args - Arguments to create a Property.
     * @example
     * // Create one Property
     * const Property = await prisma.property.create({
     *   data: {
     *     // ... data to create a Property
     *   }
     * })
     * 
     */
    create<T extends PropertyCreateArgs>(args: SelectSubset<T, PropertyCreateArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Properties.
     * @param {PropertyCreateManyArgs} args - Arguments to create many Properties.
     * @example
     * // Create many Properties
     * const property = await prisma.property.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PropertyCreateManyArgs>(args?: SelectSubset<T, PropertyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Properties and returns the data saved in the database.
     * @param {PropertyCreateManyAndReturnArgs} args - Arguments to create many Properties.
     * @example
     * // Create many Properties
     * const property = await prisma.property.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Properties and only return the `id`
     * const propertyWithIdOnly = await prisma.property.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PropertyCreateManyAndReturnArgs>(args?: SelectSubset<T, PropertyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Property.
     * @param {PropertyDeleteArgs} args - Arguments to delete one Property.
     * @example
     * // Delete one Property
     * const Property = await prisma.property.delete({
     *   where: {
     *     // ... filter to delete one Property
     *   }
     * })
     * 
     */
    delete<T extends PropertyDeleteArgs>(args: SelectSubset<T, PropertyDeleteArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Property.
     * @param {PropertyUpdateArgs} args - Arguments to update one Property.
     * @example
     * // Update one Property
     * const property = await prisma.property.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PropertyUpdateArgs>(args: SelectSubset<T, PropertyUpdateArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Properties.
     * @param {PropertyDeleteManyArgs} args - Arguments to filter Properties to delete.
     * @example
     * // Delete a few Properties
     * const { count } = await prisma.property.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PropertyDeleteManyArgs>(args?: SelectSubset<T, PropertyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Properties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Properties
     * const property = await prisma.property.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PropertyUpdateManyArgs>(args: SelectSubset<T, PropertyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Properties and returns the data updated in the database.
     * @param {PropertyUpdateManyAndReturnArgs} args - Arguments to update many Properties.
     * @example
     * // Update many Properties
     * const property = await prisma.property.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Properties and only return the `id`
     * const propertyWithIdOnly = await prisma.property.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PropertyUpdateManyAndReturnArgs>(args: SelectSubset<T, PropertyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Property.
     * @param {PropertyUpsertArgs} args - Arguments to update or create a Property.
     * @example
     * // Update or create a Property
     * const property = await prisma.property.upsert({
     *   create: {
     *     // ... data to create a Property
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Property we want to update
     *   }
     * })
     */
    upsert<T extends PropertyUpsertArgs>(args: SelectSubset<T, PropertyUpsertArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Properties.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyCountArgs} args - Arguments to filter Properties to count.
     * @example
     * // Count the number of Properties
     * const count = await prisma.property.count({
     *   where: {
     *     // ... the filter for the Properties we want to count
     *   }
     * })
    **/
    count<T extends PropertyCountArgs>(
      args?: Subset<T, PropertyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PropertyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Property.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PropertyAggregateArgs>(args: Subset<T, PropertyAggregateArgs>): Prisma.PrismaPromise<GetPropertyAggregateType<T>>

    /**
     * Group by Property.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PropertyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PropertyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PropertyGroupByArgs['orderBy'] }
        : { orderBy?: PropertyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PropertyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPropertyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Property model
   */
  readonly fields: PropertyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Property.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PropertyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    applications<T extends Property$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, Property$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    leases<T extends Property$leasesArgs<ExtArgs> = {}>(args?: Subset<T, Property$leasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    location<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    manager<T extends ManagerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ManagerDefaultArgs<ExtArgs>>): Prisma__ManagerClient<$Result.GetResult<Prisma.$ManagerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    favoritedBy<T extends Property$favoritedByArgs<ExtArgs> = {}>(args?: Subset<T, Property$favoritedByArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tenants<T extends Property$tenantsArgs<ExtArgs> = {}>(args?: Subset<T, Property$tenantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Property model
   */
  interface PropertyFieldRefs {
    readonly id: FieldRef<"Property", 'Int'>
    readonly name: FieldRef<"Property", 'String'>
    readonly description: FieldRef<"Property", 'String'>
    readonly pricePerMonth: FieldRef<"Property", 'Float'>
    readonly securityDeposit: FieldRef<"Property", 'Float'>
    readonly applicationFee: FieldRef<"Property", 'Float'>
    readonly photoUrls: FieldRef<"Property", 'String[]'>
    readonly amenities: FieldRef<"Property", 'Amenity[]'>
    readonly highlights: FieldRef<"Property", 'Highlight[]'>
    readonly isPetsAllowed: FieldRef<"Property", 'Boolean'>
    readonly isParkingIncluded: FieldRef<"Property", 'Boolean'>
    readonly beds: FieldRef<"Property", 'Int'>
    readonly baths: FieldRef<"Property", 'Float'>
    readonly squareFeet: FieldRef<"Property", 'Int'>
    readonly propertyType: FieldRef<"Property", 'PropertyType'>
    readonly postedDate: FieldRef<"Property", 'DateTime'>
    readonly averageRating: FieldRef<"Property", 'Float'>
    readonly numberOfReviews: FieldRef<"Property", 'Int'>
    readonly locationId: FieldRef<"Property", 'Int'>
    readonly managerNextAuthId: FieldRef<"Property", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Property findUnique
   */
  export type PropertyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property findUniqueOrThrow
   */
  export type PropertyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property findFirst
   */
  export type PropertyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Properties.
     */
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property findFirstOrThrow
   */
  export type PropertyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Property to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Properties.
     */
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property findMany
   */
  export type PropertyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter, which Properties to fetch.
     */
    where?: PropertyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Properties to fetch.
     */
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Properties.
     */
    cursor?: PropertyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Properties from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Properties.
     */
    skip?: number
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Property create
   */
  export type PropertyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The data needed to create a Property.
     */
    data: XOR<PropertyCreateInput, PropertyUncheckedCreateInput>
  }

  /**
   * Property createMany
   */
  export type PropertyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Properties.
     */
    data: PropertyCreateManyInput | PropertyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Property createManyAndReturn
   */
  export type PropertyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * The data used to create many Properties.
     */
    data: PropertyCreateManyInput | PropertyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Property update
   */
  export type PropertyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The data needed to update a Property.
     */
    data: XOR<PropertyUpdateInput, PropertyUncheckedUpdateInput>
    /**
     * Choose, which Property to update.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property updateMany
   */
  export type PropertyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Properties.
     */
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyInput>
    /**
     * Filter which Properties to update
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to update.
     */
    limit?: number
  }

  /**
   * Property updateManyAndReturn
   */
  export type PropertyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * The data used to update Properties.
     */
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyInput>
    /**
     * Filter which Properties to update
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Property upsert
   */
  export type PropertyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * The filter to search for the Property to update in case it exists.
     */
    where: PropertyWhereUniqueInput
    /**
     * In case the Property found by the `where` argument doesn't exist, create a new Property with this data.
     */
    create: XOR<PropertyCreateInput, PropertyUncheckedCreateInput>
    /**
     * In case the Property was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PropertyUpdateInput, PropertyUncheckedUpdateInput>
  }

  /**
   * Property delete
   */
  export type PropertyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    /**
     * Filter which Property to delete.
     */
    where: PropertyWhereUniqueInput
  }

  /**
   * Property deleteMany
   */
  export type PropertyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Properties to delete
     */
    where?: PropertyWhereInput
    /**
     * Limit how many Properties to delete.
     */
    limit?: number
  }

  /**
   * Property.applications
   */
  export type Property$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    cursor?: ApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Property.leases
   */
  export type Property$leasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseInclude<ExtArgs> | null
    where?: LeaseWhereInput
    orderBy?: LeaseOrderByWithRelationInput | LeaseOrderByWithRelationInput[]
    cursor?: LeaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LeaseScalarFieldEnum | LeaseScalarFieldEnum[]
  }

  /**
   * Property.favoritedBy
   */
  export type Property$favoritedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    cursor?: TenantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Property.tenants
   */
  export type Property$tenantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    cursor?: TenantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Property without action
   */
  export type PropertyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
  }


  /**
   * Model Manager
   */

  export type AggregateManager = {
    _count: ManagerCountAggregateOutputType | null
    _avg: ManagerAvgAggregateOutputType | null
    _sum: ManagerSumAggregateOutputType | null
    _min: ManagerMinAggregateOutputType | null
    _max: ManagerMaxAggregateOutputType | null
  }

  export type ManagerAvgAggregateOutputType = {
    id: number | null
  }

  export type ManagerSumAggregateOutputType = {
    id: number | null
  }

  export type ManagerMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    phoneNumber: string | null
    nextAuthId: string | null
  }

  export type ManagerMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    phoneNumber: string | null
    nextAuthId: string | null
  }

  export type ManagerCountAggregateOutputType = {
    id: number
    name: number
    email: number
    phoneNumber: number
    nextAuthId: number
    _all: number
  }


  export type ManagerAvgAggregateInputType = {
    id?: true
  }

  export type ManagerSumAggregateInputType = {
    id?: true
  }

  export type ManagerMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phoneNumber?: true
    nextAuthId?: true
  }

  export type ManagerMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phoneNumber?: true
    nextAuthId?: true
  }

  export type ManagerCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phoneNumber?: true
    nextAuthId?: true
    _all?: true
  }

  export type ManagerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Manager to aggregate.
     */
    where?: ManagerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Managers to fetch.
     */
    orderBy?: ManagerOrderByWithRelationInput | ManagerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ManagerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Managers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Managers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Managers
    **/
    _count?: true | ManagerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ManagerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ManagerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ManagerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ManagerMaxAggregateInputType
  }

  export type GetManagerAggregateType<T extends ManagerAggregateArgs> = {
        [P in keyof T & keyof AggregateManager]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateManager[P]>
      : GetScalarType<T[P], AggregateManager[P]>
  }




  export type ManagerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ManagerWhereInput
    orderBy?: ManagerOrderByWithAggregationInput | ManagerOrderByWithAggregationInput[]
    by: ManagerScalarFieldEnum[] | ManagerScalarFieldEnum
    having?: ManagerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ManagerCountAggregateInputType | true
    _avg?: ManagerAvgAggregateInputType
    _sum?: ManagerSumAggregateInputType
    _min?: ManagerMinAggregateInputType
    _max?: ManagerMaxAggregateInputType
  }

  export type ManagerGroupByOutputType = {
    id: number
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
    _count: ManagerCountAggregateOutputType | null
    _avg: ManagerAvgAggregateOutputType | null
    _sum: ManagerSumAggregateOutputType | null
    _min: ManagerMinAggregateOutputType | null
    _max: ManagerMaxAggregateOutputType | null
  }

  type GetManagerGroupByPayload<T extends ManagerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ManagerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ManagerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ManagerGroupByOutputType[P]>
            : GetScalarType<T[P], ManagerGroupByOutputType[P]>
        }
      >
    >


  export type ManagerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phoneNumber?: boolean
    nextAuthId?: boolean
    managedProperties?: boolean | Manager$managedPropertiesArgs<ExtArgs>
    _count?: boolean | ManagerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["manager"]>

  export type ManagerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phoneNumber?: boolean
    nextAuthId?: boolean
  }, ExtArgs["result"]["manager"]>

  export type ManagerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phoneNumber?: boolean
    nextAuthId?: boolean
  }, ExtArgs["result"]["manager"]>

  export type ManagerSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    phoneNumber?: boolean
    nextAuthId?: boolean
  }

  export type ManagerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "phoneNumber" | "nextAuthId", ExtArgs["result"]["manager"]>
  export type ManagerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    managedProperties?: boolean | Manager$managedPropertiesArgs<ExtArgs>
    _count?: boolean | ManagerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ManagerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ManagerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ManagerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Manager"
    objects: {
      managedProperties: Prisma.$PropertyPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      email: string
      phoneNumber: string
      nextAuthId: string
    }, ExtArgs["result"]["manager"]>
    composites: {}
  }

  type ManagerGetPayload<S extends boolean | null | undefined | ManagerDefaultArgs> = $Result.GetResult<Prisma.$ManagerPayload, S>

  type ManagerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ManagerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ManagerCountAggregateInputType | true
    }

  export interface ManagerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Manager'], meta: { name: 'Manager' } }
    /**
     * Find zero or one Manager that matches the filter.
     * @param {ManagerFindUniqueArgs} args - Arguments to find a Manager
     * @example
     * // Get one Manager
     * const manager = await prisma.manager.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ManagerFindUniqueArgs>(args: SelectSubset<T, ManagerFindUniqueArgs<ExtArgs>>): Prisma__ManagerClient<$Result.GetResult<Prisma.$ManagerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Manager that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ManagerFindUniqueOrThrowArgs} args - Arguments to find a Manager
     * @example
     * // Get one Manager
     * const manager = await prisma.manager.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ManagerFindUniqueOrThrowArgs>(args: SelectSubset<T, ManagerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ManagerClient<$Result.GetResult<Prisma.$ManagerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Manager that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagerFindFirstArgs} args - Arguments to find a Manager
     * @example
     * // Get one Manager
     * const manager = await prisma.manager.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ManagerFindFirstArgs>(args?: SelectSubset<T, ManagerFindFirstArgs<ExtArgs>>): Prisma__ManagerClient<$Result.GetResult<Prisma.$ManagerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Manager that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagerFindFirstOrThrowArgs} args - Arguments to find a Manager
     * @example
     * // Get one Manager
     * const manager = await prisma.manager.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ManagerFindFirstOrThrowArgs>(args?: SelectSubset<T, ManagerFindFirstOrThrowArgs<ExtArgs>>): Prisma__ManagerClient<$Result.GetResult<Prisma.$ManagerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Managers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Managers
     * const managers = await prisma.manager.findMany()
     * 
     * // Get first 10 Managers
     * const managers = await prisma.manager.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const managerWithIdOnly = await prisma.manager.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ManagerFindManyArgs>(args?: SelectSubset<T, ManagerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManagerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Manager.
     * @param {ManagerCreateArgs} args - Arguments to create a Manager.
     * @example
     * // Create one Manager
     * const Manager = await prisma.manager.create({
     *   data: {
     *     // ... data to create a Manager
     *   }
     * })
     * 
     */
    create<T extends ManagerCreateArgs>(args: SelectSubset<T, ManagerCreateArgs<ExtArgs>>): Prisma__ManagerClient<$Result.GetResult<Prisma.$ManagerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Managers.
     * @param {ManagerCreateManyArgs} args - Arguments to create many Managers.
     * @example
     * // Create many Managers
     * const manager = await prisma.manager.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ManagerCreateManyArgs>(args?: SelectSubset<T, ManagerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Managers and returns the data saved in the database.
     * @param {ManagerCreateManyAndReturnArgs} args - Arguments to create many Managers.
     * @example
     * // Create many Managers
     * const manager = await prisma.manager.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Managers and only return the `id`
     * const managerWithIdOnly = await prisma.manager.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ManagerCreateManyAndReturnArgs>(args?: SelectSubset<T, ManagerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManagerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Manager.
     * @param {ManagerDeleteArgs} args - Arguments to delete one Manager.
     * @example
     * // Delete one Manager
     * const Manager = await prisma.manager.delete({
     *   where: {
     *     // ... filter to delete one Manager
     *   }
     * })
     * 
     */
    delete<T extends ManagerDeleteArgs>(args: SelectSubset<T, ManagerDeleteArgs<ExtArgs>>): Prisma__ManagerClient<$Result.GetResult<Prisma.$ManagerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Manager.
     * @param {ManagerUpdateArgs} args - Arguments to update one Manager.
     * @example
     * // Update one Manager
     * const manager = await prisma.manager.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ManagerUpdateArgs>(args: SelectSubset<T, ManagerUpdateArgs<ExtArgs>>): Prisma__ManagerClient<$Result.GetResult<Prisma.$ManagerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Managers.
     * @param {ManagerDeleteManyArgs} args - Arguments to filter Managers to delete.
     * @example
     * // Delete a few Managers
     * const { count } = await prisma.manager.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ManagerDeleteManyArgs>(args?: SelectSubset<T, ManagerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Managers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Managers
     * const manager = await prisma.manager.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ManagerUpdateManyArgs>(args: SelectSubset<T, ManagerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Managers and returns the data updated in the database.
     * @param {ManagerUpdateManyAndReturnArgs} args - Arguments to update many Managers.
     * @example
     * // Update many Managers
     * const manager = await prisma.manager.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Managers and only return the `id`
     * const managerWithIdOnly = await prisma.manager.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ManagerUpdateManyAndReturnArgs>(args: SelectSubset<T, ManagerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ManagerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Manager.
     * @param {ManagerUpsertArgs} args - Arguments to update or create a Manager.
     * @example
     * // Update or create a Manager
     * const manager = await prisma.manager.upsert({
     *   create: {
     *     // ... data to create a Manager
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Manager we want to update
     *   }
     * })
     */
    upsert<T extends ManagerUpsertArgs>(args: SelectSubset<T, ManagerUpsertArgs<ExtArgs>>): Prisma__ManagerClient<$Result.GetResult<Prisma.$ManagerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Managers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagerCountArgs} args - Arguments to filter Managers to count.
     * @example
     * // Count the number of Managers
     * const count = await prisma.manager.count({
     *   where: {
     *     // ... the filter for the Managers we want to count
     *   }
     * })
    **/
    count<T extends ManagerCountArgs>(
      args?: Subset<T, ManagerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ManagerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Manager.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ManagerAggregateArgs>(args: Subset<T, ManagerAggregateArgs>): Prisma.PrismaPromise<GetManagerAggregateType<T>>

    /**
     * Group by Manager.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ManagerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ManagerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ManagerGroupByArgs['orderBy'] }
        : { orderBy?: ManagerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ManagerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetManagerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Manager model
   */
  readonly fields: ManagerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Manager.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ManagerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    managedProperties<T extends Manager$managedPropertiesArgs<ExtArgs> = {}>(args?: Subset<T, Manager$managedPropertiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Manager model
   */
  interface ManagerFieldRefs {
    readonly id: FieldRef<"Manager", 'Int'>
    readonly name: FieldRef<"Manager", 'String'>
    readonly email: FieldRef<"Manager", 'String'>
    readonly phoneNumber: FieldRef<"Manager", 'String'>
    readonly nextAuthId: FieldRef<"Manager", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Manager findUnique
   */
  export type ManagerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manager
     */
    select?: ManagerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manager
     */
    omit?: ManagerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManagerInclude<ExtArgs> | null
    /**
     * Filter, which Manager to fetch.
     */
    where: ManagerWhereUniqueInput
  }

  /**
   * Manager findUniqueOrThrow
   */
  export type ManagerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manager
     */
    select?: ManagerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manager
     */
    omit?: ManagerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManagerInclude<ExtArgs> | null
    /**
     * Filter, which Manager to fetch.
     */
    where: ManagerWhereUniqueInput
  }

  /**
   * Manager findFirst
   */
  export type ManagerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manager
     */
    select?: ManagerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manager
     */
    omit?: ManagerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManagerInclude<ExtArgs> | null
    /**
     * Filter, which Manager to fetch.
     */
    where?: ManagerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Managers to fetch.
     */
    orderBy?: ManagerOrderByWithRelationInput | ManagerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Managers.
     */
    cursor?: ManagerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Managers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Managers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Managers.
     */
    distinct?: ManagerScalarFieldEnum | ManagerScalarFieldEnum[]
  }

  /**
   * Manager findFirstOrThrow
   */
  export type ManagerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manager
     */
    select?: ManagerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manager
     */
    omit?: ManagerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManagerInclude<ExtArgs> | null
    /**
     * Filter, which Manager to fetch.
     */
    where?: ManagerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Managers to fetch.
     */
    orderBy?: ManagerOrderByWithRelationInput | ManagerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Managers.
     */
    cursor?: ManagerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Managers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Managers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Managers.
     */
    distinct?: ManagerScalarFieldEnum | ManagerScalarFieldEnum[]
  }

  /**
   * Manager findMany
   */
  export type ManagerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manager
     */
    select?: ManagerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manager
     */
    omit?: ManagerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManagerInclude<ExtArgs> | null
    /**
     * Filter, which Managers to fetch.
     */
    where?: ManagerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Managers to fetch.
     */
    orderBy?: ManagerOrderByWithRelationInput | ManagerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Managers.
     */
    cursor?: ManagerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Managers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Managers.
     */
    skip?: number
    distinct?: ManagerScalarFieldEnum | ManagerScalarFieldEnum[]
  }

  /**
   * Manager create
   */
  export type ManagerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manager
     */
    select?: ManagerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manager
     */
    omit?: ManagerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManagerInclude<ExtArgs> | null
    /**
     * The data needed to create a Manager.
     */
    data: XOR<ManagerCreateInput, ManagerUncheckedCreateInput>
  }

  /**
   * Manager createMany
   */
  export type ManagerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Managers.
     */
    data: ManagerCreateManyInput | ManagerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Manager createManyAndReturn
   */
  export type ManagerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manager
     */
    select?: ManagerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Manager
     */
    omit?: ManagerOmit<ExtArgs> | null
    /**
     * The data used to create many Managers.
     */
    data: ManagerCreateManyInput | ManagerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Manager update
   */
  export type ManagerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manager
     */
    select?: ManagerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manager
     */
    omit?: ManagerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManagerInclude<ExtArgs> | null
    /**
     * The data needed to update a Manager.
     */
    data: XOR<ManagerUpdateInput, ManagerUncheckedUpdateInput>
    /**
     * Choose, which Manager to update.
     */
    where: ManagerWhereUniqueInput
  }

  /**
   * Manager updateMany
   */
  export type ManagerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Managers.
     */
    data: XOR<ManagerUpdateManyMutationInput, ManagerUncheckedUpdateManyInput>
    /**
     * Filter which Managers to update
     */
    where?: ManagerWhereInput
    /**
     * Limit how many Managers to update.
     */
    limit?: number
  }

  /**
   * Manager updateManyAndReturn
   */
  export type ManagerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manager
     */
    select?: ManagerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Manager
     */
    omit?: ManagerOmit<ExtArgs> | null
    /**
     * The data used to update Managers.
     */
    data: XOR<ManagerUpdateManyMutationInput, ManagerUncheckedUpdateManyInput>
    /**
     * Filter which Managers to update
     */
    where?: ManagerWhereInput
    /**
     * Limit how many Managers to update.
     */
    limit?: number
  }

  /**
   * Manager upsert
   */
  export type ManagerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manager
     */
    select?: ManagerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manager
     */
    omit?: ManagerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManagerInclude<ExtArgs> | null
    /**
     * The filter to search for the Manager to update in case it exists.
     */
    where: ManagerWhereUniqueInput
    /**
     * In case the Manager found by the `where` argument doesn't exist, create a new Manager with this data.
     */
    create: XOR<ManagerCreateInput, ManagerUncheckedCreateInput>
    /**
     * In case the Manager was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ManagerUpdateInput, ManagerUncheckedUpdateInput>
  }

  /**
   * Manager delete
   */
  export type ManagerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manager
     */
    select?: ManagerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manager
     */
    omit?: ManagerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManagerInclude<ExtArgs> | null
    /**
     * Filter which Manager to delete.
     */
    where: ManagerWhereUniqueInput
  }

  /**
   * Manager deleteMany
   */
  export type ManagerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Managers to delete
     */
    where?: ManagerWhereInput
    /**
     * Limit how many Managers to delete.
     */
    limit?: number
  }

  /**
   * Manager.managedProperties
   */
  export type Manager$managedPropertiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    where?: PropertyWhereInput
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    cursor?: PropertyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Manager without action
   */
  export type ManagerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Manager
     */
    select?: ManagerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Manager
     */
    omit?: ManagerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ManagerInclude<ExtArgs> | null
  }


  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantAvgAggregateOutputType = {
    id: number | null
  }

  export type TenantSumAggregateOutputType = {
    id: number | null
  }

  export type TenantMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    phoneNumber: string | null
    nextAuthId: string | null
  }

  export type TenantMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    phoneNumber: string | null
    nextAuthId: string | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    name: number
    email: number
    phoneNumber: number
    nextAuthId: number
    _all: number
  }


  export type TenantAvgAggregateInputType = {
    id?: true
  }

  export type TenantSumAggregateInputType = {
    id?: true
  }

  export type TenantMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phoneNumber?: true
    nextAuthId?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phoneNumber?: true
    nextAuthId?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phoneNumber?: true
    nextAuthId?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _avg?: TenantAvgAggregateInputType
    _sum?: TenantSumAggregateInputType
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: number
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phoneNumber?: boolean
    nextAuthId?: boolean
    applications?: boolean | Tenant$applicationsArgs<ExtArgs>
    leases?: boolean | Tenant$leasesArgs<ExtArgs>
    favorites?: boolean | Tenant$favoritesArgs<ExtArgs>
    properties?: boolean | Tenant$propertiesArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phoneNumber?: boolean
    nextAuthId?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phoneNumber?: boolean
    nextAuthId?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    phoneNumber?: boolean
    nextAuthId?: boolean
  }

  export type TenantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "phoneNumber" | "nextAuthId", ExtArgs["result"]["tenant"]>
  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | Tenant$applicationsArgs<ExtArgs>
    leases?: boolean | Tenant$leasesArgs<ExtArgs>
    favorites?: boolean | Tenant$favoritesArgs<ExtArgs>
    properties?: boolean | Tenant$propertiesArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TenantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      applications: Prisma.$ApplicationPayload<ExtArgs>[]
      leases: Prisma.$LeasePayload<ExtArgs>[]
      favorites: Prisma.$PropertyPayload<ExtArgs>[]
      properties: Prisma.$PropertyPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      email: string
      phoneNumber: string
      nextAuthId: string
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tenants and returns the data saved in the database.
     * @param {TenantCreateManyAndReturnArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(args?: SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants and returns the data updated in the database.
     * @param {TenantUpdateManyAndReturnArgs} args - Arguments to update many Tenants.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TenantUpdateManyAndReturnArgs>(args: SelectSubset<T, TenantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    applications<T extends Tenant$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    leases<T extends Tenant$leasesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$leasesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    favorites<T extends Tenant$favoritesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$favoritesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    properties<T extends Tenant$propertiesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$propertiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tenant model
   */
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'Int'>
    readonly name: FieldRef<"Tenant", 'String'>
    readonly email: FieldRef<"Tenant", 'String'>
    readonly phoneNumber: FieldRef<"Tenant", 'String'>
    readonly nextAuthId: FieldRef<"Tenant", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant createManyAndReturn
   */
  export type TenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant updateManyAndReturn
   */
  export type TenantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to delete.
     */
    limit?: number
  }

  /**
   * Tenant.applications
   */
  export type Tenant$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    cursor?: ApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Tenant.leases
   */
  export type Tenant$leasesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseInclude<ExtArgs> | null
    where?: LeaseWhereInput
    orderBy?: LeaseOrderByWithRelationInput | LeaseOrderByWithRelationInput[]
    cursor?: LeaseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LeaseScalarFieldEnum | LeaseScalarFieldEnum[]
  }

  /**
   * Tenant.favorites
   */
  export type Tenant$favoritesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    where?: PropertyWhereInput
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    cursor?: PropertyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Tenant.properties
   */
  export type Tenant$propertiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    where?: PropertyWhereInput
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    cursor?: PropertyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model Location
   */

  export type AggregateLocation = {
    _count: LocationCountAggregateOutputType | null
    _avg: LocationAvgAggregateOutputType | null
    _sum: LocationSumAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  export type LocationAvgAggregateOutputType = {
    id: number | null
  }

  export type LocationSumAggregateOutputType = {
    id: number | null
  }

  export type LocationMinAggregateOutputType = {
    id: number | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    postalCode: string | null
  }

  export type LocationMaxAggregateOutputType = {
    id: number | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    postalCode: string | null
  }

  export type LocationCountAggregateOutputType = {
    id: number
    address: number
    city: number
    state: number
    country: number
    postalCode: number
    _all: number
  }


  export type LocationAvgAggregateInputType = {
    id?: true
  }

  export type LocationSumAggregateInputType = {
    id?: true
  }

  export type LocationMinAggregateInputType = {
    id?: true
    address?: true
    city?: true
    state?: true
    country?: true
    postalCode?: true
  }

  export type LocationMaxAggregateInputType = {
    id?: true
    address?: true
    city?: true
    state?: true
    country?: true
    postalCode?: true
  }

  export type LocationCountAggregateInputType = {
    id?: true
    address?: true
    city?: true
    state?: true
    country?: true
    postalCode?: true
    _all?: true
  }

  export type LocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Location to aggregate.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Locations
    **/
    _count?: true | LocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationMaxAggregateInputType
  }

  export type GetLocationAggregateType<T extends LocationAggregateArgs> = {
        [P in keyof T & keyof AggregateLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocation[P]>
      : GetScalarType<T[P], AggregateLocation[P]>
  }




  export type LocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationWhereInput
    orderBy?: LocationOrderByWithAggregationInput | LocationOrderByWithAggregationInput[]
    by: LocationScalarFieldEnum[] | LocationScalarFieldEnum
    having?: LocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationCountAggregateInputType | true
    _avg?: LocationAvgAggregateInputType
    _sum?: LocationSumAggregateInputType
    _min?: LocationMinAggregateInputType
    _max?: LocationMaxAggregateInputType
  }

  export type LocationGroupByOutputType = {
    id: number
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    _count: LocationCountAggregateOutputType | null
    _avg: LocationAvgAggregateOutputType | null
    _sum: LocationSumAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  type GetLocationGroupByPayload<T extends LocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationGroupByOutputType[P]>
            : GetScalarType<T[P], LocationGroupByOutputType[P]>
        }
      >
    >


  export type LocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    postalCode?: boolean
    properties?: boolean | Location$propertiesArgs<ExtArgs>
    _count?: boolean | LocationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["location"]>


  export type LocationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    postalCode?: boolean
  }, ExtArgs["result"]["location"]>

  export type LocationSelectScalar = {
    id?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    postalCode?: boolean
  }

  export type LocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "address" | "city" | "state" | "country" | "postalCode", ExtArgs["result"]["location"]>
  export type LocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    properties?: boolean | Location$propertiesArgs<ExtArgs>
    _count?: boolean | LocationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LocationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Location"
    objects: {
      properties: Prisma.$PropertyPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      address: string
      city: string
      state: string
      country: string
      postalCode: string
    }, ExtArgs["result"]["location"]>
    composites: {}
  }

  type LocationGetPayload<S extends boolean | null | undefined | LocationDefaultArgs> = $Result.GetResult<Prisma.$LocationPayload, S>

  type LocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocationCountAggregateInputType | true
    }

  export interface LocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Location'], meta: { name: 'Location' } }
    /**
     * Find zero or one Location that matches the filter.
     * @param {LocationFindUniqueArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocationFindUniqueArgs>(args: SelectSubset<T, LocationFindUniqueArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Location that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocationFindUniqueOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocationFindUniqueOrThrowArgs>(args: SelectSubset<T, LocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Location that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocationFindFirstArgs>(args?: SelectSubset<T, LocationFindFirstArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Location that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocationFindFirstOrThrowArgs>(args?: SelectSubset<T, LocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Locations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Locations
     * const locations = await prisma.location.findMany()
     * 
     * // Get first 10 Locations
     * const locations = await prisma.location.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationWithIdOnly = await prisma.location.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocationFindManyArgs>(args?: SelectSubset<T, LocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Delete a Location.
     * @param {LocationDeleteArgs} args - Arguments to delete one Location.
     * @example
     * // Delete one Location
     * const Location = await prisma.location.delete({
     *   where: {
     *     // ... filter to delete one Location
     *   }
     * })
     * 
     */
    delete<T extends LocationDeleteArgs>(args: SelectSubset<T, LocationDeleteArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Location.
     * @param {LocationUpdateArgs} args - Arguments to update one Location.
     * @example
     * // Update one Location
     * const location = await prisma.location.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocationUpdateArgs>(args: SelectSubset<T, LocationUpdateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Locations.
     * @param {LocationDeleteManyArgs} args - Arguments to filter Locations to delete.
     * @example
     * // Delete a few Locations
     * const { count } = await prisma.location.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocationDeleteManyArgs>(args?: SelectSubset<T, LocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Locations
     * const location = await prisma.location.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocationUpdateManyArgs>(args: SelectSubset<T, LocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Locations and returns the data updated in the database.
     * @param {LocationUpdateManyAndReturnArgs} args - Arguments to update many Locations.
     * @example
     * // Update many Locations
     * const location = await prisma.location.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Locations and only return the `id`
     * const locationWithIdOnly = await prisma.location.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocationUpdateManyAndReturnArgs>(args: SelectSubset<T, LocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>


    /**
     * Count the number of Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationCountArgs} args - Arguments to filter Locations to count.
     * @example
     * // Count the number of Locations
     * const count = await prisma.location.count({
     *   where: {
     *     // ... the filter for the Locations we want to count
     *   }
     * })
    **/
    count<T extends LocationCountArgs>(
      args?: Subset<T, LocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocationAggregateArgs>(args: Subset<T, LocationAggregateArgs>): Prisma.PrismaPromise<GetLocationAggregateType<T>>

    /**
     * Group by Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocationGroupByArgs['orderBy'] }
        : { orderBy?: LocationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Location model
   */
  readonly fields: LocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Location.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    properties<T extends Location$propertiesArgs<ExtArgs> = {}>(args?: Subset<T, Location$propertiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Location model
   */
  interface LocationFieldRefs {
    readonly id: FieldRef<"Location", 'Int'>
    readonly address: FieldRef<"Location", 'String'>
    readonly city: FieldRef<"Location", 'String'>
    readonly state: FieldRef<"Location", 'String'>
    readonly country: FieldRef<"Location", 'String'>
    readonly postalCode: FieldRef<"Location", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Location findUnique
   */
  export type LocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findUniqueOrThrow
   */
  export type LocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findFirst
   */
  export type LocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findFirstOrThrow
   */
  export type LocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findMany
   */
  export type LocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Locations to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location update
   */
  export type LocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to update a Location.
     */
    data: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
    /**
     * Choose, which Location to update.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location updateMany
   */
  export type LocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Locations.
     */
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyInput>
    /**
     * Filter which Locations to update
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to update.
     */
    limit?: number
  }

  /**
   * Location updateManyAndReturn
   */
  export type LocationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * The data used to update Locations.
     */
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyInput>
    /**
     * Filter which Locations to update
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to update.
     */
    limit?: number
  }

  /**
   * Location delete
   */
  export type LocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter which Location to delete.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location deleteMany
   */
  export type LocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Locations to delete
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to delete.
     */
    limit?: number
  }

  /**
   * Location.properties
   */
  export type Location$propertiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Property
     */
    select?: PropertySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Property
     */
    omit?: PropertyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PropertyInclude<ExtArgs> | null
    where?: PropertyWhereInput
    orderBy?: PropertyOrderByWithRelationInput | PropertyOrderByWithRelationInput[]
    cursor?: PropertyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PropertyScalarFieldEnum | PropertyScalarFieldEnum[]
  }

  /**
   * Location without action
   */
  export type LocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
  }


  /**
   * Model Application
   */

  export type AggregateApplication = {
    _count: ApplicationCountAggregateOutputType | null
    _avg: ApplicationAvgAggregateOutputType | null
    _sum: ApplicationSumAggregateOutputType | null
    _min: ApplicationMinAggregateOutputType | null
    _max: ApplicationMaxAggregateOutputType | null
  }

  export type ApplicationAvgAggregateOutputType = {
    id: number | null
    propertyId: number | null
    leaseId: number | null
  }

  export type ApplicationSumAggregateOutputType = {
    id: number | null
    propertyId: number | null
    leaseId: number | null
  }

  export type ApplicationMinAggregateOutputType = {
    id: number | null
    applicationDate: Date | null
    status: $Enums.ApplicationStatus | null
    propertyId: number | null
    name: string | null
    email: string | null
    phoneNumber: string | null
    message: string | null
    leaseId: number | null
    tenantNextAuthId: string | null
  }

  export type ApplicationMaxAggregateOutputType = {
    id: number | null
    applicationDate: Date | null
    status: $Enums.ApplicationStatus | null
    propertyId: number | null
    name: string | null
    email: string | null
    phoneNumber: string | null
    message: string | null
    leaseId: number | null
    tenantNextAuthId: string | null
  }

  export type ApplicationCountAggregateOutputType = {
    id: number
    applicationDate: number
    status: number
    propertyId: number
    name: number
    email: number
    phoneNumber: number
    message: number
    leaseId: number
    tenantNextAuthId: number
    _all: number
  }


  export type ApplicationAvgAggregateInputType = {
    id?: true
    propertyId?: true
    leaseId?: true
  }

  export type ApplicationSumAggregateInputType = {
    id?: true
    propertyId?: true
    leaseId?: true
  }

  export type ApplicationMinAggregateInputType = {
    id?: true
    applicationDate?: true
    status?: true
    propertyId?: true
    name?: true
    email?: true
    phoneNumber?: true
    message?: true
    leaseId?: true
    tenantNextAuthId?: true
  }

  export type ApplicationMaxAggregateInputType = {
    id?: true
    applicationDate?: true
    status?: true
    propertyId?: true
    name?: true
    email?: true
    phoneNumber?: true
    message?: true
    leaseId?: true
    tenantNextAuthId?: true
  }

  export type ApplicationCountAggregateInputType = {
    id?: true
    applicationDate?: true
    status?: true
    propertyId?: true
    name?: true
    email?: true
    phoneNumber?: true
    message?: true
    leaseId?: true
    tenantNextAuthId?: true
    _all?: true
  }

  export type ApplicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Application to aggregate.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Applications
    **/
    _count?: true | ApplicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ApplicationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ApplicationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApplicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApplicationMaxAggregateInputType
  }

  export type GetApplicationAggregateType<T extends ApplicationAggregateArgs> = {
        [P in keyof T & keyof AggregateApplication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApplication[P]>
      : GetScalarType<T[P], AggregateApplication[P]>
  }




  export type ApplicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithAggregationInput | ApplicationOrderByWithAggregationInput[]
    by: ApplicationScalarFieldEnum[] | ApplicationScalarFieldEnum
    having?: ApplicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApplicationCountAggregateInputType | true
    _avg?: ApplicationAvgAggregateInputType
    _sum?: ApplicationSumAggregateInputType
    _min?: ApplicationMinAggregateInputType
    _max?: ApplicationMaxAggregateInputType
  }

  export type ApplicationGroupByOutputType = {
    id: number
    applicationDate: Date
    status: $Enums.ApplicationStatus
    propertyId: number
    name: string
    email: string
    phoneNumber: string
    message: string | null
    leaseId: number | null
    tenantNextAuthId: string
    _count: ApplicationCountAggregateOutputType | null
    _avg: ApplicationAvgAggregateOutputType | null
    _sum: ApplicationSumAggregateOutputType | null
    _min: ApplicationMinAggregateOutputType | null
    _max: ApplicationMaxAggregateOutputType | null
  }

  type GetApplicationGroupByPayload<T extends ApplicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApplicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApplicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApplicationGroupByOutputType[P]>
            : GetScalarType<T[P], ApplicationGroupByOutputType[P]>
        }
      >
    >


  export type ApplicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    applicationDate?: boolean
    status?: boolean
    propertyId?: boolean
    name?: boolean
    email?: boolean
    phoneNumber?: boolean
    message?: boolean
    leaseId?: boolean
    tenantNextAuthId?: boolean
    lease?: boolean | Application$leaseArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    applicationDate?: boolean
    status?: boolean
    propertyId?: boolean
    name?: boolean
    email?: boolean
    phoneNumber?: boolean
    message?: boolean
    leaseId?: boolean
    tenantNextAuthId?: boolean
    lease?: boolean | Application$leaseArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    applicationDate?: boolean
    status?: boolean
    propertyId?: boolean
    name?: boolean
    email?: boolean
    phoneNumber?: boolean
    message?: boolean
    leaseId?: boolean
    tenantNextAuthId?: boolean
    lease?: boolean | Application$leaseArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectScalar = {
    id?: boolean
    applicationDate?: boolean
    status?: boolean
    propertyId?: boolean
    name?: boolean
    email?: boolean
    phoneNumber?: boolean
    message?: boolean
    leaseId?: boolean
    tenantNextAuthId?: boolean
  }

  export type ApplicationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "applicationDate" | "status" | "propertyId" | "name" | "email" | "phoneNumber" | "message" | "leaseId" | "tenantNextAuthId", ExtArgs["result"]["application"]>
  export type ApplicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lease?: boolean | Application$leaseArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type ApplicationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lease?: boolean | Application$leaseArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type ApplicationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lease?: boolean | Application$leaseArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $ApplicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Application"
    objects: {
      lease: Prisma.$LeasePayload<ExtArgs> | null
      property: Prisma.$PropertyPayload<ExtArgs>
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      applicationDate: Date
      status: $Enums.ApplicationStatus
      propertyId: number
      name: string
      email: string
      phoneNumber: string
      message: string | null
      leaseId: number | null
      tenantNextAuthId: string
    }, ExtArgs["result"]["application"]>
    composites: {}
  }

  type ApplicationGetPayload<S extends boolean | null | undefined | ApplicationDefaultArgs> = $Result.GetResult<Prisma.$ApplicationPayload, S>

  type ApplicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApplicationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApplicationCountAggregateInputType | true
    }

  export interface ApplicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Application'], meta: { name: 'Application' } }
    /**
     * Find zero or one Application that matches the filter.
     * @param {ApplicationFindUniqueArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApplicationFindUniqueArgs>(args: SelectSubset<T, ApplicationFindUniqueArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Application that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApplicationFindUniqueOrThrowArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApplicationFindUniqueOrThrowArgs>(args: SelectSubset<T, ApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Application that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindFirstArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApplicationFindFirstArgs>(args?: SelectSubset<T, ApplicationFindFirstArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Application that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindFirstOrThrowArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApplicationFindFirstOrThrowArgs>(args?: SelectSubset<T, ApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Applications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Applications
     * const applications = await prisma.application.findMany()
     * 
     * // Get first 10 Applications
     * const applications = await prisma.application.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const applicationWithIdOnly = await prisma.application.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApplicationFindManyArgs>(args?: SelectSubset<T, ApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Application.
     * @param {ApplicationCreateArgs} args - Arguments to create a Application.
     * @example
     * // Create one Application
     * const Application = await prisma.application.create({
     *   data: {
     *     // ... data to create a Application
     *   }
     * })
     * 
     */
    create<T extends ApplicationCreateArgs>(args: SelectSubset<T, ApplicationCreateArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Applications.
     * @param {ApplicationCreateManyArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const application = await prisma.application.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApplicationCreateManyArgs>(args?: SelectSubset<T, ApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Applications and returns the data saved in the database.
     * @param {ApplicationCreateManyAndReturnArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const application = await prisma.application.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Applications and only return the `id`
     * const applicationWithIdOnly = await prisma.application.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApplicationCreateManyAndReturnArgs>(args?: SelectSubset<T, ApplicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Application.
     * @param {ApplicationDeleteArgs} args - Arguments to delete one Application.
     * @example
     * // Delete one Application
     * const Application = await prisma.application.delete({
     *   where: {
     *     // ... filter to delete one Application
     *   }
     * })
     * 
     */
    delete<T extends ApplicationDeleteArgs>(args: SelectSubset<T, ApplicationDeleteArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Application.
     * @param {ApplicationUpdateArgs} args - Arguments to update one Application.
     * @example
     * // Update one Application
     * const application = await prisma.application.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApplicationUpdateArgs>(args: SelectSubset<T, ApplicationUpdateArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Applications.
     * @param {ApplicationDeleteManyArgs} args - Arguments to filter Applications to delete.
     * @example
     * // Delete a few Applications
     * const { count } = await prisma.application.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApplicationDeleteManyArgs>(args?: SelectSubset<T, ApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Applications
     * const application = await prisma.application.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApplicationUpdateManyArgs>(args: SelectSubset<T, ApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Applications and returns the data updated in the database.
     * @param {ApplicationUpdateManyAndReturnArgs} args - Arguments to update many Applications.
     * @example
     * // Update many Applications
     * const application = await prisma.application.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Applications and only return the `id`
     * const applicationWithIdOnly = await prisma.application.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApplicationUpdateManyAndReturnArgs>(args: SelectSubset<T, ApplicationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Application.
     * @param {ApplicationUpsertArgs} args - Arguments to update or create a Application.
     * @example
     * // Update or create a Application
     * const application = await prisma.application.upsert({
     *   create: {
     *     // ... data to create a Application
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Application we want to update
     *   }
     * })
     */
    upsert<T extends ApplicationUpsertArgs>(args: SelectSubset<T, ApplicationUpsertArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationCountArgs} args - Arguments to filter Applications to count.
     * @example
     * // Count the number of Applications
     * const count = await prisma.application.count({
     *   where: {
     *     // ... the filter for the Applications we want to count
     *   }
     * })
    **/
    count<T extends ApplicationCountArgs>(
      args?: Subset<T, ApplicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApplicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Application.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApplicationAggregateArgs>(args: Subset<T, ApplicationAggregateArgs>): Prisma.PrismaPromise<GetApplicationAggregateType<T>>

    /**
     * Group by Application.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApplicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApplicationGroupByArgs['orderBy'] }
        : { orderBy?: ApplicationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Application model
   */
  readonly fields: ApplicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Application.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApplicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lease<T extends Application$leaseArgs<ExtArgs> = {}>(args?: Subset<T, Application$leaseArgs<ExtArgs>>): Prisma__LeaseClient<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Application model
   */
  interface ApplicationFieldRefs {
    readonly id: FieldRef<"Application", 'Int'>
    readonly applicationDate: FieldRef<"Application", 'DateTime'>
    readonly status: FieldRef<"Application", 'ApplicationStatus'>
    readonly propertyId: FieldRef<"Application", 'Int'>
    readonly name: FieldRef<"Application", 'String'>
    readonly email: FieldRef<"Application", 'String'>
    readonly phoneNumber: FieldRef<"Application", 'String'>
    readonly message: FieldRef<"Application", 'String'>
    readonly leaseId: FieldRef<"Application", 'Int'>
    readonly tenantNextAuthId: FieldRef<"Application", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Application findUnique
   */
  export type ApplicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application findUniqueOrThrow
   */
  export type ApplicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application findFirst
   */
  export type ApplicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application findFirstOrThrow
   */
  export type ApplicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application findMany
   */
  export type ApplicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Applications to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application create
   */
  export type ApplicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The data needed to create a Application.
     */
    data: XOR<ApplicationCreateInput, ApplicationUncheckedCreateInput>
  }

  /**
   * Application createMany
   */
  export type ApplicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Applications.
     */
    data: ApplicationCreateManyInput | ApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Application createManyAndReturn
   */
  export type ApplicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * The data used to create many Applications.
     */
    data: ApplicationCreateManyInput | ApplicationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Application update
   */
  export type ApplicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The data needed to update a Application.
     */
    data: XOR<ApplicationUpdateInput, ApplicationUncheckedUpdateInput>
    /**
     * Choose, which Application to update.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application updateMany
   */
  export type ApplicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Applications.
     */
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyInput>
    /**
     * Filter which Applications to update
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to update.
     */
    limit?: number
  }

  /**
   * Application updateManyAndReturn
   */
  export type ApplicationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * The data used to update Applications.
     */
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyInput>
    /**
     * Filter which Applications to update
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Application upsert
   */
  export type ApplicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The filter to search for the Application to update in case it exists.
     */
    where: ApplicationWhereUniqueInput
    /**
     * In case the Application found by the `where` argument doesn't exist, create a new Application with this data.
     */
    create: XOR<ApplicationCreateInput, ApplicationUncheckedCreateInput>
    /**
     * In case the Application was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApplicationUpdateInput, ApplicationUncheckedUpdateInput>
  }

  /**
   * Application delete
   */
  export type ApplicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter which Application to delete.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application deleteMany
   */
  export type ApplicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Applications to delete
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to delete.
     */
    limit?: number
  }

  /**
   * Application.lease
   */
  export type Application$leaseArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseInclude<ExtArgs> | null
    where?: LeaseWhereInput
  }

  /**
   * Application without action
   */
  export type ApplicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
  }


  /**
   * Model Lease
   */

  export type AggregateLease = {
    _count: LeaseCountAggregateOutputType | null
    _avg: LeaseAvgAggregateOutputType | null
    _sum: LeaseSumAggregateOutputType | null
    _min: LeaseMinAggregateOutputType | null
    _max: LeaseMaxAggregateOutputType | null
  }

  export type LeaseAvgAggregateOutputType = {
    id: number | null
    rent: number | null
    deposit: number | null
    propertyId: number | null
  }

  export type LeaseSumAggregateOutputType = {
    id: number | null
    rent: number | null
    deposit: number | null
    propertyId: number | null
  }

  export type LeaseMinAggregateOutputType = {
    id: number | null
    startDate: Date | null
    endDate: Date | null
    rent: number | null
    deposit: number | null
    propertyId: number | null
    tenantNextAuthId: string | null
  }

  export type LeaseMaxAggregateOutputType = {
    id: number | null
    startDate: Date | null
    endDate: Date | null
    rent: number | null
    deposit: number | null
    propertyId: number | null
    tenantNextAuthId: string | null
  }

  export type LeaseCountAggregateOutputType = {
    id: number
    startDate: number
    endDate: number
    rent: number
    deposit: number
    propertyId: number
    tenantNextAuthId: number
    _all: number
  }


  export type LeaseAvgAggregateInputType = {
    id?: true
    rent?: true
    deposit?: true
    propertyId?: true
  }

  export type LeaseSumAggregateInputType = {
    id?: true
    rent?: true
    deposit?: true
    propertyId?: true
  }

  export type LeaseMinAggregateInputType = {
    id?: true
    startDate?: true
    endDate?: true
    rent?: true
    deposit?: true
    propertyId?: true
    tenantNextAuthId?: true
  }

  export type LeaseMaxAggregateInputType = {
    id?: true
    startDate?: true
    endDate?: true
    rent?: true
    deposit?: true
    propertyId?: true
    tenantNextAuthId?: true
  }

  export type LeaseCountAggregateInputType = {
    id?: true
    startDate?: true
    endDate?: true
    rent?: true
    deposit?: true
    propertyId?: true
    tenantNextAuthId?: true
    _all?: true
  }

  export type LeaseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lease to aggregate.
     */
    where?: LeaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leases to fetch.
     */
    orderBy?: LeaseOrderByWithRelationInput | LeaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LeaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Leases
    **/
    _count?: true | LeaseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LeaseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LeaseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LeaseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LeaseMaxAggregateInputType
  }

  export type GetLeaseAggregateType<T extends LeaseAggregateArgs> = {
        [P in keyof T & keyof AggregateLease]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLease[P]>
      : GetScalarType<T[P], AggregateLease[P]>
  }




  export type LeaseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeaseWhereInput
    orderBy?: LeaseOrderByWithAggregationInput | LeaseOrderByWithAggregationInput[]
    by: LeaseScalarFieldEnum[] | LeaseScalarFieldEnum
    having?: LeaseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LeaseCountAggregateInputType | true
    _avg?: LeaseAvgAggregateInputType
    _sum?: LeaseSumAggregateInputType
    _min?: LeaseMinAggregateInputType
    _max?: LeaseMaxAggregateInputType
  }

  export type LeaseGroupByOutputType = {
    id: number
    startDate: Date
    endDate: Date
    rent: number
    deposit: number
    propertyId: number
    tenantNextAuthId: string
    _count: LeaseCountAggregateOutputType | null
    _avg: LeaseAvgAggregateOutputType | null
    _sum: LeaseSumAggregateOutputType | null
    _min: LeaseMinAggregateOutputType | null
    _max: LeaseMaxAggregateOutputType | null
  }

  type GetLeaseGroupByPayload<T extends LeaseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LeaseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LeaseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LeaseGroupByOutputType[P]>
            : GetScalarType<T[P], LeaseGroupByOutputType[P]>
        }
      >
    >


  export type LeaseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startDate?: boolean
    endDate?: boolean
    rent?: boolean
    deposit?: boolean
    propertyId?: boolean
    tenantNextAuthId?: boolean
    application?: boolean | Lease$applicationArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    payments?: boolean | Lease$paymentsArgs<ExtArgs>
    _count?: boolean | LeaseCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lease"]>

  export type LeaseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startDate?: boolean
    endDate?: boolean
    rent?: boolean
    deposit?: boolean
    propertyId?: boolean
    tenantNextAuthId?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lease"]>

  export type LeaseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startDate?: boolean
    endDate?: boolean
    rent?: boolean
    deposit?: boolean
    propertyId?: boolean
    tenantNextAuthId?: boolean
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lease"]>

  export type LeaseSelectScalar = {
    id?: boolean
    startDate?: boolean
    endDate?: boolean
    rent?: boolean
    deposit?: boolean
    propertyId?: boolean
    tenantNextAuthId?: boolean
  }

  export type LeaseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "startDate" | "endDate" | "rent" | "deposit" | "propertyId" | "tenantNextAuthId", ExtArgs["result"]["lease"]>
  export type LeaseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    application?: boolean | Lease$applicationArgs<ExtArgs>
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    payments?: boolean | Lease$paymentsArgs<ExtArgs>
    _count?: boolean | LeaseCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LeaseIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type LeaseIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    property?: boolean | PropertyDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $LeasePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lease"
    objects: {
      application: Prisma.$ApplicationPayload<ExtArgs> | null
      property: Prisma.$PropertyPayload<ExtArgs>
      tenant: Prisma.$TenantPayload<ExtArgs>
      payments: Prisma.$PaymentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      startDate: Date
      endDate: Date
      rent: number
      deposit: number
      propertyId: number
      tenantNextAuthId: string
    }, ExtArgs["result"]["lease"]>
    composites: {}
  }

  type LeaseGetPayload<S extends boolean | null | undefined | LeaseDefaultArgs> = $Result.GetResult<Prisma.$LeasePayload, S>

  type LeaseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LeaseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LeaseCountAggregateInputType | true
    }

  export interface LeaseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lease'], meta: { name: 'Lease' } }
    /**
     * Find zero or one Lease that matches the filter.
     * @param {LeaseFindUniqueArgs} args - Arguments to find a Lease
     * @example
     * // Get one Lease
     * const lease = await prisma.lease.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeaseFindUniqueArgs>(args: SelectSubset<T, LeaseFindUniqueArgs<ExtArgs>>): Prisma__LeaseClient<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lease that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LeaseFindUniqueOrThrowArgs} args - Arguments to find a Lease
     * @example
     * // Get one Lease
     * const lease = await prisma.lease.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeaseFindUniqueOrThrowArgs>(args: SelectSubset<T, LeaseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LeaseClient<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lease that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaseFindFirstArgs} args - Arguments to find a Lease
     * @example
     * // Get one Lease
     * const lease = await prisma.lease.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeaseFindFirstArgs>(args?: SelectSubset<T, LeaseFindFirstArgs<ExtArgs>>): Prisma__LeaseClient<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lease that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaseFindFirstOrThrowArgs} args - Arguments to find a Lease
     * @example
     * // Get one Lease
     * const lease = await prisma.lease.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeaseFindFirstOrThrowArgs>(args?: SelectSubset<T, LeaseFindFirstOrThrowArgs<ExtArgs>>): Prisma__LeaseClient<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Leases that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Leases
     * const leases = await prisma.lease.findMany()
     * 
     * // Get first 10 Leases
     * const leases = await prisma.lease.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const leaseWithIdOnly = await prisma.lease.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LeaseFindManyArgs>(args?: SelectSubset<T, LeaseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lease.
     * @param {LeaseCreateArgs} args - Arguments to create a Lease.
     * @example
     * // Create one Lease
     * const Lease = await prisma.lease.create({
     *   data: {
     *     // ... data to create a Lease
     *   }
     * })
     * 
     */
    create<T extends LeaseCreateArgs>(args: SelectSubset<T, LeaseCreateArgs<ExtArgs>>): Prisma__LeaseClient<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Leases.
     * @param {LeaseCreateManyArgs} args - Arguments to create many Leases.
     * @example
     * // Create many Leases
     * const lease = await prisma.lease.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LeaseCreateManyArgs>(args?: SelectSubset<T, LeaseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Leases and returns the data saved in the database.
     * @param {LeaseCreateManyAndReturnArgs} args - Arguments to create many Leases.
     * @example
     * // Create many Leases
     * const lease = await prisma.lease.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Leases and only return the `id`
     * const leaseWithIdOnly = await prisma.lease.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LeaseCreateManyAndReturnArgs>(args?: SelectSubset<T, LeaseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lease.
     * @param {LeaseDeleteArgs} args - Arguments to delete one Lease.
     * @example
     * // Delete one Lease
     * const Lease = await prisma.lease.delete({
     *   where: {
     *     // ... filter to delete one Lease
     *   }
     * })
     * 
     */
    delete<T extends LeaseDeleteArgs>(args: SelectSubset<T, LeaseDeleteArgs<ExtArgs>>): Prisma__LeaseClient<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lease.
     * @param {LeaseUpdateArgs} args - Arguments to update one Lease.
     * @example
     * // Update one Lease
     * const lease = await prisma.lease.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LeaseUpdateArgs>(args: SelectSubset<T, LeaseUpdateArgs<ExtArgs>>): Prisma__LeaseClient<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Leases.
     * @param {LeaseDeleteManyArgs} args - Arguments to filter Leases to delete.
     * @example
     * // Delete a few Leases
     * const { count } = await prisma.lease.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LeaseDeleteManyArgs>(args?: SelectSubset<T, LeaseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Leases
     * const lease = await prisma.lease.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LeaseUpdateManyArgs>(args: SelectSubset<T, LeaseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leases and returns the data updated in the database.
     * @param {LeaseUpdateManyAndReturnArgs} args - Arguments to update many Leases.
     * @example
     * // Update many Leases
     * const lease = await prisma.lease.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Leases and only return the `id`
     * const leaseWithIdOnly = await prisma.lease.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LeaseUpdateManyAndReturnArgs>(args: SelectSubset<T, LeaseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lease.
     * @param {LeaseUpsertArgs} args - Arguments to update or create a Lease.
     * @example
     * // Update or create a Lease
     * const lease = await prisma.lease.upsert({
     *   create: {
     *     // ... data to create a Lease
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lease we want to update
     *   }
     * })
     */
    upsert<T extends LeaseUpsertArgs>(args: SelectSubset<T, LeaseUpsertArgs<ExtArgs>>): Prisma__LeaseClient<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Leases.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaseCountArgs} args - Arguments to filter Leases to count.
     * @example
     * // Count the number of Leases
     * const count = await prisma.lease.count({
     *   where: {
     *     // ... the filter for the Leases we want to count
     *   }
     * })
    **/
    count<T extends LeaseCountArgs>(
      args?: Subset<T, LeaseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LeaseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lease.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LeaseAggregateArgs>(args: Subset<T, LeaseAggregateArgs>): Prisma.PrismaPromise<GetLeaseAggregateType<T>>

    /**
     * Group by Lease.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LeaseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LeaseGroupByArgs['orderBy'] }
        : { orderBy?: LeaseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LeaseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeaseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lease model
   */
  readonly fields: LeaseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lease.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LeaseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    application<T extends Lease$applicationArgs<ExtArgs> = {}>(args?: Subset<T, Lease$applicationArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    property<T extends PropertyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PropertyDefaultArgs<ExtArgs>>): Prisma__PropertyClient<$Result.GetResult<Prisma.$PropertyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    payments<T extends Lease$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, Lease$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Lease model
   */
  interface LeaseFieldRefs {
    readonly id: FieldRef<"Lease", 'Int'>
    readonly startDate: FieldRef<"Lease", 'DateTime'>
    readonly endDate: FieldRef<"Lease", 'DateTime'>
    readonly rent: FieldRef<"Lease", 'Float'>
    readonly deposit: FieldRef<"Lease", 'Float'>
    readonly propertyId: FieldRef<"Lease", 'Int'>
    readonly tenantNextAuthId: FieldRef<"Lease", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Lease findUnique
   */
  export type LeaseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseInclude<ExtArgs> | null
    /**
     * Filter, which Lease to fetch.
     */
    where: LeaseWhereUniqueInput
  }

  /**
   * Lease findUniqueOrThrow
   */
  export type LeaseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseInclude<ExtArgs> | null
    /**
     * Filter, which Lease to fetch.
     */
    where: LeaseWhereUniqueInput
  }

  /**
   * Lease findFirst
   */
  export type LeaseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseInclude<ExtArgs> | null
    /**
     * Filter, which Lease to fetch.
     */
    where?: LeaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leases to fetch.
     */
    orderBy?: LeaseOrderByWithRelationInput | LeaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leases.
     */
    cursor?: LeaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leases.
     */
    distinct?: LeaseScalarFieldEnum | LeaseScalarFieldEnum[]
  }

  /**
   * Lease findFirstOrThrow
   */
  export type LeaseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseInclude<ExtArgs> | null
    /**
     * Filter, which Lease to fetch.
     */
    where?: LeaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leases to fetch.
     */
    orderBy?: LeaseOrderByWithRelationInput | LeaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leases.
     */
    cursor?: LeaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leases.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leases.
     */
    distinct?: LeaseScalarFieldEnum | LeaseScalarFieldEnum[]
  }

  /**
   * Lease findMany
   */
  export type LeaseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseInclude<ExtArgs> | null
    /**
     * Filter, which Leases to fetch.
     */
    where?: LeaseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leases to fetch.
     */
    orderBy?: LeaseOrderByWithRelationInput | LeaseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Leases.
     */
    cursor?: LeaseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leases from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leases.
     */
    skip?: number
    distinct?: LeaseScalarFieldEnum | LeaseScalarFieldEnum[]
  }

  /**
   * Lease create
   */
  export type LeaseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseInclude<ExtArgs> | null
    /**
     * The data needed to create a Lease.
     */
    data: XOR<LeaseCreateInput, LeaseUncheckedCreateInput>
  }

  /**
   * Lease createMany
   */
  export type LeaseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Leases.
     */
    data: LeaseCreateManyInput | LeaseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lease createManyAndReturn
   */
  export type LeaseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * The data used to create many Leases.
     */
    data: LeaseCreateManyInput | LeaseCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lease update
   */
  export type LeaseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseInclude<ExtArgs> | null
    /**
     * The data needed to update a Lease.
     */
    data: XOR<LeaseUpdateInput, LeaseUncheckedUpdateInput>
    /**
     * Choose, which Lease to update.
     */
    where: LeaseWhereUniqueInput
  }

  /**
   * Lease updateMany
   */
  export type LeaseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Leases.
     */
    data: XOR<LeaseUpdateManyMutationInput, LeaseUncheckedUpdateManyInput>
    /**
     * Filter which Leases to update
     */
    where?: LeaseWhereInput
    /**
     * Limit how many Leases to update.
     */
    limit?: number
  }

  /**
   * Lease updateManyAndReturn
   */
  export type LeaseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * The data used to update Leases.
     */
    data: XOR<LeaseUpdateManyMutationInput, LeaseUncheckedUpdateManyInput>
    /**
     * Filter which Leases to update
     */
    where?: LeaseWhereInput
    /**
     * Limit how many Leases to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lease upsert
   */
  export type LeaseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseInclude<ExtArgs> | null
    /**
     * The filter to search for the Lease to update in case it exists.
     */
    where: LeaseWhereUniqueInput
    /**
     * In case the Lease found by the `where` argument doesn't exist, create a new Lease with this data.
     */
    create: XOR<LeaseCreateInput, LeaseUncheckedCreateInput>
    /**
     * In case the Lease was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LeaseUpdateInput, LeaseUncheckedUpdateInput>
  }

  /**
   * Lease delete
   */
  export type LeaseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseInclude<ExtArgs> | null
    /**
     * Filter which Lease to delete.
     */
    where: LeaseWhereUniqueInput
  }

  /**
   * Lease deleteMany
   */
  export type LeaseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Leases to delete
     */
    where?: LeaseWhereInput
    /**
     * Limit how many Leases to delete.
     */
    limit?: number
  }

  /**
   * Lease.application
   */
  export type Lease$applicationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
  }

  /**
   * Lease.payments
   */
  export type Lease$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Lease without action
   */
  export type LeaseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lease
     */
    select?: LeaseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lease
     */
    omit?: LeaseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaseInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    id: number | null
    amountDue: number | null
    amountPaid: number | null
    leaseId: number | null
  }

  export type PaymentSumAggregateOutputType = {
    id: number | null
    amountDue: number | null
    amountPaid: number | null
    leaseId: number | null
  }

  export type PaymentMinAggregateOutputType = {
    id: number | null
    amountDue: number | null
    amountPaid: number | null
    dueDate: Date | null
    paymentDate: Date | null
    paymentStatus: $Enums.PaymentStatus | null
    leaseId: number | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: number | null
    amountDue: number | null
    amountPaid: number | null
    dueDate: Date | null
    paymentDate: Date | null
    paymentStatus: $Enums.PaymentStatus | null
    leaseId: number | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    amountDue: number
    amountPaid: number
    dueDate: number
    paymentDate: number
    paymentStatus: number
    leaseId: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    id?: true
    amountDue?: true
    amountPaid?: true
    leaseId?: true
  }

  export type PaymentSumAggregateInputType = {
    id?: true
    amountDue?: true
    amountPaid?: true
    leaseId?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    amountDue?: true
    amountPaid?: true
    dueDate?: true
    paymentDate?: true
    paymentStatus?: true
    leaseId?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    amountDue?: true
    amountPaid?: true
    dueDate?: true
    paymentDate?: true
    paymentStatus?: true
    leaseId?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    amountDue?: true
    amountPaid?: true
    dueDate?: true
    paymentDate?: true
    paymentStatus?: true
    leaseId?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: number
    amountDue: number
    amountPaid: number
    dueDate: Date
    paymentDate: Date
    paymentStatus: $Enums.PaymentStatus
    leaseId: number
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amountDue?: boolean
    amountPaid?: boolean
    dueDate?: boolean
    paymentDate?: boolean
    paymentStatus?: boolean
    leaseId?: boolean
    lease?: boolean | LeaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amountDue?: boolean
    amountPaid?: boolean
    dueDate?: boolean
    paymentDate?: boolean
    paymentStatus?: boolean
    leaseId?: boolean
    lease?: boolean | LeaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amountDue?: boolean
    amountPaid?: boolean
    dueDate?: boolean
    paymentDate?: boolean
    paymentStatus?: boolean
    leaseId?: boolean
    lease?: boolean | LeaseDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    amountDue?: boolean
    amountPaid?: boolean
    dueDate?: boolean
    paymentDate?: boolean
    paymentStatus?: boolean
    leaseId?: boolean
  }

  export type PaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "amountDue" | "amountPaid" | "dueDate" | "paymentDate" | "paymentStatus" | "leaseId", ExtArgs["result"]["payment"]>
  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lease?: boolean | LeaseDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lease?: boolean | LeaseDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lease?: boolean | LeaseDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      lease: Prisma.$LeasePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      amountDue: number
      amountPaid: number
      dueDate: Date
      paymentDate: Date
      paymentStatus: $Enums.PaymentStatus
      leaseId: number
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments and returns the data updated in the database.
     * @param {PaymentUpdateManyAndReturnArgs} args - Arguments to update many Payments.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lease<T extends LeaseDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LeaseDefaultArgs<ExtArgs>>): Prisma__LeaseClient<$Result.GetResult<Prisma.$LeasePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'Int'>
    readonly amountDue: FieldRef<"Payment", 'Float'>
    readonly amountPaid: FieldRef<"Payment", 'Float'>
    readonly dueDate: FieldRef<"Payment", 'DateTime'>
    readonly paymentDate: FieldRef<"Payment", 'DateTime'>
    readonly paymentStatus: FieldRef<"Payment", 'PaymentStatus'>
    readonly leaseId: FieldRef<"Payment", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
  }

  /**
   * Payment updateManyAndReturn
   */
  export type PaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to delete.
     */
    limit?: number
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    prefix: 'prefix',
    firstName: 'firstName',
    lastName: 'lastName',
    suffix: 'suffix',
    password: 'password',
    username: 'username',
    defaultPrivacyLevel: 'defaultPrivacyLevel',
    stateOfResidence: 'stateOfResidence',
    cityOfResidence: 'cityOfResidence',
    zipCode: 'zipCode',
    howDidYouHearAboutUs: 'howDidYouHearAboutUs',
    forumUrl: 'forumUrl',
    youtubeUrl: 'youtubeUrl',
    referredByUsername: 'referredByUsername',
    flyerPromoCode: 'flyerPromoCode',
    otherHeardAboutText: 'otherHeardAboutText',
    termsAndPolicyAccepted: 'termsAndPolicyAccepted',
    dataInterests: 'dataInterests',
    otherInterestText: 'otherInterestText',
    rankedMotivations: 'rankedMotivations',
    rankedGovernments: 'rankedGovernments',
    rankedInformationSources: 'rankedInformationSources',
    otherInformationSourceText: 'otherInformationSourceText',
    agreementAccepted: 'agreementAccepted',
    onboardingComplete: 'onboardingComplete',
    otp: 'otp',
    otpExpires: 'otpExpires',
    nextAuthId: 'nextAuthId',
    phoneNumber: 'phoneNumber',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const VerificationTokenScalarFieldEnum: {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
  };

  export type VerificationTokenScalarFieldEnum = (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum]


  export const PropertyScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    pricePerMonth: 'pricePerMonth',
    securityDeposit: 'securityDeposit',
    applicationFee: 'applicationFee',
    photoUrls: 'photoUrls',
    amenities: 'amenities',
    highlights: 'highlights',
    isPetsAllowed: 'isPetsAllowed',
    isParkingIncluded: 'isParkingIncluded',
    beds: 'beds',
    baths: 'baths',
    squareFeet: 'squareFeet',
    propertyType: 'propertyType',
    postedDate: 'postedDate',
    averageRating: 'averageRating',
    numberOfReviews: 'numberOfReviews',
    locationId: 'locationId',
    managerNextAuthId: 'managerNextAuthId'
  };

  export type PropertyScalarFieldEnum = (typeof PropertyScalarFieldEnum)[keyof typeof PropertyScalarFieldEnum]


  export const ManagerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    phoneNumber: 'phoneNumber',
    nextAuthId: 'nextAuthId'
  };

  export type ManagerScalarFieldEnum = (typeof ManagerScalarFieldEnum)[keyof typeof ManagerScalarFieldEnum]


  export const TenantScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    phoneNumber: 'phoneNumber',
    nextAuthId: 'nextAuthId'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const LocationScalarFieldEnum: {
    id: 'id',
    address: 'address',
    city: 'city',
    state: 'state',
    country: 'country',
    postalCode: 'postalCode'
  };

  export type LocationScalarFieldEnum = (typeof LocationScalarFieldEnum)[keyof typeof LocationScalarFieldEnum]


  export const ApplicationScalarFieldEnum: {
    id: 'id',
    applicationDate: 'applicationDate',
    status: 'status',
    propertyId: 'propertyId',
    name: 'name',
    email: 'email',
    phoneNumber: 'phoneNumber',
    message: 'message',
    leaseId: 'leaseId',
    tenantNextAuthId: 'tenantNextAuthId'
  };

  export type ApplicationScalarFieldEnum = (typeof ApplicationScalarFieldEnum)[keyof typeof ApplicationScalarFieldEnum]


  export const LeaseScalarFieldEnum: {
    id: 'id',
    startDate: 'startDate',
    endDate: 'endDate',
    rent: 'rent',
    deposit: 'deposit',
    propertyId: 'propertyId',
    tenantNextAuthId: 'tenantNextAuthId'
  };

  export type LeaseScalarFieldEnum = (typeof LeaseScalarFieldEnum)[keyof typeof LeaseScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    amountDue: 'amountDue',
    amountPaid: 'amountPaid',
    dueDate: 'dueDate',
    paymentDate: 'paymentDate',
    paymentStatus: 'paymentStatus',
    leaseId: 'leaseId'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Amenity[]'
   */
  export type ListEnumAmenityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Amenity[]'>
    


  /**
   * Reference to a field of type 'Amenity'
   */
  export type EnumAmenityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Amenity'>
    


  /**
   * Reference to a field of type 'Highlight[]'
   */
  export type ListEnumHighlightFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Highlight[]'>
    


  /**
   * Reference to a field of type 'Highlight'
   */
  export type EnumHighlightFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Highlight'>
    


  /**
   * Reference to a field of type 'PropertyType'
   */
  export type EnumPropertyTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PropertyType'>
    


  /**
   * Reference to a field of type 'PropertyType[]'
   */
  export type ListEnumPropertyTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PropertyType[]'>
    


  /**
   * Reference to a field of type 'ApplicationStatus'
   */
  export type EnumApplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApplicationStatus'>
    


  /**
   * Reference to a field of type 'ApplicationStatus[]'
   */
  export type ListEnumApplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApplicationStatus[]'>
    


  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>
    


  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    prefix?: StringNullableFilter<"User"> | string | null
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    suffix?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    username?: StringNullableFilter<"User"> | string | null
    defaultPrivacyLevel?: StringNullableFilter<"User"> | string | null
    stateOfResidence?: StringNullableFilter<"User"> | string | null
    cityOfResidence?: StringNullableFilter<"User"> | string | null
    zipCode?: StringNullableFilter<"User"> | string | null
    howDidYouHearAboutUs?: StringNullableFilter<"User"> | string | null
    forumUrl?: StringNullableFilter<"User"> | string | null
    youtubeUrl?: StringNullableFilter<"User"> | string | null
    referredByUsername?: StringNullableFilter<"User"> | string | null
    flyerPromoCode?: StringNullableFilter<"User"> | string | null
    otherHeardAboutText?: StringNullableFilter<"User"> | string | null
    termsAndPolicyAccepted?: BoolFilter<"User"> | boolean
    dataInterests?: StringNullableListFilter<"User">
    otherInterestText?: StringNullableFilter<"User"> | string | null
    rankedMotivations?: StringNullableListFilter<"User">
    rankedGovernments?: StringNullableListFilter<"User">
    rankedInformationSources?: StringNullableListFilter<"User">
    otherInformationSourceText?: StringNullableFilter<"User"> | string | null
    agreementAccepted?: BoolFilter<"User"> | boolean
    onboardingComplete?: BoolFilter<"User"> | boolean
    otp?: StringNullableFilter<"User"> | string | null
    otpExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    nextAuthId?: StringNullableFilter<"User"> | string | null
    phoneNumber?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    prefix?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    suffix?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    defaultPrivacyLevel?: SortOrderInput | SortOrder
    stateOfResidence?: SortOrderInput | SortOrder
    cityOfResidence?: SortOrderInput | SortOrder
    zipCode?: SortOrderInput | SortOrder
    howDidYouHearAboutUs?: SortOrderInput | SortOrder
    forumUrl?: SortOrderInput | SortOrder
    youtubeUrl?: SortOrderInput | SortOrder
    referredByUsername?: SortOrderInput | SortOrder
    flyerPromoCode?: SortOrderInput | SortOrder
    otherHeardAboutText?: SortOrderInput | SortOrder
    termsAndPolicyAccepted?: SortOrder
    dataInterests?: SortOrder
    otherInterestText?: SortOrderInput | SortOrder
    rankedMotivations?: SortOrder
    rankedGovernments?: SortOrder
    rankedInformationSources?: SortOrder
    otherInformationSourceText?: SortOrderInput | SortOrder
    agreementAccepted?: SortOrder
    onboardingComplete?: SortOrder
    otp?: SortOrderInput | SortOrder
    otpExpires?: SortOrderInput | SortOrder
    nextAuthId?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    nextAuthId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    prefix?: StringNullableFilter<"User"> | string | null
    firstName?: StringNullableFilter<"User"> | string | null
    lastName?: StringNullableFilter<"User"> | string | null
    suffix?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    defaultPrivacyLevel?: StringNullableFilter<"User"> | string | null
    stateOfResidence?: StringNullableFilter<"User"> | string | null
    cityOfResidence?: StringNullableFilter<"User"> | string | null
    zipCode?: StringNullableFilter<"User"> | string | null
    howDidYouHearAboutUs?: StringNullableFilter<"User"> | string | null
    forumUrl?: StringNullableFilter<"User"> | string | null
    youtubeUrl?: StringNullableFilter<"User"> | string | null
    referredByUsername?: StringNullableFilter<"User"> | string | null
    flyerPromoCode?: StringNullableFilter<"User"> | string | null
    otherHeardAboutText?: StringNullableFilter<"User"> | string | null
    termsAndPolicyAccepted?: BoolFilter<"User"> | boolean
    dataInterests?: StringNullableListFilter<"User">
    otherInterestText?: StringNullableFilter<"User"> | string | null
    rankedMotivations?: StringNullableListFilter<"User">
    rankedGovernments?: StringNullableListFilter<"User">
    rankedInformationSources?: StringNullableListFilter<"User">
    otherInformationSourceText?: StringNullableFilter<"User"> | string | null
    agreementAccepted?: BoolFilter<"User"> | boolean
    onboardingComplete?: BoolFilter<"User"> | boolean
    otp?: StringNullableFilter<"User"> | string | null
    otpExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    phoneNumber?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
  }, "id" | "email" | "username" | "nextAuthId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    prefix?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    suffix?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    defaultPrivacyLevel?: SortOrderInput | SortOrder
    stateOfResidence?: SortOrderInput | SortOrder
    cityOfResidence?: SortOrderInput | SortOrder
    zipCode?: SortOrderInput | SortOrder
    howDidYouHearAboutUs?: SortOrderInput | SortOrder
    forumUrl?: SortOrderInput | SortOrder
    youtubeUrl?: SortOrderInput | SortOrder
    referredByUsername?: SortOrderInput | SortOrder
    flyerPromoCode?: SortOrderInput | SortOrder
    otherHeardAboutText?: SortOrderInput | SortOrder
    termsAndPolicyAccepted?: SortOrder
    dataInterests?: SortOrder
    otherInterestText?: SortOrderInput | SortOrder
    rankedMotivations?: SortOrder
    rankedGovernments?: SortOrder
    rankedInformationSources?: SortOrder
    otherInformationSourceText?: SortOrderInput | SortOrder
    agreementAccepted?: SortOrder
    onboardingComplete?: SortOrder
    otp?: SortOrderInput | SortOrder
    otpExpires?: SortOrderInput | SortOrder
    nextAuthId?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    prefix?: StringNullableWithAggregatesFilter<"User"> | string | null
    firstName?: StringNullableWithAggregatesFilter<"User"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"User"> | string | null
    suffix?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    defaultPrivacyLevel?: StringNullableWithAggregatesFilter<"User"> | string | null
    stateOfResidence?: StringNullableWithAggregatesFilter<"User"> | string | null
    cityOfResidence?: StringNullableWithAggregatesFilter<"User"> | string | null
    zipCode?: StringNullableWithAggregatesFilter<"User"> | string | null
    howDidYouHearAboutUs?: StringNullableWithAggregatesFilter<"User"> | string | null
    forumUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    youtubeUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    referredByUsername?: StringNullableWithAggregatesFilter<"User"> | string | null
    flyerPromoCode?: StringNullableWithAggregatesFilter<"User"> | string | null
    otherHeardAboutText?: StringNullableWithAggregatesFilter<"User"> | string | null
    termsAndPolicyAccepted?: BoolWithAggregatesFilter<"User"> | boolean
    dataInterests?: StringNullableListFilter<"User">
    otherInterestText?: StringNullableWithAggregatesFilter<"User"> | string | null
    rankedMotivations?: StringNullableListFilter<"User">
    rankedGovernments?: StringNullableListFilter<"User">
    rankedInformationSources?: StringNullableListFilter<"User">
    otherInformationSourceText?: StringNullableWithAggregatesFilter<"User"> | string | null
    agreementAccepted?: BoolWithAggregatesFilter<"User"> | boolean
    onboardingComplete?: BoolWithAggregatesFilter<"User"> | boolean
    otp?: StringNullableWithAggregatesFilter<"User"> | string | null
    otpExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    nextAuthId?: StringNullableWithAggregatesFilter<"User"> | string | null
    phoneNumber?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type VerificationTokenWhereInput = {
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }

  export type VerificationTokenOrderByWithRelationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }, "token" | "identifier_token">

  export type VerificationTokenOrderByWithAggregationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    _count?: VerificationTokenCountOrderByAggregateInput
    _max?: VerificationTokenMaxOrderByAggregateInput
    _min?: VerificationTokenMinOrderByAggregateInput
  }

  export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    OR?: VerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    identifier?: StringWithAggregatesFilter<"VerificationToken"> | string
    token?: StringWithAggregatesFilter<"VerificationToken"> | string
    expires?: DateTimeWithAggregatesFilter<"VerificationToken"> | Date | string
  }

  export type PropertyWhereInput = {
    AND?: PropertyWhereInput | PropertyWhereInput[]
    OR?: PropertyWhereInput[]
    NOT?: PropertyWhereInput | PropertyWhereInput[]
    id?: IntFilter<"Property"> | number
    name?: StringFilter<"Property"> | string
    description?: StringFilter<"Property"> | string
    pricePerMonth?: FloatFilter<"Property"> | number
    securityDeposit?: FloatFilter<"Property"> | number
    applicationFee?: FloatFilter<"Property"> | number
    photoUrls?: StringNullableListFilter<"Property">
    amenities?: EnumAmenityNullableListFilter<"Property">
    highlights?: EnumHighlightNullableListFilter<"Property">
    isPetsAllowed?: BoolFilter<"Property"> | boolean
    isParkingIncluded?: BoolFilter<"Property"> | boolean
    beds?: IntFilter<"Property"> | number
    baths?: FloatFilter<"Property"> | number
    squareFeet?: IntFilter<"Property"> | number
    propertyType?: EnumPropertyTypeFilter<"Property"> | $Enums.PropertyType
    postedDate?: DateTimeFilter<"Property"> | Date | string
    averageRating?: FloatNullableFilter<"Property"> | number | null
    numberOfReviews?: IntNullableFilter<"Property"> | number | null
    locationId?: IntFilter<"Property"> | number
    managerNextAuthId?: StringFilter<"Property"> | string
    applications?: ApplicationListRelationFilter
    leases?: LeaseListRelationFilter
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
    manager?: XOR<ManagerScalarRelationFilter, ManagerWhereInput>
    favoritedBy?: TenantListRelationFilter
    tenants?: TenantListRelationFilter
  }

  export type PropertyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    pricePerMonth?: SortOrder
    securityDeposit?: SortOrder
    applicationFee?: SortOrder
    photoUrls?: SortOrder
    amenities?: SortOrder
    highlights?: SortOrder
    isPetsAllowed?: SortOrder
    isParkingIncluded?: SortOrder
    beds?: SortOrder
    baths?: SortOrder
    squareFeet?: SortOrder
    propertyType?: SortOrder
    postedDate?: SortOrder
    averageRating?: SortOrderInput | SortOrder
    numberOfReviews?: SortOrderInput | SortOrder
    locationId?: SortOrder
    managerNextAuthId?: SortOrder
    applications?: ApplicationOrderByRelationAggregateInput
    leases?: LeaseOrderByRelationAggregateInput
    location?: LocationOrderByWithRelationInput
    manager?: ManagerOrderByWithRelationInput
    favoritedBy?: TenantOrderByRelationAggregateInput
    tenants?: TenantOrderByRelationAggregateInput
  }

  export type PropertyWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PropertyWhereInput | PropertyWhereInput[]
    OR?: PropertyWhereInput[]
    NOT?: PropertyWhereInput | PropertyWhereInput[]
    name?: StringFilter<"Property"> | string
    description?: StringFilter<"Property"> | string
    pricePerMonth?: FloatFilter<"Property"> | number
    securityDeposit?: FloatFilter<"Property"> | number
    applicationFee?: FloatFilter<"Property"> | number
    photoUrls?: StringNullableListFilter<"Property">
    amenities?: EnumAmenityNullableListFilter<"Property">
    highlights?: EnumHighlightNullableListFilter<"Property">
    isPetsAllowed?: BoolFilter<"Property"> | boolean
    isParkingIncluded?: BoolFilter<"Property"> | boolean
    beds?: IntFilter<"Property"> | number
    baths?: FloatFilter<"Property"> | number
    squareFeet?: IntFilter<"Property"> | number
    propertyType?: EnumPropertyTypeFilter<"Property"> | $Enums.PropertyType
    postedDate?: DateTimeFilter<"Property"> | Date | string
    averageRating?: FloatNullableFilter<"Property"> | number | null
    numberOfReviews?: IntNullableFilter<"Property"> | number | null
    locationId?: IntFilter<"Property"> | number
    managerNextAuthId?: StringFilter<"Property"> | string
    applications?: ApplicationListRelationFilter
    leases?: LeaseListRelationFilter
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
    manager?: XOR<ManagerScalarRelationFilter, ManagerWhereInput>
    favoritedBy?: TenantListRelationFilter
    tenants?: TenantListRelationFilter
  }, "id">

  export type PropertyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    pricePerMonth?: SortOrder
    securityDeposit?: SortOrder
    applicationFee?: SortOrder
    photoUrls?: SortOrder
    amenities?: SortOrder
    highlights?: SortOrder
    isPetsAllowed?: SortOrder
    isParkingIncluded?: SortOrder
    beds?: SortOrder
    baths?: SortOrder
    squareFeet?: SortOrder
    propertyType?: SortOrder
    postedDate?: SortOrder
    averageRating?: SortOrderInput | SortOrder
    numberOfReviews?: SortOrderInput | SortOrder
    locationId?: SortOrder
    managerNextAuthId?: SortOrder
    _count?: PropertyCountOrderByAggregateInput
    _avg?: PropertyAvgOrderByAggregateInput
    _max?: PropertyMaxOrderByAggregateInput
    _min?: PropertyMinOrderByAggregateInput
    _sum?: PropertySumOrderByAggregateInput
  }

  export type PropertyScalarWhereWithAggregatesInput = {
    AND?: PropertyScalarWhereWithAggregatesInput | PropertyScalarWhereWithAggregatesInput[]
    OR?: PropertyScalarWhereWithAggregatesInput[]
    NOT?: PropertyScalarWhereWithAggregatesInput | PropertyScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Property"> | number
    name?: StringWithAggregatesFilter<"Property"> | string
    description?: StringWithAggregatesFilter<"Property"> | string
    pricePerMonth?: FloatWithAggregatesFilter<"Property"> | number
    securityDeposit?: FloatWithAggregatesFilter<"Property"> | number
    applicationFee?: FloatWithAggregatesFilter<"Property"> | number
    photoUrls?: StringNullableListFilter<"Property">
    amenities?: EnumAmenityNullableListFilter<"Property">
    highlights?: EnumHighlightNullableListFilter<"Property">
    isPetsAllowed?: BoolWithAggregatesFilter<"Property"> | boolean
    isParkingIncluded?: BoolWithAggregatesFilter<"Property"> | boolean
    beds?: IntWithAggregatesFilter<"Property"> | number
    baths?: FloatWithAggregatesFilter<"Property"> | number
    squareFeet?: IntWithAggregatesFilter<"Property"> | number
    propertyType?: EnumPropertyTypeWithAggregatesFilter<"Property"> | $Enums.PropertyType
    postedDate?: DateTimeWithAggregatesFilter<"Property"> | Date | string
    averageRating?: FloatNullableWithAggregatesFilter<"Property"> | number | null
    numberOfReviews?: IntNullableWithAggregatesFilter<"Property"> | number | null
    locationId?: IntWithAggregatesFilter<"Property"> | number
    managerNextAuthId?: StringWithAggregatesFilter<"Property"> | string
  }

  export type ManagerWhereInput = {
    AND?: ManagerWhereInput | ManagerWhereInput[]
    OR?: ManagerWhereInput[]
    NOT?: ManagerWhereInput | ManagerWhereInput[]
    id?: IntFilter<"Manager"> | number
    name?: StringFilter<"Manager"> | string
    email?: StringFilter<"Manager"> | string
    phoneNumber?: StringFilter<"Manager"> | string
    nextAuthId?: StringFilter<"Manager"> | string
    managedProperties?: PropertyListRelationFilter
  }

  export type ManagerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    nextAuthId?: SortOrder
    managedProperties?: PropertyOrderByRelationAggregateInput
  }

  export type ManagerWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    nextAuthId?: string
    AND?: ManagerWhereInput | ManagerWhereInput[]
    OR?: ManagerWhereInput[]
    NOT?: ManagerWhereInput | ManagerWhereInput[]
    name?: StringFilter<"Manager"> | string
    email?: StringFilter<"Manager"> | string
    phoneNumber?: StringFilter<"Manager"> | string
    managedProperties?: PropertyListRelationFilter
  }, "id" | "nextAuthId">

  export type ManagerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    nextAuthId?: SortOrder
    _count?: ManagerCountOrderByAggregateInput
    _avg?: ManagerAvgOrderByAggregateInput
    _max?: ManagerMaxOrderByAggregateInput
    _min?: ManagerMinOrderByAggregateInput
    _sum?: ManagerSumOrderByAggregateInput
  }

  export type ManagerScalarWhereWithAggregatesInput = {
    AND?: ManagerScalarWhereWithAggregatesInput | ManagerScalarWhereWithAggregatesInput[]
    OR?: ManagerScalarWhereWithAggregatesInput[]
    NOT?: ManagerScalarWhereWithAggregatesInput | ManagerScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Manager"> | number
    name?: StringWithAggregatesFilter<"Manager"> | string
    email?: StringWithAggregatesFilter<"Manager"> | string
    phoneNumber?: StringWithAggregatesFilter<"Manager"> | string
    nextAuthId?: StringWithAggregatesFilter<"Manager"> | string
  }

  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: IntFilter<"Tenant"> | number
    name?: StringFilter<"Tenant"> | string
    email?: StringFilter<"Tenant"> | string
    phoneNumber?: StringFilter<"Tenant"> | string
    nextAuthId?: StringFilter<"Tenant"> | string
    applications?: ApplicationListRelationFilter
    leases?: LeaseListRelationFilter
    favorites?: PropertyListRelationFilter
    properties?: PropertyListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    nextAuthId?: SortOrder
    applications?: ApplicationOrderByRelationAggregateInput
    leases?: LeaseOrderByRelationAggregateInput
    favorites?: PropertyOrderByRelationAggregateInput
    properties?: PropertyOrderByRelationAggregateInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    nextAuthId?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    name?: StringFilter<"Tenant"> | string
    email?: StringFilter<"Tenant"> | string
    phoneNumber?: StringFilter<"Tenant"> | string
    applications?: ApplicationListRelationFilter
    leases?: LeaseListRelationFilter
    favorites?: PropertyListRelationFilter
    properties?: PropertyListRelationFilter
  }, "id" | "nextAuthId">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    nextAuthId?: SortOrder
    _count?: TenantCountOrderByAggregateInput
    _avg?: TenantAvgOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
    _sum?: TenantSumOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Tenant"> | number
    name?: StringWithAggregatesFilter<"Tenant"> | string
    email?: StringWithAggregatesFilter<"Tenant"> | string
    phoneNumber?: StringWithAggregatesFilter<"Tenant"> | string
    nextAuthId?: StringWithAggregatesFilter<"Tenant"> | string
  }

  export type LocationWhereInput = {
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    id?: IntFilter<"Location"> | number
    address?: StringFilter<"Location"> | string
    city?: StringFilter<"Location"> | string
    state?: StringFilter<"Location"> | string
    country?: StringFilter<"Location"> | string
    postalCode?: StringFilter<"Location"> | string
    properties?: PropertyListRelationFilter
  }

  export type LocationOrderByWithRelationInput = {
    id?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
    properties?: PropertyOrderByRelationAggregateInput
  }

  export type LocationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    address?: StringFilter<"Location"> | string
    city?: StringFilter<"Location"> | string
    state?: StringFilter<"Location"> | string
    country?: StringFilter<"Location"> | string
    postalCode?: StringFilter<"Location"> | string
    properties?: PropertyListRelationFilter
  }, "id">

  export type LocationOrderByWithAggregationInput = {
    id?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
    _count?: LocationCountOrderByAggregateInput
    _avg?: LocationAvgOrderByAggregateInput
    _max?: LocationMaxOrderByAggregateInput
    _min?: LocationMinOrderByAggregateInput
    _sum?: LocationSumOrderByAggregateInput
  }

  export type LocationScalarWhereWithAggregatesInput = {
    AND?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    OR?: LocationScalarWhereWithAggregatesInput[]
    NOT?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Location"> | number
    address?: StringWithAggregatesFilter<"Location"> | string
    city?: StringWithAggregatesFilter<"Location"> | string
    state?: StringWithAggregatesFilter<"Location"> | string
    country?: StringWithAggregatesFilter<"Location"> | string
    postalCode?: StringWithAggregatesFilter<"Location"> | string
  }

  export type ApplicationWhereInput = {
    AND?: ApplicationWhereInput | ApplicationWhereInput[]
    OR?: ApplicationWhereInput[]
    NOT?: ApplicationWhereInput | ApplicationWhereInput[]
    id?: IntFilter<"Application"> | number
    applicationDate?: DateTimeFilter<"Application"> | Date | string
    status?: EnumApplicationStatusFilter<"Application"> | $Enums.ApplicationStatus
    propertyId?: IntFilter<"Application"> | number
    name?: StringFilter<"Application"> | string
    email?: StringFilter<"Application"> | string
    phoneNumber?: StringFilter<"Application"> | string
    message?: StringNullableFilter<"Application"> | string | null
    leaseId?: IntNullableFilter<"Application"> | number | null
    tenantNextAuthId?: StringFilter<"Application"> | string
    lease?: XOR<LeaseNullableScalarRelationFilter, LeaseWhereInput> | null
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type ApplicationOrderByWithRelationInput = {
    id?: SortOrder
    applicationDate?: SortOrder
    status?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    message?: SortOrderInput | SortOrder
    leaseId?: SortOrderInput | SortOrder
    tenantNextAuthId?: SortOrder
    lease?: LeaseOrderByWithRelationInput
    property?: PropertyOrderByWithRelationInput
    tenant?: TenantOrderByWithRelationInput
  }

  export type ApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    leaseId?: number
    AND?: ApplicationWhereInput | ApplicationWhereInput[]
    OR?: ApplicationWhereInput[]
    NOT?: ApplicationWhereInput | ApplicationWhereInput[]
    applicationDate?: DateTimeFilter<"Application"> | Date | string
    status?: EnumApplicationStatusFilter<"Application"> | $Enums.ApplicationStatus
    propertyId?: IntFilter<"Application"> | number
    name?: StringFilter<"Application"> | string
    email?: StringFilter<"Application"> | string
    phoneNumber?: StringFilter<"Application"> | string
    message?: StringNullableFilter<"Application"> | string | null
    tenantNextAuthId?: StringFilter<"Application"> | string
    lease?: XOR<LeaseNullableScalarRelationFilter, LeaseWhereInput> | null
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "leaseId">

  export type ApplicationOrderByWithAggregationInput = {
    id?: SortOrder
    applicationDate?: SortOrder
    status?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    message?: SortOrderInput | SortOrder
    leaseId?: SortOrderInput | SortOrder
    tenantNextAuthId?: SortOrder
    _count?: ApplicationCountOrderByAggregateInput
    _avg?: ApplicationAvgOrderByAggregateInput
    _max?: ApplicationMaxOrderByAggregateInput
    _min?: ApplicationMinOrderByAggregateInput
    _sum?: ApplicationSumOrderByAggregateInput
  }

  export type ApplicationScalarWhereWithAggregatesInput = {
    AND?: ApplicationScalarWhereWithAggregatesInput | ApplicationScalarWhereWithAggregatesInput[]
    OR?: ApplicationScalarWhereWithAggregatesInput[]
    NOT?: ApplicationScalarWhereWithAggregatesInput | ApplicationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Application"> | number
    applicationDate?: DateTimeWithAggregatesFilter<"Application"> | Date | string
    status?: EnumApplicationStatusWithAggregatesFilter<"Application"> | $Enums.ApplicationStatus
    propertyId?: IntWithAggregatesFilter<"Application"> | number
    name?: StringWithAggregatesFilter<"Application"> | string
    email?: StringWithAggregatesFilter<"Application"> | string
    phoneNumber?: StringWithAggregatesFilter<"Application"> | string
    message?: StringNullableWithAggregatesFilter<"Application"> | string | null
    leaseId?: IntNullableWithAggregatesFilter<"Application"> | number | null
    tenantNextAuthId?: StringWithAggregatesFilter<"Application"> | string
  }

  export type LeaseWhereInput = {
    AND?: LeaseWhereInput | LeaseWhereInput[]
    OR?: LeaseWhereInput[]
    NOT?: LeaseWhereInput | LeaseWhereInput[]
    id?: IntFilter<"Lease"> | number
    startDate?: DateTimeFilter<"Lease"> | Date | string
    endDate?: DateTimeFilter<"Lease"> | Date | string
    rent?: FloatFilter<"Lease"> | number
    deposit?: FloatFilter<"Lease"> | number
    propertyId?: IntFilter<"Lease"> | number
    tenantNextAuthId?: StringFilter<"Lease"> | string
    application?: XOR<ApplicationNullableScalarRelationFilter, ApplicationWhereInput> | null
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    payments?: PaymentListRelationFilter
  }

  export type LeaseOrderByWithRelationInput = {
    id?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    rent?: SortOrder
    deposit?: SortOrder
    propertyId?: SortOrder
    tenantNextAuthId?: SortOrder
    application?: ApplicationOrderByWithRelationInput
    property?: PropertyOrderByWithRelationInput
    tenant?: TenantOrderByWithRelationInput
    payments?: PaymentOrderByRelationAggregateInput
  }

  export type LeaseWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: LeaseWhereInput | LeaseWhereInput[]
    OR?: LeaseWhereInput[]
    NOT?: LeaseWhereInput | LeaseWhereInput[]
    startDate?: DateTimeFilter<"Lease"> | Date | string
    endDate?: DateTimeFilter<"Lease"> | Date | string
    rent?: FloatFilter<"Lease"> | number
    deposit?: FloatFilter<"Lease"> | number
    propertyId?: IntFilter<"Lease"> | number
    tenantNextAuthId?: StringFilter<"Lease"> | string
    application?: XOR<ApplicationNullableScalarRelationFilter, ApplicationWhereInput> | null
    property?: XOR<PropertyScalarRelationFilter, PropertyWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    payments?: PaymentListRelationFilter
  }, "id">

  export type LeaseOrderByWithAggregationInput = {
    id?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    rent?: SortOrder
    deposit?: SortOrder
    propertyId?: SortOrder
    tenantNextAuthId?: SortOrder
    _count?: LeaseCountOrderByAggregateInput
    _avg?: LeaseAvgOrderByAggregateInput
    _max?: LeaseMaxOrderByAggregateInput
    _min?: LeaseMinOrderByAggregateInput
    _sum?: LeaseSumOrderByAggregateInput
  }

  export type LeaseScalarWhereWithAggregatesInput = {
    AND?: LeaseScalarWhereWithAggregatesInput | LeaseScalarWhereWithAggregatesInput[]
    OR?: LeaseScalarWhereWithAggregatesInput[]
    NOT?: LeaseScalarWhereWithAggregatesInput | LeaseScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Lease"> | number
    startDate?: DateTimeWithAggregatesFilter<"Lease"> | Date | string
    endDate?: DateTimeWithAggregatesFilter<"Lease"> | Date | string
    rent?: FloatWithAggregatesFilter<"Lease"> | number
    deposit?: FloatWithAggregatesFilter<"Lease"> | number
    propertyId?: IntWithAggregatesFilter<"Lease"> | number
    tenantNextAuthId?: StringWithAggregatesFilter<"Lease"> | string
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: IntFilter<"Payment"> | number
    amountDue?: FloatFilter<"Payment"> | number
    amountPaid?: FloatFilter<"Payment"> | number
    dueDate?: DateTimeFilter<"Payment"> | Date | string
    paymentDate?: DateTimeFilter<"Payment"> | Date | string
    paymentStatus?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    leaseId?: IntFilter<"Payment"> | number
    lease?: XOR<LeaseScalarRelationFilter, LeaseWhereInput>
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    amountDue?: SortOrder
    amountPaid?: SortOrder
    dueDate?: SortOrder
    paymentDate?: SortOrder
    paymentStatus?: SortOrder
    leaseId?: SortOrder
    lease?: LeaseOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    amountDue?: FloatFilter<"Payment"> | number
    amountPaid?: FloatFilter<"Payment"> | number
    dueDate?: DateTimeFilter<"Payment"> | Date | string
    paymentDate?: DateTimeFilter<"Payment"> | Date | string
    paymentStatus?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    leaseId?: IntFilter<"Payment"> | number
    lease?: XOR<LeaseScalarRelationFilter, LeaseWhereInput>
  }, "id">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    amountDue?: SortOrder
    amountPaid?: SortOrder
    dueDate?: SortOrder
    paymentDate?: SortOrder
    paymentStatus?: SortOrder
    leaseId?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Payment"> | number
    amountDue?: FloatWithAggregatesFilter<"Payment"> | number
    amountPaid?: FloatWithAggregatesFilter<"Payment"> | number
    dueDate?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    paymentDate?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    paymentStatus?: EnumPaymentStatusWithAggregatesFilter<"Payment"> | $Enums.PaymentStatus
    leaseId?: IntWithAggregatesFilter<"Payment"> | number
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    prefix?: string | null
    firstName?: string | null
    lastName?: string | null
    suffix?: string | null
    password?: string | null
    username?: string | null
    defaultPrivacyLevel?: string | null
    stateOfResidence?: string | null
    cityOfResidence?: string | null
    zipCode?: string | null
    howDidYouHearAboutUs?: string | null
    forumUrl?: string | null
    youtubeUrl?: string | null
    referredByUsername?: string | null
    flyerPromoCode?: string | null
    otherHeardAboutText?: string | null
    termsAndPolicyAccepted?: boolean
    dataInterests?: UserCreatedataInterestsInput | string[]
    otherInterestText?: string | null
    rankedMotivations?: UserCreaterankedMotivationsInput | string[]
    rankedGovernments?: UserCreaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserCreaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: string | null
    agreementAccepted?: boolean
    onboardingComplete?: boolean
    otp?: string | null
    otpExpires?: Date | string | null
    nextAuthId?: string | null
    phoneNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    prefix?: string | null
    firstName?: string | null
    lastName?: string | null
    suffix?: string | null
    password?: string | null
    username?: string | null
    defaultPrivacyLevel?: string | null
    stateOfResidence?: string | null
    cityOfResidence?: string | null
    zipCode?: string | null
    howDidYouHearAboutUs?: string | null
    forumUrl?: string | null
    youtubeUrl?: string | null
    referredByUsername?: string | null
    flyerPromoCode?: string | null
    otherHeardAboutText?: string | null
    termsAndPolicyAccepted?: boolean
    dataInterests?: UserCreatedataInterestsInput | string[]
    otherInterestText?: string | null
    rankedMotivations?: UserCreaterankedMotivationsInput | string[]
    rankedGovernments?: UserCreaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserCreaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: string | null
    agreementAccepted?: boolean
    onboardingComplete?: boolean
    otp?: string | null
    otpExpires?: Date | string | null
    nextAuthId?: string | null
    phoneNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    prefix?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    defaultPrivacyLevel?: NullableStringFieldUpdateOperationsInput | string | null
    stateOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    cityOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    howDidYouHearAboutUs?: NullableStringFieldUpdateOperationsInput | string | null
    forumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referredByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    flyerPromoCode?: NullableStringFieldUpdateOperationsInput | string | null
    otherHeardAboutText?: NullableStringFieldUpdateOperationsInput | string | null
    termsAndPolicyAccepted?: BoolFieldUpdateOperationsInput | boolean
    dataInterests?: UserUpdatedataInterestsInput | string[]
    otherInterestText?: NullableStringFieldUpdateOperationsInput | string | null
    rankedMotivations?: UserUpdaterankedMotivationsInput | string[]
    rankedGovernments?: UserUpdaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserUpdaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: NullableStringFieldUpdateOperationsInput | string | null
    agreementAccepted?: BoolFieldUpdateOperationsInput | boolean
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    otp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    prefix?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    defaultPrivacyLevel?: NullableStringFieldUpdateOperationsInput | string | null
    stateOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    cityOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    howDidYouHearAboutUs?: NullableStringFieldUpdateOperationsInput | string | null
    forumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referredByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    flyerPromoCode?: NullableStringFieldUpdateOperationsInput | string | null
    otherHeardAboutText?: NullableStringFieldUpdateOperationsInput | string | null
    termsAndPolicyAccepted?: BoolFieldUpdateOperationsInput | boolean
    dataInterests?: UserUpdatedataInterestsInput | string[]
    otherInterestText?: NullableStringFieldUpdateOperationsInput | string | null
    rankedMotivations?: UserUpdaterankedMotivationsInput | string[]
    rankedGovernments?: UserUpdaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserUpdaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: NullableStringFieldUpdateOperationsInput | string | null
    agreementAccepted?: BoolFieldUpdateOperationsInput | boolean
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    otp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    prefix?: string | null
    firstName?: string | null
    lastName?: string | null
    suffix?: string | null
    password?: string | null
    username?: string | null
    defaultPrivacyLevel?: string | null
    stateOfResidence?: string | null
    cityOfResidence?: string | null
    zipCode?: string | null
    howDidYouHearAboutUs?: string | null
    forumUrl?: string | null
    youtubeUrl?: string | null
    referredByUsername?: string | null
    flyerPromoCode?: string | null
    otherHeardAboutText?: string | null
    termsAndPolicyAccepted?: boolean
    dataInterests?: UserCreatedataInterestsInput | string[]
    otherInterestText?: string | null
    rankedMotivations?: UserCreaterankedMotivationsInput | string[]
    rankedGovernments?: UserCreaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserCreaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: string | null
    agreementAccepted?: boolean
    onboardingComplete?: boolean
    otp?: string | null
    otpExpires?: Date | string | null
    nextAuthId?: string | null
    phoneNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    prefix?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    defaultPrivacyLevel?: NullableStringFieldUpdateOperationsInput | string | null
    stateOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    cityOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    howDidYouHearAboutUs?: NullableStringFieldUpdateOperationsInput | string | null
    forumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referredByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    flyerPromoCode?: NullableStringFieldUpdateOperationsInput | string | null
    otherHeardAboutText?: NullableStringFieldUpdateOperationsInput | string | null
    termsAndPolicyAccepted?: BoolFieldUpdateOperationsInput | boolean
    dataInterests?: UserUpdatedataInterestsInput | string[]
    otherInterestText?: NullableStringFieldUpdateOperationsInput | string | null
    rankedMotivations?: UserUpdaterankedMotivationsInput | string[]
    rankedGovernments?: UserUpdaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserUpdaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: NullableStringFieldUpdateOperationsInput | string | null
    agreementAccepted?: BoolFieldUpdateOperationsInput | boolean
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    otp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    prefix?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    defaultPrivacyLevel?: NullableStringFieldUpdateOperationsInput | string | null
    stateOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    cityOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    howDidYouHearAboutUs?: NullableStringFieldUpdateOperationsInput | string | null
    forumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referredByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    flyerPromoCode?: NullableStringFieldUpdateOperationsInput | string | null
    otherHeardAboutText?: NullableStringFieldUpdateOperationsInput | string | null
    termsAndPolicyAccepted?: BoolFieldUpdateOperationsInput | boolean
    dataInterests?: UserUpdatedataInterestsInput | string[]
    otherInterestText?: NullableStringFieldUpdateOperationsInput | string | null
    rankedMotivations?: UserUpdaterankedMotivationsInput | string[]
    rankedGovernments?: UserUpdaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserUpdaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: NullableStringFieldUpdateOperationsInput | string | null
    agreementAccepted?: BoolFieldUpdateOperationsInput | boolean
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    otp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUncheckedCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateManyInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PropertyCreateInput = {
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    applications?: ApplicationCreateNestedManyWithoutPropertyInput
    leases?: LeaseCreateNestedManyWithoutPropertyInput
    location: LocationCreateNestedOneWithoutPropertiesInput
    manager: ManagerCreateNestedOneWithoutManagedPropertiesInput
    favoritedBy?: TenantCreateNestedManyWithoutFavoritesInput
    tenants?: TenantCreateNestedManyWithoutPropertiesInput
  }

  export type PropertyUncheckedCreateInput = {
    id?: number
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    locationId: number
    managerNextAuthId: string
    applications?: ApplicationUncheckedCreateNestedManyWithoutPropertyInput
    leases?: LeaseUncheckedCreateNestedManyWithoutPropertyInput
    favoritedBy?: TenantUncheckedCreateNestedManyWithoutFavoritesInput
    tenants?: TenantUncheckedCreateNestedManyWithoutPropertiesInput
  }

  export type PropertyUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    applications?: ApplicationUpdateManyWithoutPropertyNestedInput
    leases?: LeaseUpdateManyWithoutPropertyNestedInput
    location?: LocationUpdateOneRequiredWithoutPropertiesNestedInput
    manager?: ManagerUpdateOneRequiredWithoutManagedPropertiesNestedInput
    favoritedBy?: TenantUpdateManyWithoutFavoritesNestedInput
    tenants?: TenantUpdateManyWithoutPropertiesNestedInput
  }

  export type PropertyUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    managerNextAuthId?: StringFieldUpdateOperationsInput | string
    applications?: ApplicationUncheckedUpdateManyWithoutPropertyNestedInput
    leases?: LeaseUncheckedUpdateManyWithoutPropertyNestedInput
    favoritedBy?: TenantUncheckedUpdateManyWithoutFavoritesNestedInput
    tenants?: TenantUncheckedUpdateManyWithoutPropertiesNestedInput
  }

  export type PropertyCreateManyInput = {
    id?: number
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    locationId: number
    managerNextAuthId: string
  }

  export type PropertyUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type PropertyUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    managerNextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type ManagerCreateInput = {
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
    managedProperties?: PropertyCreateNestedManyWithoutManagerInput
  }

  export type ManagerUncheckedCreateInput = {
    id?: number
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
    managedProperties?: PropertyUncheckedCreateNestedManyWithoutManagerInput
  }

  export type ManagerUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
    managedProperties?: PropertyUpdateManyWithoutManagerNestedInput
  }

  export type ManagerUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
    managedProperties?: PropertyUncheckedUpdateManyWithoutManagerNestedInput
  }

  export type ManagerCreateManyInput = {
    id?: number
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
  }

  export type ManagerUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type ManagerUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type TenantCreateInput = {
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
    applications?: ApplicationCreateNestedManyWithoutTenantInput
    leases?: LeaseCreateNestedManyWithoutTenantInput
    favorites?: PropertyCreateNestedManyWithoutFavoritedByInput
    properties?: PropertyCreateNestedManyWithoutTenantsInput
  }

  export type TenantUncheckedCreateInput = {
    id?: number
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
    applications?: ApplicationUncheckedCreateNestedManyWithoutTenantInput
    leases?: LeaseUncheckedCreateNestedManyWithoutTenantInput
    favorites?: PropertyUncheckedCreateNestedManyWithoutFavoritedByInput
    properties?: PropertyUncheckedCreateNestedManyWithoutTenantsInput
  }

  export type TenantUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
    applications?: ApplicationUpdateManyWithoutTenantNestedInput
    leases?: LeaseUpdateManyWithoutTenantNestedInput
    favorites?: PropertyUpdateManyWithoutFavoritedByNestedInput
    properties?: PropertyUpdateManyWithoutTenantsNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
    applications?: ApplicationUncheckedUpdateManyWithoutTenantNestedInput
    leases?: LeaseUncheckedUpdateManyWithoutTenantNestedInput
    favorites?: PropertyUncheckedUpdateManyWithoutFavoritedByNestedInput
    properties?: PropertyUncheckedUpdateManyWithoutTenantsNestedInput
  }

  export type TenantCreateManyInput = {
    id?: number
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
  }

  export type TenantUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type LocationUpdateInput = {
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    properties?: PropertyUpdateManyWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    properties?: PropertyUncheckedUpdateManyWithoutLocationNestedInput
  }

  export type LocationUpdateManyMutationInput = {
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
  }

  export type LocationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
  }

  export type ApplicationCreateInput = {
    applicationDate: Date | string
    status: $Enums.ApplicationStatus
    name: string
    email: string
    phoneNumber: string
    message?: string | null
    lease?: LeaseCreateNestedOneWithoutApplicationInput
    property: PropertyCreateNestedOneWithoutApplicationsInput
    tenant: TenantCreateNestedOneWithoutApplicationsInput
  }

  export type ApplicationUncheckedCreateInput = {
    id?: number
    applicationDate: Date | string
    status: $Enums.ApplicationStatus
    propertyId: number
    name: string
    email: string
    phoneNumber: string
    message?: string | null
    leaseId?: number | null
    tenantNextAuthId: string
  }

  export type ApplicationUpdateInput = {
    applicationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    lease?: LeaseUpdateOneWithoutApplicationNestedInput
    property?: PropertyUpdateOneRequiredWithoutApplicationsNestedInput
    tenant?: TenantUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type ApplicationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    applicationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    propertyId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    leaseId?: NullableIntFieldUpdateOperationsInput | number | null
    tenantNextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type ApplicationCreateManyInput = {
    id?: number
    applicationDate: Date | string
    status: $Enums.ApplicationStatus
    propertyId: number
    name: string
    email: string
    phoneNumber: string
    message?: string | null
    leaseId?: number | null
    tenantNextAuthId: string
  }

  export type ApplicationUpdateManyMutationInput = {
    applicationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ApplicationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    applicationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    propertyId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    leaseId?: NullableIntFieldUpdateOperationsInput | number | null
    tenantNextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type LeaseCreateInput = {
    startDate: Date | string
    endDate: Date | string
    rent: number
    deposit: number
    application?: ApplicationCreateNestedOneWithoutLeaseInput
    property: PropertyCreateNestedOneWithoutLeasesInput
    tenant: TenantCreateNestedOneWithoutLeasesInput
    payments?: PaymentCreateNestedManyWithoutLeaseInput
  }

  export type LeaseUncheckedCreateInput = {
    id?: number
    startDate: Date | string
    endDate: Date | string
    rent: number
    deposit: number
    propertyId: number
    tenantNextAuthId: string
    application?: ApplicationUncheckedCreateNestedOneWithoutLeaseInput
    payments?: PaymentUncheckedCreateNestedManyWithoutLeaseInput
  }

  export type LeaseUpdateInput = {
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    rent?: FloatFieldUpdateOperationsInput | number
    deposit?: FloatFieldUpdateOperationsInput | number
    application?: ApplicationUpdateOneWithoutLeaseNestedInput
    property?: PropertyUpdateOneRequiredWithoutLeasesNestedInput
    tenant?: TenantUpdateOneRequiredWithoutLeasesNestedInput
    payments?: PaymentUpdateManyWithoutLeaseNestedInput
  }

  export type LeaseUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    rent?: FloatFieldUpdateOperationsInput | number
    deposit?: FloatFieldUpdateOperationsInput | number
    propertyId?: IntFieldUpdateOperationsInput | number
    tenantNextAuthId?: StringFieldUpdateOperationsInput | string
    application?: ApplicationUncheckedUpdateOneWithoutLeaseNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutLeaseNestedInput
  }

  export type LeaseCreateManyInput = {
    id?: number
    startDate: Date | string
    endDate: Date | string
    rent: number
    deposit: number
    propertyId: number
    tenantNextAuthId: string
  }

  export type LeaseUpdateManyMutationInput = {
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    rent?: FloatFieldUpdateOperationsInput | number
    deposit?: FloatFieldUpdateOperationsInput | number
  }

  export type LeaseUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    rent?: FloatFieldUpdateOperationsInput | number
    deposit?: FloatFieldUpdateOperationsInput | number
    propertyId?: IntFieldUpdateOperationsInput | number
    tenantNextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type PaymentCreateInput = {
    amountDue: number
    amountPaid: number
    dueDate: Date | string
    paymentDate: Date | string
    paymentStatus: $Enums.PaymentStatus
    lease: LeaseCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: number
    amountDue: number
    amountPaid: number
    dueDate: Date | string
    paymentDate: Date | string
    paymentStatus: $Enums.PaymentStatus
    leaseId: number
  }

  export type PaymentUpdateInput = {
    amountDue?: FloatFieldUpdateOperationsInput | number
    amountPaid?: FloatFieldUpdateOperationsInput | number
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    lease?: LeaseUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    amountDue?: FloatFieldUpdateOperationsInput | number
    amountPaid?: FloatFieldUpdateOperationsInput | number
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    leaseId?: IntFieldUpdateOperationsInput | number
  }

  export type PaymentCreateManyInput = {
    id?: number
    amountDue: number
    amountPaid: number
    dueDate: Date | string
    paymentDate: Date | string
    paymentStatus: $Enums.PaymentStatus
    leaseId: number
  }

  export type PaymentUpdateManyMutationInput = {
    amountDue?: FloatFieldUpdateOperationsInput | number
    amountPaid?: FloatFieldUpdateOperationsInput | number
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    amountDue?: FloatFieldUpdateOperationsInput | number
    amountPaid?: FloatFieldUpdateOperationsInput | number
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    leaseId?: IntFieldUpdateOperationsInput | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    prefix?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    suffix?: SortOrder
    password?: SortOrder
    username?: SortOrder
    defaultPrivacyLevel?: SortOrder
    stateOfResidence?: SortOrder
    cityOfResidence?: SortOrder
    zipCode?: SortOrder
    howDidYouHearAboutUs?: SortOrder
    forumUrl?: SortOrder
    youtubeUrl?: SortOrder
    referredByUsername?: SortOrder
    flyerPromoCode?: SortOrder
    otherHeardAboutText?: SortOrder
    termsAndPolicyAccepted?: SortOrder
    dataInterests?: SortOrder
    otherInterestText?: SortOrder
    rankedMotivations?: SortOrder
    rankedGovernments?: SortOrder
    rankedInformationSources?: SortOrder
    otherInformationSourceText?: SortOrder
    agreementAccepted?: SortOrder
    onboardingComplete?: SortOrder
    otp?: SortOrder
    otpExpires?: SortOrder
    nextAuthId?: SortOrder
    phoneNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    prefix?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    suffix?: SortOrder
    password?: SortOrder
    username?: SortOrder
    defaultPrivacyLevel?: SortOrder
    stateOfResidence?: SortOrder
    cityOfResidence?: SortOrder
    zipCode?: SortOrder
    howDidYouHearAboutUs?: SortOrder
    forumUrl?: SortOrder
    youtubeUrl?: SortOrder
    referredByUsername?: SortOrder
    flyerPromoCode?: SortOrder
    otherHeardAboutText?: SortOrder
    termsAndPolicyAccepted?: SortOrder
    otherInterestText?: SortOrder
    otherInformationSourceText?: SortOrder
    agreementAccepted?: SortOrder
    onboardingComplete?: SortOrder
    otp?: SortOrder
    otpExpires?: SortOrder
    nextAuthId?: SortOrder
    phoneNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    prefix?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    suffix?: SortOrder
    password?: SortOrder
    username?: SortOrder
    defaultPrivacyLevel?: SortOrder
    stateOfResidence?: SortOrder
    cityOfResidence?: SortOrder
    zipCode?: SortOrder
    howDidYouHearAboutUs?: SortOrder
    forumUrl?: SortOrder
    youtubeUrl?: SortOrder
    referredByUsername?: SortOrder
    flyerPromoCode?: SortOrder
    otherHeardAboutText?: SortOrder
    termsAndPolicyAccepted?: SortOrder
    otherInterestText?: SortOrder
    otherInformationSourceText?: SortOrder
    agreementAccepted?: SortOrder
    onboardingComplete?: SortOrder
    otp?: SortOrder
    otpExpires?: SortOrder
    nextAuthId?: SortOrder
    phoneNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string
    token: string
  }

  export type VerificationTokenCountOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMaxOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMinOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumAmenityNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.Amenity[] | ListEnumAmenityFieldRefInput<$PrismaModel> | null
    has?: $Enums.Amenity | EnumAmenityFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.Amenity[] | ListEnumAmenityFieldRefInput<$PrismaModel>
    hasSome?: $Enums.Amenity[] | ListEnumAmenityFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumHighlightNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.Highlight[] | ListEnumHighlightFieldRefInput<$PrismaModel> | null
    has?: $Enums.Highlight | EnumHighlightFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.Highlight[] | ListEnumHighlightFieldRefInput<$PrismaModel>
    hasSome?: $Enums.Highlight[] | ListEnumHighlightFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumPropertyTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyType | EnumPropertyTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPropertyTypeFilter<$PrismaModel> | $Enums.PropertyType
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type ApplicationListRelationFilter = {
    every?: ApplicationWhereInput
    some?: ApplicationWhereInput
    none?: ApplicationWhereInput
  }

  export type LeaseListRelationFilter = {
    every?: LeaseWhereInput
    some?: LeaseWhereInput
    none?: LeaseWhereInput
  }

  export type LocationScalarRelationFilter = {
    is?: LocationWhereInput
    isNot?: LocationWhereInput
  }

  export type ManagerScalarRelationFilter = {
    is?: ManagerWhereInput
    isNot?: ManagerWhereInput
  }

  export type TenantListRelationFilter = {
    every?: TenantWhereInput
    some?: TenantWhereInput
    none?: TenantWhereInput
  }

  export type ApplicationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LeaseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PropertyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    pricePerMonth?: SortOrder
    securityDeposit?: SortOrder
    applicationFee?: SortOrder
    photoUrls?: SortOrder
    amenities?: SortOrder
    highlights?: SortOrder
    isPetsAllowed?: SortOrder
    isParkingIncluded?: SortOrder
    beds?: SortOrder
    baths?: SortOrder
    squareFeet?: SortOrder
    propertyType?: SortOrder
    postedDate?: SortOrder
    averageRating?: SortOrder
    numberOfReviews?: SortOrder
    locationId?: SortOrder
    managerNextAuthId?: SortOrder
  }

  export type PropertyAvgOrderByAggregateInput = {
    id?: SortOrder
    pricePerMonth?: SortOrder
    securityDeposit?: SortOrder
    applicationFee?: SortOrder
    beds?: SortOrder
    baths?: SortOrder
    squareFeet?: SortOrder
    averageRating?: SortOrder
    numberOfReviews?: SortOrder
    locationId?: SortOrder
  }

  export type PropertyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    pricePerMonth?: SortOrder
    securityDeposit?: SortOrder
    applicationFee?: SortOrder
    isPetsAllowed?: SortOrder
    isParkingIncluded?: SortOrder
    beds?: SortOrder
    baths?: SortOrder
    squareFeet?: SortOrder
    propertyType?: SortOrder
    postedDate?: SortOrder
    averageRating?: SortOrder
    numberOfReviews?: SortOrder
    locationId?: SortOrder
    managerNextAuthId?: SortOrder
  }

  export type PropertyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    pricePerMonth?: SortOrder
    securityDeposit?: SortOrder
    applicationFee?: SortOrder
    isPetsAllowed?: SortOrder
    isParkingIncluded?: SortOrder
    beds?: SortOrder
    baths?: SortOrder
    squareFeet?: SortOrder
    propertyType?: SortOrder
    postedDate?: SortOrder
    averageRating?: SortOrder
    numberOfReviews?: SortOrder
    locationId?: SortOrder
    managerNextAuthId?: SortOrder
  }

  export type PropertySumOrderByAggregateInput = {
    id?: SortOrder
    pricePerMonth?: SortOrder
    securityDeposit?: SortOrder
    applicationFee?: SortOrder
    beds?: SortOrder
    baths?: SortOrder
    squareFeet?: SortOrder
    averageRating?: SortOrder
    numberOfReviews?: SortOrder
    locationId?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumPropertyTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyType | EnumPropertyTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPropertyTypeWithAggregatesFilter<$PrismaModel> | $Enums.PropertyType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPropertyTypeFilter<$PrismaModel>
    _max?: NestedEnumPropertyTypeFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type PropertyListRelationFilter = {
    every?: PropertyWhereInput
    some?: PropertyWhereInput
    none?: PropertyWhereInput
  }

  export type PropertyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ManagerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    nextAuthId?: SortOrder
  }

  export type ManagerAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ManagerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    nextAuthId?: SortOrder
  }

  export type ManagerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    nextAuthId?: SortOrder
  }

  export type ManagerSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    nextAuthId?: SortOrder
  }

  export type TenantAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    nextAuthId?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    nextAuthId?: SortOrder
  }

  export type TenantSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type LocationCountOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
  }

  export type LocationAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type LocationMaxOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
  }

  export type LocationMinOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
  }

  export type LocationSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumApplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusFilter<$PrismaModel> | $Enums.ApplicationStatus
  }

  export type LeaseNullableScalarRelationFilter = {
    is?: LeaseWhereInput | null
    isNot?: LeaseWhereInput | null
  }

  export type PropertyScalarRelationFilter = {
    is?: PropertyWhereInput
    isNot?: PropertyWhereInput
  }

  export type TenantScalarRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type ApplicationCountOrderByAggregateInput = {
    id?: SortOrder
    applicationDate?: SortOrder
    status?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    message?: SortOrder
    leaseId?: SortOrder
    tenantNextAuthId?: SortOrder
  }

  export type ApplicationAvgOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    leaseId?: SortOrder
  }

  export type ApplicationMaxOrderByAggregateInput = {
    id?: SortOrder
    applicationDate?: SortOrder
    status?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    message?: SortOrder
    leaseId?: SortOrder
    tenantNextAuthId?: SortOrder
  }

  export type ApplicationMinOrderByAggregateInput = {
    id?: SortOrder
    applicationDate?: SortOrder
    status?: SortOrder
    propertyId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phoneNumber?: SortOrder
    message?: SortOrder
    leaseId?: SortOrder
    tenantNextAuthId?: SortOrder
  }

  export type ApplicationSumOrderByAggregateInput = {
    id?: SortOrder
    propertyId?: SortOrder
    leaseId?: SortOrder
  }

  export type EnumApplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApplicationStatusFilter<$PrismaModel>
    _max?: NestedEnumApplicationStatusFilter<$PrismaModel>
  }

  export type ApplicationNullableScalarRelationFilter = {
    is?: ApplicationWhereInput | null
    isNot?: ApplicationWhereInput | null
  }

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput
    some?: PaymentWhereInput
    none?: PaymentWhereInput
  }

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LeaseCountOrderByAggregateInput = {
    id?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    rent?: SortOrder
    deposit?: SortOrder
    propertyId?: SortOrder
    tenantNextAuthId?: SortOrder
  }

  export type LeaseAvgOrderByAggregateInput = {
    id?: SortOrder
    rent?: SortOrder
    deposit?: SortOrder
    propertyId?: SortOrder
  }

  export type LeaseMaxOrderByAggregateInput = {
    id?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    rent?: SortOrder
    deposit?: SortOrder
    propertyId?: SortOrder
    tenantNextAuthId?: SortOrder
  }

  export type LeaseMinOrderByAggregateInput = {
    id?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    rent?: SortOrder
    deposit?: SortOrder
    propertyId?: SortOrder
    tenantNextAuthId?: SortOrder
  }

  export type LeaseSumOrderByAggregateInput = {
    id?: SortOrder
    rent?: SortOrder
    deposit?: SortOrder
    propertyId?: SortOrder
  }

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type LeaseScalarRelationFilter = {
    is?: LeaseWhereInput
    isNot?: LeaseWhereInput
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    amountDue?: SortOrder
    amountPaid?: SortOrder
    dueDate?: SortOrder
    paymentDate?: SortOrder
    paymentStatus?: SortOrder
    leaseId?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    id?: SortOrder
    amountDue?: SortOrder
    amountPaid?: SortOrder
    leaseId?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    amountDue?: SortOrder
    amountPaid?: SortOrder
    dueDate?: SortOrder
    paymentDate?: SortOrder
    paymentStatus?: SortOrder
    leaseId?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    amountDue?: SortOrder
    amountPaid?: SortOrder
    dueDate?: SortOrder
    paymentDate?: SortOrder
    paymentStatus?: SortOrder
    leaseId?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    id?: SortOrder
    amountDue?: SortOrder
    amountPaid?: SortOrder
    leaseId?: SortOrder
  }

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type UserCreatedataInterestsInput = {
    set: string[]
  }

  export type UserCreaterankedMotivationsInput = {
    set: string[]
  }

  export type UserCreaterankedGovernmentsInput = {
    set: string[]
  }

  export type UserCreaterankedInformationSourcesInput = {
    set: string[]
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdatedataInterestsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdaterankedMotivationsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdaterankedGovernmentsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdaterankedInformationSourcesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type PropertyCreatephotoUrlsInput = {
    set: string[]
  }

  export type PropertyCreateamenitiesInput = {
    set: $Enums.Amenity[]
  }

  export type PropertyCreatehighlightsInput = {
    set: $Enums.Highlight[]
  }

  export type ApplicationCreateNestedManyWithoutPropertyInput = {
    create?: XOR<ApplicationCreateWithoutPropertyInput, ApplicationUncheckedCreateWithoutPropertyInput> | ApplicationCreateWithoutPropertyInput[] | ApplicationUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutPropertyInput | ApplicationCreateOrConnectWithoutPropertyInput[]
    createMany?: ApplicationCreateManyPropertyInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type LeaseCreateNestedManyWithoutPropertyInput = {
    create?: XOR<LeaseCreateWithoutPropertyInput, LeaseUncheckedCreateWithoutPropertyInput> | LeaseCreateWithoutPropertyInput[] | LeaseUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: LeaseCreateOrConnectWithoutPropertyInput | LeaseCreateOrConnectWithoutPropertyInput[]
    createMany?: LeaseCreateManyPropertyInputEnvelope
    connect?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
  }

  export type LocationCreateNestedOneWithoutPropertiesInput = {
    connect?: LocationWhereUniqueInput
  }

  export type ManagerCreateNestedOneWithoutManagedPropertiesInput = {
    create?: XOR<ManagerCreateWithoutManagedPropertiesInput, ManagerUncheckedCreateWithoutManagedPropertiesInput>
    connectOrCreate?: ManagerCreateOrConnectWithoutManagedPropertiesInput
    connect?: ManagerWhereUniqueInput
  }

  export type TenantCreateNestedManyWithoutFavoritesInput = {
    create?: XOR<TenantCreateWithoutFavoritesInput, TenantUncheckedCreateWithoutFavoritesInput> | TenantCreateWithoutFavoritesInput[] | TenantUncheckedCreateWithoutFavoritesInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutFavoritesInput | TenantCreateOrConnectWithoutFavoritesInput[]
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
  }

  export type TenantCreateNestedManyWithoutPropertiesInput = {
    create?: XOR<TenantCreateWithoutPropertiesInput, TenantUncheckedCreateWithoutPropertiesInput> | TenantCreateWithoutPropertiesInput[] | TenantUncheckedCreateWithoutPropertiesInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutPropertiesInput | TenantCreateOrConnectWithoutPropertiesInput[]
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
  }

  export type ApplicationUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<ApplicationCreateWithoutPropertyInput, ApplicationUncheckedCreateWithoutPropertyInput> | ApplicationCreateWithoutPropertyInput[] | ApplicationUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutPropertyInput | ApplicationCreateOrConnectWithoutPropertyInput[]
    createMany?: ApplicationCreateManyPropertyInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type LeaseUncheckedCreateNestedManyWithoutPropertyInput = {
    create?: XOR<LeaseCreateWithoutPropertyInput, LeaseUncheckedCreateWithoutPropertyInput> | LeaseCreateWithoutPropertyInput[] | LeaseUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: LeaseCreateOrConnectWithoutPropertyInput | LeaseCreateOrConnectWithoutPropertyInput[]
    createMany?: LeaseCreateManyPropertyInputEnvelope
    connect?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
  }

  export type TenantUncheckedCreateNestedManyWithoutFavoritesInput = {
    create?: XOR<TenantCreateWithoutFavoritesInput, TenantUncheckedCreateWithoutFavoritesInput> | TenantCreateWithoutFavoritesInput[] | TenantUncheckedCreateWithoutFavoritesInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutFavoritesInput | TenantCreateOrConnectWithoutFavoritesInput[]
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
  }

  export type TenantUncheckedCreateNestedManyWithoutPropertiesInput = {
    create?: XOR<TenantCreateWithoutPropertiesInput, TenantUncheckedCreateWithoutPropertiesInput> | TenantCreateWithoutPropertiesInput[] | TenantUncheckedCreateWithoutPropertiesInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutPropertiesInput | TenantCreateOrConnectWithoutPropertiesInput[]
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PropertyUpdatephotoUrlsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PropertyUpdateamenitiesInput = {
    set?: $Enums.Amenity[]
    push?: $Enums.Amenity | $Enums.Amenity[]
  }

  export type PropertyUpdatehighlightsInput = {
    set?: $Enums.Highlight[]
    push?: $Enums.Highlight | $Enums.Highlight[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumPropertyTypeFieldUpdateOperationsInput = {
    set?: $Enums.PropertyType
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ApplicationUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<ApplicationCreateWithoutPropertyInput, ApplicationUncheckedCreateWithoutPropertyInput> | ApplicationCreateWithoutPropertyInput[] | ApplicationUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutPropertyInput | ApplicationCreateOrConnectWithoutPropertyInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutPropertyInput | ApplicationUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: ApplicationCreateManyPropertyInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutPropertyInput | ApplicationUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutPropertyInput | ApplicationUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type LeaseUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<LeaseCreateWithoutPropertyInput, LeaseUncheckedCreateWithoutPropertyInput> | LeaseCreateWithoutPropertyInput[] | LeaseUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: LeaseCreateOrConnectWithoutPropertyInput | LeaseCreateOrConnectWithoutPropertyInput[]
    upsert?: LeaseUpsertWithWhereUniqueWithoutPropertyInput | LeaseUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: LeaseCreateManyPropertyInputEnvelope
    set?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    disconnect?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    delete?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    connect?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    update?: LeaseUpdateWithWhereUniqueWithoutPropertyInput | LeaseUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: LeaseUpdateManyWithWhereWithoutPropertyInput | LeaseUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: LeaseScalarWhereInput | LeaseScalarWhereInput[]
  }

  export type LocationUpdateOneRequiredWithoutPropertiesNestedInput = {
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutPropertiesInput, LocationUpdateWithoutPropertiesInput>, LocationUncheckedUpdateWithoutPropertiesInput>
  }

  export type ManagerUpdateOneRequiredWithoutManagedPropertiesNestedInput = {
    create?: XOR<ManagerCreateWithoutManagedPropertiesInput, ManagerUncheckedCreateWithoutManagedPropertiesInput>
    connectOrCreate?: ManagerCreateOrConnectWithoutManagedPropertiesInput
    upsert?: ManagerUpsertWithoutManagedPropertiesInput
    connect?: ManagerWhereUniqueInput
    update?: XOR<XOR<ManagerUpdateToOneWithWhereWithoutManagedPropertiesInput, ManagerUpdateWithoutManagedPropertiesInput>, ManagerUncheckedUpdateWithoutManagedPropertiesInput>
  }

  export type TenantUpdateManyWithoutFavoritesNestedInput = {
    create?: XOR<TenantCreateWithoutFavoritesInput, TenantUncheckedCreateWithoutFavoritesInput> | TenantCreateWithoutFavoritesInput[] | TenantUncheckedCreateWithoutFavoritesInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutFavoritesInput | TenantCreateOrConnectWithoutFavoritesInput[]
    upsert?: TenantUpsertWithWhereUniqueWithoutFavoritesInput | TenantUpsertWithWhereUniqueWithoutFavoritesInput[]
    set?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    disconnect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    delete?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    update?: TenantUpdateWithWhereUniqueWithoutFavoritesInput | TenantUpdateWithWhereUniqueWithoutFavoritesInput[]
    updateMany?: TenantUpdateManyWithWhereWithoutFavoritesInput | TenantUpdateManyWithWhereWithoutFavoritesInput[]
    deleteMany?: TenantScalarWhereInput | TenantScalarWhereInput[]
  }

  export type TenantUpdateManyWithoutPropertiesNestedInput = {
    create?: XOR<TenantCreateWithoutPropertiesInput, TenantUncheckedCreateWithoutPropertiesInput> | TenantCreateWithoutPropertiesInput[] | TenantUncheckedCreateWithoutPropertiesInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutPropertiesInput | TenantCreateOrConnectWithoutPropertiesInput[]
    upsert?: TenantUpsertWithWhereUniqueWithoutPropertiesInput | TenantUpsertWithWhereUniqueWithoutPropertiesInput[]
    set?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    disconnect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    delete?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    update?: TenantUpdateWithWhereUniqueWithoutPropertiesInput | TenantUpdateWithWhereUniqueWithoutPropertiesInput[]
    updateMany?: TenantUpdateManyWithWhereWithoutPropertiesInput | TenantUpdateManyWithWhereWithoutPropertiesInput[]
    deleteMany?: TenantScalarWhereInput | TenantScalarWhereInput[]
  }

  export type ApplicationUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<ApplicationCreateWithoutPropertyInput, ApplicationUncheckedCreateWithoutPropertyInput> | ApplicationCreateWithoutPropertyInput[] | ApplicationUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutPropertyInput | ApplicationCreateOrConnectWithoutPropertyInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutPropertyInput | ApplicationUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: ApplicationCreateManyPropertyInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutPropertyInput | ApplicationUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutPropertyInput | ApplicationUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type LeaseUncheckedUpdateManyWithoutPropertyNestedInput = {
    create?: XOR<LeaseCreateWithoutPropertyInput, LeaseUncheckedCreateWithoutPropertyInput> | LeaseCreateWithoutPropertyInput[] | LeaseUncheckedCreateWithoutPropertyInput[]
    connectOrCreate?: LeaseCreateOrConnectWithoutPropertyInput | LeaseCreateOrConnectWithoutPropertyInput[]
    upsert?: LeaseUpsertWithWhereUniqueWithoutPropertyInput | LeaseUpsertWithWhereUniqueWithoutPropertyInput[]
    createMany?: LeaseCreateManyPropertyInputEnvelope
    set?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    disconnect?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    delete?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    connect?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    update?: LeaseUpdateWithWhereUniqueWithoutPropertyInput | LeaseUpdateWithWhereUniqueWithoutPropertyInput[]
    updateMany?: LeaseUpdateManyWithWhereWithoutPropertyInput | LeaseUpdateManyWithWhereWithoutPropertyInput[]
    deleteMany?: LeaseScalarWhereInput | LeaseScalarWhereInput[]
  }

  export type TenantUncheckedUpdateManyWithoutFavoritesNestedInput = {
    create?: XOR<TenantCreateWithoutFavoritesInput, TenantUncheckedCreateWithoutFavoritesInput> | TenantCreateWithoutFavoritesInput[] | TenantUncheckedCreateWithoutFavoritesInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutFavoritesInput | TenantCreateOrConnectWithoutFavoritesInput[]
    upsert?: TenantUpsertWithWhereUniqueWithoutFavoritesInput | TenantUpsertWithWhereUniqueWithoutFavoritesInput[]
    set?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    disconnect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    delete?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    update?: TenantUpdateWithWhereUniqueWithoutFavoritesInput | TenantUpdateWithWhereUniqueWithoutFavoritesInput[]
    updateMany?: TenantUpdateManyWithWhereWithoutFavoritesInput | TenantUpdateManyWithWhereWithoutFavoritesInput[]
    deleteMany?: TenantScalarWhereInput | TenantScalarWhereInput[]
  }

  export type TenantUncheckedUpdateManyWithoutPropertiesNestedInput = {
    create?: XOR<TenantCreateWithoutPropertiesInput, TenantUncheckedCreateWithoutPropertiesInput> | TenantCreateWithoutPropertiesInput[] | TenantUncheckedCreateWithoutPropertiesInput[]
    connectOrCreate?: TenantCreateOrConnectWithoutPropertiesInput | TenantCreateOrConnectWithoutPropertiesInput[]
    upsert?: TenantUpsertWithWhereUniqueWithoutPropertiesInput | TenantUpsertWithWhereUniqueWithoutPropertiesInput[]
    set?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    disconnect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    delete?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    connect?: TenantWhereUniqueInput | TenantWhereUniqueInput[]
    update?: TenantUpdateWithWhereUniqueWithoutPropertiesInput | TenantUpdateWithWhereUniqueWithoutPropertiesInput[]
    updateMany?: TenantUpdateManyWithWhereWithoutPropertiesInput | TenantUpdateManyWithWhereWithoutPropertiesInput[]
    deleteMany?: TenantScalarWhereInput | TenantScalarWhereInput[]
  }

  export type PropertyCreateNestedManyWithoutManagerInput = {
    create?: XOR<PropertyCreateWithoutManagerInput, PropertyUncheckedCreateWithoutManagerInput> | PropertyCreateWithoutManagerInput[] | PropertyUncheckedCreateWithoutManagerInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutManagerInput | PropertyCreateOrConnectWithoutManagerInput[]
    createMany?: PropertyCreateManyManagerInputEnvelope
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
  }

  export type PropertyUncheckedCreateNestedManyWithoutManagerInput = {
    create?: XOR<PropertyCreateWithoutManagerInput, PropertyUncheckedCreateWithoutManagerInput> | PropertyCreateWithoutManagerInput[] | PropertyUncheckedCreateWithoutManagerInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutManagerInput | PropertyCreateOrConnectWithoutManagerInput[]
    createMany?: PropertyCreateManyManagerInputEnvelope
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
  }

  export type PropertyUpdateManyWithoutManagerNestedInput = {
    create?: XOR<PropertyCreateWithoutManagerInput, PropertyUncheckedCreateWithoutManagerInput> | PropertyCreateWithoutManagerInput[] | PropertyUncheckedCreateWithoutManagerInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutManagerInput | PropertyCreateOrConnectWithoutManagerInput[]
    upsert?: PropertyUpsertWithWhereUniqueWithoutManagerInput | PropertyUpsertWithWhereUniqueWithoutManagerInput[]
    createMany?: PropertyCreateManyManagerInputEnvelope
    set?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    disconnect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    delete?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    update?: PropertyUpdateWithWhereUniqueWithoutManagerInput | PropertyUpdateWithWhereUniqueWithoutManagerInput[]
    updateMany?: PropertyUpdateManyWithWhereWithoutManagerInput | PropertyUpdateManyWithWhereWithoutManagerInput[]
    deleteMany?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
  }

  export type PropertyUncheckedUpdateManyWithoutManagerNestedInput = {
    create?: XOR<PropertyCreateWithoutManagerInput, PropertyUncheckedCreateWithoutManagerInput> | PropertyCreateWithoutManagerInput[] | PropertyUncheckedCreateWithoutManagerInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutManagerInput | PropertyCreateOrConnectWithoutManagerInput[]
    upsert?: PropertyUpsertWithWhereUniqueWithoutManagerInput | PropertyUpsertWithWhereUniqueWithoutManagerInput[]
    createMany?: PropertyCreateManyManagerInputEnvelope
    set?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    disconnect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    delete?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    update?: PropertyUpdateWithWhereUniqueWithoutManagerInput | PropertyUpdateWithWhereUniqueWithoutManagerInput[]
    updateMany?: PropertyUpdateManyWithWhereWithoutManagerInput | PropertyUpdateManyWithWhereWithoutManagerInput[]
    deleteMany?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
  }

  export type ApplicationCreateNestedManyWithoutTenantInput = {
    create?: XOR<ApplicationCreateWithoutTenantInput, ApplicationUncheckedCreateWithoutTenantInput> | ApplicationCreateWithoutTenantInput[] | ApplicationUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutTenantInput | ApplicationCreateOrConnectWithoutTenantInput[]
    createMany?: ApplicationCreateManyTenantInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type LeaseCreateNestedManyWithoutTenantInput = {
    create?: XOR<LeaseCreateWithoutTenantInput, LeaseUncheckedCreateWithoutTenantInput> | LeaseCreateWithoutTenantInput[] | LeaseUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: LeaseCreateOrConnectWithoutTenantInput | LeaseCreateOrConnectWithoutTenantInput[]
    createMany?: LeaseCreateManyTenantInputEnvelope
    connect?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
  }

  export type PropertyCreateNestedManyWithoutFavoritedByInput = {
    create?: XOR<PropertyCreateWithoutFavoritedByInput, PropertyUncheckedCreateWithoutFavoritedByInput> | PropertyCreateWithoutFavoritedByInput[] | PropertyUncheckedCreateWithoutFavoritedByInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutFavoritedByInput | PropertyCreateOrConnectWithoutFavoritedByInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
  }

  export type PropertyCreateNestedManyWithoutTenantsInput = {
    create?: XOR<PropertyCreateWithoutTenantsInput, PropertyUncheckedCreateWithoutTenantsInput> | PropertyCreateWithoutTenantsInput[] | PropertyUncheckedCreateWithoutTenantsInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutTenantsInput | PropertyCreateOrConnectWithoutTenantsInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
  }

  export type ApplicationUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<ApplicationCreateWithoutTenantInput, ApplicationUncheckedCreateWithoutTenantInput> | ApplicationCreateWithoutTenantInput[] | ApplicationUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutTenantInput | ApplicationCreateOrConnectWithoutTenantInput[]
    createMany?: ApplicationCreateManyTenantInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type LeaseUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<LeaseCreateWithoutTenantInput, LeaseUncheckedCreateWithoutTenantInput> | LeaseCreateWithoutTenantInput[] | LeaseUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: LeaseCreateOrConnectWithoutTenantInput | LeaseCreateOrConnectWithoutTenantInput[]
    createMany?: LeaseCreateManyTenantInputEnvelope
    connect?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
  }

  export type PropertyUncheckedCreateNestedManyWithoutFavoritedByInput = {
    create?: XOR<PropertyCreateWithoutFavoritedByInput, PropertyUncheckedCreateWithoutFavoritedByInput> | PropertyCreateWithoutFavoritedByInput[] | PropertyUncheckedCreateWithoutFavoritedByInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutFavoritedByInput | PropertyCreateOrConnectWithoutFavoritedByInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
  }

  export type PropertyUncheckedCreateNestedManyWithoutTenantsInput = {
    create?: XOR<PropertyCreateWithoutTenantsInput, PropertyUncheckedCreateWithoutTenantsInput> | PropertyCreateWithoutTenantsInput[] | PropertyUncheckedCreateWithoutTenantsInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutTenantsInput | PropertyCreateOrConnectWithoutTenantsInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
  }

  export type ApplicationUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ApplicationCreateWithoutTenantInput, ApplicationUncheckedCreateWithoutTenantInput> | ApplicationCreateWithoutTenantInput[] | ApplicationUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutTenantInput | ApplicationCreateOrConnectWithoutTenantInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutTenantInput | ApplicationUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ApplicationCreateManyTenantInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutTenantInput | ApplicationUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutTenantInput | ApplicationUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type LeaseUpdateManyWithoutTenantNestedInput = {
    create?: XOR<LeaseCreateWithoutTenantInput, LeaseUncheckedCreateWithoutTenantInput> | LeaseCreateWithoutTenantInput[] | LeaseUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: LeaseCreateOrConnectWithoutTenantInput | LeaseCreateOrConnectWithoutTenantInput[]
    upsert?: LeaseUpsertWithWhereUniqueWithoutTenantInput | LeaseUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: LeaseCreateManyTenantInputEnvelope
    set?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    disconnect?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    delete?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    connect?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    update?: LeaseUpdateWithWhereUniqueWithoutTenantInput | LeaseUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: LeaseUpdateManyWithWhereWithoutTenantInput | LeaseUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: LeaseScalarWhereInput | LeaseScalarWhereInput[]
  }

  export type PropertyUpdateManyWithoutFavoritedByNestedInput = {
    create?: XOR<PropertyCreateWithoutFavoritedByInput, PropertyUncheckedCreateWithoutFavoritedByInput> | PropertyCreateWithoutFavoritedByInput[] | PropertyUncheckedCreateWithoutFavoritedByInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutFavoritedByInput | PropertyCreateOrConnectWithoutFavoritedByInput[]
    upsert?: PropertyUpsertWithWhereUniqueWithoutFavoritedByInput | PropertyUpsertWithWhereUniqueWithoutFavoritedByInput[]
    set?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    disconnect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    delete?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    update?: PropertyUpdateWithWhereUniqueWithoutFavoritedByInput | PropertyUpdateWithWhereUniqueWithoutFavoritedByInput[]
    updateMany?: PropertyUpdateManyWithWhereWithoutFavoritedByInput | PropertyUpdateManyWithWhereWithoutFavoritedByInput[]
    deleteMany?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
  }

  export type PropertyUpdateManyWithoutTenantsNestedInput = {
    create?: XOR<PropertyCreateWithoutTenantsInput, PropertyUncheckedCreateWithoutTenantsInput> | PropertyCreateWithoutTenantsInput[] | PropertyUncheckedCreateWithoutTenantsInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutTenantsInput | PropertyCreateOrConnectWithoutTenantsInput[]
    upsert?: PropertyUpsertWithWhereUniqueWithoutTenantsInput | PropertyUpsertWithWhereUniqueWithoutTenantsInput[]
    set?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    disconnect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    delete?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    update?: PropertyUpdateWithWhereUniqueWithoutTenantsInput | PropertyUpdateWithWhereUniqueWithoutTenantsInput[]
    updateMany?: PropertyUpdateManyWithWhereWithoutTenantsInput | PropertyUpdateManyWithWhereWithoutTenantsInput[]
    deleteMany?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
  }

  export type ApplicationUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<ApplicationCreateWithoutTenantInput, ApplicationUncheckedCreateWithoutTenantInput> | ApplicationCreateWithoutTenantInput[] | ApplicationUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutTenantInput | ApplicationCreateOrConnectWithoutTenantInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutTenantInput | ApplicationUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: ApplicationCreateManyTenantInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutTenantInput | ApplicationUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutTenantInput | ApplicationUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type LeaseUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<LeaseCreateWithoutTenantInput, LeaseUncheckedCreateWithoutTenantInput> | LeaseCreateWithoutTenantInput[] | LeaseUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: LeaseCreateOrConnectWithoutTenantInput | LeaseCreateOrConnectWithoutTenantInput[]
    upsert?: LeaseUpsertWithWhereUniqueWithoutTenantInput | LeaseUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: LeaseCreateManyTenantInputEnvelope
    set?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    disconnect?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    delete?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    connect?: LeaseWhereUniqueInput | LeaseWhereUniqueInput[]
    update?: LeaseUpdateWithWhereUniqueWithoutTenantInput | LeaseUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: LeaseUpdateManyWithWhereWithoutTenantInput | LeaseUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: LeaseScalarWhereInput | LeaseScalarWhereInput[]
  }

  export type PropertyUncheckedUpdateManyWithoutFavoritedByNestedInput = {
    create?: XOR<PropertyCreateWithoutFavoritedByInput, PropertyUncheckedCreateWithoutFavoritedByInput> | PropertyCreateWithoutFavoritedByInput[] | PropertyUncheckedCreateWithoutFavoritedByInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutFavoritedByInput | PropertyCreateOrConnectWithoutFavoritedByInput[]
    upsert?: PropertyUpsertWithWhereUniqueWithoutFavoritedByInput | PropertyUpsertWithWhereUniqueWithoutFavoritedByInput[]
    set?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    disconnect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    delete?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    update?: PropertyUpdateWithWhereUniqueWithoutFavoritedByInput | PropertyUpdateWithWhereUniqueWithoutFavoritedByInput[]
    updateMany?: PropertyUpdateManyWithWhereWithoutFavoritedByInput | PropertyUpdateManyWithWhereWithoutFavoritedByInput[]
    deleteMany?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
  }

  export type PropertyUncheckedUpdateManyWithoutTenantsNestedInput = {
    create?: XOR<PropertyCreateWithoutTenantsInput, PropertyUncheckedCreateWithoutTenantsInput> | PropertyCreateWithoutTenantsInput[] | PropertyUncheckedCreateWithoutTenantsInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutTenantsInput | PropertyCreateOrConnectWithoutTenantsInput[]
    upsert?: PropertyUpsertWithWhereUniqueWithoutTenantsInput | PropertyUpsertWithWhereUniqueWithoutTenantsInput[]
    set?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    disconnect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    delete?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    update?: PropertyUpdateWithWhereUniqueWithoutTenantsInput | PropertyUpdateWithWhereUniqueWithoutTenantsInput[]
    updateMany?: PropertyUpdateManyWithWhereWithoutTenantsInput | PropertyUpdateManyWithWhereWithoutTenantsInput[]
    deleteMany?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
  }

  export type PropertyUpdateManyWithoutLocationNestedInput = {
    create?: XOR<PropertyCreateWithoutLocationInput, PropertyUncheckedCreateWithoutLocationInput> | PropertyCreateWithoutLocationInput[] | PropertyUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutLocationInput | PropertyCreateOrConnectWithoutLocationInput[]
    upsert?: PropertyUpsertWithWhereUniqueWithoutLocationInput | PropertyUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: PropertyCreateManyLocationInputEnvelope
    set?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    disconnect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    delete?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    update?: PropertyUpdateWithWhereUniqueWithoutLocationInput | PropertyUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: PropertyUpdateManyWithWhereWithoutLocationInput | PropertyUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
  }

  export type PropertyUncheckedUpdateManyWithoutLocationNestedInput = {
    create?: XOR<PropertyCreateWithoutLocationInput, PropertyUncheckedCreateWithoutLocationInput> | PropertyCreateWithoutLocationInput[] | PropertyUncheckedCreateWithoutLocationInput[]
    connectOrCreate?: PropertyCreateOrConnectWithoutLocationInput | PropertyCreateOrConnectWithoutLocationInput[]
    upsert?: PropertyUpsertWithWhereUniqueWithoutLocationInput | PropertyUpsertWithWhereUniqueWithoutLocationInput[]
    createMany?: PropertyCreateManyLocationInputEnvelope
    set?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    disconnect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    delete?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    connect?: PropertyWhereUniqueInput | PropertyWhereUniqueInput[]
    update?: PropertyUpdateWithWhereUniqueWithoutLocationInput | PropertyUpdateWithWhereUniqueWithoutLocationInput[]
    updateMany?: PropertyUpdateManyWithWhereWithoutLocationInput | PropertyUpdateManyWithWhereWithoutLocationInput[]
    deleteMany?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
  }

  export type LeaseCreateNestedOneWithoutApplicationInput = {
    create?: XOR<LeaseCreateWithoutApplicationInput, LeaseUncheckedCreateWithoutApplicationInput>
    connectOrCreate?: LeaseCreateOrConnectWithoutApplicationInput
    connect?: LeaseWhereUniqueInput
  }

  export type PropertyCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<PropertyCreateWithoutApplicationsInput, PropertyUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutApplicationsInput
    connect?: PropertyWhereUniqueInput
  }

  export type TenantCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<TenantCreateWithoutApplicationsInput, TenantUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutApplicationsInput
    connect?: TenantWhereUniqueInput
  }

  export type EnumApplicationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ApplicationStatus
  }

  export type LeaseUpdateOneWithoutApplicationNestedInput = {
    create?: XOR<LeaseCreateWithoutApplicationInput, LeaseUncheckedCreateWithoutApplicationInput>
    connectOrCreate?: LeaseCreateOrConnectWithoutApplicationInput
    upsert?: LeaseUpsertWithoutApplicationInput
    disconnect?: LeaseWhereInput | boolean
    delete?: LeaseWhereInput | boolean
    connect?: LeaseWhereUniqueInput
    update?: XOR<XOR<LeaseUpdateToOneWithWhereWithoutApplicationInput, LeaseUpdateWithoutApplicationInput>, LeaseUncheckedUpdateWithoutApplicationInput>
  }

  export type PropertyUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<PropertyCreateWithoutApplicationsInput, PropertyUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutApplicationsInput
    upsert?: PropertyUpsertWithoutApplicationsInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutApplicationsInput, PropertyUpdateWithoutApplicationsInput>, PropertyUncheckedUpdateWithoutApplicationsInput>
  }

  export type TenantUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<TenantCreateWithoutApplicationsInput, TenantUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutApplicationsInput
    upsert?: TenantUpsertWithoutApplicationsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutApplicationsInput, TenantUpdateWithoutApplicationsInput>, TenantUncheckedUpdateWithoutApplicationsInput>
  }

  export type ApplicationCreateNestedOneWithoutLeaseInput = {
    create?: XOR<ApplicationCreateWithoutLeaseInput, ApplicationUncheckedCreateWithoutLeaseInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutLeaseInput
    connect?: ApplicationWhereUniqueInput
  }

  export type PropertyCreateNestedOneWithoutLeasesInput = {
    create?: XOR<PropertyCreateWithoutLeasesInput, PropertyUncheckedCreateWithoutLeasesInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutLeasesInput
    connect?: PropertyWhereUniqueInput
  }

  export type TenantCreateNestedOneWithoutLeasesInput = {
    create?: XOR<TenantCreateWithoutLeasesInput, TenantUncheckedCreateWithoutLeasesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutLeasesInput
    connect?: TenantWhereUniqueInput
  }

  export type PaymentCreateNestedManyWithoutLeaseInput = {
    create?: XOR<PaymentCreateWithoutLeaseInput, PaymentUncheckedCreateWithoutLeaseInput> | PaymentCreateWithoutLeaseInput[] | PaymentUncheckedCreateWithoutLeaseInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutLeaseInput | PaymentCreateOrConnectWithoutLeaseInput[]
    createMany?: PaymentCreateManyLeaseInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type ApplicationUncheckedCreateNestedOneWithoutLeaseInput = {
    create?: XOR<ApplicationCreateWithoutLeaseInput, ApplicationUncheckedCreateWithoutLeaseInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutLeaseInput
    connect?: ApplicationWhereUniqueInput
  }

  export type PaymentUncheckedCreateNestedManyWithoutLeaseInput = {
    create?: XOR<PaymentCreateWithoutLeaseInput, PaymentUncheckedCreateWithoutLeaseInput> | PaymentCreateWithoutLeaseInput[] | PaymentUncheckedCreateWithoutLeaseInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutLeaseInput | PaymentCreateOrConnectWithoutLeaseInput[]
    createMany?: PaymentCreateManyLeaseInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type ApplicationUpdateOneWithoutLeaseNestedInput = {
    create?: XOR<ApplicationCreateWithoutLeaseInput, ApplicationUncheckedCreateWithoutLeaseInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutLeaseInput
    upsert?: ApplicationUpsertWithoutLeaseInput
    disconnect?: ApplicationWhereInput | boolean
    delete?: ApplicationWhereInput | boolean
    connect?: ApplicationWhereUniqueInput
    update?: XOR<XOR<ApplicationUpdateToOneWithWhereWithoutLeaseInput, ApplicationUpdateWithoutLeaseInput>, ApplicationUncheckedUpdateWithoutLeaseInput>
  }

  export type PropertyUpdateOneRequiredWithoutLeasesNestedInput = {
    create?: XOR<PropertyCreateWithoutLeasesInput, PropertyUncheckedCreateWithoutLeasesInput>
    connectOrCreate?: PropertyCreateOrConnectWithoutLeasesInput
    upsert?: PropertyUpsertWithoutLeasesInput
    connect?: PropertyWhereUniqueInput
    update?: XOR<XOR<PropertyUpdateToOneWithWhereWithoutLeasesInput, PropertyUpdateWithoutLeasesInput>, PropertyUncheckedUpdateWithoutLeasesInput>
  }

  export type TenantUpdateOneRequiredWithoutLeasesNestedInput = {
    create?: XOR<TenantCreateWithoutLeasesInput, TenantUncheckedCreateWithoutLeasesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutLeasesInput
    upsert?: TenantUpsertWithoutLeasesInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutLeasesInput, TenantUpdateWithoutLeasesInput>, TenantUncheckedUpdateWithoutLeasesInput>
  }

  export type PaymentUpdateManyWithoutLeaseNestedInput = {
    create?: XOR<PaymentCreateWithoutLeaseInput, PaymentUncheckedCreateWithoutLeaseInput> | PaymentCreateWithoutLeaseInput[] | PaymentUncheckedCreateWithoutLeaseInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutLeaseInput | PaymentCreateOrConnectWithoutLeaseInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutLeaseInput | PaymentUpsertWithWhereUniqueWithoutLeaseInput[]
    createMany?: PaymentCreateManyLeaseInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutLeaseInput | PaymentUpdateWithWhereUniqueWithoutLeaseInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutLeaseInput | PaymentUpdateManyWithWhereWithoutLeaseInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type ApplicationUncheckedUpdateOneWithoutLeaseNestedInput = {
    create?: XOR<ApplicationCreateWithoutLeaseInput, ApplicationUncheckedCreateWithoutLeaseInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutLeaseInput
    upsert?: ApplicationUpsertWithoutLeaseInput
    disconnect?: ApplicationWhereInput | boolean
    delete?: ApplicationWhereInput | boolean
    connect?: ApplicationWhereUniqueInput
    update?: XOR<XOR<ApplicationUpdateToOneWithWhereWithoutLeaseInput, ApplicationUpdateWithoutLeaseInput>, ApplicationUncheckedUpdateWithoutLeaseInput>
  }

  export type PaymentUncheckedUpdateManyWithoutLeaseNestedInput = {
    create?: XOR<PaymentCreateWithoutLeaseInput, PaymentUncheckedCreateWithoutLeaseInput> | PaymentCreateWithoutLeaseInput[] | PaymentUncheckedCreateWithoutLeaseInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutLeaseInput | PaymentCreateOrConnectWithoutLeaseInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutLeaseInput | PaymentUpsertWithWhereUniqueWithoutLeaseInput[]
    createMany?: PaymentCreateManyLeaseInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutLeaseInput | PaymentUpdateWithWhereUniqueWithoutLeaseInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutLeaseInput | PaymentUpdateManyWithWhereWithoutLeaseInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type LeaseCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<LeaseCreateWithoutPaymentsInput, LeaseUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: LeaseCreateOrConnectWithoutPaymentsInput
    connect?: LeaseWhereUniqueInput
  }

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus
  }

  export type LeaseUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<LeaseCreateWithoutPaymentsInput, LeaseUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: LeaseCreateOrConnectWithoutPaymentsInput
    upsert?: LeaseUpsertWithoutPaymentsInput
    connect?: LeaseWhereUniqueInput
    update?: XOR<XOR<LeaseUpdateToOneWithWhereWithoutPaymentsInput, LeaseUpdateWithoutPaymentsInput>, LeaseUncheckedUpdateWithoutPaymentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumPropertyTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyType | EnumPropertyTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPropertyTypeFilter<$PrismaModel> | $Enums.PropertyType
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumPropertyTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PropertyType | EnumPropertyTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PropertyType[] | ListEnumPropertyTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPropertyTypeWithAggregatesFilter<$PrismaModel> | $Enums.PropertyType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPropertyTypeFilter<$PrismaModel>
    _max?: NestedEnumPropertyTypeFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumApplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusFilter<$PrismaModel> | $Enums.ApplicationStatus
  }

  export type NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApplicationStatusFilter<$PrismaModel>
    _max?: NestedEnumApplicationStatusFilter<$PrismaModel>
  }

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    prefix?: string | null
    firstName?: string | null
    lastName?: string | null
    suffix?: string | null
    password?: string | null
    username?: string | null
    defaultPrivacyLevel?: string | null
    stateOfResidence?: string | null
    cityOfResidence?: string | null
    zipCode?: string | null
    howDidYouHearAboutUs?: string | null
    forumUrl?: string | null
    youtubeUrl?: string | null
    referredByUsername?: string | null
    flyerPromoCode?: string | null
    otherHeardAboutText?: string | null
    termsAndPolicyAccepted?: boolean
    dataInterests?: UserCreatedataInterestsInput | string[]
    otherInterestText?: string | null
    rankedMotivations?: UserCreaterankedMotivationsInput | string[]
    rankedGovernments?: UserCreaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserCreaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: string | null
    agreementAccepted?: boolean
    onboardingComplete?: boolean
    otp?: string | null
    otpExpires?: Date | string | null
    nextAuthId?: string | null
    phoneNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    prefix?: string | null
    firstName?: string | null
    lastName?: string | null
    suffix?: string | null
    password?: string | null
    username?: string | null
    defaultPrivacyLevel?: string | null
    stateOfResidence?: string | null
    cityOfResidence?: string | null
    zipCode?: string | null
    howDidYouHearAboutUs?: string | null
    forumUrl?: string | null
    youtubeUrl?: string | null
    referredByUsername?: string | null
    flyerPromoCode?: string | null
    otherHeardAboutText?: string | null
    termsAndPolicyAccepted?: boolean
    dataInterests?: UserCreatedataInterestsInput | string[]
    otherInterestText?: string | null
    rankedMotivations?: UserCreaterankedMotivationsInput | string[]
    rankedGovernments?: UserCreaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserCreaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: string | null
    agreementAccepted?: boolean
    onboardingComplete?: boolean
    otp?: string | null
    otpExpires?: Date | string | null
    nextAuthId?: string | null
    phoneNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    prefix?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    defaultPrivacyLevel?: NullableStringFieldUpdateOperationsInput | string | null
    stateOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    cityOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    howDidYouHearAboutUs?: NullableStringFieldUpdateOperationsInput | string | null
    forumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referredByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    flyerPromoCode?: NullableStringFieldUpdateOperationsInput | string | null
    otherHeardAboutText?: NullableStringFieldUpdateOperationsInput | string | null
    termsAndPolicyAccepted?: BoolFieldUpdateOperationsInput | boolean
    dataInterests?: UserUpdatedataInterestsInput | string[]
    otherInterestText?: NullableStringFieldUpdateOperationsInput | string | null
    rankedMotivations?: UserUpdaterankedMotivationsInput | string[]
    rankedGovernments?: UserUpdaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserUpdaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: NullableStringFieldUpdateOperationsInput | string | null
    agreementAccepted?: BoolFieldUpdateOperationsInput | boolean
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    otp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    prefix?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    defaultPrivacyLevel?: NullableStringFieldUpdateOperationsInput | string | null
    stateOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    cityOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    howDidYouHearAboutUs?: NullableStringFieldUpdateOperationsInput | string | null
    forumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referredByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    flyerPromoCode?: NullableStringFieldUpdateOperationsInput | string | null
    otherHeardAboutText?: NullableStringFieldUpdateOperationsInput | string | null
    termsAndPolicyAccepted?: BoolFieldUpdateOperationsInput | boolean
    dataInterests?: UserUpdatedataInterestsInput | string[]
    otherInterestText?: NullableStringFieldUpdateOperationsInput | string | null
    rankedMotivations?: UserUpdaterankedMotivationsInput | string[]
    rankedGovernments?: UserUpdaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserUpdaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: NullableStringFieldUpdateOperationsInput | string | null
    agreementAccepted?: BoolFieldUpdateOperationsInput | boolean
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    otp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    prefix?: string | null
    firstName?: string | null
    lastName?: string | null
    suffix?: string | null
    password?: string | null
    username?: string | null
    defaultPrivacyLevel?: string | null
    stateOfResidence?: string | null
    cityOfResidence?: string | null
    zipCode?: string | null
    howDidYouHearAboutUs?: string | null
    forumUrl?: string | null
    youtubeUrl?: string | null
    referredByUsername?: string | null
    flyerPromoCode?: string | null
    otherHeardAboutText?: string | null
    termsAndPolicyAccepted?: boolean
    dataInterests?: UserCreatedataInterestsInput | string[]
    otherInterestText?: string | null
    rankedMotivations?: UserCreaterankedMotivationsInput | string[]
    rankedGovernments?: UserCreaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserCreaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: string | null
    agreementAccepted?: boolean
    onboardingComplete?: boolean
    otp?: string | null
    otpExpires?: Date | string | null
    nextAuthId?: string | null
    phoneNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    prefix?: string | null
    firstName?: string | null
    lastName?: string | null
    suffix?: string | null
    password?: string | null
    username?: string | null
    defaultPrivacyLevel?: string | null
    stateOfResidence?: string | null
    cityOfResidence?: string | null
    zipCode?: string | null
    howDidYouHearAboutUs?: string | null
    forumUrl?: string | null
    youtubeUrl?: string | null
    referredByUsername?: string | null
    flyerPromoCode?: string | null
    otherHeardAboutText?: string | null
    termsAndPolicyAccepted?: boolean
    dataInterests?: UserCreatedataInterestsInput | string[]
    otherInterestText?: string | null
    rankedMotivations?: UserCreaterankedMotivationsInput | string[]
    rankedGovernments?: UserCreaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserCreaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: string | null
    agreementAccepted?: boolean
    onboardingComplete?: boolean
    otp?: string | null
    otpExpires?: Date | string | null
    nextAuthId?: string | null
    phoneNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    prefix?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    defaultPrivacyLevel?: NullableStringFieldUpdateOperationsInput | string | null
    stateOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    cityOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    howDidYouHearAboutUs?: NullableStringFieldUpdateOperationsInput | string | null
    forumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referredByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    flyerPromoCode?: NullableStringFieldUpdateOperationsInput | string | null
    otherHeardAboutText?: NullableStringFieldUpdateOperationsInput | string | null
    termsAndPolicyAccepted?: BoolFieldUpdateOperationsInput | boolean
    dataInterests?: UserUpdatedataInterestsInput | string[]
    otherInterestText?: NullableStringFieldUpdateOperationsInput | string | null
    rankedMotivations?: UserUpdaterankedMotivationsInput | string[]
    rankedGovernments?: UserUpdaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserUpdaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: NullableStringFieldUpdateOperationsInput | string | null
    agreementAccepted?: BoolFieldUpdateOperationsInput | boolean
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    otp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    prefix?: NullableStringFieldUpdateOperationsInput | string | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    defaultPrivacyLevel?: NullableStringFieldUpdateOperationsInput | string | null
    stateOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    cityOfResidence?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    howDidYouHearAboutUs?: NullableStringFieldUpdateOperationsInput | string | null
    forumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referredByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    flyerPromoCode?: NullableStringFieldUpdateOperationsInput | string | null
    otherHeardAboutText?: NullableStringFieldUpdateOperationsInput | string | null
    termsAndPolicyAccepted?: BoolFieldUpdateOperationsInput | boolean
    dataInterests?: UserUpdatedataInterestsInput | string[]
    otherInterestText?: NullableStringFieldUpdateOperationsInput | string | null
    rankedMotivations?: UserUpdaterankedMotivationsInput | string[]
    rankedGovernments?: UserUpdaterankedGovernmentsInput | string[]
    rankedInformationSources?: UserUpdaterankedInformationSourcesInput | string[]
    otherInformationSourceText?: NullableStringFieldUpdateOperationsInput | string | null
    agreementAccepted?: BoolFieldUpdateOperationsInput | boolean
    onboardingComplete?: BoolFieldUpdateOperationsInput | boolean
    otp?: NullableStringFieldUpdateOperationsInput | string | null
    otpExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextAuthId?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ApplicationCreateWithoutPropertyInput = {
    applicationDate: Date | string
    status: $Enums.ApplicationStatus
    name: string
    email: string
    phoneNumber: string
    message?: string | null
    lease?: LeaseCreateNestedOneWithoutApplicationInput
    tenant: TenantCreateNestedOneWithoutApplicationsInput
  }

  export type ApplicationUncheckedCreateWithoutPropertyInput = {
    id?: number
    applicationDate: Date | string
    status: $Enums.ApplicationStatus
    name: string
    email: string
    phoneNumber: string
    message?: string | null
    leaseId?: number | null
    tenantNextAuthId: string
  }

  export type ApplicationCreateOrConnectWithoutPropertyInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutPropertyInput, ApplicationUncheckedCreateWithoutPropertyInput>
  }

  export type ApplicationCreateManyPropertyInputEnvelope = {
    data: ApplicationCreateManyPropertyInput | ApplicationCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type LeaseCreateWithoutPropertyInput = {
    startDate: Date | string
    endDate: Date | string
    rent: number
    deposit: number
    application?: ApplicationCreateNestedOneWithoutLeaseInput
    tenant: TenantCreateNestedOneWithoutLeasesInput
    payments?: PaymentCreateNestedManyWithoutLeaseInput
  }

  export type LeaseUncheckedCreateWithoutPropertyInput = {
    id?: number
    startDate: Date | string
    endDate: Date | string
    rent: number
    deposit: number
    tenantNextAuthId: string
    application?: ApplicationUncheckedCreateNestedOneWithoutLeaseInput
    payments?: PaymentUncheckedCreateNestedManyWithoutLeaseInput
  }

  export type LeaseCreateOrConnectWithoutPropertyInput = {
    where: LeaseWhereUniqueInput
    create: XOR<LeaseCreateWithoutPropertyInput, LeaseUncheckedCreateWithoutPropertyInput>
  }

  export type LeaseCreateManyPropertyInputEnvelope = {
    data: LeaseCreateManyPropertyInput | LeaseCreateManyPropertyInput[]
    skipDuplicates?: boolean
  }

  export type ManagerCreateWithoutManagedPropertiesInput = {
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
  }

  export type ManagerUncheckedCreateWithoutManagedPropertiesInput = {
    id?: number
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
  }

  export type ManagerCreateOrConnectWithoutManagedPropertiesInput = {
    where: ManagerWhereUniqueInput
    create: XOR<ManagerCreateWithoutManagedPropertiesInput, ManagerUncheckedCreateWithoutManagedPropertiesInput>
  }

  export type TenantCreateWithoutFavoritesInput = {
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
    applications?: ApplicationCreateNestedManyWithoutTenantInput
    leases?: LeaseCreateNestedManyWithoutTenantInput
    properties?: PropertyCreateNestedManyWithoutTenantsInput
  }

  export type TenantUncheckedCreateWithoutFavoritesInput = {
    id?: number
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
    applications?: ApplicationUncheckedCreateNestedManyWithoutTenantInput
    leases?: LeaseUncheckedCreateNestedManyWithoutTenantInput
    properties?: PropertyUncheckedCreateNestedManyWithoutTenantsInput
  }

  export type TenantCreateOrConnectWithoutFavoritesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutFavoritesInput, TenantUncheckedCreateWithoutFavoritesInput>
  }

  export type TenantCreateWithoutPropertiesInput = {
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
    applications?: ApplicationCreateNestedManyWithoutTenantInput
    leases?: LeaseCreateNestedManyWithoutTenantInput
    favorites?: PropertyCreateNestedManyWithoutFavoritedByInput
  }

  export type TenantUncheckedCreateWithoutPropertiesInput = {
    id?: number
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
    applications?: ApplicationUncheckedCreateNestedManyWithoutTenantInput
    leases?: LeaseUncheckedCreateNestedManyWithoutTenantInput
    favorites?: PropertyUncheckedCreateNestedManyWithoutFavoritedByInput
  }

  export type TenantCreateOrConnectWithoutPropertiesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutPropertiesInput, TenantUncheckedCreateWithoutPropertiesInput>
  }

  export type ApplicationUpsertWithWhereUniqueWithoutPropertyInput = {
    where: ApplicationWhereUniqueInput
    update: XOR<ApplicationUpdateWithoutPropertyInput, ApplicationUncheckedUpdateWithoutPropertyInput>
    create: XOR<ApplicationCreateWithoutPropertyInput, ApplicationUncheckedCreateWithoutPropertyInput>
  }

  export type ApplicationUpdateWithWhereUniqueWithoutPropertyInput = {
    where: ApplicationWhereUniqueInput
    data: XOR<ApplicationUpdateWithoutPropertyInput, ApplicationUncheckedUpdateWithoutPropertyInput>
  }

  export type ApplicationUpdateManyWithWhereWithoutPropertyInput = {
    where: ApplicationScalarWhereInput
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyWithoutPropertyInput>
  }

  export type ApplicationScalarWhereInput = {
    AND?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
    OR?: ApplicationScalarWhereInput[]
    NOT?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
    id?: IntFilter<"Application"> | number
    applicationDate?: DateTimeFilter<"Application"> | Date | string
    status?: EnumApplicationStatusFilter<"Application"> | $Enums.ApplicationStatus
    propertyId?: IntFilter<"Application"> | number
    name?: StringFilter<"Application"> | string
    email?: StringFilter<"Application"> | string
    phoneNumber?: StringFilter<"Application"> | string
    message?: StringNullableFilter<"Application"> | string | null
    leaseId?: IntNullableFilter<"Application"> | number | null
    tenantNextAuthId?: StringFilter<"Application"> | string
  }

  export type LeaseUpsertWithWhereUniqueWithoutPropertyInput = {
    where: LeaseWhereUniqueInput
    update: XOR<LeaseUpdateWithoutPropertyInput, LeaseUncheckedUpdateWithoutPropertyInput>
    create: XOR<LeaseCreateWithoutPropertyInput, LeaseUncheckedCreateWithoutPropertyInput>
  }

  export type LeaseUpdateWithWhereUniqueWithoutPropertyInput = {
    where: LeaseWhereUniqueInput
    data: XOR<LeaseUpdateWithoutPropertyInput, LeaseUncheckedUpdateWithoutPropertyInput>
  }

  export type LeaseUpdateManyWithWhereWithoutPropertyInput = {
    where: LeaseScalarWhereInput
    data: XOR<LeaseUpdateManyMutationInput, LeaseUncheckedUpdateManyWithoutPropertyInput>
  }

  export type LeaseScalarWhereInput = {
    AND?: LeaseScalarWhereInput | LeaseScalarWhereInput[]
    OR?: LeaseScalarWhereInput[]
    NOT?: LeaseScalarWhereInput | LeaseScalarWhereInput[]
    id?: IntFilter<"Lease"> | number
    startDate?: DateTimeFilter<"Lease"> | Date | string
    endDate?: DateTimeFilter<"Lease"> | Date | string
    rent?: FloatFilter<"Lease"> | number
    deposit?: FloatFilter<"Lease"> | number
    propertyId?: IntFilter<"Lease"> | number
    tenantNextAuthId?: StringFilter<"Lease"> | string
  }

  export type LocationUpdateToOneWithWhereWithoutPropertiesInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutPropertiesInput, LocationUncheckedUpdateWithoutPropertiesInput>
  }

  export type LocationUpdateWithoutPropertiesInput = {
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
  }

  export type LocationUncheckedUpdateWithoutPropertiesInput = {
    id?: IntFieldUpdateOperationsInput | number
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
  }

  export type ManagerUpsertWithoutManagedPropertiesInput = {
    update: XOR<ManagerUpdateWithoutManagedPropertiesInput, ManagerUncheckedUpdateWithoutManagedPropertiesInput>
    create: XOR<ManagerCreateWithoutManagedPropertiesInput, ManagerUncheckedCreateWithoutManagedPropertiesInput>
    where?: ManagerWhereInput
  }

  export type ManagerUpdateToOneWithWhereWithoutManagedPropertiesInput = {
    where?: ManagerWhereInput
    data: XOR<ManagerUpdateWithoutManagedPropertiesInput, ManagerUncheckedUpdateWithoutManagedPropertiesInput>
  }

  export type ManagerUpdateWithoutManagedPropertiesInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type ManagerUncheckedUpdateWithoutManagedPropertiesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type TenantUpsertWithWhereUniqueWithoutFavoritesInput = {
    where: TenantWhereUniqueInput
    update: XOR<TenantUpdateWithoutFavoritesInput, TenantUncheckedUpdateWithoutFavoritesInput>
    create: XOR<TenantCreateWithoutFavoritesInput, TenantUncheckedCreateWithoutFavoritesInput>
  }

  export type TenantUpdateWithWhereUniqueWithoutFavoritesInput = {
    where: TenantWhereUniqueInput
    data: XOR<TenantUpdateWithoutFavoritesInput, TenantUncheckedUpdateWithoutFavoritesInput>
  }

  export type TenantUpdateManyWithWhereWithoutFavoritesInput = {
    where: TenantScalarWhereInput
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyWithoutFavoritesInput>
  }

  export type TenantScalarWhereInput = {
    AND?: TenantScalarWhereInput | TenantScalarWhereInput[]
    OR?: TenantScalarWhereInput[]
    NOT?: TenantScalarWhereInput | TenantScalarWhereInput[]
    id?: IntFilter<"Tenant"> | number
    name?: StringFilter<"Tenant"> | string
    email?: StringFilter<"Tenant"> | string
    phoneNumber?: StringFilter<"Tenant"> | string
    nextAuthId?: StringFilter<"Tenant"> | string
  }

  export type TenantUpsertWithWhereUniqueWithoutPropertiesInput = {
    where: TenantWhereUniqueInput
    update: XOR<TenantUpdateWithoutPropertiesInput, TenantUncheckedUpdateWithoutPropertiesInput>
    create: XOR<TenantCreateWithoutPropertiesInput, TenantUncheckedCreateWithoutPropertiesInput>
  }

  export type TenantUpdateWithWhereUniqueWithoutPropertiesInput = {
    where: TenantWhereUniqueInput
    data: XOR<TenantUpdateWithoutPropertiesInput, TenantUncheckedUpdateWithoutPropertiesInput>
  }

  export type TenantUpdateManyWithWhereWithoutPropertiesInput = {
    where: TenantScalarWhereInput
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyWithoutPropertiesInput>
  }

  export type PropertyCreateWithoutManagerInput = {
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    applications?: ApplicationCreateNestedManyWithoutPropertyInput
    leases?: LeaseCreateNestedManyWithoutPropertyInput
    location: LocationCreateNestedOneWithoutPropertiesInput
    favoritedBy?: TenantCreateNestedManyWithoutFavoritesInput
    tenants?: TenantCreateNestedManyWithoutPropertiesInput
  }

  export type PropertyUncheckedCreateWithoutManagerInput = {
    id?: number
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    locationId: number
    applications?: ApplicationUncheckedCreateNestedManyWithoutPropertyInput
    leases?: LeaseUncheckedCreateNestedManyWithoutPropertyInput
    favoritedBy?: TenantUncheckedCreateNestedManyWithoutFavoritesInput
    tenants?: TenantUncheckedCreateNestedManyWithoutPropertiesInput
  }

  export type PropertyCreateOrConnectWithoutManagerInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutManagerInput, PropertyUncheckedCreateWithoutManagerInput>
  }

  export type PropertyCreateManyManagerInputEnvelope = {
    data: PropertyCreateManyManagerInput | PropertyCreateManyManagerInput[]
    skipDuplicates?: boolean
  }

  export type PropertyUpsertWithWhereUniqueWithoutManagerInput = {
    where: PropertyWhereUniqueInput
    update: XOR<PropertyUpdateWithoutManagerInput, PropertyUncheckedUpdateWithoutManagerInput>
    create: XOR<PropertyCreateWithoutManagerInput, PropertyUncheckedCreateWithoutManagerInput>
  }

  export type PropertyUpdateWithWhereUniqueWithoutManagerInput = {
    where: PropertyWhereUniqueInput
    data: XOR<PropertyUpdateWithoutManagerInput, PropertyUncheckedUpdateWithoutManagerInput>
  }

  export type PropertyUpdateManyWithWhereWithoutManagerInput = {
    where: PropertyScalarWhereInput
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyWithoutManagerInput>
  }

  export type PropertyScalarWhereInput = {
    AND?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
    OR?: PropertyScalarWhereInput[]
    NOT?: PropertyScalarWhereInput | PropertyScalarWhereInput[]
    id?: IntFilter<"Property"> | number
    name?: StringFilter<"Property"> | string
    description?: StringFilter<"Property"> | string
    pricePerMonth?: FloatFilter<"Property"> | number
    securityDeposit?: FloatFilter<"Property"> | number
    applicationFee?: FloatFilter<"Property"> | number
    photoUrls?: StringNullableListFilter<"Property">
    amenities?: EnumAmenityNullableListFilter<"Property">
    highlights?: EnumHighlightNullableListFilter<"Property">
    isPetsAllowed?: BoolFilter<"Property"> | boolean
    isParkingIncluded?: BoolFilter<"Property"> | boolean
    beds?: IntFilter<"Property"> | number
    baths?: FloatFilter<"Property"> | number
    squareFeet?: IntFilter<"Property"> | number
    propertyType?: EnumPropertyTypeFilter<"Property"> | $Enums.PropertyType
    postedDate?: DateTimeFilter<"Property"> | Date | string
    averageRating?: FloatNullableFilter<"Property"> | number | null
    numberOfReviews?: IntNullableFilter<"Property"> | number | null
    locationId?: IntFilter<"Property"> | number
    managerNextAuthId?: StringFilter<"Property"> | string
  }

  export type ApplicationCreateWithoutTenantInput = {
    applicationDate: Date | string
    status: $Enums.ApplicationStatus
    name: string
    email: string
    phoneNumber: string
    message?: string | null
    lease?: LeaseCreateNestedOneWithoutApplicationInput
    property: PropertyCreateNestedOneWithoutApplicationsInput
  }

  export type ApplicationUncheckedCreateWithoutTenantInput = {
    id?: number
    applicationDate: Date | string
    status: $Enums.ApplicationStatus
    propertyId: number
    name: string
    email: string
    phoneNumber: string
    message?: string | null
    leaseId?: number | null
  }

  export type ApplicationCreateOrConnectWithoutTenantInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutTenantInput, ApplicationUncheckedCreateWithoutTenantInput>
  }

  export type ApplicationCreateManyTenantInputEnvelope = {
    data: ApplicationCreateManyTenantInput | ApplicationCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type LeaseCreateWithoutTenantInput = {
    startDate: Date | string
    endDate: Date | string
    rent: number
    deposit: number
    application?: ApplicationCreateNestedOneWithoutLeaseInput
    property: PropertyCreateNestedOneWithoutLeasesInput
    payments?: PaymentCreateNestedManyWithoutLeaseInput
  }

  export type LeaseUncheckedCreateWithoutTenantInput = {
    id?: number
    startDate: Date | string
    endDate: Date | string
    rent: number
    deposit: number
    propertyId: number
    application?: ApplicationUncheckedCreateNestedOneWithoutLeaseInput
    payments?: PaymentUncheckedCreateNestedManyWithoutLeaseInput
  }

  export type LeaseCreateOrConnectWithoutTenantInput = {
    where: LeaseWhereUniqueInput
    create: XOR<LeaseCreateWithoutTenantInput, LeaseUncheckedCreateWithoutTenantInput>
  }

  export type LeaseCreateManyTenantInputEnvelope = {
    data: LeaseCreateManyTenantInput | LeaseCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type PropertyCreateWithoutFavoritedByInput = {
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    applications?: ApplicationCreateNestedManyWithoutPropertyInput
    leases?: LeaseCreateNestedManyWithoutPropertyInput
    location: LocationCreateNestedOneWithoutPropertiesInput
    manager: ManagerCreateNestedOneWithoutManagedPropertiesInput
    tenants?: TenantCreateNestedManyWithoutPropertiesInput
  }

  export type PropertyUncheckedCreateWithoutFavoritedByInput = {
    id?: number
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    locationId: number
    managerNextAuthId: string
    applications?: ApplicationUncheckedCreateNestedManyWithoutPropertyInput
    leases?: LeaseUncheckedCreateNestedManyWithoutPropertyInput
    tenants?: TenantUncheckedCreateNestedManyWithoutPropertiesInput
  }

  export type PropertyCreateOrConnectWithoutFavoritedByInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutFavoritedByInput, PropertyUncheckedCreateWithoutFavoritedByInput>
  }

  export type PropertyCreateWithoutTenantsInput = {
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    applications?: ApplicationCreateNestedManyWithoutPropertyInput
    leases?: LeaseCreateNestedManyWithoutPropertyInput
    location: LocationCreateNestedOneWithoutPropertiesInput
    manager: ManagerCreateNestedOneWithoutManagedPropertiesInput
    favoritedBy?: TenantCreateNestedManyWithoutFavoritesInput
  }

  export type PropertyUncheckedCreateWithoutTenantsInput = {
    id?: number
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    locationId: number
    managerNextAuthId: string
    applications?: ApplicationUncheckedCreateNestedManyWithoutPropertyInput
    leases?: LeaseUncheckedCreateNestedManyWithoutPropertyInput
    favoritedBy?: TenantUncheckedCreateNestedManyWithoutFavoritesInput
  }

  export type PropertyCreateOrConnectWithoutTenantsInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutTenantsInput, PropertyUncheckedCreateWithoutTenantsInput>
  }

  export type ApplicationUpsertWithWhereUniqueWithoutTenantInput = {
    where: ApplicationWhereUniqueInput
    update: XOR<ApplicationUpdateWithoutTenantInput, ApplicationUncheckedUpdateWithoutTenantInput>
    create: XOR<ApplicationCreateWithoutTenantInput, ApplicationUncheckedCreateWithoutTenantInput>
  }

  export type ApplicationUpdateWithWhereUniqueWithoutTenantInput = {
    where: ApplicationWhereUniqueInput
    data: XOR<ApplicationUpdateWithoutTenantInput, ApplicationUncheckedUpdateWithoutTenantInput>
  }

  export type ApplicationUpdateManyWithWhereWithoutTenantInput = {
    where: ApplicationScalarWhereInput
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyWithoutTenantInput>
  }

  export type LeaseUpsertWithWhereUniqueWithoutTenantInput = {
    where: LeaseWhereUniqueInput
    update: XOR<LeaseUpdateWithoutTenantInput, LeaseUncheckedUpdateWithoutTenantInput>
    create: XOR<LeaseCreateWithoutTenantInput, LeaseUncheckedCreateWithoutTenantInput>
  }

  export type LeaseUpdateWithWhereUniqueWithoutTenantInput = {
    where: LeaseWhereUniqueInput
    data: XOR<LeaseUpdateWithoutTenantInput, LeaseUncheckedUpdateWithoutTenantInput>
  }

  export type LeaseUpdateManyWithWhereWithoutTenantInput = {
    where: LeaseScalarWhereInput
    data: XOR<LeaseUpdateManyMutationInput, LeaseUncheckedUpdateManyWithoutTenantInput>
  }

  export type PropertyUpsertWithWhereUniqueWithoutFavoritedByInput = {
    where: PropertyWhereUniqueInput
    update: XOR<PropertyUpdateWithoutFavoritedByInput, PropertyUncheckedUpdateWithoutFavoritedByInput>
    create: XOR<PropertyCreateWithoutFavoritedByInput, PropertyUncheckedCreateWithoutFavoritedByInput>
  }

  export type PropertyUpdateWithWhereUniqueWithoutFavoritedByInput = {
    where: PropertyWhereUniqueInput
    data: XOR<PropertyUpdateWithoutFavoritedByInput, PropertyUncheckedUpdateWithoutFavoritedByInput>
  }

  export type PropertyUpdateManyWithWhereWithoutFavoritedByInput = {
    where: PropertyScalarWhereInput
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyWithoutFavoritedByInput>
  }

  export type PropertyUpsertWithWhereUniqueWithoutTenantsInput = {
    where: PropertyWhereUniqueInput
    update: XOR<PropertyUpdateWithoutTenantsInput, PropertyUncheckedUpdateWithoutTenantsInput>
    create: XOR<PropertyCreateWithoutTenantsInput, PropertyUncheckedCreateWithoutTenantsInput>
  }

  export type PropertyUpdateWithWhereUniqueWithoutTenantsInput = {
    where: PropertyWhereUniqueInput
    data: XOR<PropertyUpdateWithoutTenantsInput, PropertyUncheckedUpdateWithoutTenantsInput>
  }

  export type PropertyUpdateManyWithWhereWithoutTenantsInput = {
    where: PropertyScalarWhereInput
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyWithoutTenantsInput>
  }

  export type PropertyCreateWithoutLocationInput = {
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    applications?: ApplicationCreateNestedManyWithoutPropertyInput
    leases?: LeaseCreateNestedManyWithoutPropertyInput
    manager: ManagerCreateNestedOneWithoutManagedPropertiesInput
    favoritedBy?: TenantCreateNestedManyWithoutFavoritesInput
    tenants?: TenantCreateNestedManyWithoutPropertiesInput
  }

  export type PropertyUncheckedCreateWithoutLocationInput = {
    id?: number
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    managerNextAuthId: string
    applications?: ApplicationUncheckedCreateNestedManyWithoutPropertyInput
    leases?: LeaseUncheckedCreateNestedManyWithoutPropertyInput
    favoritedBy?: TenantUncheckedCreateNestedManyWithoutFavoritesInput
    tenants?: TenantUncheckedCreateNestedManyWithoutPropertiesInput
  }

  export type PropertyCreateOrConnectWithoutLocationInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutLocationInput, PropertyUncheckedCreateWithoutLocationInput>
  }

  export type PropertyUpsertWithWhereUniqueWithoutLocationInput = {
    where: PropertyWhereUniqueInput
    update: XOR<PropertyUpdateWithoutLocationInput, PropertyUncheckedUpdateWithoutLocationInput>
    create: XOR<PropertyCreateWithoutLocationInput, PropertyUncheckedCreateWithoutLocationInput>
  }

  export type PropertyCreateManyLocationInputEnvelope = {
    data: PropertyCreateManyLocationInput | PropertyCreateManyLocationInput[]
    skipDuplicates?: boolean
  }

  export type PropertyUpdateWithWhereUniqueWithoutLocationInput = {
    where: PropertyWhereUniqueInput
    data: XOR<PropertyUpdateWithoutLocationInput, PropertyUncheckedUpdateWithoutLocationInput>
  }

  export type PropertyUpdateManyWithWhereWithoutLocationInput = {
    where: PropertyScalarWhereInput
    data: XOR<PropertyUpdateManyMutationInput, PropertyUncheckedUpdateManyWithoutLocationInput>
  }

  export type LeaseCreateWithoutApplicationInput = {
    startDate: Date | string
    endDate: Date | string
    rent: number
    deposit: number
    property: PropertyCreateNestedOneWithoutLeasesInput
    tenant: TenantCreateNestedOneWithoutLeasesInput
    payments?: PaymentCreateNestedManyWithoutLeaseInput
  }

  export type LeaseUncheckedCreateWithoutApplicationInput = {
    id?: number
    startDate: Date | string
    endDate: Date | string
    rent: number
    deposit: number
    propertyId: number
    tenantNextAuthId: string
    payments?: PaymentUncheckedCreateNestedManyWithoutLeaseInput
  }

  export type LeaseCreateOrConnectWithoutApplicationInput = {
    where: LeaseWhereUniqueInput
    create: XOR<LeaseCreateWithoutApplicationInput, LeaseUncheckedCreateWithoutApplicationInput>
  }

  export type PropertyCreateWithoutApplicationsInput = {
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    leases?: LeaseCreateNestedManyWithoutPropertyInput
    location: LocationCreateNestedOneWithoutPropertiesInput
    manager: ManagerCreateNestedOneWithoutManagedPropertiesInput
    favoritedBy?: TenantCreateNestedManyWithoutFavoritesInput
    tenants?: TenantCreateNestedManyWithoutPropertiesInput
  }

  export type PropertyUncheckedCreateWithoutApplicationsInput = {
    id?: number
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    locationId: number
    managerNextAuthId: string
    leases?: LeaseUncheckedCreateNestedManyWithoutPropertyInput
    favoritedBy?: TenantUncheckedCreateNestedManyWithoutFavoritesInput
    tenants?: TenantUncheckedCreateNestedManyWithoutPropertiesInput
  }

  export type PropertyCreateOrConnectWithoutApplicationsInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutApplicationsInput, PropertyUncheckedCreateWithoutApplicationsInput>
  }

  export type TenantCreateWithoutApplicationsInput = {
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
    leases?: LeaseCreateNestedManyWithoutTenantInput
    favorites?: PropertyCreateNestedManyWithoutFavoritedByInput
    properties?: PropertyCreateNestedManyWithoutTenantsInput
  }

  export type TenantUncheckedCreateWithoutApplicationsInput = {
    id?: number
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
    leases?: LeaseUncheckedCreateNestedManyWithoutTenantInput
    favorites?: PropertyUncheckedCreateNestedManyWithoutFavoritedByInput
    properties?: PropertyUncheckedCreateNestedManyWithoutTenantsInput
  }

  export type TenantCreateOrConnectWithoutApplicationsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutApplicationsInput, TenantUncheckedCreateWithoutApplicationsInput>
  }

  export type LeaseUpsertWithoutApplicationInput = {
    update: XOR<LeaseUpdateWithoutApplicationInput, LeaseUncheckedUpdateWithoutApplicationInput>
    create: XOR<LeaseCreateWithoutApplicationInput, LeaseUncheckedCreateWithoutApplicationInput>
    where?: LeaseWhereInput
  }

  export type LeaseUpdateToOneWithWhereWithoutApplicationInput = {
    where?: LeaseWhereInput
    data: XOR<LeaseUpdateWithoutApplicationInput, LeaseUncheckedUpdateWithoutApplicationInput>
  }

  export type LeaseUpdateWithoutApplicationInput = {
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    rent?: FloatFieldUpdateOperationsInput | number
    deposit?: FloatFieldUpdateOperationsInput | number
    property?: PropertyUpdateOneRequiredWithoutLeasesNestedInput
    tenant?: TenantUpdateOneRequiredWithoutLeasesNestedInput
    payments?: PaymentUpdateManyWithoutLeaseNestedInput
  }

  export type LeaseUncheckedUpdateWithoutApplicationInput = {
    id?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    rent?: FloatFieldUpdateOperationsInput | number
    deposit?: FloatFieldUpdateOperationsInput | number
    propertyId?: IntFieldUpdateOperationsInput | number
    tenantNextAuthId?: StringFieldUpdateOperationsInput | string
    payments?: PaymentUncheckedUpdateManyWithoutLeaseNestedInput
  }

  export type PropertyUpsertWithoutApplicationsInput = {
    update: XOR<PropertyUpdateWithoutApplicationsInput, PropertyUncheckedUpdateWithoutApplicationsInput>
    create: XOR<PropertyCreateWithoutApplicationsInput, PropertyUncheckedCreateWithoutApplicationsInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutApplicationsInput, PropertyUncheckedUpdateWithoutApplicationsInput>
  }

  export type PropertyUpdateWithoutApplicationsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    leases?: LeaseUpdateManyWithoutPropertyNestedInput
    location?: LocationUpdateOneRequiredWithoutPropertiesNestedInput
    manager?: ManagerUpdateOneRequiredWithoutManagedPropertiesNestedInput
    favoritedBy?: TenantUpdateManyWithoutFavoritesNestedInput
    tenants?: TenantUpdateManyWithoutPropertiesNestedInput
  }

  export type PropertyUncheckedUpdateWithoutApplicationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    managerNextAuthId?: StringFieldUpdateOperationsInput | string
    leases?: LeaseUncheckedUpdateManyWithoutPropertyNestedInput
    favoritedBy?: TenantUncheckedUpdateManyWithoutFavoritesNestedInput
    tenants?: TenantUncheckedUpdateManyWithoutPropertiesNestedInput
  }

  export type TenantUpsertWithoutApplicationsInput = {
    update: XOR<TenantUpdateWithoutApplicationsInput, TenantUncheckedUpdateWithoutApplicationsInput>
    create: XOR<TenantCreateWithoutApplicationsInput, TenantUncheckedCreateWithoutApplicationsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutApplicationsInput, TenantUncheckedUpdateWithoutApplicationsInput>
  }

  export type TenantUpdateWithoutApplicationsInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
    leases?: LeaseUpdateManyWithoutTenantNestedInput
    favorites?: PropertyUpdateManyWithoutFavoritedByNestedInput
    properties?: PropertyUpdateManyWithoutTenantsNestedInput
  }

  export type TenantUncheckedUpdateWithoutApplicationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
    leases?: LeaseUncheckedUpdateManyWithoutTenantNestedInput
    favorites?: PropertyUncheckedUpdateManyWithoutFavoritedByNestedInput
    properties?: PropertyUncheckedUpdateManyWithoutTenantsNestedInput
  }

  export type ApplicationCreateWithoutLeaseInput = {
    applicationDate: Date | string
    status: $Enums.ApplicationStatus
    name: string
    email: string
    phoneNumber: string
    message?: string | null
    property: PropertyCreateNestedOneWithoutApplicationsInput
    tenant: TenantCreateNestedOneWithoutApplicationsInput
  }

  export type ApplicationUncheckedCreateWithoutLeaseInput = {
    id?: number
    applicationDate: Date | string
    status: $Enums.ApplicationStatus
    propertyId: number
    name: string
    email: string
    phoneNumber: string
    message?: string | null
    tenantNextAuthId: string
  }

  export type ApplicationCreateOrConnectWithoutLeaseInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutLeaseInput, ApplicationUncheckedCreateWithoutLeaseInput>
  }

  export type PropertyCreateWithoutLeasesInput = {
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    applications?: ApplicationCreateNestedManyWithoutPropertyInput
    location: LocationCreateNestedOneWithoutPropertiesInput
    manager: ManagerCreateNestedOneWithoutManagedPropertiesInput
    favoritedBy?: TenantCreateNestedManyWithoutFavoritesInput
    tenants?: TenantCreateNestedManyWithoutPropertiesInput
  }

  export type PropertyUncheckedCreateWithoutLeasesInput = {
    id?: number
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    locationId: number
    managerNextAuthId: string
    applications?: ApplicationUncheckedCreateNestedManyWithoutPropertyInput
    favoritedBy?: TenantUncheckedCreateNestedManyWithoutFavoritesInput
    tenants?: TenantUncheckedCreateNestedManyWithoutPropertiesInput
  }

  export type PropertyCreateOrConnectWithoutLeasesInput = {
    where: PropertyWhereUniqueInput
    create: XOR<PropertyCreateWithoutLeasesInput, PropertyUncheckedCreateWithoutLeasesInput>
  }

  export type TenantCreateWithoutLeasesInput = {
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
    applications?: ApplicationCreateNestedManyWithoutTenantInput
    favorites?: PropertyCreateNestedManyWithoutFavoritedByInput
    properties?: PropertyCreateNestedManyWithoutTenantsInput
  }

  export type TenantUncheckedCreateWithoutLeasesInput = {
    id?: number
    name: string
    email: string
    phoneNumber: string
    nextAuthId: string
    applications?: ApplicationUncheckedCreateNestedManyWithoutTenantInput
    favorites?: PropertyUncheckedCreateNestedManyWithoutFavoritedByInput
    properties?: PropertyUncheckedCreateNestedManyWithoutTenantsInput
  }

  export type TenantCreateOrConnectWithoutLeasesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutLeasesInput, TenantUncheckedCreateWithoutLeasesInput>
  }

  export type PaymentCreateWithoutLeaseInput = {
    amountDue: number
    amountPaid: number
    dueDate: Date | string
    paymentDate: Date | string
    paymentStatus: $Enums.PaymentStatus
  }

  export type PaymentUncheckedCreateWithoutLeaseInput = {
    id?: number
    amountDue: number
    amountPaid: number
    dueDate: Date | string
    paymentDate: Date | string
    paymentStatus: $Enums.PaymentStatus
  }

  export type PaymentCreateOrConnectWithoutLeaseInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutLeaseInput, PaymentUncheckedCreateWithoutLeaseInput>
  }

  export type PaymentCreateManyLeaseInputEnvelope = {
    data: PaymentCreateManyLeaseInput | PaymentCreateManyLeaseInput[]
    skipDuplicates?: boolean
  }

  export type ApplicationUpsertWithoutLeaseInput = {
    update: XOR<ApplicationUpdateWithoutLeaseInput, ApplicationUncheckedUpdateWithoutLeaseInput>
    create: XOR<ApplicationCreateWithoutLeaseInput, ApplicationUncheckedCreateWithoutLeaseInput>
    where?: ApplicationWhereInput
  }

  export type ApplicationUpdateToOneWithWhereWithoutLeaseInput = {
    where?: ApplicationWhereInput
    data: XOR<ApplicationUpdateWithoutLeaseInput, ApplicationUncheckedUpdateWithoutLeaseInput>
  }

  export type ApplicationUpdateWithoutLeaseInput = {
    applicationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    property?: PropertyUpdateOneRequiredWithoutApplicationsNestedInput
    tenant?: TenantUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutLeaseInput = {
    id?: IntFieldUpdateOperationsInput | number
    applicationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    propertyId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    tenantNextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type PropertyUpsertWithoutLeasesInput = {
    update: XOR<PropertyUpdateWithoutLeasesInput, PropertyUncheckedUpdateWithoutLeasesInput>
    create: XOR<PropertyCreateWithoutLeasesInput, PropertyUncheckedCreateWithoutLeasesInput>
    where?: PropertyWhereInput
  }

  export type PropertyUpdateToOneWithWhereWithoutLeasesInput = {
    where?: PropertyWhereInput
    data: XOR<PropertyUpdateWithoutLeasesInput, PropertyUncheckedUpdateWithoutLeasesInput>
  }

  export type PropertyUpdateWithoutLeasesInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    applications?: ApplicationUpdateManyWithoutPropertyNestedInput
    location?: LocationUpdateOneRequiredWithoutPropertiesNestedInput
    manager?: ManagerUpdateOneRequiredWithoutManagedPropertiesNestedInput
    favoritedBy?: TenantUpdateManyWithoutFavoritesNestedInput
    tenants?: TenantUpdateManyWithoutPropertiesNestedInput
  }

  export type PropertyUncheckedUpdateWithoutLeasesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    managerNextAuthId?: StringFieldUpdateOperationsInput | string
    applications?: ApplicationUncheckedUpdateManyWithoutPropertyNestedInput
    favoritedBy?: TenantUncheckedUpdateManyWithoutFavoritesNestedInput
    tenants?: TenantUncheckedUpdateManyWithoutPropertiesNestedInput
  }

  export type TenantUpsertWithoutLeasesInput = {
    update: XOR<TenantUpdateWithoutLeasesInput, TenantUncheckedUpdateWithoutLeasesInput>
    create: XOR<TenantCreateWithoutLeasesInput, TenantUncheckedCreateWithoutLeasesInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutLeasesInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutLeasesInput, TenantUncheckedUpdateWithoutLeasesInput>
  }

  export type TenantUpdateWithoutLeasesInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
    applications?: ApplicationUpdateManyWithoutTenantNestedInput
    favorites?: PropertyUpdateManyWithoutFavoritedByNestedInput
    properties?: PropertyUpdateManyWithoutTenantsNestedInput
  }

  export type TenantUncheckedUpdateWithoutLeasesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
    applications?: ApplicationUncheckedUpdateManyWithoutTenantNestedInput
    favorites?: PropertyUncheckedUpdateManyWithoutFavoritedByNestedInput
    properties?: PropertyUncheckedUpdateManyWithoutTenantsNestedInput
  }

  export type PaymentUpsertWithWhereUniqueWithoutLeaseInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutLeaseInput, PaymentUncheckedUpdateWithoutLeaseInput>
    create: XOR<PaymentCreateWithoutLeaseInput, PaymentUncheckedCreateWithoutLeaseInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutLeaseInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutLeaseInput, PaymentUncheckedUpdateWithoutLeaseInput>
  }

  export type PaymentUpdateManyWithWhereWithoutLeaseInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutLeaseInput>
  }

  export type PaymentScalarWhereInput = {
    AND?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    OR?: PaymentScalarWhereInput[]
    NOT?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    id?: IntFilter<"Payment"> | number
    amountDue?: FloatFilter<"Payment"> | number
    amountPaid?: FloatFilter<"Payment"> | number
    dueDate?: DateTimeFilter<"Payment"> | Date | string
    paymentDate?: DateTimeFilter<"Payment"> | Date | string
    paymentStatus?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    leaseId?: IntFilter<"Payment"> | number
  }

  export type LeaseCreateWithoutPaymentsInput = {
    startDate: Date | string
    endDate: Date | string
    rent: number
    deposit: number
    application?: ApplicationCreateNestedOneWithoutLeaseInput
    property: PropertyCreateNestedOneWithoutLeasesInput
    tenant: TenantCreateNestedOneWithoutLeasesInput
  }

  export type LeaseUncheckedCreateWithoutPaymentsInput = {
    id?: number
    startDate: Date | string
    endDate: Date | string
    rent: number
    deposit: number
    propertyId: number
    tenantNextAuthId: string
    application?: ApplicationUncheckedCreateNestedOneWithoutLeaseInput
  }

  export type LeaseCreateOrConnectWithoutPaymentsInput = {
    where: LeaseWhereUniqueInput
    create: XOR<LeaseCreateWithoutPaymentsInput, LeaseUncheckedCreateWithoutPaymentsInput>
  }

  export type LeaseUpsertWithoutPaymentsInput = {
    update: XOR<LeaseUpdateWithoutPaymentsInput, LeaseUncheckedUpdateWithoutPaymentsInput>
    create: XOR<LeaseCreateWithoutPaymentsInput, LeaseUncheckedCreateWithoutPaymentsInput>
    where?: LeaseWhereInput
  }

  export type LeaseUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: LeaseWhereInput
    data: XOR<LeaseUpdateWithoutPaymentsInput, LeaseUncheckedUpdateWithoutPaymentsInput>
  }

  export type LeaseUpdateWithoutPaymentsInput = {
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    rent?: FloatFieldUpdateOperationsInput | number
    deposit?: FloatFieldUpdateOperationsInput | number
    application?: ApplicationUpdateOneWithoutLeaseNestedInput
    property?: PropertyUpdateOneRequiredWithoutLeasesNestedInput
    tenant?: TenantUpdateOneRequiredWithoutLeasesNestedInput
  }

  export type LeaseUncheckedUpdateWithoutPaymentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    rent?: FloatFieldUpdateOperationsInput | number
    deposit?: FloatFieldUpdateOperationsInput | number
    propertyId?: IntFieldUpdateOperationsInput | number
    tenantNextAuthId?: StringFieldUpdateOperationsInput | string
    application?: ApplicationUncheckedUpdateOneWithoutLeaseNestedInput
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationCreateManyPropertyInput = {
    id?: number
    applicationDate: Date | string
    status: $Enums.ApplicationStatus
    name: string
    email: string
    phoneNumber: string
    message?: string | null
    leaseId?: number | null
    tenantNextAuthId: string
  }

  export type LeaseCreateManyPropertyInput = {
    id?: number
    startDate: Date | string
    endDate: Date | string
    rent: number
    deposit: number
    tenantNextAuthId: string
  }

  export type ApplicationUpdateWithoutPropertyInput = {
    applicationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    lease?: LeaseUpdateOneWithoutApplicationNestedInput
    tenant?: TenantUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutPropertyInput = {
    id?: IntFieldUpdateOperationsInput | number
    applicationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    leaseId?: NullableIntFieldUpdateOperationsInput | number | null
    tenantNextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type ApplicationUncheckedUpdateManyWithoutPropertyInput = {
    id?: IntFieldUpdateOperationsInput | number
    applicationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    leaseId?: NullableIntFieldUpdateOperationsInput | number | null
    tenantNextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type LeaseUpdateWithoutPropertyInput = {
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    rent?: FloatFieldUpdateOperationsInput | number
    deposit?: FloatFieldUpdateOperationsInput | number
    application?: ApplicationUpdateOneWithoutLeaseNestedInput
    tenant?: TenantUpdateOneRequiredWithoutLeasesNestedInput
    payments?: PaymentUpdateManyWithoutLeaseNestedInput
  }

  export type LeaseUncheckedUpdateWithoutPropertyInput = {
    id?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    rent?: FloatFieldUpdateOperationsInput | number
    deposit?: FloatFieldUpdateOperationsInput | number
    tenantNextAuthId?: StringFieldUpdateOperationsInput | string
    application?: ApplicationUncheckedUpdateOneWithoutLeaseNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutLeaseNestedInput
  }

  export type LeaseUncheckedUpdateManyWithoutPropertyInput = {
    id?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    rent?: FloatFieldUpdateOperationsInput | number
    deposit?: FloatFieldUpdateOperationsInput | number
    tenantNextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type TenantUpdateWithoutFavoritesInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
    applications?: ApplicationUpdateManyWithoutTenantNestedInput
    leases?: LeaseUpdateManyWithoutTenantNestedInput
    properties?: PropertyUpdateManyWithoutTenantsNestedInput
  }

  export type TenantUncheckedUpdateWithoutFavoritesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
    applications?: ApplicationUncheckedUpdateManyWithoutTenantNestedInput
    leases?: LeaseUncheckedUpdateManyWithoutTenantNestedInput
    properties?: PropertyUncheckedUpdateManyWithoutTenantsNestedInput
  }

  export type TenantUncheckedUpdateManyWithoutFavoritesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type TenantUpdateWithoutPropertiesInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
    applications?: ApplicationUpdateManyWithoutTenantNestedInput
    leases?: LeaseUpdateManyWithoutTenantNestedInput
    favorites?: PropertyUpdateManyWithoutFavoritedByNestedInput
  }

  export type TenantUncheckedUpdateWithoutPropertiesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
    applications?: ApplicationUncheckedUpdateManyWithoutTenantNestedInput
    leases?: LeaseUncheckedUpdateManyWithoutTenantNestedInput
    favorites?: PropertyUncheckedUpdateManyWithoutFavoritedByNestedInput
  }

  export type TenantUncheckedUpdateManyWithoutPropertiesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    nextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type PropertyCreateManyManagerInput = {
    id?: number
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    locationId: number
  }

  export type PropertyUpdateWithoutManagerInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    applications?: ApplicationUpdateManyWithoutPropertyNestedInput
    leases?: LeaseUpdateManyWithoutPropertyNestedInput
    location?: LocationUpdateOneRequiredWithoutPropertiesNestedInput
    favoritedBy?: TenantUpdateManyWithoutFavoritesNestedInput
    tenants?: TenantUpdateManyWithoutPropertiesNestedInput
  }

  export type PropertyUncheckedUpdateWithoutManagerInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    applications?: ApplicationUncheckedUpdateManyWithoutPropertyNestedInput
    leases?: LeaseUncheckedUpdateManyWithoutPropertyNestedInput
    favoritedBy?: TenantUncheckedUpdateManyWithoutFavoritesNestedInput
    tenants?: TenantUncheckedUpdateManyWithoutPropertiesNestedInput
  }

  export type PropertyUncheckedUpdateManyWithoutManagerInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
  }

  export type ApplicationCreateManyTenantInput = {
    id?: number
    applicationDate: Date | string
    status: $Enums.ApplicationStatus
    propertyId: number
    name: string
    email: string
    phoneNumber: string
    message?: string | null
    leaseId?: number | null
  }

  export type LeaseCreateManyTenantInput = {
    id?: number
    startDate: Date | string
    endDate: Date | string
    rent: number
    deposit: number
    propertyId: number
  }

  export type ApplicationUpdateWithoutTenantInput = {
    applicationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    lease?: LeaseUpdateOneWithoutApplicationNestedInput
    property?: PropertyUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    applicationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    propertyId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    leaseId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ApplicationUncheckedUpdateManyWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    applicationDate?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    propertyId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phoneNumber?: StringFieldUpdateOperationsInput | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    leaseId?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type LeaseUpdateWithoutTenantInput = {
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    rent?: FloatFieldUpdateOperationsInput | number
    deposit?: FloatFieldUpdateOperationsInput | number
    application?: ApplicationUpdateOneWithoutLeaseNestedInput
    property?: PropertyUpdateOneRequiredWithoutLeasesNestedInput
    payments?: PaymentUpdateManyWithoutLeaseNestedInput
  }

  export type LeaseUncheckedUpdateWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    rent?: FloatFieldUpdateOperationsInput | number
    deposit?: FloatFieldUpdateOperationsInput | number
    propertyId?: IntFieldUpdateOperationsInput | number
    application?: ApplicationUncheckedUpdateOneWithoutLeaseNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutLeaseNestedInput
  }

  export type LeaseUncheckedUpdateManyWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    rent?: FloatFieldUpdateOperationsInput | number
    deposit?: FloatFieldUpdateOperationsInput | number
    propertyId?: IntFieldUpdateOperationsInput | number
  }

  export type PropertyUpdateWithoutFavoritedByInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    applications?: ApplicationUpdateManyWithoutPropertyNestedInput
    leases?: LeaseUpdateManyWithoutPropertyNestedInput
    location?: LocationUpdateOneRequiredWithoutPropertiesNestedInput
    manager?: ManagerUpdateOneRequiredWithoutManagedPropertiesNestedInput
    tenants?: TenantUpdateManyWithoutPropertiesNestedInput
  }

  export type PropertyUncheckedUpdateWithoutFavoritedByInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    managerNextAuthId?: StringFieldUpdateOperationsInput | string
    applications?: ApplicationUncheckedUpdateManyWithoutPropertyNestedInput
    leases?: LeaseUncheckedUpdateManyWithoutPropertyNestedInput
    tenants?: TenantUncheckedUpdateManyWithoutPropertiesNestedInput
  }

  export type PropertyUncheckedUpdateManyWithoutFavoritedByInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    managerNextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type PropertyUpdateWithoutTenantsInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    applications?: ApplicationUpdateManyWithoutPropertyNestedInput
    leases?: LeaseUpdateManyWithoutPropertyNestedInput
    location?: LocationUpdateOneRequiredWithoutPropertiesNestedInput
    manager?: ManagerUpdateOneRequiredWithoutManagedPropertiesNestedInput
    favoritedBy?: TenantUpdateManyWithoutFavoritesNestedInput
  }

  export type PropertyUncheckedUpdateWithoutTenantsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    managerNextAuthId?: StringFieldUpdateOperationsInput | string
    applications?: ApplicationUncheckedUpdateManyWithoutPropertyNestedInput
    leases?: LeaseUncheckedUpdateManyWithoutPropertyNestedInput
    favoritedBy?: TenantUncheckedUpdateManyWithoutFavoritesNestedInput
  }

  export type PropertyUncheckedUpdateManyWithoutTenantsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    locationId?: IntFieldUpdateOperationsInput | number
    managerNextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type PropertyUpdateWithoutLocationInput = {
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    applications?: ApplicationUpdateManyWithoutPropertyNestedInput
    leases?: LeaseUpdateManyWithoutPropertyNestedInput
    manager?: ManagerUpdateOneRequiredWithoutManagedPropertiesNestedInput
    favoritedBy?: TenantUpdateManyWithoutFavoritesNestedInput
    tenants?: TenantUpdateManyWithoutPropertiesNestedInput
  }

  export type PropertyUncheckedUpdateWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    managerNextAuthId?: StringFieldUpdateOperationsInput | string
    applications?: ApplicationUncheckedUpdateManyWithoutPropertyNestedInput
    leases?: LeaseUncheckedUpdateManyWithoutPropertyNestedInput
    favoritedBy?: TenantUncheckedUpdateManyWithoutFavoritesNestedInput
    tenants?: TenantUncheckedUpdateManyWithoutPropertiesNestedInput
  }

  export type PropertyCreateManyLocationInput = {
    id?: number
    name: string
    description: string
    pricePerMonth: number
    securityDeposit: number
    applicationFee: number
    photoUrls?: PropertyCreatephotoUrlsInput | string[]
    amenities?: PropertyCreateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyCreatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: boolean
    isParkingIncluded?: boolean
    beds: number
    baths: number
    squareFeet: number
    propertyType: $Enums.PropertyType
    postedDate?: Date | string
    averageRating?: number | null
    numberOfReviews?: number | null
    managerNextAuthId: string
  }

  export type PropertyUncheckedUpdateManyWithoutLocationInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    pricePerMonth?: FloatFieldUpdateOperationsInput | number
    securityDeposit?: FloatFieldUpdateOperationsInput | number
    applicationFee?: FloatFieldUpdateOperationsInput | number
    photoUrls?: PropertyUpdatephotoUrlsInput | string[]
    amenities?: PropertyUpdateamenitiesInput | $Enums.Amenity[]
    highlights?: PropertyUpdatehighlightsInput | $Enums.Highlight[]
    isPetsAllowed?: BoolFieldUpdateOperationsInput | boolean
    isParkingIncluded?: BoolFieldUpdateOperationsInput | boolean
    beds?: IntFieldUpdateOperationsInput | number
    baths?: FloatFieldUpdateOperationsInput | number
    squareFeet?: IntFieldUpdateOperationsInput | number
    propertyType?: EnumPropertyTypeFieldUpdateOperationsInput | $Enums.PropertyType
    postedDate?: DateTimeFieldUpdateOperationsInput | Date | string
    averageRating?: NullableFloatFieldUpdateOperationsInput | number | null
    numberOfReviews?: NullableIntFieldUpdateOperationsInput | number | null
    managerNextAuthId?: StringFieldUpdateOperationsInput | string
  }

  export type PaymentCreateManyLeaseInput = {
    id?: number
    amountDue: number
    amountPaid: number
    dueDate: Date | string
    paymentDate: Date | string
    paymentStatus: $Enums.PaymentStatus
  }

  export type PaymentUpdateWithoutLeaseInput = {
    amountDue?: FloatFieldUpdateOperationsInput | number
    amountPaid?: FloatFieldUpdateOperationsInput | number
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
  }

  export type PaymentUncheckedUpdateWithoutLeaseInput = {
    id?: IntFieldUpdateOperationsInput | number
    amountDue?: FloatFieldUpdateOperationsInput | number
    amountPaid?: FloatFieldUpdateOperationsInput | number
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
  }

  export type PaymentUncheckedUpdateManyWithoutLeaseInput = {
    id?: IntFieldUpdateOperationsInput | number
    amountDue?: FloatFieldUpdateOperationsInput | number
    amountPaid?: FloatFieldUpdateOperationsInput | number
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentStatus?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}