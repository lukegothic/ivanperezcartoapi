/**
 * Class that contains all the properties of the Token received from the auth request
 */
export class Token {
  /** @type {string} XXXX */
  access_token: string;
  /** @type {string} XXXX */
  scope: string;
  /** @type {number} Token expiration time (in seconds) */
  expires_in: number;
  /** @type {string} XXXX */
  token_type: string;

  constructor({ access_token, scope, expires_in, token_type }: Token) {
    this.access_token = access_token;
    this.scope = scope;
    this.expires_in = expires_in;
    this.token_type = token_type;
  }
}

/**
 * Token class that enables checking token expiration
 */
export class ExpirableToken extends Token {
  /** @type {Number} Time moment at which the token has been created */
  created_at: number;
  constructor(token: Token) {
    super(token);
    this.created_at = process.uptime();
  }
  /**
   * Checks if the token has expired
   * @returns {boolean} True if Token has expired
   */
  isExpired = (): boolean => process.uptime() > this.created_at + this.expires_in;
}
