import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { Article, ArticleReference } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';
import { FormArray } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { StorageFile } from 'src/app/models/storage-file.model';
import { StorageService } from 'src/app/services/storage.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-write-article',
  templateUrl: './write-article.component.html',
  styleUrls: ['./write-article.component.css']
})
export class WriteArticleComponent implements OnInit, OnDestroy {

  private articleId: string;
  public article$: Observable<Article>;
  public article: Article;
  public bodyLength$: Observable<number>;
  public minLength = 560;
  public errorMessage = '';
  public edit = false;
  public draft = false;

  public imageURL: string;

  public articleForm: FormGroup;
  private subscriptions: Subscription = new Subscription();
  draftId: string;



  constructor(
    public articlesService: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private storage: StorageService,
    ) { }




  ngOnInit(): void {
    this.creatForm();
    this.draftId = this.route.snapshot.paramMap.get('draft');
    if (this.draftId !== null) {this.draft = true; }

    this.articleId = this.route.snapshot.paramMap.get('id');
    if (this.articleId || this.draft){
      this.edit = true;
      const articles$ = this.draft ? this.articlesService.getDraft(this.articleId) :
      this.articlesService.getArticle(this.articleId);
      this.subscriptions.add(articles$.subscribe(article => {
        if (article){
          this.articleForm.patchValue(article);
          this.patchTags(article.tags);
          this.patchReferences(article.references);
          if (article.imageUrl) {this.imageURL = article.imageUrl; }
        }
        this.article = article;
      }));
      return;
    }

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  findInvalidControls() {
    const invalid = [];
    const controls = this.articleForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
}

  creatForm(){
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      body: ['', [Validators.required, Validators.minLength(this.minLength)]],
      references: this.fb.array([]),
      tags: this.fb.array([])
    });
    this.bodyLength$ = this.articleForm.controls.body.valueChanges.pipe(map(val => (val as string).length));
  }

  /**
   * Prepares an article for saving
   * @returns a new article to save
   */
  private prepareSave(): Article{
    let newArticle: Article = this.articleForm.value;
    if (this.edit){
      newArticle = {...this.article, ...newArticle};
    }
    newArticle.tags = this.tags.value || null;
    newArticle.references = this.references.value || null;

    // Remove empty references and tags
    newArticle.references = newArticle.references.filter(tag => {
      return tag.label?.length > 1;
    });

    newArticle.tags = newArticle.tags.filter(tag => {
      return tag.length > 1;
    });

    newArticle.imageUrl = this.imageURL || null;


    return newArticle;
  }

  saveArticle(){
    const newArticle = this.prepareSave();
    this.articlesService.updateArticle(newArticle).then(res => {
      if (this.draft){
        this.articlesService.deleteArticle(this.article.id);
      }
      this.router.navigate(['home']);
    });
  }

  saveDraft(){
    const newArticle = this.prepareSave();
    this.articlesService.saveDraft(newArticle).then(res => {
      this.draft = true;
      window.alert('Draft Saved');
    });
  }

  delete(){
    if (this.article && this.article.imageUrl){
      this.storage.deleteFile(this.article.imageUrl);
    }

    if (this.draft) {
      this.articlesService.deleteDraft(this.article.id).then(res => {this.router.navigate(['profile']); });
      return;
    }
    this.articlesService.deleteArticle(this.article.id).then(res => {
      this.router.navigate(['home']);
    });
  }

  get references() {
    return this.articleForm.get('references') as FormArray;
  }

  get tags() {
    return this.articleForm.get('tags') as FormArray;
  }

  addReference(){
    this.references.push(  this.fb.group({
      label: [''],
      url: ['']
    }));
  }

  addTag(){
    this.tags.push(this.fb.control(''));
  }

  removeReference(index: number){
    this.references.removeAt(index);
  }

  removeTag(index: number){
    this.tags.removeAt(index);
  }

  private patchTags(tags: string[]){
    if (this.arrayEquals(this.tags.value, tags)) {return; }
    this.tags.clear();
    tags.forEach( tag => {this.tags.push(this.fb.control(tag)); });
  }

  private patchReferences(refs: ArticleReference[]){
    const currentRefs = this.references.value as ArticleReference[];
    if (currentRefs.length === refs.length && currentRefs.every((val, index) => val === refs[index])) {
      return;
    }

    this.references.clear();
    refs.forEach( ref => {
      this.references.push(
        this.fb.group({label: [ref.label], url: [ref.url]})
      );
    });
  }

  private arrayEquals(a, b) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

  picUploaded(storageFile: StorageFile){
    this.imageURL = storageFile.url;
  }

}
