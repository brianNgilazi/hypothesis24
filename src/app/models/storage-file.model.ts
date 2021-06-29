export interface StorageFile {
  /**
   * path of the fiel in storge
   */
  path: string;

  /**
   * url of the file
   */
  url: string;
  /**
   * path to the parent directory
   */
  parentPath: string;

  /**
   * the name of the file
   */
  name?: string;
}
