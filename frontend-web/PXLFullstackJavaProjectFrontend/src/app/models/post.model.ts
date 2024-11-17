import {Author} from "./author";

export class Post {
  private _id:number;
  private _title:string;
  private _content:string;
  private _previewContent:string;
  private _imageUrl:string;
  private _author:Author;
  private _date:string;


  constructor(id: number, title: string, content: string, previewContent: string, imageUrl: string, author: Author) {
    this._id = id;
    this._title = title;
    this._content = content;
    this._previewContent = previewContent;
    this._imageUrl = imageUrl;
    this._author = author;
    this._date = new Date("2023, 4, 7").toString()
  }


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
  }

  get previewContent(): string {
    return this._previewContent;
  }

  set previewContent(value: string) {
    this._previewContent = value;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  set imageUrl(value: string) {
    this._imageUrl = value;
  }

  get author(): Author {
    return this._author;
  }

  set author(value: Author) {
    this._author = value;
  }


  get date(): string {
    return this._date;
  }

  set date(value: string) {
    this._date = value;
  }
}
