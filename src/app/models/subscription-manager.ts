import { Subscription } from 'rxjs';

export class SubscriptionManager{

  /**
   * Unsubscribe from all subscriptions provided as an argument
   * @param subscriptions the SubscriptionCollection
   */
  public static unsubscribe(subscriptions: SubscriptionCollection){
    const subs = Object.values(subscriptions);
    subs.forEach(sub => sub.unsubscribe());
  }
}

export interface SubscriptionCollection{
  [key: string]: Subscription;
}
