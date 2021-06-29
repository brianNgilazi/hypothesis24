import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Article } from '../models/article.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class ArticleService {


  private readonly COLLECTION_GROUP_NAME = 'articles';
  articles: BehaviorSubject<Article[]>;
  Timestamp = firebase.default.firestore.Timestamp;

  constructor(private firestore: AngularFirestore, private authService: AuthService) { }

  //#region  Demo Values
  getDemoArticle(){
    return {
      title: 'Article Title',
      subtitle: 'An Interesting Subtitle',
      author: 'Article Author',
      authorId: '12345ABC6789',
      body: 'Mauris neque quam, fermentum ut nisl vitae, convallis maximus nisl. Sed mattis nunc id lorem euismod placerat.\
      Vivamus porttitor magna enim, ac accumsan tortor cursus at. Phasellus sed ultricies mi non congue ullam corper. Praesent tincidunt sed\
      tellus ut rutrum. Sed vitae justo condimentum, porta lectus vitae, ultricies congue gravida diam non fringilla.',
      references: [{label: 'Wikipedia', url: 'https://www.wikipedia.org'}],
      tags: ['latin', 'lorum ipsum'],
      created: new Date(),
      views: 0,
      id: '0sadgfg',
    } as Article;
  }

  getDemoArticles(count: number = 10): Observable<Article[]>{
    const article = this.getDemoArticle();
    const articles = new Array<Article>(count).fill(article);
    return of(articles);
  }
  //#endregion

  /**
   * Creates a new article in the database and updates its id value.
   * The authorName and authorId properties are also set.
   * @param article the article to be added to the database
   * @returns A promise resolved once the document has been created
   */
  createArticle(article: Article){
    article.author = this.user.username;
    article.authorId = this.user.uid;
    return this.firestore.collection(`users/${this.user.uid}/${this.COLLECTION_GROUP_NAME}`)
    .add({...article, created:  firebase.default.firestore.Timestamp.now().toDate()}).then(docRef => {
      docRef.update({id: docRef.id});
    });

  }

  moveArticle(article: Article, id: string){
    article.author = this.user.username;
    article.authorId = this.user.uid;
    return this.firestore.collection(`users/${this.user.uid}/${this.COLLECTION_GROUP_NAME}`)
    .doc(id).set(article);

  }

  /**
   * Update an article
   * @param article the article to be  update
   * @returns A Promise resolved once the update is complete
   */
  updateArticle(article: Article){
    const newArticle = article as any;

    if (!article.id) {return this.createArticle(article); }
    else {newArticle.modified = this.Timestamp.now(); }

    return this.firestore.collection(`users/${this.user.uid}/${this.COLLECTION_GROUP_NAME}`).doc(article.id)
    .update(newArticle);
  }

  /**
   *
   * @param articleId the id of the article to return
   * @returns an observable that emits the requested article if it exists.
   */
  getArticle(articleId: string){
    return this.getAllArticles().asObservable().pipe(map(articles => {
      console.log("find articles");
      return articles.find(article => article.id === articleId);
    }));
  }

  /**
   *  Deletes an article
   * @param articleId the id of the article to ID
   * @returns A promise that resolve when the article has been deleted
   */
  deleteArticle(articleId: string) {
    return this.firestore.collection(`users/${this.user.uid}/${this.COLLECTION_GROUP_NAME}`).doc(articleId)
    .delete();
  }

  /**
   * Get all articles that belong to the user
   * @returns an Observable that emits an array of all articles by the user
   */
  getUserArticles() {
    return this.firestore.collection(`users/${this.user.uid}/${this.COLLECTION_GROUP_NAME}`)
    .valueChanges().pipe(map(this.dateMapFunction()));
  }

  /**
   * Get all unique tags associated with an article
   * @returns An Observable that emits an array of all the unique tags
   */
  getTags(){
    return this.getAllArticles().asObservable().pipe(map(articles => {
      const tags: string[] = [];
      articles.forEach(article => {
        article.tags.forEach(tag => {
          if (!tags.includes(tag)){
            tags.push(tag);
          }
        });
      });
      return tags;
    }));
  }

  /**
   * Get all articles from tall users
   * @returns BehaviourSubject with a list of all the articles
   */
  getAllArticles(){

    if (this.articles) {return this.articles; }
    this.articles = new BehaviorSubject([]);
    this.firestore.collectionGroup<Article>(this.COLLECTION_GROUP_NAME).valueChanges().pipe(map(this.dateMapFunction()))
    .subscribe(articles => {
      this.articles.next(articles);
    }, error => console.log('Error fetching articles', error));
    return this.articles;
  }



  /**
   * Get all articles that have the provided tag
   * @param tag the tag to be used in the search
   * @returns an Observable that emits an array of all articles that have the provided tag
   */
  getArticlesByTag(tag: string) {
    return this.firestore.collectionGroup<Article>(this.COLLECTION_GROUP_NAME, ref => ref
      .where('tags', 'array-contains', tag)).valueChanges().pipe(map(this.dateMapFunction()));
  }


  /**
   * Returns the 5 most viewed articles
   * @returns an observable that emits the 5 most viewed articles
   */
  getTopArticles() {
    return this.firestore.collectionGroup<Article>(this.COLLECTION_GROUP_NAME, ref => ref
      .orderBy('views').limit(5)).valueChanges().pipe(map(this.dateMapFunction()));
  }




  /**
   * Increases the number of views of the article by 1.
   * @param articleId the id of the article.
   * @returns A prmise
   */
   increaseViews(article: Article){
    if (!article) {return; }
    return this.firestore.collection(`users/${article.authorId}/${this.COLLECTION_GROUP_NAME}`).doc(article.id)
    .update({views: firebase.default.firestore.FieldValue.increment(1)});
  }

  /**
   * Creates a new article in the database and updates its id value
   * @param draft the article to be added to the database
   * @returns A promise resolved once the document has been created
   */
   createDraft(draft: Article){
    draft.authorId = this.user.uid;
    return this.firestore.collection<Article>(`users/${this.user.uid}/drafts`)
    .add({...draft, created:  firebase.default.firestore.Timestamp.now().toDate()}).then(docRef => {
      docRef.update({id: docRef.id});
    });

  }

  /**
   * Update a draft
   * @param draft the draft article to be updated
   * @returns A Promise resolved once the update is complete
   */
  saveDraft(draft: Article){
    const newArticle = draft as any;

    if (!draft.id) {return this.createDraft(draft); }
    else {newArticle.modified = this.Timestamp.now(); }

    return this.firestore.collection<Article>(`users/${this.user.uid}/drafts`).doc(draft.id)
    .update(newArticle);
  }

  /**
   * Fetch the draft with the provided id
   * @param draftID the id of the article to return
   * @returns an observable that emits the requested draft if it exists.
   */
   getDraft(draftID: string){
    return this.firestore.collection<Article>(`users/${this.user.uid}/drafts`).doc(draftID).valueChanges();
  }

  /**
   * Get all drafts belonging to the currently logged in author
   * @returns an observable that emits all drafts belonging to the logged in auhtor
   */
  getUserDrafts(){
    return this.firestore.collection<Article>(`users/${this.user.uid}/drafts`).valueChanges().pipe(map(this.dateMapFunction()));
  }

  /**
   *  Deletes an article
   * @param draftID the id of the article to ID
   * @returns A promise that resolve when the article has been deleted
   */
  deleteDraft(draftID: string) {
    return this.firestore.collection<Article>(`users/${this.user.uid}/drafts`).doc(draftID).delete();
  }

  private dateMapFunction(){
    return (list: Article[]) => {
      list.forEach(article => {
        if (article.created && article.created instanceof this.Timestamp){
          article.created = article.created.toDate();
        }
        if (article.modified && article.modified instanceof this.Timestamp){
          article.modified = article.modified.toDate();
        }
      });
      return list;
    };

  }

  get user(){
    return this.authService.currentUser;
  }
}
