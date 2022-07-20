/** Claims contained in the JSON Web Token we issue to our authenticated users;
 * see https://en.wikipedia.org/wiki/JSON_Web_Token#Standard_fields */
export type JwtPayload = {
  /** Internal users ID; we choose a property name of `sub` to hold our users ID value
   * to be consistent with JWT standards */
  sub: string;

  /** Identifies the time at which the JWT was issued, e.g. 1644228687.
   * This property is added automatically by passport-jwt. */
  iat?: number;

  /** Expiration time, e.g. 1644229587. This property is added automatically by passport-jwt. */
  exp?: number;

  /** e.g. "josearce" */
  username?: string;

  /** e.g. 'John Doe' */
  displayName: string;

  /** Profile emails, e.g. "demo@company.com" */
  emails?:
    | Array<{
        value: string;
        type?: string | undefined;
      }>
    | undefined;

  /** With which social login provider the users has logged in */
  provider: string;

  /** The users ID that the users has at his/her `provider` */
  providerId?: string;
};

export const JWT_COOKIE_NAME = 'jwt';
