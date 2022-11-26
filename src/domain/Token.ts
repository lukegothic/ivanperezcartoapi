export class Token {
  access_token: string;
  scope: string;
  expires_in: number;
  token_type: string;

  constructor({ access_token, scope, expires_in, token_type }: Token) {
    this.access_token = access_token;
    this.scope = scope;
    this.expires_in = expires_in;
    this.token_type = token_type;
  }
}

export class ExpirableToken extends Token {
  created_at: number;
  constructor(token: Token) {
    super(token);
    this.created_at = process.uptime();
  }
  isExpired = (): boolean => process.uptime() > this.created_at + this.expires_in;
}
