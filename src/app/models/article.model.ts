export interface Article{

  /**
   * Article ID
   */
  id?: string;
  title: string;
  subtitle: string;
  body: string;
  imageUrl?: string;
  references: ArticleReference[];
  tags: string[];
  author: string;
  authorId: string;
  created?: Date;
  modified?: Date;
  views: number;

}

export interface ArticleReference{
  label: string;
  url: string;
}

export class ArticleUtils{

  static compareReferences(a: ArticleReference, b: ArticleReference){
    return a.label === b.label && a.url === b.url;
  }
}
