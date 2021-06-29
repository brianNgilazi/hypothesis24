/**
 * A User of the web app
 */
export interface User {
  /**
   * unique user id
   */
  uid: string;
  username: string;
  email: string;
  photoUrl?: string;
  created: Date;
}
